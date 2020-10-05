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
	db model.DBHandler
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

4:50



