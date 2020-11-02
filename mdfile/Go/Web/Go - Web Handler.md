## 시작

``` Go
  package main
  
  func main() {
      http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) { // 1
        fmt.Fprint(w, "Hello World") // 2
  })
  
  http.ListenAndServe(":3000", nil) // 3
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93288924-f7969a80-f817-11ea-96c0-406c7b274794.png" width = 50%> </img></p>


1 : http.HandleFunc으로 선언 하여 경로는 처음 경로인 "/"으로 해주고, 함수 타입을 <code>w http.ResponseWriter, r *http.Request"</code> 으로 넣어준다. <br>
2 : 함수의 내용 <br />
3 : port 번호 3000으로 지정. <br />

여기서 중요한 건 http.HandleFunc, http.ListenAndServe인데 HandleFunc은 어떤 Handler를 등록하는 것이다. <br />
어떤 경로에 해당하는 Request가 들어 왔을 때 어떤 일을 할 것인지 그 Handler를 등록하는 Function이다. <br />
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
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93289063-64119980-f818-11ea-88f1-6591ac27b988.png" width = 50%> </img></p>

'/bar' 라는 경로에 진입 했을 때의 Handler를 추가했다.

추가로 

``` Go

type fooHandler struct{}

``` 
으로 비어있는 struct를 만들고, <br />

fooHandler의 인스턴스의 메소드를 만들어준다. <br />
``` Go

  func (f *fooHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello Foo!")
  }

```

다시 main함수에 돌아와서 맨 아래줄에

``` Go

   http.Handle("/foo", &fooHandler{})
      
```
를 추가해 준다.

이 상태에서 실행을 하면

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93289391-3bd66a80-f819-11ea-90a3-1aaec2dbaf78.png" width = 50%> </img></p>

Foo Handler도 추가 됐음을 알 수 있다. <br />

지금까지 3가지의 Handler를 추가했는데 "/", "/bar"의 Handler와 "/foo"의 Handler가 다르다. <br />
"/", "/bar"의 Handler는 func형태로 직접등록하여 사용한 상태이고, "/foo"의 Handler는 인스턴스 형태로 등록할 때 많이 쓰이는 형태인데 <br />
인스턴스로 등록 할 때는 <br />

위와 같이 어떤 인스턴스를 만들고, <br />
``` Go

type fooHandler struct{}

``` 

``` Go

  func (f *fooHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello Foo!")
  }

```

거기에 해당하는 ServeHTTP라는 인터페이스를 구현해서 그 인터페이스를 구현한 것을 <code>&fooHandler{}</code>로 등록하는 형태로 만들면 된다. <br />

실제로 Handler는 ServeHTTP라는 함수 하나를 가지고 있는 인터페이스로

``` Go

  type Handler interface {
    ServeHTTP(ResponseWriter, * Request)
  }
  
```
형태로 이루어져 있다.



## 풀 소스

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
