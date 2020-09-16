### 시작

[Web Handler](https://github.com/ckdqja135/Typescript-restful-starter/blob/master/mdfile/2020-09-15/Go%20-%20Web%20Handler.md)에 이어서 main함수의 

``` Go

http.HandleFunc("/bar", func(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "Hello Bar!")
})
    
```

부분 중 fooHandler처럼 func(w http.ResponseWriter, r *http.Request) 부분을 바깥으로 빼서 수정한다. <br />

``` Go

  func barHandeler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello Bar!")
  })
  
```
이렇게 수정한 뒤 main함수에 이에 해당하는 코드를 수정해준다. <br />
``` Go

  http.HandleFunc("/bar", barHandler)

```
이렇게 각각 경로에 해당하는 Handler들을 등록했다. 이렇게 경로에 따라 분배해주는 라우터가 있는데 "Mux"라는 것이다. <br />
그래서 main함수에 라우터 클래스를 만들어서 등록하는 방식으로 수정해보자. <br />

``` Go
  
    func main() {
      mux := http.NewServeMux()
      mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Hello World")
      })

      mux.HandleFunc("/bar", barHandler)

      mux.Handle("/foo", &fooHandler{})

      http.ListenAndServe(":3000", mux)
  }
```
이 상태에서 실행을 해도 전과 똑같은 화면이 출력된다.
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93288924-f7969a80-f817-11ea-96c0-406c7b274794.png" width = 50%> </img></p>
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93289063-64119980-f818-11ea-88f1-6591ac27b988.png" width = 50%> </img></p>
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93289391-3bd66a80-f819-11ea-90a3-1aaec2dbaf78.png" width = 50%> </img></p>

### 풀 소스

``` Go

  package main

  import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
  )

  type User struct {
    FirstName string
    LastName  string
    Email     string
    CreatedAt time.Time
  }

  type fooHandler struct{}

  func (f *fooHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    user := new(User)
    err := json.NewDecoder(r.Body).Decode(user)
    if err != nil {
      w.WriteHeader(http.StatusBadRequest)
      fmt.Fprint(w, "Bad Request: ", err)
      return
    }
  }

  func barHandler(w http.ResponseWriter, r *http.Request) {
    name := r.URL.Query().Get("name")
    if name == "" {
      name = "World"
    }
    fmt.Fprintf(w, "Hello %s!", name)
  }

  func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
      fmt.Fprint(w, "Hello World")
    })

    mux.HandleFunc("/bar", barHandler)

    mux.Handle("/foo", &fooHandler{})

    http.ListenAndServe(":3000", mux)
  }

```
