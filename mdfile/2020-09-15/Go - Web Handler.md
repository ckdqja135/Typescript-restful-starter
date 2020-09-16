### 시작

``` Go
  package main
  
  func main() {
      http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) { // 1
        fmt.Fprint(w, "Hello World") // 2
  })
  
  http.ListenAndServe(":3000", nil) // 3
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93288924-f7969a80-f817-11ea-96c0-406c7b274794.png" width = 50%> </img></p>


1 : http.HandleFunc으로 선언 하여 경로는 처음 경로인 "/"으로 해주고, 함수 타입을 <code>w http.ResponseWriter, r *http.Request"</code> 으로 넣어준다.
2 : 함수의 내용
3 : port 번호 3000으로 지정.

여기서 중요한 건 http.HandleFunc, http.ListenAndServe인데 HandleFunc은 어떤 Handler를 등록하는 것이다. 어떤 경로에 해당하는 Request가 들어 왔을 때 어떤 일을 할 것인지 그 Handler를 등록하는 Function이다. <br />
여기서는 초기경로인 "/"에 대한 Request가 왔을 때 어떤 일을 할 것 인지 지정한 것이다. <br />
그래서 func 안에 Response를 Writer할 수 있는 w 인자, 사용자가 요청한 Request정보를 저장하는 r인자가 있는 것이다. <br />
Fprint(w, "Hello World")는 request 보낸 쪽에 Hello World라는 Response를 줘라는 의미이다.<br />
그리고 ListenAndServe이라는 곳에 기다리는 포트를 적어준다. <br />

이제 main()안에 또 다른 Handler를 추가해보자.

``` Go
  
  http.HandleFunc("/bar", func(w http.ResponseWriter, r *http.Request) {
      fmt.Fprint(w, "Hello Bar!")
  })
    
```

### 풀 소스

``` Go
  package main

  import (
    "fmt"
    "net/http"
  )

  type fooHandler struct{}

  func (f *fooHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello Foo!")
  }

  func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
      fmt.Fprint(w, "Hello World")
    })

    http.HandleFunc("/bar", func(w http.ResponseWriter, r *http.Request) {
      fmt.Fprintf(w, "Hello Bar!")
    })

    http.Handle("/foo", &fooHandler{})

    http.ListenAndServe(":3000", nil)
  }

```
