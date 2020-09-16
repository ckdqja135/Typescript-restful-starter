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

이 전과 차이가 있다면 기존에는 HTTP에 정적으로 등록했는데 지금은 mux라는 인스턴스를 만들어서 거기에 등록해서 그 인스턴스를 넘겨주는 방식으로 바꾸었다. <br />

우리가 서버에 요청할 때 request를 날리는데 이 request안에 필요한 argument의 input값을 넣을 수 있는데 <br />
``` Go

  func barHandler(w http.ResponseWriter, r *http.Request) {
      name := r.URL.Query().Get("name") // 1
      if name == "" { // 2
        name = "World"
      }
      fmt.Fprintf(w, "Hello %s!", name) // 3
  }

```
1 : r.URL.Query()는 URL에서 정보를 뽑아내기 위해 사용하는 것이고, 그 결과에서 name이라는 argument를 Get하기 위해 r.URL.Query().Get("name")으로 작성했다. 
즉, URL에서 name이라는 argument를 뽑아내서 그 값을 name에 넣어준다.<br />


2 : 그 후 name값이 없으면 name변수에 World가 들어가도록 해준다.

3 : Fprintf를 사용하여 출력 시켜준다.

이 상태에서 실행 시켜준다. <br />
먼저 /bar경로로 들어가면 "Hello world!"가 출력되는 것을 볼 수 있는데
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93291380-e05aab80-f81d-11ea-8b85-a7583cc2b5ba.png" width = 50%> </img></p>

이 상태에서 ?name=bar를 경로에 추가시켜주게 되면
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93291360-d042cc00-f81d-11ea-8918-078d5634315f.png" width = 50%> </img></p>
"Hello bar!"가 출력 되는 것을 알 수 있다. <br />

즉, name=임의적인name값 을 넣으면 Hello 임의적인name 값이 출력됨을 알 수 있다. <br />

이제부터 JSON을 다루기 위해 User라는 struct를 만들어 준다. <br />

``` Go

   type User struct {
      FirstName string
      LastName  string
      Email     string
      CreatedAt time.Time
    }

```

그리고 fooHandler에서 Request값이 JSON으로 오기 때문에 그 것을 읽을 수 있도록 fooHandler부분을 수정해준다.
```Go

   func (f *fooHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    user := new(User) // 1
    err := json.NewDecoder(r.Body).Decode(user) // 2
    if err != nil { // 3
      w.WriteHeader(http.StatusBadRequest)
      fmt.Fprint(w, "Bad Request: ", err)
      return
    }
    user.CreatedAt = time.Now() // 4
    
    data, _ := json.Marshal(user) // 5
    w.WriteHander(http.StatusOK) // 6
    fmt.Fprint(w, string(data))
  }
  
```
1 : User struct형태의 JSON이 올 것이기 때문에 그 값을 채워줄 인스턴스를 만들어준다. <br />

2 : 이 값을 JSON형태로 파싱을 해주어야 하는데 그것을 위해 NewDecoder(r.Body)를 사용하고, JSON형태의 데이터가 Body에 들어있기 때문에 NewDecoder의 인자로 reader인 r을 받기 때문에 
    r.Body를 넣어준다. <br />
    r.Body에 커서를 두게 되면
    <p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93292083-a5f20e00-f81f-11ea-92bb-82350d87e397.png" width = 40%> </img></p>
    r.Body가 io.Reader를 포함하고 있음을 알 수 있고, NewDecoder는 io.Reader를 인자로 받고 있다는 걸 알 수 있다. <br />
    그리고 Body에서 값을 읽어서 user struct형태로 값을 채워주기 위해 Decode(user)를 사용한다. <br />
    이 부분은 뭔가 데이터가 잘못될 수 있기 때문에 err변수에 넣어준다. <br />
    
3 : 그래서 if문으로 err가 nil이 아닌경우에는 에러가 생겼기 때문에 w.WriteHeader(http.StatusBadRequest)로 잘못 보냈다라는것을 알려주고, <br />
    fmt.Fprint(w, "Bad Request: ", err)로 Body에 쓸 수 있도록 작성한 후 더 이상 에러가 나지 않도록 return해준다. <br />

4 : 성공적으로 Decode가 됐을 때 err값이 nil이 되는데 그 때 user의 CreatedAt값을 현재로 바꾸어 주고, <br />

5 : JSON을 다시 보내주려면 JSON data로 바꾸어 주어야 한다. (지금 상태는 Go struct형태임.) 어떤 인터페이스를 받아서 JSON형태로 Encodding을 해주는 Marshal(user)를 사용해준다. <br />
    이 형태는 첫 번째 리턴 값으로 byte array가 나오고 두 번째 return값으로 error가 나오는데 error를 무시하기 위해 작성한다. <br />

6 : 잘 되었다고 알려주기 위해 사용한다. string(data)으로 사용한 이유는 data가 byte[]형식이기 때문에 string으로 형변환 시켜준 것이다. <br />

이 상태에서 실행을 하게 되면 <br />
https://user-images.githubusercontent.com/33046341/93293018-ece10300-f821-11ea-8042-7b35608eb89c.png)
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
    
    user.CreatedAt = time.Now()
    data, _ := json.Marshal(user)
    w.WriteHander(http.StatusOK)
    fmt.Fprint(w, string(data))
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