### 시작
<code>model/model.go</code>
``` Go 

  package model

  import "time"

  type Todo struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"created_at"`
  }

  type DbHandler interface {
    GetTodos() []*Todo
    AddTodo(name string) *Todo
    RemoveTodo(id int) bool
    CompleteTodo(id int, complete bool) bool // 1
    close() 
  }

 // var handler DbHandler

  func NewDBHandler() DBHandler { // 2
    //handler = newMemoryHandler()
    handler = newSqliteHandler()
  }
/*
  func GetTodos() []*Todo {
    return handler.getTodos()
  }

  func AddTodo(name string) *Todo {
    return handler.addTodo(name)
  }

  func RemoveTodo(id int) bool {
    return handler.removeTodo(id)
  }

  func CompleteTodo(id int, complete bool) bool {
    return handler.completeTodo(id, complete)
  }
*/

```
이제 GetTodos(), AddTodo(), RemoveTodo(), CompleteTodo() 들만 채워주면 되는데 문제가 하나 생긴게, DB를 열어주면 close를 해주어야 해서 close를 추가했는데, <br />
이 인스턴스에 대한 생명주기에 대해 관리해주어야 한다. 그런데 이 패키지안에서 알 수 없기 때문에 이 close를 호출해주는 책임을 이 패키지를 사용하는 쪽에 넘겨주어야 한다. <br />

1 :그래서 dbHandler 라는 interface에 close함수를 추가시켜주고, interface와 메소드 모두 public하게 바꾸어 준다. <br />

2 : 그리고 init()를 NewDBHandler()로 만들어서 DBHandler라는 인터페이스 자체를 바깥쪽으로 내보낸다. <br />
    그래서 이 함수를 호출한 쪽에서 DBHandler의 인스턴스들을 가지고 사용하다가 필요가 없어질 때 close()를 할 수 있게 웹으로 책임을 넘겨준다. <br />

그 후 인터페이스가 바뀌었기 때문에 <code>model/sqliteHandler.go</code>도 수정해준다. 

``` Go

package model

import (
	"database/sql"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

type sqliteHandler struct {
	db *sql.DB
}

func (s *sqliteHandler) GetTodos() []*Todo {
	return nil
}

func (s *sqliteHandler) AddTodo(name string) *Todo {
	return nil
}

func (s *sqliteHandler) RemoveTodo(id int) bool {
	return false
}

func (s *sqliteHandler) CompleteTodo(id int, complete bool) bool {
	return false
}

func (s *sqliteHandler) close() {
	s.db.Close()
}

func newSqliteHandler() DBHandler {
	os.Remove("./test.db")
	database, err := sql.Open("sqlite3", "./test.db")
	if err != nil {
		panic(err)
	}
	statement, _ := database.Prepare(
		`CREATE TABLE IF NOT EXISTS todos (
			id        INTEGER  PRIMARY KEY AUTOINCREMENT,
			name      TEXT,
			completed BOOLEAN,
			createdAt DATETIME
		)`)
	statement.Exec()
	return &sqliteHandler{db: database}
}

```

그 후 <code>model/memoryHandler.go</code> 쪽도 바꾸어 준다. <br />

``` Go
package model

import "time"

type memoryHandler struct {
	todoMap map[int]*Todo
}

func (m *memoryHandler) GetTodos() []*Todo {
	list := []*Todo{}
	for _, v := range m.todoMap {
		list = append(list, v)
	}
	return list
}

func (m *memoryHandler) AddTodo(name string) *Todo {
	id := len(m.todoMap) + 1
	todo := &Todo{id, name, false, time.Now()}
	m.todoMap[id] = todo
	return todo
}

func (m *memoryHandler) RemoveTodo(id int) bool {
	if _, ok := m.todoMap[id]; ok {
		delete(m.todoMap, id)
		return true
	}
	return false
}

func (m *memoryHandler) CompleteTodo(id int, complete bool) bool {
	if todo, ok := m.todoMap[id]; ok {
		todo.Completed = complete
		return true
	}
	return false
}

func(m *memoryHandler) close() { // 1
  
}

func newMemoryHandler() DBHandler {
	m := &memoryHandler{}
	m.todoMap = make(map[int]*Todo)
	return m
}

```
1 : 인터페이스에 맞춰주기 위해 close()함수를 새로 만들어 준다. <br />

그리고 <code>app/app.go</code>도 수정을 해준다. <br />

``` Go
package app

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/tuckersGo/goWeb/web18/model"
	"github.com/unrolled/render"
)

