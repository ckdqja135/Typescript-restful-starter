### 시작
부트스트랩과 지금까지 배운것을 토대로 TodoList를 만들어 보려고 한다. <br />

먼저 알아볼 것은 부트스트랩인데, public폴더에 있는 파일들을 다운 받으면 된다. <br />
[출처](https://bbbootstrap.com/snippets/awesome-todo-list-template-25095891) <Br />

그 후 app이라는 폴더를 만든 뒤 app.go파일을 만든 뒤 여기에 핸들러를 만들어 보자! <br />

``` Go
  
  package app
  
  func MakeHandler() http.Handler { // 1
    r := mux.NewRouter()
    
    return r
  }
  
```
1 : 이 핸들러가 하는 일은 단순히 mux를 만들고 단순하게 mux를 반환하는 함수로 만들어준다. <br />

<code>main.go</code>를 작성해보자! <br />
``` Go
  
  package main

  import (
    "net/http"

    "./app"
    "github.com/urfave/negroni"
  )

  func main() {
    m := app.MakeHandler()
    n := negroni.Classic()
    n.UseHandler(m)
    
    http.ListenAndServe(":3000", n)
  }

```

이렇게 기본적인 서버를 구축 한 뒤 public폴더를 만들어 original폴더를 넣어주고, original폴더에 들어있는 파일들을 public안으로 빼준 뒤, 서버를 실행해 보자! <br />

여기서 주의할 점은 localhost:3000/이 아니라 localhost:3000/todo.html로 접속해야 한다는 것이다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93981324-cccdb880-fdba-11ea-93fa-cb9eeb68b4b2.png" width = 70%> </img></p> 

그래서 그냥 localhost:3000으로 접속하면 404Page가 나오게 되는데<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93981496-08688280-fdbb-11ea-80bb-f90339a8a06b.png" width = 70%> </img></p> 

이것을 리다이렉트 시켜보도록 하자! <br />
<code>app/app.go</code>

``` Go
  
  package app
  
  import (
    "net/http"
   
    "github.com/gorilla/mux"
  )

  func indexHandler(w http.ResponseWriter, r *http.Request) { // 1
    http.Redirect(w, r, "/todo.html", http.StatusTemporaryRedirect)
  }
  
  func MakeHandler() http.Handler { // 1
    r := mux.NewRouter()
    
    r.HandleFunc("/", indexHandler)
    return r
  }
  
```
 
1 : Redirect 시켜주는 함수.  <br />

그 후 다시 <code>main.go</code>로 돌아와서 코드를 수정해주자! <br />
``` Go
  
  package main

  import (
    "net/http"

    "./app"
    "github.com/urfave/negroni"
  )

  func main() {
    m := app.MakeHandler()
    n := negroni.Classic()
    n.UseHandler(m)
    
    err := http.ListenAndServe(":3000", n) // 1
    if err != nil {
      panic(err)
    }
  }

```

1 : ListenAndServe를 할 때 응답으로 error가 나오는데 그 erorr를 출력 시켜 실행여부를 확인 할 수 있게 수정했다. <br />

이렇게 한 뒤 실행을 시켜주면 <br />

localhost:3000/을 입력하면 자동으로 localhost:3000/todo.html으로 리다이렉션 되는 것을 확인할 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93982235-f3402380-fdbb-11ea-9e1c-bc61c67f377f.png" width = 70%> </img></p>

그 후 <code>public/todo.html</code>로 들어가서 주석처리해야 할 부분이 있는데 <br />

``` HTML

  <div class="list-wrapper">
                          <ul class="d-flex flex-column-reverse todo-list">
                              <!-- <li>
                                  <div class="form-check"> <label class="form-check-label"> <input class="checkbox" type="checkbox"> For what reason would it be advisable. <i class="input-helper"></i></label> </div> <i class="remove mdi mdi-close-circle-outline"></i>
                              </li>
                              <li class="completed">
                                  <div class="form-check"> <label class="form-check-label"> <input class="checkbox" type="checkbox" checked=""> For what reason would it be advisable for me to think. <i class="input-helper"></i></label> </div> <i class="remove mdi mdi-close-circle-outline"></i>
                              </li>
                              <li>
                                  <div class="form-check"> <label class="form-check-label"> <input class="checkbox" type="checkbox"> it be advisable for me to think about business content? <i class="input-helper"></i></label> </div> <i class="remove mdi mdi-close-circle-outline"></i>
                              </li>
                              <li>
                                  <div class="form-check"> <label class="form-check-label"> <input class="checkbox" type="checkbox"> Print Statements all <i class="input-helper"></i></label> </div> <i class="remove mdi mdi-close-circle-outline"></i>
                              </li>
                              <li class="completed">
                                  <div class="form-check"> <label class="form-check-label"> <input class="checkbox" type="checkbox" checked=""> Call Rampbo <i class="input-helper"></i></label> </div> <i class="remove mdi mdi-close-circle-outline"></i>
                              </li>
                              <li>
                                  <div class="form-check"> <label class="form-check-label"> <input class="checkbox" type="checkbox"> Print bills <i class="input-helper"></i></label> </div> <i class="remove mdi mdi-close-circle-outline"></i>
                              </li> -->
                          </ul>
                      </div>

```

이 부분들을 이런식으로 수정해준다. <br /> 그 다음 저장을 하고 새로고침을 하게 되면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93982628-677ac700-fdbc-11ea-9179-e0ffe0fb2036.png" width = 70%> </img></p>
항목이 모두 사라져 있다는 것을 확인 할 수 있다. <br />

이제 todo.html이 불러져 올 때 todo.js가 실행될텐데 이 때 서버로 부터 list를 받아오도록 수정해보자! <br />
<code>public/todo.js</code>

``` JAVASCRIPT

  (function($) {
    'use strict';
    $(function() {
        var todoListItem = $('.todo-list');
        var todoListInput = $('.todo-list-input');
        $('.todo-list-add-btn').on("click", function(event) {
            event.preventDefault();

            var item = $(this).prevAll('.todo-list-input').val();

            if (item) {
                todoListItem.append("<li><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' />" + item 
                + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
                todoListInput.val("");
            }
        });

        var addItem = function(item) { // 이 부분 추가.
            if (item.completed) {
                todoListItem.append("<li class='completed'><div class='form-check'><label class='form-check-label'>
                <input class='checkbox' type='checkbox' checked='checked' />" 
                + item.name + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
            } else {
                todoListItem.append("<li><div class='form-check'><label class='form-check-label'>
                <input class='checkbox' type='checkbox' />" + item.name 
                + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
            }
        };

        $.get('/todos', function(items) { // 이 부분 추가.
            items.forEach(e => {
                addItem(e)
            });
        });

        todoListItem.on('change', '.checkbox', function() {
            if ($(this).attr('checked')) {
                $(this).removeAttr('checked');
            } else {
                $(this).attr('checked', 'checked');
            }

            $(this).closest("li").toggleClass('completed');
        });

        todoListItem.on('click', '.remove', function() {
            $(this).parent().remove();
        });

    });
    })(jQuery);

```
todo-list-add-btn 버튼을 클릭했을 때 하는 이벤트가 addItem인데 이것이 add하는 항목을 가져온다. <br />
todo list item에 append 해주면 된다. <br />
위에 if (item) {에 있는 코드를 복붙 하면 되는데 차이점은 <br />
위에 것은 '.todo-list-input'인 todo 를 등록할 때 쓰는 input창에서 입력받는 부분의 .var()이라 위의 item 변수는 text지만, <br />
addItem에 인자로 받는 item은 json object가 오기 때문에 그냥 item이 아닌 item.name으로 변경해준다. <br />
그리고 그 addItem을 forEach안에 호출해 주었기 때문에 '/todos'를 해서 결과가 나오면 그 결과를 하나씩 돌면서 add해주는 방식이다. <br />

이제 '/todos'의 핸들러를 만들어보자! <br />

<code>app/app.go</code>
``` Go
  
  package app
  
  import (
    "net/http"
   
    "github.com/unrolled/render"
    "github.com/gorilla/mux"
  )
  
  var rd *render.Render // 3
  
  type Todo struct { // 4
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"created_at"`
  }
  
  var todoMap map[int]*Todo // 5
  
  func indexHandler(w http.ResponseWriter, r *http.Request) {
    http.Redirect(w, r, "/todo.html", http.StatusTemporaryRedirect)
  }
  
  func getTodoListHandler(w http.ResponseWriter, r *http.Request) { // 2
    list := []*Todo{} // 7
    for _, v := range todoMap { // 8
      list = append(list, v)
    }
    rd.JSON(w, http.StatusOK, list) // 9
  }
  
  func MakeHandler() http.Handler { 
    todoMap = make(map[int]*Todo) // 6
    rd = render.New()
    r := mux.NewRouter()
    
    r.HandleFunc("/", indexHandler)
    	r.HandleFunc("/todos", getTodoListHandler).Methods("GET") // 1
    return r
  }
  
```

1 : todos 핸들러 추가 <br />
2 : todos 핸들러 함수 list를 받아서 JSON으로 넘겨줌. <br />
    
3 : JSON을 반환하기 때문에 사용하기 편하게 render 변수를 만들어 준다. <br />
4 : Todo struct 생성 <br />
5 : Todo struct의 variable한 In-memory struct생성 <br />
    Map이고, id와 todo정보를 가지고 있다. <br />
    
6 : todoMap 초기화 <br />
7 : Todo 포인터형 인스턴스를 list로 가지고 있는 list 변수. <Br />
8 : forEach를 todoMap을 돌면서 Key, Value를 가져오는데 Key는 필요없고 Value만 가져오기 때문에 key를 list에 Value부분을 append해서 list를 생성해주었다. <br />
9 : render를 사용해서 JSON 반환 <br />

이렇게 하면 지금 data가 비어있는 상태이기 때문에 test형 데이터를 추가해주자! <br />

<code>app/app.go</code>
``` Go
  
  package app
  
  import (
    "net/http"
   
    "github.com/unrolled/render"
    "github.com/gorilla/mux"
  )
  
  var rd *render.Render
  
  type Todo struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"created_at"`
  }
  
  var todoMap map[int]*Todo
  
  func indexHandler(w http.ResponseWriter, r *http.Request) {
    http.Redirect(w, r, "/todo.html", http.StatusTemporaryRedirect)
  }
  
  func getTodoListHandler(w http.ResponseWriter, r *http.Request) { 
    list := []*Todo{} 
    for _, v := range todoMap {
      list = append(list, v)
    }
    rd.JSON(w, http.StatusOK, list) 
  }
  
  func addTestTodos() { // 1
    todoMap[1] = &Todo{1, "Buy a milk", false, time.Now()}
    todoMap[2] = &Todo{2, "Exercise", true, time.Now()}
    todoMap[3] = &Todo{2, "Home work", false, time.Now()}
  }
  
  func MakeHandler() http.Handler { 
    todoMap = make(map[int]*Todo)
    addTestTodos() // 2
    rd = render.New()
    r := mux.NewRouter()
    
    r.HandleFunc("/", indexHandler)
    	r.HandleFunc("/todos", getTodoListHandler).Methods("GET") 
    return r
  }
  
```

1 : 테스트 용 데이터를 넣어주는 함수 생성. <br />
2 : 테스트 용 데이터를 넣어주는 함수 실행. <br />

그 후 실행을 하고, 웹에서 확인을 하기 전에 클라이언트 앱에서 확인을 해보자! <br />
메소드는 GET, URL은 localhostL3000/todos이다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93987994-2fc34d80-fdc3-11ea-8643-c1bdc3a76577.png" width = 70%> </img></p>

웹 상에서도 추가가 잘 된 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93988239-70bb6200-fdc3-11ea-8150-fe57b260c1d7.png" width = 70%> </img></p>

그런데 Exercise부분은 true로 해서 체크가 되어 있게 만들었는데 체크가 되어 있지 않아 체크 될 수 있도록 만들어 주자! <br />
완료 표시는 todo.html에서 <code>class="copleted"</code>를 사용 하여 추가해주면 된다.   <br />
<code>public/todo.js</code> 
``` Go

    var addItem = function(item) {
        if (item.completed) {
            todoListItem.append("<li class='completed'><div class='form-check'><label class='form-check-label'>
            <input class='checkbox' type='checkbox' checked='checked' />" + item.name 
            + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
        } else {
            todoListItem.append("<li><div class='form-check'><label class='form-check-label'>
            <input class='checkbox' type='checkbox' />" + item.name 
            + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
        }
    };
    
```

이렇게 수정해 준 뒤 다시 실행 하면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93988803-1ec70c00-fdc4-11ea-9bba-f3fe6bfc6ffe.png" width = 70%> </img></p>
정상적으로 체크 되어 있는 것을 확인 할 수 있다. <br />

<code>main.go</code>
``` Go
  package main

  import (
    "log"
    "net/http"

    "./app"
    "github.com/urfave/negroni"
  )

  func main() {
    m := app.MakeHandler()
    n := negroni.Classic()
    n.UseHandler(m)

    log.Println("Started App")
    err := http.ListenAndServe(":3000", n)
    if err != nil {
      panic(err)
    }
  }

```

<code>app/app.go</code>

``` Go
  
  package app

  import (
    "net/http"
    "time"

    "github.com/gorilla/mux"
    "github.com/unrolled/render"
  )

  var rd *render.Render

  type Todo struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"created_at"`
  }

  var todoMap map[int]*Todo

  func indexHandler(w http.ResponseWriter, r *http.Request) {
    http.Redirect(w, r, "/todo.html", http.StatusTemporaryRedirect)
  }

  func getTodoListHandler(w http.ResponseWriter, r *http.Request) {
    list := []*Todo{}
    for _, v := range todoMap {
      list = append(list, v)
    }
    rd.JSON(w, http.StatusOK, list)
  }

  func addTestTodos() {
    todoMap[1] = &Todo{1, "Buy a milk", false, time.Now()}
    todoMap[2] = &Todo{2, "Exercise", true, time.Now()}
    todoMap[3] = &Todo{3, "Home work", false, time.Now()}
  }

  func MakeHandler() http.Handler {
    todoMap = make(map[int]*Todo)
    addTestTodos()

    rd = render.New()
    r := mux.NewRouter()

    r.HandleFunc("/todos", getTodoListHandler).Methods("GET")
    r.HandleFunc("/", indexHandler)

    return r
  }

```
