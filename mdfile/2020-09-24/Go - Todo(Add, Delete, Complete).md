### 시작
<code>public/todo.js</code>
``` Javascript
 ....
 
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

   ...

```
  
저번에 이어서 여기에서 '.todo-list-add-btn'을 클릭했을 때 서버에 add를 요청할 수 있게 만들어보자! <br />
이 코드를 보면은
``` Javascript
 ....
 
$(function() {
    var todoListItem = $('.todo-list');
    var todoListInput = $('.todo-list-input');
    $('.todo-list-add-btn').on("click", function(event) {
        event.preventDefault();

        var item = $(this).prevAll('.todo-list-input').val();

        if (item) {
            $.post("/todos", {name:item}, function(e){ // 1
                addItem({name:item, completed:false); 
            // todoListItem.append("<li><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' />" + item + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
            todoListInput.val("");
        }
    });

   ...

```

1 : todo-list-add-btn을 클릭했을 때 todo-list-input의 값을 읽어서 어떤 것이 추가 되었는지 확인해서 그것을 item에 넣고 바로 add하는 식인데 <br />
    그 data를 서버로 POST로 보내준다. 그 후 처리가 되면 응답이 올텐데 addItem을 호출해주면 된다. 그리고 item을 넣을 때 값으로 completed와 name이 있기 때문에 <br />
    item을 바로 넣는게 아니라 JSON으로 만들어서 넣어준다. <br />

이제 POST로 Todo를 보낸 다음에 그 응답이 왔을 때 add하기 때문에 바로 보낼 필요가 없어서 todoListItem.append부분을 주석처리 시켜준다. <br />

그 후 Todos POST핸들러를 추가해주자! <br />
<code>app/app.go</code>
``` Go

  func addTodoHandler(w http.ResponseWriter, r *http.Request) { // 2
    name := r.FormValue("name") // 1
    id := len(todoMap) + 1 // 2
    todo := &Todo{id, name, false, time.Now()} // 3
    todoMap[id] = todo // 4
    rd.JSON(w, http.StatusOK, todo) // 5
  }

  func MakeHandler() http.Handler {
    todoMap = make(map[int]*Todo)
    addTestTodos()

    rd = render.New()
    r := mux.NewRouter()

    r.HandleFunc("/todos", getTodoListHandler).Methods("GET")
    r.HandleFunc("/todos", addTodoHandler).Methods("POST") // 1
    r.HandleFunc("/", indexHandler)

    return r
  }
  
```

1 : addTodoHandler추가 <br />
2 : addTodoHandler 함수 <br />
    여기에서 TodoList를 add해주는데 js에서 보낼 때 POST로 todo로 보낼 때 name에 item오브젝트를 넣어서 보내서 이것을 읽으려면 <br />
2-1 : FormValue()를 사용하여 key를 넣어주면 JS에서 보낸 inputvalue가 나오게 되는데 이것을 name에 넣고, 그것을 todoMap에 추가해주어야 하는데 <Br />
2-2 : id가 없으므로 id를 새로 발급해야 하는데 그 맵의 갯수가 id값이 되도록 한다. 0부터 시작하므로 +1을 해준다. <br />
2-3 : todo 인스턴스를 만들고 <br />
2-4 : todoMap에 등록해서 <br />
2-5 : 그 정보를 JSON형태로 반환 하여 클라이언트에게 알려준다. <br />

이제 저장 후에 실행을 해보자! <br />
아무거나 입력해서 등록하면 잘 들어가는 것을 확인 할 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94095122-0276ae00-fe5c-11ea-9243-bf432ec27ce8.png" width = 70%> </img></p> 