var rd *render.Render

type AppHandler struct { // 1
	http.Handler // 1
	db model.DBHandler // 2
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/todo.html", http.StatusTemporaryRedirect)
}

func getTodoListHandler(w http.ResponseWriter, r *http.Request) {
	list := model.GetTodos()
	rd.JSON(w, http.StatusOK, list)
}

func addTodoHandler(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("name")
	todo := model.AddTodo(name)
	rd.JSON(w, http.StatusCreated, todo)
}

type Success struct {
	Success bool `json:"success"`
}

func removeTodoHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	ok := model.RemoveTodo(id)
	if ok {
		rd.JSON(w, http.StatusOK, Success{true})
	} else {
		rd.JSON(w, http.StatusOK, Success{false})
	}
}

func completeTodoHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	complete := r.FormValue("complete") == "true"
	ok := model.CompleteTodo(id, complete)
	if ok {
		rd.JSON(w, http.StatusOK, Success{true})
	} else {
		rd.JSON(w, http.StatusOK, Success{false})
	}
}

func MakeHandler() http.Handler {
	//todoMap = make(map[int]*Todo)

	rd = render.New()
	r := mux.NewRouter()

	r.HandleFunc("/todos", getTodoListHandler).Methods("GET")
	r.HandleFunc("/todos", addTodoHandler).Methods("POST")
	r.HandleFunc("/todos/{id:[0-9]+}", removeTodoHandler).Methods("DELETE")
	r.HandleFunc("/complete-todo/{id:[0-9]+}", completeTodoHandler).Methods("GET")
	r.HandleFunc("/", indexHandler)

	return r
}

```

1 : 이 쪽도 마찬가지로 main.go에서 사용하기 때문에 이것도 하나의 패키지인데, 이제는 Model.go의 DBHandler를 만들어서 사용할 것인데, 이 것의 대한 close책임을 이 패키지를 사용한 쪽에 넘겨야 한다. <br />
그런데 app.go도 하나의 패키지이고, 이것을 main.go에서 사용하기 때문에 app.go에는 close책임이 없기 때문에 수정해주어야 한다. <br />

1-1 : http.Handler를 포함 타입 이라고 하는데 <br />
``` Go
	
  handler http.Handler
  
```
맴버 변수를 암시적으로 생략해서 이 인터페이스를 포함하고 있다. 라는 의미이다. 상속하고 비슷한 개념으로 볼 수 있지만 상속관계가 아니다.
has-a관계이지 is-a관계가 아니다. <br />
[is-a관계 has-a관계에 대해](https://m.blog.naver.com/PostView.nhn?blogId=lunatic918&logNo=156290730&proxyReferer=https:%2F%2Fwww.google.com%2F)

1-2 : model의 DB핸들러를 추가해준다.

그 후 아래의 함수들을 AppHandler의 메소드로 바꾸어 준다. <br />

``` Go 

func (a *AppHandler) indexHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/todo.html", http.StatusTemporaryRedirect)
}

func (a *AppHandler) getTodoListHandler(w http.ResponseWriter, r *http.Request) {
	list := a.db.GetTodos() // 1
	rd.JSON(w, http.StatusOK, list)
}

func (a *AppHandler) addTodoHandler(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("name")
	todo := a.db.AddTodo(name)
	rd.JSON(w, http.StatusCreated, todo)
}

type Success struct {
	Success bool `json:"success"`
}

func (a *AppHandler) removeTodoHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	ok := a.db.RemoveTodo(id)
	if ok {
		rd.JSON(w, http.StatusOK, Success{true})
	} else {
		rd.JSON(w, http.StatusOK, Success{false})
	}
}

func (a *AppHandler) completeTodoHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	complete := r.FormValue("complete") == "true"
	ok := a.db.CompleteTodo(id, complete)
	if ok {
		rd.JSON(w, http.StatusOK, Success{true})
	} else {
		rd.JSON(w, http.StatusOK, Success{false})
	}
}

```

1 : AppHandler의 db 변수를 사용 할 수 있도록 바꾸어준다. <br />

그 후 AppHandler를 initialize해주어야 하는데, MakeHandler()할 때 반환값을 AppHandler의 포인터가 반환되도록 바꾸어 준다. <br />

``` Go

var rd *render.Render = render.New() // 1

