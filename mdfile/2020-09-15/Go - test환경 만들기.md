### 시작

지난번에 이어서 myapp이라는 폴더를 만든 뒤, app.go파일을 만들어준다.<br />
패키지를 분리하는게 테스팅하기 편리하기 때문에 여기에 지난번에 main에 만들었던 코드들을 들어낼 것이다. <br />
#### app.go
``` Go
  
  package myapp
  
  import "net/http"
  
  
  type User struct {
    FirstName string    `json:"first_name"`
    LastName  string    `json:"last_name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
  }

  func indexHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello World")
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
    w.Header().Add("content-type", "application/json")
    w.WriteHeader(http.StatusCreated)
    fmt.Fprint(w, string(data))
  }

  func barHandler(w http.ResponseWriter, r *http.Request) {
    name := r.URL.Query().Get("name")
    if name == "" {
      name = "World"
    }
    fmt.Fprintf(w, "Hello %s!", name)
  }
  
  func NewHttpHandler() http.Handler {
    mux := http.NewServeMux() // 1
    mux.HandleFunc("/", indexHandler)

    mux.HandleFunc("/bar", barHandler)

    mux.Handle("/foo", &fooHandler{})
  }
  
```

1 : main에 있는 코드를 여기에 옮긴다.

그 후 main.go 파일도 수정해준다.

``` Go

  package main

  import (
    "net/http"

    "./myapp"
  )

  func main() {
    http.ListenAndServe(":3000", myapp.NewHttpHandler()) // 1
  }

```

1 : myapp안에서 핸들러를 만들어서 핸들러 자리에 등록해준다. <br />

이 상태에서 실행해주면 hello world가 뜨는 것을 확인할 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93848044-996c2a80-fce3-11ea-9569-48729eb5f220.png" width = 50%> </img></p>

그리고 /bar를 해주면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93848170-cae4f600-fce3-11ea-9c2d-4f2b69771f24.png" width = 50%> </img></p>

그리고 /foo를 해주면 json파일이 없기 대문에 EOF가 뜨는 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93848212-e6e89780-fce3-11ea-949f-f20aebbdc0e7.png" width = 50%> </img></p>

이제부터 테스팅 코드를 만들게 될건데 아까 만들었던 myapp폴더에 app_test.go파일을 만들어준다.<br />
Go에서는 <code>_test</code>만 붙여주면 Test코드로 작동한다. <br />
``` Go

  package myapp
  
  func TestIndexPathHandler(t *testing.T) { // 1
  
  }
  
```
  
1 : 이 부분은 양식이 정해져 있는데 testing패키지의 T포인터를 인자로 받게 된다. <br />
    이렇게 하면 앞에가 test로 시작하게 되고, testing패키지의 T포인터를 인자로 받게되는 함수인 테스트 함수가 되는 것이다.  <br />
    
이제 패키지 하나를 추가 하게 될 것인데 smartystreets의 goconvey라는 것이다. <br />
백그라운드에서 돌면서 파일이 갱신될 때 마다 자동으로 테스트를 해준다. <br />

[goconvey](https://github.com/smartystreets/goconvey)여기서 자세한 것을 확인 할 수 있다.

``` linux
  
  go get github.com/smartystreets/goconvey
  
```

를 사용하여 다운받자! <br />

그 다음 <code>goconvey</code>라는 명령어를 터미널에 실행하게 되면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93848540-d258cf00-fce4-11ea-9af5-98fc3498b48e.png" width = 50%> </img></p>

<code>http:localhost:8080</code>에 테스트 서버가 돌아가는 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93848590-02a06d80-fce5-11ea-8f92-ff91760ff999.png" width = 50%> </img></p>

먼저 build error부터 고쳐보자! <br />

``` Go

  package myapp
  
  import "testing"
  
  func TestIndexPathHandler(t *testing.T) { // 1
  
  }
  