다시 소스로 돌아와서 
<code>public/todo.js</code>
``` javascript
 ....
    
    var item = $(this).prevAll('.todo-list-input').val();
    
        if (item) {
            $.post("/todos", {name:item}, function(e){
                addItem({name:item, completed:false); 
            // todoListItem.append("<li><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' />" + item + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
            todoListInput.val("");
        }
    });

   ...

```
이 곳을 보면 post로 todos를 보내는데 응답을 받은 상태에서 서버가 보내준 응답이 e에 들어있는데 이것을 사용하지 않고 <br />
기존에 있던 item변수에서 가져오는데 이렇게 하면 서버에서 보내준 id값을 읽어 올 수 없기 때문에 서버의 data를 그대로 사용 할 수 있도록 수정 하는데 <br />
서버가 JSON object로 반환해주기 때문에 그 값을 그대로 사용 할 수 있다.  <br />

``` Javascrpit
 ....
    
    var item = $(this).prevAll('.todo-list-input').val();
    
        if (item) {
            $.post("/todos", {name:item}, additem); 
            // todoListItem.append("<li><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' />" + item + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
            todoListInput.val("");
        }
    });
    
     var addItem = function(item) {
        if (item.completed) {
            todoListItem.append("<li class='completed'"+ " id='" + item.id + "'><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' checked='checked' />" + item.name + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
        } else {
            todoListItem.append("<li "+ " id='" + item.id + "'><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' />" + item.name + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
        }
    };

   ...

```

그래서 그냥 additem을 추가해주면 서버 응답이 될 때 이 함수가 호출이 되고, addItem함수에 item값에 서버의 응답값이 들어오게 되서 item에 해당하는 값을 사용할 수 있게 된다. <br />
그리고 todoListItem.append부분에  id='" + item.id + "'를 넣어서 서버가 보내준 id를 추가해준다. <br />
이렇게 하면 나중에 remove할 때 id값을 사용할 수 있게 된다.  <br />

이제 다시 실행 시켜서 값을 추가 시켜준 뒤 개발자 도구에 'Elements'로 들어가서 코드를 확인해보면 각 항목에 id값이 추가 되었다는 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94095852-8c734680-fe5d-11ea-8945-791ed9cebdcc.png" width = 70%> </img></p> 

지금까지 add버튼을 클릭했을 때 그 항목을 읽어서 서버로 todos Post로 보내서 응답이 오면 additem함수를 호출해서 additem함수에서 그 서버가 알려준 항목을 추가할 수 있게 했다. <br />

이제 Delete할 수 있게 만들어 보자! 서버로 요청을 날린다음에 요청이 처리된 다음에 지울 수 있게 만들어본다.<br />
<code>public/todo.js</code>
``` Javascript

  todoListItem.on('click', '.remove', function() { // 1
          // url: todos/id method: DELETE
          var id = $(this).closest("li").attr('id');  // 1
          var $self = $(this); // 4
          $.ajax({ // 2
              url: "todos/" + id,
              type: "DELETE",
              success: function() {
                      $self.parent().remove(); // 3
                  }
              }
          })
          //$(this).parent().remove();
  });
  
```

1 : delete가 클릭 되었을 때 todos/id URL로 메소드는 DELETE로 보낼 것이다.
    그러기위해서는 id를 알아야하는데, todolist item의 remove 항목이 클릭되면 function()이 출력되는데

1-1 : 이 때 ($this)는 remove버튼이 된다. 그래서 this에서 가장 가까운 li항목을 찾아와서 그것의 Attribute id를 가져오면 remove될 항목의 id값을 알 수 있다. <br />
1-2 : ajax request object 생성. <br />
1-3 : 성공했을 때 이벤트. <code>//$(this).parent().remove();</code> 값을 넣어주는데, this가 바뀔 수 있기 때문에 <br />
1-4 : self라는 변수를 만들어 this를 저장해준다. <br />
      그 이유는 success: function(data) 불릴 때 this가 되어버리기 때문에 바깥쪽의 this와 다르기 때문에 바깥쪽의 this를 저장해서 사용한다. <br />

이제 저장 후에 제대로 동작하는지 확인해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94097413-6cde1d00-fe61-11ea-8f29-1666c87532d5.png" width = 70%> </img></p> 