func MakeHandler(filepath string) *AppHandler {
	r := mux.NewRouter()
	a := &AppHandler{
		Handler: r, // 1
		db:      model.NewDBHandler(filepath),
	}

	r.HandleFunc("/todos", a.getTodoListHandler).Methods("GET")
	r.HandleFunc("/todos", a.addTodoHandler).Methods("POST")
	r.HandleFunc("/todos/{id:[0-9]+}", a.removeTodoHandler).Methods("DELETE")
	r.HandleFunc("/complete-todo/{id:[0-9]+}", a.completeTodoHandler).Methods("GET")
	r.HandleFunc("/", a.indexHandler)

	return a
}

```

그 후 muxRouter를 지워주고, AppHandler를 만들어준다. <br />

1 : render.New() 부분은 전역이기 때문에 저 위치에 initialize시켜준다. <br />
2 : http 핸들러 부분은 muxRouter가 되고, dbHandler는 model의 NewDBHandler를 호출해서 그 결과를 db변수에 집어 넣는다. <br />

이렇게 하면 AppHandler라는 인스턴스가 만들어지게 된다. <br />

그 후 muxRouter에 등록을 할 때 일반 함수가 아닌 메소드로 변경되었기 때문에 메소드 형태로 바꾸어 준다. <br />
그리고 반환을 AppHandler를 반환하기 때문에 a값을 넣어준다. <br />

이렇게 한 이유는 DB핸들러가 프로그램이 종료되기 전에 Close()를 불러주어야 하는데 이걸 model패키지 입장에서는 자기가 만든 인스턴스에 대해서 얼만큼 사용될 지를 알 수 없다. <br />
그러니까 자기 패키지안에선 Close()를 불러줄 수 가 없다. 결국에는 이 패키지를 사용한 쪽에서 불러주어야 하는데 그 패키지를 <code>app/app.go</code>에서 사용하는데 이 app 또한 <br />
전적으로 DBHandler를 사용권한을 가지고 있지 않다. 이것 또한 바깥에서 사용되는 패키지이기 때문이다. <br />

그래서 새로운 인스턴스를 만들어서 바깥에서 AppHandler의 function을 호출할 수 있게 코드를 추가해준다. <br />

 <code>app/app.go</code>
``` Go
....

 func (a *AppHandler) Close() { // 1
	a.db.Close()
}

...

```

1 : 이렇게해서 app패키지를 사용하는 쪽에서 Close()를 호출 할 수 있도록 해준다. <br />

그리고 <code>main.go</code>에서 appHandler를 만들었기 때문에 프로그램이 종료되기 전에 defer로 m의 Close를 호출 할 수 있게 된다. <br />
<code>main.go</code>
``` Go

func main() {
   m := app.MakeHandler("./test.db")
   defer m.Close()
   n := negroni.Classic()
   n.UseHandler(m)

   log.Println("Started App")
   err := http.ListenAndServe(":3000", n)
   if err != nil {
      panic(err)
   }
}

```

그 후 app에서 build가 잘 되는지 test를 해보면 만들어 놓은것이 없으므로 Fail이 났음을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95039228-27e0a300-070b-11eb-8b60-590a15544684.png" width = 70%> </img></p> 

그리고 test.db가 생성 된 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95039437-afc6ad00-070b-11eb-9eb4-11af446ffcfd.png" width = 70%> </img></p> 
저 test.db가 생성된 이유는 <code>model/sqliteHandler.go</code>에서 

``` Go

func newSqliteHandler() dbHandler {
  database, err := sql.Open("sqlite3", "./test.db")
    ...
  }

```

"./test.db"를 여는데 저 파일이 없기 때문에 생성된 것이다. <br />

이제 본격적으로 기능들을 추가해보자! 먼저 getTodos()와 addTodo()를 수정해준다. <br /><br />
<code>model/sqliteHandler.go</code>

``` Go

package model

func (s *sqliteHandler) getTodos() []*Todo { // 2
  todos := []*Todo{} // 1
  rows, err := s.db.Query("SELECT id, name, completed, createdAt FROM todos") // 2
  if err != nil { // 3
    panic(err)
  }
  defer rows.Close() // 5
  for rows.Next() { // 4
     var todo Todo
     rows.Scan(&todo.ID, &todo.Name, &todo.Completed, &todo.CreatedAt)
     todos = append(todos, &todo)
  }
  return todos
}


