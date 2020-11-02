## 시작
메모리맵을 파일DB로 바꾸기 위한 전작업으로 리팩토링을 시작.

먼저 테스트 코드를 만들어보자!
<code>app/app_test.go</code>
``` Go

  package app

  import (
    "testing"

    "github.com/stretchr/testify/assert"

  )

  func TestTodos(t *testing.T) {
    assert := assert.New(t)
    ts := httptest.NewServer(MakeHandler())
	  defer ts.Close()
    
    resp, err := http.PostForm(ts.URL+"/todos", url.Values{"name": {"Test todo"}}) // 1
    assert.NoError(err) // 2
	  assert.Equal(http.StatusCreated, resp.StatusCode) // 3
  }
  
```
1 : Add를 한 다음에 GET을 해서 제대로 나오는지 해보기 위해 먼저 POST를 해준다. <br />
    URL, Value를 인자로 받는다. 이 때 응답과 에러가 나오는데<br />
2 : 에러가 없어야 하기 때문에 NoError로 해주고, <br />
3 : 응답의 코드가 같은지 확인해준다. <br />

그 후 <code>app/app.go</code>에서
``` Go

  func addTodoHandler(w http.ResponseWriter, r *http.Request) {
    name := r.FormValue("name")
    id := len(todoMap) + 1
    todo := &Todo{id, name, false, time.Now()}
    todoMap[id] = todo
    rd.JSON(w, http.StatusCreated, todo)
  }


/*
func addTestTodos() {
	todoMap[1] = &Todo{1, "Buy a milk", false, time.Now()}
	todoMap[2] = &Todo{2, "Exercise", true, time.Now()}
	todoMap[3] = &Todo{3, "Home work", false, time.Now()}
}
*/
func MakeHandler() http.Handler {
	todoMap = make(map[int]*Todo)
	// addTestTodos()

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
rd.JSON(w, http.StatusCreated, todo)로 변경해주고, addTestTodos와 addTestTodos()는 지워준다. <br />

여기서 저장 후 테스트를 진행해보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94105182-b46da480-fe73-11ea-9ea0-fae23211d042.png" width = 70%> </img></p> 
PASS 되는 것을 확인 할 수 있다. <br />

그리고 이어서 상대방이 JSON포맷으로 새로 만든 todo를 보내주기 때문에 이것을 읽어주는 코드를 작성하자 ! <br />
<code>app/app_test.go</code>
``` Go

  package app

  import (
    "testing"

    "github.com/stretchr/testify/assert"

  )

  func TestTodos(t *testing.T) {
    assert := assert.New(t)
    ts := httptest.NewServer(MakeHandler())
	  defer ts.Close()
    
    resp, err := http.PostForm(ts.URL+"/todos", url.Values{"name": {"Test todo"}})
    assert.NoError(err)
	  assert.Equal(http.StatusCreated, resp.StatusCode) 
    var todo Todo // 1
    err = json.NewDecoder(resp.Body).Decode(&todo) // 2
    assert.NoError(err)
    assert.Equal(todo.Name, "Test todo") // 3
  }
  
```
1 : Decode해줄 todo객체 <br />
2 : 새로만든 todo객체를 읽어오는 코드 <br />
3 : todo객체의 name이 보낸 name과 같은지 확인한다. <br />

여기까지 해서 다시 테스트하면
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94105182-b46da480-fe73-11ea-9ea0-fae23211d042.png" width = 70%> </img></p> 
PASS 되는 것을 확인 할 수 있다. <br />

그러면 이 서버가 추가한 todo의 id가 나오는데 그 id를 먼저 저장 해준다. <br />

<code>app/app_test.go</code>
``` Go

  package app

  import (
    "testing"

    "github.com/stretchr/testify/assert"

  )

  func TestTodos(t *testing.T) {
    assert := assert.New(t)
    ts := httptest.NewServer(MakeHandler())
	  defer ts.Close()
    
    resp, err := http.PostForm(ts.URL+"/todos", url.Values{"name": {"Test todo"}})
    assert.NoError(err)
	  assert.Equal(http.StatusCreated, resp.StatusCode) 
    var todo Todo 
    err = json.NewDecoder(resp.Body).Decode(&todo)
    assert.NoError(err)
    assert.Equal(todo.Name, "Test todo") 
    id1 := todo.ID // 1
  }
  
```

1 : todo의 id <br />
그 후 <br />

``` Go 

    resp, err := http.PostForm(ts.URL+"/todos", url.Values{"name": {"Test todo"}})
    assert.NoError(err)
	  assert.Equal(http.StatusCreated, resp.StatusCode) 
    var todo Todo 
    err = json.NewDecoder(resp.Body).Decode(&todo)
    assert.NoError(err)
    assert.Equal(todo.Name, "Test todo") 
    