```
으로 수정하게 되면 PASS가 되었음을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93848825-a68a1900-fce5-11ea-9cec-9761486ed809.png" width = 50%> </img></p>

이제 이어서 테스트 코드를 만들어보면 <br />

``` Go

  package myapp
  
  import "testing"
  
  func TestIndexPathHandler(t *testing.T) { 
    	res := httptest.NewRecorder() // 1
	    req := httptest.NewRequest("GET", "/", nil) // 2
  }
  
```

1 : httptest패키지가 있는데 실제 http프로토콜을 사용하지 않고, 가짜 response 할 수 있는 NewRecorder()를 만들어주고, <br />
2 : 테스트 용으로 request할 수 있는 코드인데 NewRequest() 인자가 3개가 들어간다. method, target, body가 들어간다.<br />
    그래서 method에 get, target에 indexpath , body는 없으니까 nil로 해준다. <br />
 
그 뒤 myapp/app.go에 돌아와서 NewHttpHandler()부분을 수정하여 준다. <br />
  
``` Go
  
  func indexHandler(w http.ResponseWriter, r *http.Request) {
	  fmt.Fprint(w, "Hello World")
  }
  
  func NewHttpHandler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/", indexHandler) // 1

	mux.HandleFunc("/bar", barHandler)

	mux.Handle("/foo", &fooHandler{})
	return mux
}

```
1 : 람다에서 indexHandler라는 함수로 분리를 시켜주었다. <br />

다시 myapp/app_test.go로 넘어와서 이어서 작성해준다. <br />

``` Go

  package myapp
  
  import "testing"
  
  func TestIndexPathHandler(t *testing.T) { 
    	res := httptest.NewRecorder() 
	    req := httptest.NewRequest("GET", "/", nil)
      
      indexHandler(res, req) // 1
      
      if res.Code != http.StatusOK { // 2
        t.Fatal("Failed!" , res.Code)
      }
  }
  
  
```

1 : 아까 만들었던 함수를 request하고, response를 넣어서 불러준다. <br />
2 : res.Code가 실패했을 경우 프로그램이 종료되도록 한다. <br />

이 상태로 저장을 하면 goconvey가 테스트를 진행 할 것이고, 결과가 뜨게 된다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93849449-21076880-fce7-11ea-9d64-2cfaca6a832c.png" width = 50%> </img></p>

이번에 가져올 패키지는 stretchr의 testfy라는 패키지를 추가할 것인데, 여기서 assert를 가져올 것이다. <br />

``` linux
  
  go get github.com/stretchr/testify/assert
  
```
를 새 터미널 창을 추가해서 설치해준다. 그 뒤 다시 돌아와서 <br />

``` Go

  package myapp
  
  import (
        "io/ioutil"
        "net/http"
        "net/http/httptest"
        "testing"

        "github.com/stretchr/testify/assert"
  )
  
  func TestIndexPathHandler(t *testing.T) {
      assert := assert.New(t) // 1
    	res := httptest.NewRecorder() 
	    req := httptest.NewRequest("GET", "/", nil)
      
      indexHandler(res, req)
      
      assert.Equal(http.StatusOK, res.Code) // 2
      data, _ := ioutil.ReadAll(res.Body) // 3
	    assert.Equal("Hello World", string(data)) 
  }
  
  func TestBarPathHandler_WithoutName(t *testing.T) { // 4
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/", nil)
    
    barHandler(res, req)
    
    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello World!", string(data))
  }
  
```

1 : assert를 추가 해준다.

2 : 기대하는 값(statusOK)과 맞는지 확인해준다. <br />
    -> 이렇게 하면 아까 썼던 if문을 쓰지 않아도 된다. <br />
    
3 : 실제 결과값은 res.Body에 들어있는데 바로 가져올 수 없기 때문에 ioutil.ReadAll을 사용해서 버퍼값을 전부 가져오게 한다. <br />
    이것을 사용하면 return 값과 error값이 나오게 되는데 data만 가져온다. <br />
    
4 : barHander 추가 <br />

그 뒤 저장하면 goconvey가 테스트 코드로 돌릴 것이고, pass가 뜰 것이다.<br />

여기서 이상한 것은 barHander로 호출되어 '/'로 보내졌을 때 '!'가 없어야 되는데 '!'가 있게 왔다는 의미이다. <br />
즉 mux를 제대로 사용하고 있지 않아 타겟이 적용이 안되었다는 것이다. <br />
그래서 barHandler(res, req)가 아니라 mux를 사용해야 타겟에 제대로 맞추어 사용된다는 것이다. <br />
그래서 코드를 수정하면 <br />

``` Go

  func TestBarPathHandler_WithoutName(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello World!", string(data))
  }
  
