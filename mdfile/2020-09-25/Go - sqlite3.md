

### SQLite 설치

Go에서 SQLite를 사용하기 위해서 [mattn/go-sqlite3](https://github.com/mattn/go-sqlite3)를 사용할 것인데 <br />
이 패키지가 사용하는 것이 CGO라는 것을 사용한다. <br />
CGO는 C언어 라이브러리를 사용 할 수 있게 해주는 것인데, 문제는 이 C언어를 컴파일 할 수 있어야 한다.  <br />
이 C언어가 표준 C언어인데, 표준 C언어를 컴파일 하기 위해서는 표준 컴파일러가 필요하다. <br />
MAC이나 리눅스는 기본적으로 표준 C컴파일러가 깔려있는데 MS-Window는 표준 컴파일러인 gcc가 깔려있지 않다. <br />
Go에서는 gcc를 기본적으로 사용하는데 윈도우에서는 제공을 하고 있지 않아서 'MinGW'라는 표준 컴파일러가 돌아가는 환경을 만들었다. <br />
그래서 MinGW에서 gcc를 돌려야하는 복잡한 문제가 생겼다. MS가 표준을 지키지 않아 생긴 문제이다. <br />

그래서 go-sqllite3를 설치하기 위해서 gcc가 필요하다. sqlite가 C언어로 만들어진 라이브러리고, 이걸 사용하려면 CGO가 필요하고, CGO를 하기 위해서 표준 컴파일러인 gcc가 필요하다. <br />

MS-Window에서 사용하기에는 기본적으로 안되고, 무언가를 깔아야 하는데 <br />
요약하면 [여기](https://jmeubank.github.io/tdm-gcc/)에서 tdm-gcc를 다운 받아야 한다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94228562-31fae880-ff38-11ea-8f55-ec483ae8875e.png" width = 70%> </img></p> 
여기에서 이 것을 다운 받으면 된다. <br />

설치가 완료 되었으면 MinGW를 실행 시켜서 go-sqlite3를 다운 받아 준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94228838-e39a1980-ff38-11ea-8d2b-a5459f7ce978.png" width = 70%> </img></p> 

``` Linux
  
  go get github.com/mattn/go-sqlite3
  
```

그 후 환경변수를 설정해주어야 한다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95047319-d17e5f00-0720-11eb-8325-f1cd1baec0fc.png" width = 70%> </img></p> 
위의 화면과 같이 PATH의 최상위에 추가시켜주어야 한다. <br />

자세한 내용은 [여기](http://mingw.org/wiki/Getting_Started)에서 확인하면 된다. <br />

### 시작
메모리 map을 사용하는 부분을 인터페이스로 빼서 다시 한번 리팩토링을 하겠다. <br />

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
  
  type dbHandler interface { // 1
    getTodos() []*Todo
    addTodo(name string) *Todo
    removeTodo(id int) bool
    completeTodo(id int, complete bool) bool
  }
  
  type memoryHandler struct { // 2
    todoMap map[int]*Todo
  }
  
  var handler dbHandler // 4
  
  func (m *memoryHandler) getTodos() []*Todo { // 3
    list := []*Todo{}
    for _, v := range m.todoMap {
      list = append(list, v)
    }
    return list
  }
  
  func (m *memoryHandler) addTodo(name string) []*Todo { // 3
    id := len(m.todoMap) + 1
    todo := &Todo{id, name, false, time.Now()}
    m.todoMap[id] = todo
    return todo
  }
  
  func (m *memoryHandler) removeTodo(id int) bool { // 3
    if _, ok := m.todoMap[id]; ok {
      delete(m.todoMap, id)
      return true
    }
    return false
  }
  
  func (m *memoryHandler) completeTodo(id int, complete bool) bool { // 3
    if todo, ok := m.todoMap[id]; ok {
      todo.Completed = complete
      return true
    }
    return false
  }
  
  func newMemoryHandler() dbHandler { // 6
    m := &memoryHandler{} 
    m.todoMap = make(map[int]*Todo) // 2
    return m // 3
  }
  
  func init() {
    handler = newMemoryHandler() // 5
  }
  
  func GetTodos() []*Todo { // 7
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


```

1 : dbHandler interface <br />
    interface에 함수 정의만 가져오면 된다. <br />
이렇게 4가지 함수를 제공하는 인터페이스가 만들어 졌고, <br />

2 : DB를 사용하는 부분을 별도 struct로 만들어 준다. <br />

3 : memoryHandler의 맴버 메소드로 4가지 함수를 지원하여 인터페이스를 implements해주어야 한다. <br />
    memoryHandler인스턴스로 인터페이스를 메소드 함수으로 만들어준다. <br />
    그리고 이 인터페이스들은 외부로 공개되는 인터페이스가 아니기 때문에 소문자로 private하게 만들어준다. <br /> 
    그리고 해당 함수에 해당했었던 기존 코드들을 그대로 잘라내서 붙여준다. <br />

4 : memoryHandler는 dbHandler interface를 implements하고 있기 때문에 dbHandler만 전역변수로 들고 있으면 된다. <br />
5 : newMemoryHandler() 추가. <br />
6 : 반환값이 dbHandler인 newMemoryHandler()생성 <br />
    이 함수가 하는 일은 memoryHandler를 initialize해서 그 인스턴스를 반환하는 역할을 한다. <br />
6-2 : map을 initialize해준다. <br />
6-3 : m을 반환하는데 반환하는 m의 타입은 memoryHandler{}가 아니라 dbHandler의 인터페이스로 반환한다. <br />
      그 이유는 memoryHandler{}가 dbHandler의 인터페이스를 implements하고 있기 때문이다. <br />
  
7 : 그 후 잘라내고 비어 있는 곳에 핸들러 메소드를 호출해준다. <br />

지금까지 한 작업은 인터페이스를 추가했고, 메모리 map을 가지고 있던 것을 별도 struct를 만들어서 별도의 맴버 변수로 옮겼고, 그 struct의 메소드로 인터페이스를 전부 implements해주었다. <br />

여기서 잘 되는지 테스트를 해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94105182-b46da480-fe73-11ea-9ea0-fae23211d042.png" width = 70%> </img></p> 
PASS가 되는 것을 확인할 수 있다. <br />

그리고 memoryHandler를 별도의 파일에 옮겨 관리하도록 변경해준다. <br />
<code>model/memoryHandler.go</code>
``` Go

  package model

  import "time"

  type memoryHandler struct {
    todoMap map[int]*Todo
  }

  func (m *memoryHandler) getTodos() []*Todo {
    list := []*Todo{}
    for _, v := range m.todoMap {
      list = append(list, v)
    }
    return list
  }

  func (m *memoryHandler) addTodo(name string) *Todo {
    id := len(m.todoMap) + 1
    todo := &Todo{id, name, false, time.Now()}
    m.todoMap[id] = todo
    return todo
  }

  func (m *memoryHandler) removeTodo(id int) bool {
    if _, ok := m.todoMap[id]; ok {
      delete(m.todoMap, id)
      return true
    }
    return false
  }

  func (m *memoryHandler) completeTodo(id int, complete bool) bool {
    if todo, ok := m.todoMap[id]; ok {
      todo.Completed = complete
      return true
    }
    return false
  }

  func newMemoryHandler() dbHandler {
    m := &memoryHandler{}
    m.todoMap = make(map[int]*Todo)
    return m
  }

```

이 부분을 옮겨준다. <br />

그래서 <code>model/model.go</code>를 보면
``` Go

  package model

  import "time"

  type Todo struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"created_at"`
  }

  type dbHandler interface {
    getTodos() []*Todo
    addTodo(name string) *Todo
    removeTodo(id int) bool
    completeTodo(id int, complete bool) bool
  }

  var handler dbHandler

  func init() {
    handler = newMemoryHandler() 
    // handler = newSqliteHandler() // 1
  }

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

```

인터페이스만 있으면 되기 때문에 실제로 어떤 핸들러로 돌아가는지 알 수 없다. <br />
1 : 나중에 newSqliteHandler()를 만들어서 바꿔주면 동작은 기존 것과 같은데 새로운 핸들러로 바꾸어 줄 수 있게 된다. <br />
    계속 리팩토링 했기 때문에 쉽게 될 수 있고, 동작은 테스트코드를 만들어 놓았기 때문에 테스트를 금방 할 수 있게 된다. <br />
    그래서 리팩토링 하기전에 미리 구조를 바꾸어 주었다. <br />
    
그 다음 <code>model/sqliteHandler.go</code>를 생성해준다. <br />
``` Go

  package model

  type sqliteHandler struct { // 1

  }

  func (s *sqliteHandler) getTodos() []*Todo { // 2
    return nil
  }

  func (s *sqliteHandler) addTodo(name string) *Todo { // 2
    return nil
  }

  func (s *sqliteHandler) removeTodo(id int) bool { // 2
    return false
  }

  func (s *sqliteHandler) completeTodo(id int, complete bool) bool { // 2
    return false
  }

  func newSqliteHandler() dbHandler { // 3
    return &sqliteHander{}
  }
  
```

1 : sqliteHandler라는 struct를 추가. <br />
    sqliteHandler가 implements 할 때 인터페이스가 dbHandler 인터페이스의 4개 함수이다. <br />

2 : 그래서 4개의 메소드를 만들어 주면 된다. <br />
    처음에는 아무것도 동작하지 않는 함수로 만들었다. <br />
    
3 : 지금은 맴버 변수를 initialize할게 없어서 인스턴스를 하나 만들어서 반환하도록 작성한다. <br />

이제 기본틀은 다 만들어졌기 때문에 build가 되는지 확인해보아야 하는데, <code>model/model.go</code>에 아까 미리 만들어 두었던 핸들러의 주석을 풀어준다. <br />

그 후 테스트를 진행해보자! 현재 sqllite에 구현된게 아무것도 없기 때문에 테스터가 동작하지 않을 것이다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94232227-86a26180-ff40-11ea-9890-ec6882381047.png" width = 70%> </img></p> 
테스트가 전부 fail 난 것을 확인 할 수 있다. <br />

이제부터 sqlite를 채워보자! <br />

``` Go

  package model
  
  import (
    "database/sql"

    _ "github.com/mattn/go-sqlite3"
  )
  
  type sqliteHandler struct { 
    db *sql.DB // 2
  }
  
  func (s *sqliteHandler) close() { // 4
    s.db.Close()
  }
  
  func (s *sqliteHandler) getTodos() []*Todo {
    return nil
  }

  func (s *sqliteHandler) addTodo(name string) *Todo {
    return nil
  }

  func (s *sqliteHandler) removeTodo(id int) bool {
    return false
  }

  func (s *sqliteHandler) completeTodo(id int, complete bool) bool {
    return false
  }

  func newSqliteHandler() dbHandler {
    	database, err := sql.Open("sqlite3", "./test.db") // 1
      
      if err != nil { // 3
        panic(err)
      }
      
      statement, _ := database.Prepare( // 5
        `CREATE TABLE IF NOT EXISTS todos (
          id        INTEGER  PRIMARY KEY AUTOINCREMENT,
          name      TEXT,
          completed BOOLEAN,
          createdAt DATETIME
        )`)
      statement.Exec() // 6
    return &sqliteHander{db: database} // 7
  }
  
```

1 : sqlite를 사용하기 위해서 sql.Open을 사용해야하는데 어떤 타입의 db를 열 것인지, 파일DB이기 때문에 file명을 인자로 넣어준다. <br />
    이 때 import에 "database/sql"이 추가 되는데, 이것만 추가하면 안되고, "github.com/mattn/go-sqlite3"를 추가시켜준다. <br />
    앞에 밑줄은 실제로 이 패키지를 명시적으로 사용하진 않겠지만 "database/sql"을 사용할 때 "github.com/mattn/go-sqlite3"을 가지고 사용하겠다는 의미이다. <br />
    첫번째 인자가 sql.DB의 인스턴스가 나오고 두번째 인자가 error가 나온다. <br />
    
2 : 그래서 sql.DB를 기억하고 있다가 사용할 것이기 때문에 맴버 번수로 db변수를 가지고 있는다. <br />
3 : error 생길 시 에러를 반환하기 어려워서 panic으로 처리한다. <br />
4 : DB를 열면 프로그램이 종료되기 전에 닫아주어야 하는데 sqliteHandler 인스턴스가 사라지기 전에 닫아주어야 하기 때문에 close 함수를 추가한다. <br />
5 : todos data를 저장할 테이블을 생성 해준다. <br />
6 : query 실행. <br />
7 : 그리고 이 database를 계속 사용하기 때문에 &sqliteHandler에 값으로 넣어준다. <br />