```

부분을 아래에 복붙하여 작성한다. <br />

``` Go

  package app

  import (
    "testing"

    "github.com/stretchr/testify/assert"

  )

  func TestTodos(t *testing.T) {
    assert := assert.New(t)
    ts := httptest.NewServer(MakeHandler())
	  defer ts.Close()
    
    resp, err := http.PostForm(ts.URL+"/todos", url.Values{"name": {"Test todo"}})
    assert.NoError(err)
	  assert.Equal(http.StatusCreated, resp.StatusCode) 
    var todo Todo 
    err = json.NewDecoder(resp.Body).Decode(&todo)
    assert.NoError(err)
    assert.Equal(todo.Name, "Test todo") 
    
    id1 := todo.ID
    resp, err = http.PostForm(ts.URL+"/todos", url.Values{"name": {"Test todo2"}})
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
    err = json.NewDecoder(resp.Body).Decode(&todo)
    assert.NoError(err)
    assert.Equal(todo.Name, "Test todo2")
    id2 := todo.ID
    
    resp, err = http.Get(ts.URL + "/todos")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    todos := []*model.Todo{} // 1
    err = json.NewDecoder(resp.Body).Decode(&todos) // 2
    assert.NoError(err)
    assert.Equal(len(todos), 2) // 3
    for _, t := range todos { // 4
      if t.ID == id1 {
        assert.Equal("Test todo", t.Name)
      } else if t.ID == id2 {
        assert.Equal("Test todo2", t.Name)
      } else {
        assert.Error(fmt.Errorf("testID should be id1 or id2"))
      }
    }
  }
  
```


1,2 : getTodoListHandler()에서 list를 JSON으로 보내기 때문에 JSON으로 todo list를 받아온다. <br />
3 : todos의 길이가 2개인지 확인한다. <br />
4 : 검증 부분. 
    t의 id가 첫번째 추가한 id1과 같다면 첫번째 값인 "test todo"이 되야 하고, <br />
    t의 id가 두번째 추가한 id2와 같다면 "Test todo2"가 되어야 한다. <br />
    1번과도 같지않고, 2번과도 같지않다면 문제가 있으므로 에러처리를 해준다. <br />
    list를 range로 돌 때 첫번째 인자가 index, value가 나오는데 index를 쓰지 않기 때문에 _처리 해준다. <br />
    
2개를 POST해주었기 때문에 GET을 해주면 2개가 와야한다. <br />

이렇게 해서 테스트 해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94105182-b46da480-fe73-11ea-9ea0-fae23211d042.png" width = 70%> </img></p> 
PASS 되는 것을 확인 할 수 있다. <br />

GET과 POST가 되는것을 확인했고, 이제 Complete를 해보자! <br />
Complete를 보낼 때 URL에 id를 붙여서 보냈고, 그 다음에 FormValue로 "complete"를 보냈고, 메소드는 GET으로 보냈었다. <br />

``` Go

  package app

  import (
    "testing"

    "github.com/stretchr/testify/assert"

  )

  func TestTodos(t *testing.T) {
   
   ....
    
    resp, err = http.Get(ts.URL + "/todos")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    todos := []*model.Todo{} 
    err = json.NewDecoder(resp.Body).Decode(&todos) 
    assert.NoError(err)
    assert.Equal(len(todos), 2) 
    for _, t := range todos {
      if t.ID == id1 {
        assert.Equal("Test todo", t.Name)
      } else if t.ID == id2 {
        assert.Equal("Test todo2", t.Name)
      } else {
        assert.Error(fmt.Errorf("testID should be id1 or id2"))
      }
    }
    
   resp, err = http.Get(ts.URL + "/complete-todo/" + strconv.Itoa(id1) + "?complete=true") // 1
   assert.NoError(err)
   assert.Equal(http.StatusOK, resp.StatusCode)
   
   resp, err = http.Get(ts.URL + "/todos") // 2
	 assert.NoError(err)
	 assert.Equal(http.StatusOK, resp.StatusCode)
	 todos = []*model.Todo{}
	 err = json.NewDecoder(resp.Body).Decode(&todos)
 	 assert.NoError(err) 
	 assert.Equal(len(todos), 2)
	 
	 for _, t := range todos {
	   if t.ID == id1 {
	     assert.True(t.Completed)
	   }
	 }
  }
  