404 에러가 뜨면서 todos/7이 온 것을 확인 할 수 있다. <br />

제대로 동작하므로 delete핸들러를 만들어주자! <br />

<code>app/app.go</code>
``` Go
  
  type Success struct { // 3
    Success bool `json:"success"`
  }
  
  func removeTodoHandler(w http.ResponseWriter, r *http.Request) { // 2
    vars := mux.Vars(r) // 1
    id, _ := strconv.Atoi(vars["id"]) // 2
    if _, ok := todoMap[id]; ok { // 3
      delete(todoMap, id) // 4
      rd.JSON(w, http.StatusOK, Success{true}) // 5
    } else {
      rd.JSON(w, http.StatusOK, Success{false}) // 6
    }
  }
  
  func MakeHandler() http.Handler {
    todoMap = make(map[int]*Todo)
    addTestTodos()

    rd = render.New()
    r := mux.NewRouter()

    r.HandleFunc("/todos", getTodoListHandler).Methods("GET")
    r.HandleFunc("/todos", addTodoHandler).Methods("POST")
    r.HandleFunc("/todos/{id:[0-9]+}", removeTodoHandler).Methods("DELETE") // 1
    r.HandleFunc("/", indexHandler)

    return r
  }

```

1 : removeHandler 추가. <br />

2 : removeTodoHandler 함수.  <br />
2-1 : id값을 가져오기 위해 사용. <br />
2-2 : vars의 id값을 문자열을 숫자로 바꾸어준다. <br />
2-3 : Map에 id값에 해당하는 data가 있는지 확인한다. <br />
2-4 : 있으면 지워주고, <br />
2-5, 2-6 : 그 후 응답 결과를 return을 해준다. <br />

3 : 응답 결과를 알려주기 위한 struct <br />

이 후 서버를 재실행 했을 때 정상적으로 삭제되는 것을 알 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94097935-76b45000-fe62-11ea-8bd6-aabe6b86894c.png" width = 70%> </img></p> 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94097943-7caa3100-fe62-11ea-8d48-2e89161c8f91.png" width = 70%> </img></p> 

이제 DELETE했을 때 성공여부에 따라서 data가 success일 때만 지워 줄 수 있도록 코드를 수정해주자. <br />
<code>public/todo.js</code>
``` Javascript

  todoListItem.on('click', '.remove', function() {
          // url: todos/id method: DELETE
          var id = $(this).closest("li").attr('id'); 
          var $self = $(this);
          $.ajax({
              url: "todos/" + id,
              type: "DELETE",
              success: function() {
                  if (data.success) { // 추가.
                      $self.parent().remove(); 
                  }
              }
          })
          //$(this).parent().remove();
  });
  
```

이제 지우는 것은 끝이났고, 마지막으로 Complete toggle처리해주는 것을 하자! <br />
이 부분은 여기에 있는데 이 부분을 수정해주자. <br />
<code>public/todo.js</code>
``` javascript

  todoListItem.on('change', '.checkbox', function() {
      if ($(this).attr('checked')) {
          $(this).removeAttr('checked');
      } else {
          $(this).attr('checked', 'checked');
      }

      $(this).closest("li").toggleClass('completed');
  });
    
```

