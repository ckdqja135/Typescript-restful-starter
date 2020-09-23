### 시작
부트스트랩과 지금까지 배운것을 토대로 TodoList를 만들어 보려고 한다. <br />

먼저 알아볼 것은 부트스트랩인데, original폴더에 있는 파일들을 다운 받으면 된다. <br />
[출처](https://bbbootstrap.com/snippets/awesome-todo-list-template-25095891) <Br />

그 후 app이라는 폴더를 만든 뒤 app.go파일을 만든 뒤 여기에 핸들러를 만들어 보자! <br />

``` Go
  
  package app
  
  func MakeHandler() http.Handler { // 1
    r := mux.NewRouter()
    
    return r
  }
  
```
1 : 이 핸들러가 하는 일은 단순히 mux를 만들고 단순하게 mux를 반환하는 함수로 만들어준다.

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

이렇게 기본적인 서버를 구축 한 뒤 public폴더를 만들어 original폴더를 넣어주고, original폴더에 들어있는 파일들을 public안으로 빼준 뒤, 서버를 실행해 보자! <br/ >

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
   
    "github.com/unrolled/render"
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

이제 todo.html이 불러져 올 때 todo.js가 실행될텐데 이 때 서버로 부터 list를 받아오도록 수정해보자!
<code>public/todo.js</code>

``` javascrpit

  (function($) {
    'use strict';
    $(function() {
        var todoListItem = $('.todo-list');
        var todoListInput = $('.todo-list-input');
        $('.todo-list-add-btn').on("click", function(event) {
            event.preventDefault();

            var item = $(this).prevAll('.todo-list-input').val();

            if (item) {
                todoListItem.append("<li><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' />" + item + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
                todoListInput.val("");
            }
        });

        var addItem = function(item) { // 이 부분 추가.
            if (item.completed) {
                todoListItem.append("<li class='completed'><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' checked='checked' />" + item.name + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
            } else {
                todoListItem.append("<li><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' />" + item.name + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
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