func (s *sqliteHandler) addTodo(name string) *Todo { // 2
   stmt, err := s.db.Prepare("INSERT INTO todos (name, completed, createdAt) VALUES (?, ?, datetime('now'))") // 1
  
  if err != nil { // 2
      panic(err)
  }
  
  rst, err := stmt.Exec(name, false) // 3
   
  if err != nil { // 4
    panic(err)
  }
  
  id, _ := rst.LastInsertId() // 5
  var todo Todo // 6
  todo.ID = int(id) // 7
  todo.Name = name // 8
  todo.Completed = false // 9
  todo.CreatedAt = time.Now() // 10
  
  return &todo // 1
}

```
1-1 : data를 저장할 쿼리문을 만들어야 하는데, data를 읽어서 그 data를 반환시켜주어야 하기 때문에 data를 반환시켜주는 list를 만들어준다. <br />
1-2 : 쿼리문 작성. <br />
      Query()를 보면 query문을 먼저 작성하고, 전달인자(argument)를 넣으면 성공시에 sql.Rows, 실패시에 error가 나오게 된다. <br />
1-3 : 에러가 있을 시 에러 처리. <br />
1-4 : 데이터가 잘 뽑아져 나왔을 시 각 행(row)을 돌면서 데이터를 가져와야 하기 때문에 for문으로 반복문을 돌려주는데, for.Next()는 다음행으로 가겠다는 의미이며, <br />
      다음 행이 없을 때 return false가 되어 return true가 될 때 까지 돌면서 레코드들을 읽어준다. <br />
      rows.Scan()을 쓰게 되면 쿼리안에 있던 값들이 각각에 맞춰서 가져오게 되는데, 이 data를 담을 todo객체를 만들어서 Scan()안에 받아올 각 항목들을 넣어주면 된다. <br />
      그 후 todo에 들어간 값들을 todos에 저장해준 뒤, todos를 return 해준다.<br />
1-5 : 그 다음 row를 close시켜준다. <br />

2-1 : 여기서도 쿼리문을 작성해주어야 하는데 s.db.Prepare()로 Statement를 만들어준다. <br />
      Prepare의 반환값으로 Statement값과 error값이 나온다. <br />
2-2 : error 처리 <br />
2-3 : Statement값이 나왔기 때문에 execute해주어야 하는데 Exec()의 대응되는 전달인자(argument)는 아까 Insert 쿼리에 '?'로 썼던 부분이다. <br />
      그래서 name에 name값, complete값에 false값을 넣어준다. <br />
      Exec()가 반환되는 값은 result와 error가 나온다. <br />
2-4 : 이 과정에서 error가 있을 수 있기 때문에 에러 처리를 해준다. <br />
2-5 : 그 후 result값이 나왔고, AddTodo를 한 다음에 추가한 Todo의 정보를 알려주어야 한다. <br />
      name, completed, createdAt값은 알 수 있는데 insert 시 id값을 넣지 않았으므로 id값은 알 수가 없다.(table을 만들었을 때 AUTO로 설정했기 때문)<br />
      그래서 자동으로 발급된 그 id값을 알아야하기 때문에 result의 메소드로 LastInsertId()가 있는데 마지막으로 추가된 레코드의 id값을 알려준다. <br />
      이 것을 id변수에 넣어준다. <br />
2-6 : 그리고 return값이 todo이기 때문에 todo를 만들어 준다. <br />
2-7 : 그래서 todo의 id는 새로만든 id가 될 것이고, 이 타입이 int64여서 int로 바꾸어준다. <br />
2-8 : name값은 요청한 name값이 되고, <br />
2-9 : completed값은 false로 넣어주고, <br />
2-10 : CreateAt은 현재시간으로 넣어준다. <br />
2-11 : 그 후 포인터 값을 반환시켜준다. <br />

이렇게 하면 add와 get이 끝이 난다. <br />

그 후 저장후에 테스트를 진행해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95042521-27e5a080-0715-11eb-9329-32d1f4bf475b.png" width = 70%> </img></p> 
에러 문을 보면 65번째 줄과 79번째 줄이 통과가 안되었는데, 이 부분은 Completetodo와 delete한 부분이다.
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95042590-5fece380-0715-11eb-945d-1249ca91a69a.png" width = 70%> </img></p> 

그러므로 방금 수정했던 Add와 Get은 통과가 되었다는 의미인데, 여기서 한 번 더 테스트를 해보면
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95042716-b9eda900-0715-11eb-98d7-bfed289d03f3.png" width = 70%> </img></p> 

아까는 통과되었던 부분도 통과가 되지 않은 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95042793-ebff0b00-0715-11eb-802f-a85a4b2cb897.png" width = 70%> </img></p> 
그 이유는 레코드가 2개가 와야하는데 4개가 왔기 때문이다. 아까 생성된 test.db파일이 한번 만들어지면 지워지지 않는데 <br />
첫 번 째 테스트 시 이미 테이블이 만들어진 상태에서 테스트 코드에서 add를 2번하여 레코드 2개가 추가되었고, GetTodos를 진행하여 2개의 레코드를 조회했고, <br />
두 번 째 테스트 시 추가했었던 레코드 2개가 이미 추가 된 상태에서 2개를 또 추가하는 것이기 때문에 4개가 된 것이다. <br />
그래서 이것을 테스트를 돌리기 전에 db파일을 삭제하도록 수정해야 한다.<br />

<code>app/app_test.go</code>
``` Go

 func TestTodos(t *testing.T) {
   os.Remove("./test.db")
   
   ah := MakeHandler()
   defer ah.Close()
   ts := httptest.NewServer(ah)
	...
 }
 
