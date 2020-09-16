MySql을 접속하기 위해 database/sql과 MySql 드라이버가 필요하다. <br />
database/sql는 표준패키지이므로 MySql 드라이버를 다운 받는다. <br />
쉘이나 커맨드창에서 go get을 통해 아래와 같이 MySql 드라이버를 다운 받은 후 Import을 해야한다. <br />

``` text

  go get github.com/go-sql-driver/mysql

```

### 풀소스

``` Go

  package main

  import (
    "database/sql"
    "fmt"

    _ "github.com/go-sql-driver/mysql"
  )

  func main() {
    db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3307)/mytest")
    if err != nil {
      panic(err.Error())
    }
    defer db.Close()

    // insert query
    // insert, err := db.Query("INSERT INTO user(name, age) VALUES('cja', '11')")
    // if err != nil {
    // 	panic(err.Error())
    // }
    // defer insert.Close()

    // select query
    selectq, err := db.Query("SELECT num, name, age FROM user")
    if err != nil {
      panic(err.Error())
    }

    for selectq.Next() {
      var num int
      var name string
      var age int
      selectq.Scan(&num, &name, &age)
      fmt.Printf("num : %d, name : %s, age : %d\n", num, name, age)
    }
    defer selectq.Close()
  }

```
