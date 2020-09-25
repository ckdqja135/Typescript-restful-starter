### 시작
Go에서 SQLlite를 사용하기 위해서 [mattn/go-sqlite3](https://github.com/mattn/go-sqlite3)를 사용할 것인데 <br />
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
이렇게 4가지 함수를 제공하는 인터페이스가 만들어 졌고, 

2 : DB를 사용하는 부분을 별도 struct로 만들어 준다. <br />

3 : memoryHandler의 맴버 메소드로 4가지 함수를 지원하여 인터페이스를 implements해주어야 한다. <br />
    memoryHandler인스턴스로 인터페이스를 메소드 함수으로 만들어준다. <br />
    그리고 이 인터페이스들은 외부로 공개되는 인터페이스가 아니기 때문에 소문자로 private하게 만들어준다. <br /> 
    그리고 해당 함수에 해당했었던 기존 코드들을 그대로 잘라내서 붙여준다. <br />

4 : memoryHandler는 dbHandler interface를 implements하고 있기 때문에 dbHandler만 전역변수로 들고 있으면 된다.
5 : newMemoryHandler() 추가.
6 : 반환값이 dbHandler인 newMemoryHandler()생성
    이 함수가 하는 일은 memoryHandler를 initialize해서 그 인스턴스를 반환하는 역할을 한다.
6-2 : map을 initialize해준다. <br />
6-3 : m을 반환하는데 반환하는 m의 타입은 memoryHandler{}가 아니라 dbHandler의 인터페이스로 반환한다. <br />
      그 이유는 memoryHandler{}가 dbHandler의 인터페이스를 implements하고 있기 때문이다. <br />
  
7 : 그 후 잘라내고 비어 있는 곳에 핸들러 메소드를 호출해준다. <br />