```

이렇게 되는데 이때 테스팅을 하게 되면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93850465-236ac200-fce9-11ea-8209-c435763e18b3.png" width = 50%> </img></p>
FAIL이 뜨는 것을 확인 할 수 있다. <br />

그래서 그 원인을 보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93850525-41382700-fce9-11ea-8ab9-1230ba48a20d.png" width = 50%> </img></p>
'!'가 있어야 되는데 없다고 뜬다. <br />

정상적으로 인덱스 경로에 호출 되었다는 것을 알 수 있다. 그래서 인덱스 경로에서 '/bar'경로로 바꾸어주면 <br />
``` Go

  func TestBarPathHandler_WithoutName(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/bar", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello World!", string(data))
  }
  
```

그리고  <br />

``` Go 
  
      mux := NewHttpHandler()
      mux.ServeHTTP(res, req)
```

이 부분을 카피하여 IndexPathHandler에 붙여넣기 해주면 분리되게 된다.<br/ >

``` Go
  
  func TestIndexPathHandler(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello World", string(data))
  }
  
```

그래서 실행하면 PASS 되는 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93850727-ac81f900-fce9-11ea-80ff-f5596ae2b70f.png" width = 50%> </img></p>

이번에는 name과 함께 넣는 함수를 만들어 보자! 기존에 있던 TestBarPathHandler_WithoutName함수를 복붙해준다. <br />

``` Go
  
  func TestBarPathHandler_WithName(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/bar?name=chagbeom", nil) // 1

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello changbeom!", string(data)) // 2
  }

```

1 : URL에 이름을 넣는다. <br />
2 : 해당 string과 같은지 비교한다. <br />

이렇게 해서 저장을 해주면 테스트 코드가 돌게 되고, 서버 실행 시 제대로 출력 됐음을 알 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93850972-35009980-fcea-11ea-986c-9a0e280fe77b.png" width = 50%> </img></p>

### 풀 소스
<code>myapp/app_test.go</code>
``` Go
  
  package myapp

  import (
    "io/ioutil"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/stretchr/testify/assert"
  )

  func TestIndexPathHandler(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello World", string(data))
  }

  func TestBarPathHandler_WithoutName(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/bar", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello World!", string(data))
  }

  func TestBarPathHandler_WithName(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/bar?name=chagbeom", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello changbeom!", string(data))
  }
  
```

<code>myapp/app.go</code>
``` Go
  
  package myapp

  import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
  )

  type User struct {
    FirstName string    `json:"first_name"`
    LastName  string    `json:"last_name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
  }

  func indexHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello World")
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
    w.Header().Add("content-type", "application/json")
    w.WriteHeader(http.StatusCreated)
    fmt.Fprint(w, string(data))
  }

  func barHandler(w http.ResponseWriter, r *http.Request) {
    name := r.URL.Query().Get("name")
    if name == "" {
      name = "World"
    }
    fmt.Fprintf(w, "Hello %s!", name)
  }

  func NewHttpHandler() http.Handler {
    mux := http.NewServeMux()
    mux.HandleFunc("/", indexHandler)

    mux.HandleFunc("/bar", barHandler)

    mux.Handle("/foo", &fooHandler{})
    return mux
  }

```

<code>main.go</code>
``` Go
  
  package main

  import (
    "net/http"

    "./myapp"
  )

  func main() {

    http.ListenAndServe(":3000", myapp.NewHttpHandler())
  }

```