```
os.Remove()를 추가 해주고, ts부분에서 AppHandler가 나와서 Close()를 시켜주어야 하기 때문에 다음과 같이 수정해준다. <br />
AppHandler는 http.Handler를 임베디드하고 있기 때문에 NewServer()의 인자로 바로 써 줄 수 있다. <br />
ah 또한 function이 끝나기 전에 DB를 닫아주어야 하기 때문에 Close()시켜준다. <br />

이제 테스팅을 해보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95043475-c96df180-0717-11eb-827f-6cd78412128b.png" width = 70%> </img></p> 
Get, Add를 제외한 부분만 에러가 나는 것을 확인할 수 있다. <br />

이제 CompleteTodo를 수정해보자! <br />
CompleteTodo는 완료상태를 변경하는 것인데, 기존 레코드는 그대로 두고, 기존 레코드의 complete값만 변경해주는 부분이다. <br />

``` Go

func (s *sqliteHandler) CompleteTodo(id int, complete bool) bool {
   stmt, err := s.db.Prepare("UPDATE todos SET completed=? WHERE id=?") // 1
   
   if err != nil { // 2
     panic(err)
   }
   
   rst, err := stmt.Exec(complete, id) // 3
   
   if err != nil { // 4
     panic(err)
   }

  cnt, _ := rst.RowsAffected() // 5
  return cnt > 0 // 6
}

```

1 : Prepare()로 UPDATE문을 넣어준다. 마찬가지로 statement가 나오고, error가 나온다.<br />
2 : 에러 처리. <br />
3 : 첫번째 전달인자(argument)값이 Compelte, 두 번째 전달인자(argument)값이 id값으로 넣어준다. <br />
4 : 에러 처리. <br />
5 : 위의 쿼리문을 영향받은 레코드 갯수가 몇개인지 알려준다. <br />
    UPDATE 시 1이 될 것이고, UPDATE가 되지 않으면 0이 될 것이다. <br />
6 : 그래서 UPDATE된 항목이 있을 시 True가 될 것이고, 그렇지 않으면 False값이 될 것이다.

그 다음 RemoveTodo()를 수정하자! <br />
``` Go

func (s *sqliteHandler) RemoveTodo(id int) bool {
  stmt, err := s.db.Prepare("DELETE FROM todos WHERE id=?") // 1
  
  if err != nil { // 2
    panic(err)
  }
  
  rst, err := stmt.Exec(id) // 3
  
  if err != nil { // 4
    panic(err)
  }
  
  cnt, _ := rst.RowsAffected() // 5
  return cnt > 0 // 6
}

