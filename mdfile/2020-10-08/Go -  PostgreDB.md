### 시작
현재까지 Todos를 Heroku에 배포를 했다. <br />
heroku에서는 dyno라는 컨테이너를 쓰는데, 이것이 [statelss](https://velog.io/@makeitcloud/%EB%9E%80-Stateless-Stateful-%EC%9D%B4%EB%9E%80)라 fileDB를 사용할 수 없게 되어 <br />
실제 DB를 사용해야 하는데 heroku가 클라우드 서비스이기 때문에 PostgreDB라는 DB서비스를 10000레코드까지만 무료로 제공하고 있다. <br />

커맨드 창을 띄운 뒤에 Heroku 로그인을 해준다. <br />

그 후 해당 명령어를 입력한다. <br />

``` linux

  heroku addons:create heroku-postgresql:hobby-dev
  
```
이렇게 하면 현재 앱에 postgresqlDB가 추가가 되고, 티어는 hobby-dev인 무료티어로 추가가 된다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95405829-ceb78000-0953-11eb-9400-977003cf6032.png" width = 70%> </img></p> 

``` text

  Created postgresql-round-47123 as DATABASE_URL 

```
라는 의미는 DATABASE_URL라는 이름으로 환경변수가 추가되었다는 의미이다. <br />

그래서 heroku config를 사용하여 환경변수를 조회하면 DATABASE_URL라는 이름으로 환경변수가 추가되었다는 것을 확인 할 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95405999-4685aa80-0954-11eb-84c6-8faaabec4fc0.png" width = 70%> </img></p> 

이것을 이용해서 PostgreSQL에 접속할 수 있다. <br />

Go에서 사용하기 위해서 패키지를 받아주어야 한다. 다음과 같이 입력한다.<br />

``` linux

  go get github.com/lib/pq
  
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95406107-95334480-0954-11eb-8b66-b86a64b722cc.png" width = 70%> </img></p> 

pq가 postgreSQL을 의미한다. <br />

그리고 이전에 만들었던 <code>model/sqliteHandler.go</code>로 와서 복사 붙여넣기해서 pqHandler.go로 이름만 바꾸어준다. <br />

그 후 코드를 다음과 같이 수정해준다. <br />

``` Go 

  package model

  import (
    "database/sql"
    "time"

    _ "github.com/mattn/go-sqlite3"
  )

  type pqHandler struct {
    db *sql.DB
  }

  func (s *pqHandler) GetTodos() []*Todo {
    todos := []*Todo{}
    rows, err := s.db.Query("SELECT id, name, completed, createdAt FROM todos")
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

  func (s *pqHandler) AddTodo(name string) *Todo {
    stmt, err := s.db.Prepare("INSERT INTO todos (name, completed, createdAt) VALUES (?, ?, datetime('now'))")
    if err != nil {
      panic(err)
    }
    rst, err := stmt.Exec(name, false)
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

  func (s *pqHandler) RemoveTodo(id int) bool {
    stmt, err := s.db.Prepare("DELETE FROM todos WHERE id=?")
    if err != nil {
      panic(err)
    }
    rst, err := stmt.Exec(id)
    if err != nil {
      panic(err)
    }
    cnt, _ := rst.RowsAffected()
    return cnt > 0
  }

  func (s *pqHandler) CompleteTodo(id int, complete bool) bool {
    stmt, err := s.db.Prepare("UPDATE todos SET completed=? WHERE id=?")
    if err != nil {
      panic(err)
    }
    rst, err := stmt.Exec(complete, id)
    if err != nil {
      panic(err)
    }
    cnt, _ := rst.RowsAffected()
    return cnt > 0
  }

  func (s *pqHandler) Close() {
    s.db.Close()
  }

  func newPQHandler(filepath string) DBHandler {
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

이런식으로 기존 handler struct를 pqHandler로 바꾼 뒤 이름만 바꾸어 준다. <br />

그 후 <code>model/model.go</code>로 넘어와서 newPQHandler가 생성되도록 수정해준다. <br />

``` Go

func NewDBHandler(dbConn string) DBHandler {
	//handler = newMemoryHandler()
	return newPQHandler(dbConn)
}

```

그리고 기존에는 filePath였는데 지금은 DB정보가 와야 하기 때문에 dbConn으로 변경해준다. <br />

마찬가지로 <code>model/sqliteHandler.go</code>도 수정해준다. <br />

``` Go 

  import (
    "database/sql"
    "time"

    _ "github.com/lib/pq"
)

  func newSqliteHandler(dbConn string) DBHandler {
    database, err := sql.Open("postgres", dbConn)
    if err != nil {
      panic(err)
    }
    
    statement, err := database.Prepare(
      `CREATE TABLE IF NOT EXISTS todos (
        id        INTEGER  PRIMARY KEY AUTOINCREMENT,
        name      TEXT,
        completed BOOLEAN,
        createdAt DATETIME
      )`)
      
    if err != nil {
      panic(err)
    }
    
    _, err = statement.Exec()
    
    if err != nil {
      panic(err)
    }
    
    return &sqliteHandler{db: database}
  }

```

마찬가지로 여기에서도 dbConn으로 변경해주었고, error를 받아서 error가 날 때마다 확인하도록 수정했고, <br />
import 부분에서 go-sqlite3을 pq로, newSqliteHandler부분에서 postgres로 수정해주었다.

그 후 <code>main.go</code>에서 file을 넣었는데, dbConn을 넣어준다. <br />

``` Go

  func main() {
    port := os.Getenv("PORT")
    m := app.MakeHandler(os.Getenv("DATABASE_URL"))
    defer m.Close()

    log.Println("Started App")
    err := http.ListenAndServe(":"+port, m)
    if err != nil {
      panic(err)
    }
  }
  
```

이렇게 하면 준비는 끝났다. 저장 후에, add, commit, push를 해주자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95407003-cf9de100-0956-11eb-92b1-68fbee824a9f.png" width = 70%> </img></p> 

그 후 잘 동작하는지 log를 확인한다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95407139-2f948780-0957-11eb-9696-a3b38a112dc0.png" width = 70%> </img></p> 

log창을 보면 panic: runtime error: invalid memory address or nil pointer dereference이라는 에러가 떴는데, <code>model/sqliteHandler.go</code>에서 DB테이블을 만들 때

``` Go

  func newPQHandler(filepath string) DBHandler {
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

<code>id INTEGER  PRIMARY KEY AUTOINCREMENT,</code> 이 부분에서 에러가 난 것이다. <br />
각 DB마다 문법이 다른데, 이 부분을 

``` Go

  func newPQHandler(dbConn string) DBHandler {
    database, err := sql.Open("postgres", dbConn)
    if err != nil {
      panic(err)
    }
    statement, err := database.Prepare(
      `CREATE TABLE IF NOT EXISTS todos (
        id        INTEGER  PRIMARY KEY AUTOINCREMENT,
        sessionId VARCHAR(256),
        name      TEXT,
        completed BOOLEAN,
        createdAt TIMESTAMP
      );`)

    if err != nil {
      panic(err)
    }

    _, err = statement.Exec()

    if err != nil {
      panic(err)
    }

    statement, err = database.Prepare(
      `CREATE INDEX IF NOT EXISTS sessionIdIndexOnTodos ON todos (
          sessionId ASC
      );`)

    if err != nil {
      panic(err)
    }

    _, err = statement.Exec()

    if err != nil {
      panic(err)
    }

    return &sqliteHandler{db: database}
  }

```

로 바꾸어주면 되며, 한번에 여러개의 커맨드를 하나로 사용할 수 없기 때문에 나누어서 실행시켜주도록 수정해주어야 하고, <br />
STRING을 사용할 수 없기 때문에 VARCHAR(256)으로 수정해주고, DATETIME을 사용할 수 없어 같은 기능을 하는 TIMESTAMP로 변경해준다. <br />

이후 저장 후 다시 add, commit, push를 진행한다. <br />

에러 잡는 중..
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95412966-30341a80-0965-11eb-9579-dfa05d49ceb1.png" width = 70%> </img></p> 