<code>public/todo.js</code>
`` Javascript
   
  todoListItem.on('change', '.checkbox', function() {
    var id = $(this).closest("li").attr('id'); // 2
    var $self = $(this); // 3
    var complete = true; // 6
    if ($(this).attr('checked')) { // 5
      complete = false;
    }
    
    $.get("complete-todo/"+id+"?complete="+complete, function(data){ // 1
       if ($self.attr('checked')) {
          $self.removeAttr('checked');
        } else {
          $self.attr('checked', 'checked');
        }

        $self.closest("li").toggleClass('completed');
    });
    
```

1 : 서버로 요청하게 수정해준다. <br />
    어떤 id를 complete 시켜줄 것인지 알려주기 위해 id를 받아와야하는데 <br />
2 ~ 3 : 방금 delete 부분 수정했을 때 코드를 그대로 가져온다. <br />
1 : 그렇게 되면 change가 클릭한 항목들이 나오게 될텐데, 그게 온 다음에 complete-todo/에 id를 붙인 URL에 요청을 해주게 되고, <br />
4 : 그 뒤 응답이 오면 아래의 코드가 실행 되도록 해준다. <br />

5 : toggle되는 것을 알려주어야 하기 때문에 사용되는 if문 (checked인지 아닌지) <br />
6 : checked인 상태는 change가 온 상태이므로 완료상태에서 완료 상태가 아닌 과정을 만드는 것이므로 기본값을 true로 바꾸어준다. <br />
    
재실행해서 정상적으로 값이 들어오는지 확인해보자! <br />
체크되어있는 상태에서 체크를 해제하면 아래와 같은 오류창이 뜨는 것을 확인 할 수 있는데 정상적인 URL을 호출하는 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94099697-86359800-fe66-11ea-979e-3f4ab716d68e.png" width = 70%> </img></p> 

이제 이것을 요청하는 핸들러를 만들어보자! <br />
<code>app/app.go</code>
``` Go

  func completeTodoHandler(w http.ResponseWriter, r *http.Request) { // 2
    vars := mux.Vars(r) // 1
    id, _ := strconv.Atoi(vars["id"]) // 2
    complete := r.FormValue("complete") == "true" // 3
    if todo, ok := todoMap[id]; ok { // 4
      todo.Completed = complete
      rd.JSON(w, http.StatusOK, Success{true})
    } else {
      rd.JSON(w, http.StatusOK, Success{false})
    }
  }

  func MakeHandler() http.Handler {
    todoMap = make(map[int]*Todo)
    addTestTodos()

    rd = render.New()
    r := mux.NewRouter()

    r.HandleFunc("/todos", getTodoListHandler).Methods("GET")
    r.HandleFunc("/todos", addTodoHandler).Methods("POST")
    r.HandleFunc("/todos/{id:[0-9]+}", removeTodoHandler).Methods("DELETE")
    r.HandleFunc("/complete-todo/{id:[0-9]+}", completeTodoHandler).Methods("GET") // 1
    r.HandleFunc("/", indexHandler)

    return r
  }
  
1 : complte핸들러 추가 <br />
2 : completeTodoHandler 함수 <br />
2-1 ~ 2-2 : remove코드를 가져온다. <br />
2-3 : complete여부는 FormValue에 들어있는데 true,false로 값이 온다. <br />
2-4 : 그 값이 map에 있는지 확인 후 , 있는경우 값을 가져와서 complete의 값을 변경시켜주고, todo값을 반환시켜준다. <br />
      없는 경우 Success{false}로 반환해준다. 이 부분은 remove부분과 비슷하다. <br />
      
다시 <code>public/todo.js</code>로 돌아와서

``` Javascript
   
  todoListItem.on('change', '.checkbox', function() {
    var id = $(this).closest("li").attr('id'); 
    var $self = $(this); 
    var complete = true; 
    if ($(this).attr('checked')) {
      complete = false;
    }
    
    $.get("complete-todo/"+id+"?complete="+complete, function(data){
       if (complete) { // 1
            $self.attr('checked', 'checked');
        } else {
            $self.removeAttr('checked');
        }

        $self.closest("li").toggleClass('completed');
    })
  });
    
```
1 : complete완료를 요청하는 경우에 check를 넣어주고, 완료 해제를 하는 경우엔 check를 remove를 할 수 있게 바꾸어준다. <br />

그 후 재실행을 해보면 체크, 체크 해제가 정상적으로 동작하는 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94100483-c39b2500-fe68-11ea-863f-bde1102cb399.png" width = 70%> </img></p> 

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94100493-cac23300-fe68-11ea-96e2-afcc358e8d13.png" width = 70%> </img></p> 

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/94100559-ed544c00-fe68-11ea-8729-83c76357586b.png" width = 70%> </img></p> 