``` 
1 : remove도 마찬가지로 Statement를 만들어준다. <br />
2 : 에러 처리. <br />
3 : 첫번째 전달인자(argument)값을 id값으로 넣어준다. <br />
4 : 에러 처리. <br />
5 : 위의 쿼리문을 영향받은 레코드 갯수가 몇개인지 알려준다. <br />
6 : 그래서 DELETE된 항목이 있을 시 True가 될 것이고, 그렇지 않으면 False값이 될 것이다.

그 후 테스트를 진행해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95046106-69c71480-071e-11eb-98ba-6b755fde899b.png" width = 70%> </img></p> 

4개 모두 통과가 되었다! <br />
코딩이 완료 되었고, 서버로 실행하여 동작을 하는지 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95047497-24581680-0721-11eb-8f04-f884a7a05f9e.png" width = 70%> </img></p> 

memoryDB가 아닌 FileDB로 변경해주었기 때문에 위와 같이 임의적으로 data를 추가 시킨 뒤 서버를 재시작 해주면 마지막 상태가 저장 되어 있음을 확인 할 수 있다.<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95047497-24581680-0721-11eb-8f04-f884a7a05f9e.png" width = 70%> </img></p> 

프로그램이 종료되어도, test.db에 저장되어 있다. <br />

그 후에 한가지 수정할 사항이 있는데, <code>model/sqliteHandler.go</code>에서 

``` Go

func newSqliteHandler() dbHandler {
  database, err := sql.Open("sqlite3", "./test.db")
    ...
  }

```
이렇게 configuration에 관련된 항목들을 코드안에 있는 박아 놓는 형태가 좋지 않아 최대한 바깥 쪽으로 빼주는게 좋다. <br />
``` Go

func newSqliteHandler(filepath string) DBHandler {
   database, err := sql.Open("sqlite3", filepath)
     if err != nil {
        panic(err)
     }
     
   statement, _ := database.Prepare(
	`CREATE TABLE IF NOT EXISTS todos (
	   id        INTEGER  PRIMARY KEY AUTOINCREMENT,
	   name      TEXT,
	   completed BOOLEAN,
	   createdAt DATETIME
	)`)
	
   statement.Exec()
   return &sqliteHandler{db: database}
}

```
이런식으로 filepath를 인자로 받아서 sql.Open()에 넣어준다. <br />
그래서 기존에 있던 "./test.db"는 <code>model/model.go</code>의 NewDBHandler()안에 넣어준다. <br />
``` Go

func NewDBHandler() DBHandler {
  //handler = newMemoryHandler()
  return newSqliteHandler("./test.db")
}

```
그래서 이렇게 바뀌어야 하는데 여기에 넣어놓으나, sqliteHandler.go에 넣어 놓으나 사실상 똑같기 때문에 filepath의 인자를 받아서 여기에도 filepath를 넘겨준다. <br />

``` Go

func NewDBHandler(filepath string) DBHandler {
  //handler = newMemoryHandler()
  return newSqliteHandler(filepath)
}

```
또 filepath부분이 불리는 부분인 <code>app/app.go</code>의 MakeHandler()부분도 마찬가지로 수정해준다.
``` Go
func MakeHandler(filepath string) *AppHandler {
  r := mux.NewRouter()
  a := &AppHandler{
        Handler: r,
	db:      mo
	del.NewDBHandler(filepath),
  }

  r.HandleFunc("/todos", a.getTodoListHandler).Methods("GET")
  r.HandleFunc("/todos", a.addTodoHandler).Methods("POST")
  r.HandleFunc("/todos/{id:[0-9]+}", a.removeTodoHandler).Methods("DELETE")
  r.HandleFunc("/complete-todo/{id:[0-9]+}", a.completeTodoHandler).Methods("GET")
  r.HandleFunc("/", a.indexHandler)

  return a
}

```

그렇게 사용하는 부분들을 거슬러 올라가다보면 main.go까지 사용하는데 main에서 "./test.db"를 추가시켜준다. <br />
``` Go

func main() {
  m := app.MakeHandler("./test.db")
  defer m.Close()
  n := negroni.Classic()
  n.UseHandler(m)

  log.Println("Started App")
  err := http.ListenAndServe(":3000", n)
  
  if err != nil {
    panic(err)
  }
}

```

여기서 파일을 바꾸어 줄 수 있다. <br />
그렇다면 여기에서도 마찬가지로 코드에 박힌 것이 아니냐고 생각할 수 있다.<br />
그래서 여기서는 flag같은 실행인자를 가져오는 패키지가 있어서 사용할 수 있는데 지금은 그것을 사용하지 않고 그냥 넣어준다. <br />
main에 넣는 것은 금방 바꿀 수 있어서 좋고, 패키지 안쪽에 있는 것 보다 최대한 바깥쪽에 넣어주는 것이 좋다. <br />

이렇게 해서 기존 todos를 바꾸어 주는 부분들이 끝이 났다. <br />
