### 시작
다른 아이디로 로그인해도 똑같은 Todo가 나오는게 문제였었는데 각 세션별로 따로 데이터를 저장해서 각 세션에 해당하는 데이터만 보여주도록 수정할 것이다. <br />
먼저 <code>model/sqliteHandler.go</code>에 세션 아이디도 저장할 수 있도록 CREATE TABLE 쿼리문을 수정해준다. <br />

``` Go 

  func (s *sqliteHandler) GetTodos(sessionId string) []*Todo {
    todos := []*Todo{}
    rows, err := s.db.Query("SELECT id, name, completed, createdAt FROM todos WHERE sessionId=?", sessionId)
    if err != nil {
      panic(err)
    }
    defer rows.Close()
    for rows.Next() {
      var todo Todo
      rows.Scan(&todo.ID, &todo.Name, &todo.Completed, &todo.CreatedAt)
      todos = append(todos, &todo)
    }
    return todos
  }

  func (s *sqliteHandler) AddTodo(name string, sessionId string) *Todo {
    stmt, err := s.db.Prepare("INSERT INTO todos (sessionId, name, completed, createdAt) VALUES (?, ?, ?, datetime('now'))")
    if err != nil {
      panic(err)
    }
    rst, err := stmt.Exec(sessionId, name, false)
    if err != nil {
      panic(err)
    }
    id, _ := rst.LastInsertId()
    var todo Todo
    todo.ID = int(id)
    todo.Name = name
    todo.Completed = false
    todo.CreatedAt = time.Now()
    return &todo
  }

  func newSqliteHandler(filepath string) DBHandler {
    database, err := sql.Open("sqlite3", filepath)
    if err != nil {
      panic(err)
    }
    
    statement, _ := database.Prepare(
      `CREATE TABLE IF NOT EXISTS todos (
        id        INTEGER  PRIMARY KEY AUTOINCREMENT,
        sessionId STRING,
        name      TEXT,
        completed BOOLEAN,
        createdAt DATETIME
      );
    statement.Exec()
    return &sqliteHandler{db: database}
  }

```
sessionId 컬럼을 추가해서 Add나 Get할 때 이 컬럼을 이용할 수 있도록 수정했다. <br />
그리고 새로운 argument가 추가되었기 때문에 DBHandler interface도 수정해준다. <br />
<code>model/model.go</code>
``` Go

  type DBHandler interface {
    GetTodos(sessionId string) []*Todo
    AddTodo(sessionId string, name string) *Todo
    RemoveTodo(id int) bool
    CompleteTodo(id int, complete bool) bool
    Close()
  }

```

그리고 <code>model/memoryHandler.go</code>도 수정한다. <br />
``` Go 

...
  
  func (m *memoryHandler) GetTodos(sessionId string) []*Todo {
    list := []*Todo{}
    for _, v := range m.todoMap {
      list = append(list, v)
    }
    return list
  }

  func (m *memoryHandler) AddTodo(sessionId string, name string) *Todo {
    id := len(m.todoMap) + 1
    todo := &Todo{id, name, false, time.Now()}
    m.todoMap[id] = todo
    return todo
  }

...

```
이런식으로 interface만 맞추어준다. <br />

그리고 DBHandler가 변경되었기 때문에 AppHandler에서도 맞추어 주어야 한다. <br />
``` Go

  func (a *AppHandler) getTodoListHandler(w http.ResponseWriter, r *http.Request) {
    sessionId := getSesssionID(r) // 1
    list := a.db.GetTodos(sessionId) // 2
    rd.JSON(w, http.StatusOK, list)
  }

  func (a *AppHandler) addTodoHandler(w http.ResponseWriter, r *http.Request) {
    sessionId := getSesssionID(r)
    name := r.FormValue("name")
    todo := a.db.AddTodo(name, sessionId)
    rd.JSON(w, http.StatusCreated, todo)
  }

```

1 : getTodoListHandler가 불렸다는 것은 저번에 만들었던 CheckSignin()를 통과했기 때문에 getSesssionID를 사용하여 Request를 넣어주면 sessionId값이 들어 올 것이고, <br />
2 : 그러면 GetTodos는 nil이 아니므로 sessionId값을 넣어준다. <br />

그 다음 <code>model/sqliteHandler.go</code>에서 봐야 할 점이 <br />
GetTodos() 쿼리에서
``` Go

  rows, err := s.db.Query("SELECT id, name, completed, createdAt FROM todos WHERE sessionId=?", sessionId)

```
SELECT할 때 WHERE절로 가져오고 있는데, map에서는 키워드로 가져오는게 빠르고, list는 키워드로 가져오는 것이 불가능 하여 각각 항목을 비교해야 한다. <br />
지금은 괜찮겠지만 나중에 항목이 몇 만개가 되면 비교하는데 시간이 많이 걸리므로 binary search tree key index를 만들어 주어야 한다. <br />
그래서 index를 만들어보자! <br />

``` Go

  func newSqliteHandler(filepath string) DBHandler {
    database, err := sql.Open("sqlite3", filepath)
    if err != nil {
      panic(err)
    }
    statement, _ := database.Prepare(
      `CREATE TABLE IF NOT EXISTS todos (
        id        INTEGER  PRIMARY KEY AUTOINCREMENT,
        sessionId STRING,
        name      TEXT,
        completed BOOLEAN,
        createdAt DATETIME
      );
      CREATE INDEX IF NOT EXISTS sessionIdIndexOnTodos ON todos ( // 1
        sessionId ASC // 2
      );`)
    statement.Exec()
    return &sqliteHandler{db: database}
  }

