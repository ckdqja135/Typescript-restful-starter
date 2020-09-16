### 시작
먼저 기본틀을 만들고 시작한다.

그 전에 Handler를 만들어 주어야 하는데 'myapp'이라는 폴더에 app.go라는 파일에 Handler를 만들어준다.

myapp/app.go
``` Go
package myapp

import "net/http"

// NewHandler make a new myapp handler
func NewHandler() http.Handler {
  mux := http.NewServeMux()
  
  return mux
  
}

```

main.go
``` Go
package main

import (
     "net/http"
     "./myapp"

func main() {
    http.ListenAndServe(":3000", myapp.NewHandler())
}

```
이 상태에서 실행시키면 아무것도 뜨지 않는 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93297308-fd967680-f82b-11ea-82fa-82e13eae6f29.png" width = 70%> </img></p>

이 상태에서 myapp폴더 안에 테스트코드를 만들어보자! <br />
코드를 작성하기 전에 터미널 하나를 더 추가하여 goconvey를 실행시켜 놓자!
[goconvey](https://github.com/smartystreets/goconvey)여기서 자세한 것을 확인 할 수 있다.

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93297761-e73cea80-f82c-11ea-93ca-fc0b95c2b428.png" width = 70%> </img></p>

myapp/app_test.go

``` Go

  package myapp
  
  import "testing"
  
  func TestIndex(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL) // 2
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode) // 3
  }
  
```
1 : 저 부분을 통해 실제 웹 서버는 아니고 mock-up서버가 나오게 된다. <br />
    그 후 항상 닫아주어야 하기 때문에 defer로 함수가 끝나기 전에 닫아준다. <br />

2 : http.Get()안에 URL을 넣어야 하는데 test서버의 URL을 넣어주고, 이 return값은 response와 error가 나온다. <br />
그래서 error가 없어야 하기 때문에 assert.NoError(err)로 작성해주고, <br />

3 : resp.Code의 코드가 http.StatusOK 같아야 한다는 의미이다. <br />
이 상태로 저장하면 goconvey가 계속 테스트 하는 것을 볼 수 있다. 테스트 화면을 보면 404가 반환되는 것을 알 수 있는데 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93298587-7696cd80-f82e-11ea-80c6-0cecb930ea8f.png" width = 70%> </img></p>

Handler를 등록하지 않아서 생긴 현상이다. <br />
Handler를 등록하기 위해 <code>myapp/app.go</code>로 돌아온다. <br />
``` Go
package myapp

import "net/http"

 func indexHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello World")
 }

// NewHandler make a new myapp handler
func NewHandler() http.Handler {
  mux := http.NewServeMux()
  
  mux.HandleFunc("/", indexHandler)
  return mux
  
}

```
이 상태에서 실행하면 빌드가 패스됐음을 알 수 있다.<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93298722-b362c480-f82e-11ea-812c-fc859f50d3aa.png" width = 70%> </img></p>

이제 첫 번째 테스트는 끝났고, 두 번째 테스트를 해보도록 하자! 결과가 Hello world가 나오는지 확인 해보도록 하려고 한다. <br />

다시 <code>myapp/app_test.go</code>로 돌아와서

``` Go

  package myapp
  
  import "testing"
  
  func TestIndex(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL) 
    assert.NoError(err)
    
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body) // 1
    assert.Equal("Hello World", string(data)) // 2
  }
  
```

1 : ioutil을 통해 Body의 결과를 모두 읽어오고, 이 때 return 값은 data, error가 나오는데 지금은 error를 무시하기 때문에 다음과 같이 작성한다.
2 : 읽은 data가 "Hello World"와 같아야 한다는 의미이다.

이 상태에서 저장하면 테스트가 진행 될 것이고, 아래와 같은 문구가 뜰 것이다.
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93299188-a1cdec80-f82f-11ea-967b-7a9e5eddbcc6.png" width = 70%> </img></p>

그럼 이제 TestIndex부분 테스트는 끝이 났고, 두 번째 테스트를 할 것이다.

``` Go

  package myapp
  
  import "testing"
  
  func TestIndex(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL) 
    assert.NoError(err)
    
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Equal("Hello World", string(data))
    
  }
  
   func TestUsers(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL + "/users")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "Get UserInfo")
  }
  
```

구조는 TestIndex와 동일한데, URL만 기존 테스트 URL + /users를 추가한 상태이다.

그 후 <code>myapp/app.go</code>로 돌아와 Handler를 추가해준다.
``` Go
package myapp

import "net/http"

 func indexHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello World")
 }
 
  func usersHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Get UserInfo by /users/{id}")
 }

// NewHandler make a new myapp handler
func NewHandler() http.Handler {
  mux := http.NewServeMux()
  
  mux.HandleFunc("/", indexHandler)
  mux.HandleFunc("/users", usersHandler)
  return mux
  
}

```

참고로 이렇게 추가해주는 이유는 <code>mux.HandleFunc("/", indexHandler)</code>에서 하위 핸들러가 없으면 그 최상위 핸들러가 호출 되기 때문이다.

그 후 <code>myapp/app_test.go</code>로 돌아와서 수정해준다.

``` Go

  package myapp
  
  import "testing"
  
  func TestIndex(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL) 
    assert.NoError(err)
    
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Equal("Hello World", string(data))
    
  }
  
   func TestUsers(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL + "/users")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "Get UserInfo") // 1
  }
  
```

1 : app.go에 작성 했던 문자가 포함 되어 있어야 한다는 의미이다. <br />

그 후 저장 후 테스트를 하면 <br />

위와 같은 문구가 뜰텐데 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93299916-d7270a00-f830-11ea-9bb0-23d53c9e4145.png" width = 70%> </img></p>

정말로 제대로 되었는지 확인 해보자! <br />

그 전에 Get UserInfo가 들어와야 하는데 Hello World가 들어온게 아닌지 테스트 실패가 나는지 확인해보자! <br />
assert.Contains(string(data), "Get UserInfo") 부분을 assert.Equal("Hello World", string(data))로 바꾸어준다. <br />
이 상태에서 저장 후 테스트를 해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93299916-d7270a00-f830-11ea-9bb0-23d53c9e4145.png" width = 70%> </img></p>
실패가 떴다!! <br />

gocovey 화면에서 error문구를 살펴보면
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93300202-5583ac00-f831-11ea-809f-2594e30cebce.png" width = 70%> </img></p>
정상적인 실패 화면이 떴음을 확인 할 수 있다.

그 후 테스트를 하나 더 추가한다.

``` Go

  package myapp
  
  import "testing"
  
  func TestIndex(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL) 
    assert.NoError(err)
    
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Equal("Hello World", string(data))
    
  }
  
   func TestUsers(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL + "/users")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "Get UserInfo")
    
   func TestUserInfo(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL + "/users/89") // 1
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
  }
  
```
 
1 : http.Get으로 89번 유저의 정보를 가져오게 한다.

우선 이 상태에서 PASS가 되는지 확인해보면 PASS가 뜰텐데 하위에 있는 부분이 정의가 안되어서 <code>myapp/app.go</code>에 있는 
상위 URL인 <code>mux.HandleFunc("/users", usersHandler)</code> 가 호출되어 PASS가 된 것이다.

그러면 data를 검증해보자! <br />
``` Go

      data, _ := ioutil.ReadAll(resp.Body)
      assert.Contains(string(data), "User Id:89")
    
```
를 TestUserInfo()안에 추가해준 뒤 확인해보자
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93300921-a7790180-f832-11ea-828a-eaa36b83045d.png" width = 70%> </img></p>

Fail이 떴고,  <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93301024-c9728400-f832-11ea-80a1-ba20d29ec813.png" width = 70%> </img></p>
User Id:89 값이 포함이 되지 않았다는걸 확인 할 수 있다. <br />

이것을 통과 시키려면

<code>myapp/app.go</code>로 돌아와 Handler를 추가 해주어야 한다.
``` Go
package myapp

import (
  "fmt"
  "net/http"
)

 func indexHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello World")
 }
 
  func usersHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Get UserInfo by /users/{id}")
 }

  func getUserInfo89Handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "User Id:89")
 }
 
// NewHandler make a new myapp handler
func NewHandler() http.Handler {
  mux := http.NewServeMux()
  
  mux.HandleFunc("/", indexHandler)
  mux.HandleFunc("/users", usersHandler)
  mux.HandleFunc("/users/89", getUserInfo89Handler)
  return mux
  
}

```

그 후 저장하면 테스트가 될 것 이고, <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93301254-23734980-f833-11ea-9cfb-1167ddb26edb.png" width = 70%> </img></p>

PASS 되었다는 것을 확인 할 수 있다. <br />

문제는 Id값이 변할 수 있다는 것이다. 그렇기 때문에 usersURL뒤에 붙었을 때 파싱을 해주어야 하는데 <br />
<code>r.URL.Path</code>를 사용하여 추출 해낼 수 있다. 하지만 그 과정이 복잡하기 때문에 있는 패키지를 사용하도록 하자. <br />

[여기](https://github.com/gorilla/mux)에서 자세한 내용이 나온다. <br />

``` linux

  go get -u github.com/gorilla/mux
  
```
이것을 카피하여 설치하자. <br />

<code>myapp/app.go</code>의 코드를 수정하자.
``` Go
package myapp

import (
  "fmt"
  "net/http"
  
  "github.com/gorilla/mux"
)
  
 func indexHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello World")
 }
 
  func usersHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Get UserInfo by /users/{id}")
 }

  func getUserInfo89Handler(w http.ResponseWriter, r *http.Request) {
    mux.Vars(r) // 3
    fmt.Fprint(w, "User Id:", vars["id"]) 
 }
 
// NewHandler make a new myapp handler
func NewHandler() http.Handler {
  mux := mux.NewRouter() // 1
  
  mux.HandleFunc("/", indexHandler)
  mux.HandleFunc("/users", usersHandler)
  mux.HandleFunc("/users/{id:[0-9]+}", getUserInfo89Handler) // 2
  return mux
  
}

```

1 : 이제 http.NewServeMux()가 아니라 gorillamux를 가지고 할 것이다. <br />

2 : [여기](https://github.com/gorilla/mux)에 들어가보면 해당 코드와 관련된 예제 코드가 나온다. <br />

3 : mux.Vars(r)를 사용하면 알아서 파싱을 해준다.

이 상태에서 저장하면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93302502-10617900-f835-11ea-858e-c0808c396eef.png" width = 70%> </img></p>
PASS 되었다는 것을 확인 할 수 있고, users뒷부분에 id값을 적어주게 되면 거기에 해당하는 값이 파싱이 되는 것을 확인 할 수 있다.

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93303100-ec526780-f835-11ea-97c9-4041bf6f1604.png" width = 70%> </img></p>


### 풀소스

myapp/app_test.go
``` Go
  package myapp

  import (
    "io/ioutil"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/stretchr/testify/assert"
  )

  func TestIndex(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL)
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Equal("Hello World", string(data))
  }

  func TestUsers(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL + "/users")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "Get UserInfo")
  }

  func TestGetUserInfo(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL + "/users/89")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "User Id:89")

    resp, err = http.Get(ts.URL + "/users/56")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ = ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "User Id:56")
  }

```

myapp/app.go
``` Go

  package myapp

  import (
    "fmt"
    "net/http"

    "github.com/gorilla/mux"
  )

  func indexHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello World")
  }

  func usersHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Get UserInfo by /users/{id}")
  }

  func getUserInfoHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    fmt.Fprint(w, "User Id:", vars["id"])
  }

  // NewHandler make a new myapp handler
  func NewHandler() http.Handler {
    mux := mux.NewRouter()

    mux.HandleFunc("/", indexHandler)
    mux.HandleFunc("/users", usersHandler)
    mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler)
    return mux
  }

```

main.go
``` Go
  
  package main

  import (
    "net/http"

    "./myapp"
  )

  func main() {
    http.ListenAndServe(":3000", myapp.NewHandler())
  }

```
