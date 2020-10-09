### 시작

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95412966-30341a80-0965-11eb-9579-dfa05d49ceb1.png" width = 70%> </img></p> 
위와 같은 에러는 main함수의 os.Getenv()에서 발생하여 <br />

``` Go

  m := app.MakeHandler("발급받은 Postgre URL")

```
이런식으로 해결했다. <br />


그 후 git add, commit, push 후 heroku -logs --tail을 사용하여 정상적으로 작동하는지 로그를 확인해준다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95541170-984e3380-0a2d-11eb-9696-9a3b30cff6a7.png" width = 70%> </img></p> 

postgre에서는 '?'를 지원하지 않는다는 의미인데, postgre ?가 아닌 $와 숫자를 사용해야 한다. <br />
``` Go

  func (s *pqHandler) GetTodos(sessionId string) []*Todo {
    todos := []*Todo{}
    rows, err := s.db.Query("SELECT id, name, completed, createdAt FROM todos sessionId=$1", sessionId)
  ...
  }
  
  func (s *pqHandler) AddTodo(name string, sessionId string) *Todo {
    stmt, err := s.db.Prepare("INSERT INTO todos (sessionId, name, completed, createdAt) VALUES ($1, $2, $3, now()")
    ...
  }
func (s *pqHandler) RemoveTodo(id int) bool {
	stmt, err := s.db.Prepare("DELETE FROM todos WHERE id=$1")
  ...
}

func (s *pqHandler) CompleteTodo(id int, complete bool) bool {
	stmt, err := s.db.Prepare("UPDATE todos SET completed=$1 WHERE id=$2")
  ...
}


```

이렇게 바꾸어준다. <br />

그 후 git add, commit, push 후 서버를 실행해주면 정상적으로 add와 update가 되는 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95535005-46ec7700-0a22-11eb-8d76-67f355e2e03b.png" width = 70%> </img></p> 

그런데 여기서 DELETE가 되지 않는다. 그 이유는 Postgre에서 LastInsertId()를 지원하지 않기 때문에 그런것인데 아래와 같이 코드를 수정해준다. <br />


``` Go

  func (s *pqHandler) AddTodo(name string, sessionId string) *Todo {
    stmt, err := s.db.Prepare("INSERT INTO todos (sessionId, name, completed, createdAt) VALUES ($1, $2, $3, now()) RETURNING id")
    if err != nil {
      panic(err)
    }
    var id int
    err = stmt.QueryRow(sessionId, name, false).Scan(&id)
    if err != nil {
      panic(err)
    }
    // id, _ := rst.LastInsertId()
    var todo Todo
    todo.ID = id
    todo.Name = name
    todo.Completed = false
    todo.CreatedAt = time.Now()
    return &todo
  }

```

LastInsertId()를 지원하지 않는 이유는 insert 된 게 정확한 id가 아니기 때문이라고 한다. <br />
그래서 insert 한 뒤에 RETURNING id으로 id정보를 return할 수 있게 만들어주고, <br />
그 다음에 QueryRow()바꾸고, 결과로 SqlRow()가 나온다. 이것이 id값으로 가지고 있을 것인데 그것을 Scan()해서 id변수를 집어넣어서 id값을 채워주도록 수정했다. <br />
그래서 그 id값을 LastInsertId()가 아닌 아까만들었던 id 변수를 넣어서 제대로된 id값을 가져올 수 있게 되었다. <br />

저장 후에 git add, commit, push후에 heroku를 open 해준다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95535621-e6f6d000-0a23-11eb-952a-ff8753ce4595.png" width = 70%> </img></p> 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95535635-ebbb8400-0a23-11eb-9d7d-0a13f60a5be5.png" width = 70%> </img></p> 

여기까지 간단하지만 Todos라는 Web Service를 배포했고, database까지 추가했다. <br />