```
1 : EXISTS 후에 index이름을 적어준다. 이 index가 todos 테이블에 있는 index라는 의미이다. <br />
2 : 첫번째에는 어떤 컬럼에 index를 걸것인지 적고, 두번째에는 어떤 방식으로 search tree를 만들 것인지 적어준다. <br />

이렇게하면 sessionId로 WHERE절을 검색할 때 훨씬 빠르게 찾아낼 수 있게 되었다. <br />

이제 구현은 끝이났는데, 기존에 만들었던 Test코드가 동작을 안한다는 문제가 있다. <br />
Test코드엔 login하는 기능을 만들지 않았기 때문에 add테스트 시 sign화면으로 Redirect되기 때문에 동작을 하지 않는다. <br />
그래서 signin기능을 넣어주어야 하는데 그렇게 하기 어렵다. 그래서 Mockup을 만들어서 signin했다 칠 수 있게 수정해준다. <br />

<code>app/app.go</code>에서 로그인 여부를 체크하는 함수가 getSesssionID()인데 이 함수의 return 값이 빈문자열이 아닐 경우에는 로그인 된 것으로 간주 된다. <br />
그래서 테스트 코드에선 임의의 빈문자열이 아닌 값을 return하면 되는데, 이 함수가 로그인 여부를 체크하는 함수이기 때문에 이 함수를 고쳤을 시 로그인 여부를 체크하는 게 위험해 질 수 있다. <br />
그래서 function pointer를 갖는 변수로 만들어 준다. <br />

``` Go

  var getSesssionID = func(r *http.Request) string {
    session, err := store.Get(r, "session")
    if err != nil {
      return ""
    }

    // Set some session values.
    val := session.Values["id"]
    if val == nil {
      return ""
    }
    return val.(string)
  }

```
이렇게 만들면 function pointer를 갖는 변수가 된다. <br />
똑같이 함수를 호출하듯이 사용할 수 있지만 엄밀히 따지면 함수가 아니고 변수이기 때문에 변수의 값을 호출하는 것이다. <br />
그런데 변수의 값이 function pointer를 가지고 있기 때문에 이 변수의 값을 언제든지 바꿔줄 수 있다. <br />

그래서 이것을 테스트 코드 안에서 바꿔 줄 수 있도록 수정해준다. <br />

<code>app/app_test.go</code>
``` Go

  func TestTodos(t *testing.T) {
    getSesssionID = func(r *http.Request) string { // 1
      return "testsessionId"
    }

  ...

```

1 : 원래 변수의 값은 제대로 세션을 검사하는 function pointer를 가지고 있었지만 <br />
    테스트 코드 안에서는 세션검사를 안하고 testsessionId를 return하는 것으로 바꾸었다. <br />
    이것이 Mockup으로 만든 형태이다. <br />

이제 Test를 진행 해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95170634-c1818080-07ef-11eb-9b1f-f75a855ce37e.png" width = 70%> </img></p> 
FAIL이 났다. <br />
expected가 Test Todo가 아니라 testsessionId가 들어가서 생겨난 것인데 <br />

<code>app/app.go</code>
``` Go

  func (a *AppHandler) addTodoHandler(w http.ResponseWriter, r *http.Request) {
    sessionId := getSesssionID(r)
    name := r.FormValue("name")
    todo := a.db.AddTodo(sessionId, name)
    rd.JSON(w, http.StatusCreated, todo)
  }

```
여기를 보면 첫번째 인자를 sessionId 넣었고, 두번째 인자를 name으로 넣었다. <br />

그런데 <code>model/sqliteHandler.go</code>를 보면

``` Go

func (s *sqliteHandler) AddTodo(name string, sessionId string) *Todo {

```

첫번째 인자가 name이고 두번째 인자가 sessionId 인 것을 확인할 수 있다. <br />
그래서 <code>app/app.go</code> 에서 첫번째 인자가 name이고 두번째 인자가 sessionId로 넣어주자 <br />

``` Go

  func (a *AppHandler) addTodoHandler(w http.ResponseWriter, r *http.Request) {
    sessionId := getSesssionID(r)
    name := r.FormValue("name")
    todo := a.db.AddTodo(name, sessionId)
    rd.JSON(w, http.StatusCreated, todo)
  }

```

이 후에 Test를 진행해보면 PASS가 되는 것을 확인 할 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95171315-af541200-07f0-11eb-9b8f-05d4d8169186.png" width = 70%> </img></p> 

추가적으로 <code>app/app.go</code>에서 로그인 체크를 할 때

``` Go

func CheckSignin(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	// if request URL is /signin.html, then next()
	if strings.Contains(r.URL.Path, "/signin.html") ||
		strings.Contains(r.URL.Path, "/auth") {
		next(w, r)
		return
	}
  
```
signin.css 정보를 요청하는 것도 여기에 걸려서 signin.html로 바뀌어서 css가 적용이 되지 않아 아래와 같이 바꾸어준다. <br />


``` Go

func CheckSignin(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	// if request URL is /signin.html, then next()
	if strings.Contains(r.URL.Path, "/signin") ||
		strings.Contains(r.URL.Path, "/auth") {
		next(w, r)
		return
	}
  
```

그 후 저장 후에 서버를 접속하여 확인하자! <br />