```
1 : GET으로 보내주기 위해 사용 <br />
    id1을 complete값을 true로 바꾸어준다. <br />
    
2 : 실제로 Complete가 바뀌었는지 확인해주기 위해 GET을 다시해서 검증해준다. <br />
    현재는 바꾼 id1만 검증하기 때문에 id1에 대해서만 작성한다. <br />

그래서 complte-todo를 한 다음에 GET으로 list를 다시 가져와서 가져온 id가 id1과 같을 때 Completed가 true로 바뀌어야 한다. <br />

이 상태에서 다시 테스트를 해보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94105182-b46da480-fe73-11ea-9ea0-fae23211d042.png" width = 70%> </img></p> 
PASS 되는 것을 확인 할 수 있다. <br />

이제 DELETE 하나 남았는데 저번 RESTful API를 했을 때 말했다시피 Golang 자체가 GET과 POST는 기본제공 하지만 DELETE는 제공하지 않기 때문에 Request를 새로 만들어 주어야 한다. <br />
``` Go

  package app

  import (
    "testing"

    "github.com/stretchr/testify/assert"

  )

  func TestTodos(t *testing.T) {
   
   ....
      
   for _, t := range todos {
     if t.ID == id1 {
       assert.True(t.Completed)
     }
   }
   
   req, _ := http.NewRequest("DELETE", ts.URL+"/todos/"+strconv.Itoa(id1), nil) // 1
   resp, err = http.DefaultClient.Do(req) // 2
   assert.NoError(err) // 3
   assert.Equal(http.StatusOK, resp.StatusCode)
   
  }
  
```

1 : 그래서 사용하는게 NewRequest()인데 첫번째 값이 메소드, 두번째 값이 URL을 넣어주고, id를 넣어준 다음 data를 넣어야 하는데 data는 지금 필요없으니까 nil로 바꾸어준다. <br />
2 : DefaultClient.Do를 사용하여 request를 넣어준다. <br />
    이 때 response와 error가 반환값으로 나오게 된다. <br />
3 : 마찬가지로 에러가 없어야 하고, <br />
4 : StatusCode가 같은지 확인한다. <br />

이 상태에서 다시 테스트를 해보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94105182-b46da480-fe73-11ea-9ea0-fae23211d042.png" width = 70%> </img></p> 
PASS 되는 것을 확인 할 수 있다. <br />

DELETE가 되었는데 이것을 확인하려면 다시 GET해서 확인했는지 확인해보아야 한다. <br />
위의 코드를 복붙 해보자 <br />
``` Go

  package app

  import (
    "testing"

    "github.com/stretchr/testify/assert"

  )

  func TestTodos(t *testing.T) {
   
   ....

   req, _ := http.NewRequest("DELETE", ts.URL+"/todos/"+strconv.Itoa(id1), nil)
   resp, err = http.DefaultClient.Do(req)
   assert.NoError(err) 
   assert.Equal(http.StatusOK, resp.StatusCode)
   todos = []*model.Todo{}
   err = json.NewDecoder(resp.Body).Decode(&todos)
   assert.NoError(err)
   assert.Equal(len(todos), 1) // 1
   
   for _, t := range todos {
 	assert.Equal(t.id, id2) // 2
   }
  }
  
  
```
1 : 삭제되었기 때문에 길이가 1과 같아야 한다. <br />
2 : 첫번째 나오는 id는 id2와 같아야 한다. <br />

그리고 테스트를 해보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94105182-b46da480-fe73-11ea-9ea0-fae23211d042.png" width = 70%> </img></p> 
PASS 되는 것을 확인 할 수 있다. <br />

이제 모든 테스트 코드가 완성되었다. <br />
이렇게 app의 기능을 확인 했는데 이렇게 해놓아야 나중에 리팩토링할 때 기존의 동작과 똑같다는 것을 확인 할 수 있기 때문에 테스트 코드 만드는 과정이 번거롭더라도 리팩토링 할 때 매우 유용하다. <br />

그 다음에 해볼 것은 <code>app/app.go</code>에 <code>var todoMap map[int]*Todo</code>로 메모리상에 Map이 들어가 있는데 이것을 다른것으로 바꾸어 주기 위해 분리하는 작업을 해보자! <br />

먼저 model이라는 폴더를 만들고 model.go라는 파일을 생성하여 여기에 분리 시켜주도록 하자. <br />

``` Go

package model

type Todo struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"created_at"`
}

var todoMap map[int]*Todo

func GetTodos() []*Todo { // 1
   return nil
}

func AddTodo(name string) *Todo { // 2
  return nil
}

func RemoveTodo(id int) bool { // 3
  return false
}

func CompleteTodo(id int, complete bool) bool { // 3
  return false
}

``` 
1 : Todos를 가져오기 위한 함수. <br />
2 : Todos를 추가하기 위한 함수. <br />
3 : Todos를 삭제하기 위한 함수. <br />
4 : Todos에 Complete를 하기 위한 함수. <br />

