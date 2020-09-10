MySql을 접속하기 위해 database/sql과 MySql 드라이버가 필요하다.
database/sql는 표준패키지이므로 MySql 드라이버를 다운 받는다.
쉘이나 커맨드창에서 go get을 통해 아래와 같이 MySql 드라이버를 다운 받은 후 Import을 해야한다.

``` text

  go get github.com/go-sql-driver/mysql

```