그리고 기존 파일에 코드가 사라져서 에러가 날텐데 그 부분을 수정해주자!
<code>app/app.go</code>
``` Go

func getTodoListHandler(w http.ResponseWriter, r *http.Request) {
   // list := []*Todo{}
   // for _, v := range todoMap {
     // list = append(list, v)
   // }
   list := model.GetTodos() // 1
   rd.JSON(w, http.StatusOK, list)
}

func addTodoHandler(w http.ResponseWriter, r *http.Request) {
   name := r.FormValue("name")
   todo := model.AddTodo(name) // 2
   // id := len(todoMap) + 1
   // todo := &Todo{id, name, false, time.Now()}
   // todoMap[id] = todo
   rd.JSON(w, http.StatusCreated, todo)
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
   // if _, ok := todoMap[id]; ok {
    // delete(todoMap, id)
    // rd.JSON(w, http.StatusOK, Success{true})
    // } else {
    // rd.JSON(w, http.StatusOK, Success{false})
   // }
}

func completeTodoHandler(w http.ResponseWriter, r *http.Request) {
   vars := mux.Vars(r)
   id, _ := strconv.Atoi(vars["id"])
   complete := r.FormValue("complete") == "true"
   ok := model.CompleteTodo(id, complete) // 4
   if ok {
     rd.JSON(w, http.StatusOK, Success{true})
   } else {
     rd.JSON(w, http.StatusOK, Success{false})
   }
   // if todo, ok := todoMap[id]; ok {
   // todo.Completed = complete
   // rd.JSON(w, http.StatusOK, Success{true})
   // } else {
    // rd.JSON(w, http.StatusOK, Success{false})
  // }
}

func MakeHandler() http.Handler {
  // todoMap = make(map[int]*Todo)
 ....
 }
```
getTodoListHandler, addTodoHandler, removeTodoHandler의 주석 처리된 부분은 나중에 옮길 것이기 때문에 해놓은 것이다. <br />
1 : model의 GetTodos함수를 통해 가져오는 것으로 수정. <br />
2 : model의 AddTodo함수를 통해 add 되는 것으로 수정. <br />
3 : id를 뽑아내서 그 id에 remove를 하면 True, False가 나오기 때문에 아래와 같이 수정해준다. <br />
4 : CompleteTodo에 id, complete를 넣어주면 잘 되었는지 ok로 알려주기 때문에 아래와 같이 수정해준다. <br />

이렇게 하면 기본적인 model과 수정은 끝이 났고, import에 model폴더를 추가시켜준다. <br />

지금 한 것이 기존 코드가 app.go가 메모리 map까지 다 들고 있었고, 그 map을 조정하는 부분도 다 포함 하고 있어서 강하게 결합되어 서로 의존성이 있는 상태였는데<br />
이 의존성을 끊기 위한 (이제부터 메모리가 아닌 FileDB를 사용할 것이기 때문에 끊어내야한다.) 전 작업을 다 해놓고, 분리가 완료된 상태이다. <br />
이제 <code>app.go</code> 를 건들 필요는 없고, <code>model/model.go</code>안에서 메모리 쓰는 부분을 File로 바꾸어 주면 된다. <br />
그걸 쉽게 하기 위해서 먼저 분리 시켜 준 것이다. <br />

그리고 <code>app/app_test.go</code>에서 <code>var todo Todo </code> 처럼 그냥 Todo 또는 todo로 되어있는 부분을 <br />
<code>model.Todo</code> 또는 <code>model.todo</code>로 전부 바꾸어준다. <br />

지금 부터 <code>model/model.go</code> 를 수정해보자! <br />

``` Go

package model

import "time"

type Todo struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"created_at"`
}

var todoMap map[int]*Todo

func init() { // 1
  todoMap = make(map[int]*Todo)
}

func GetTodos() []*Todo {
  list := []*Todo{}
  for _, v := range todoMap {
    list = append(list, v)
  }
 return list
}

func AddTodo(name string) *Todo {
  id := len(todoMap) + 1
  todo := &Todo{id, name, false, time.Now()}
  todoMap[id] = todo
  return todo
}

func RemoveTodo(id int) bool {
  if _, ok := todoMap[id]; ok {
    delete(todoMap, id)
     return true
  }
  return false
}

func CompleteTodo(id int, complete bool) bool {
  if todo, ok := todoMap[id]; ok {
   todo.Completed = complete
     return true
   }
   return false
}

``` 

1 : 먼저 map을 initialize(이니셜라이즈)해주어야 한다. <br />
    이 패키지가 처음 initialize될 때 호출되는 함수, 그러니까 한번만 호출되는 함수이다. <br />

그리고 주석처리 했던 코드들을 전부 여기에 복붙시켜준다. <br />

이제 잘 동작하는지 테스트해보자!  <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94105182-b46da480-fe73-11ea-9ea0-fae23211d042.png" width = 70%> </img></p> 
PASS 되는 것을 확인 할 수 있다. <br />

다시 한번 말하지만 테스트 코드에서 PASS가 뜨면 굳이 웹사이트를 띄우지 않아도 정상적으로 리팩토링 되었음을 확인할 수 있다. <br />
