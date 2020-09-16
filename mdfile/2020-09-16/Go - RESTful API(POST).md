### 시작
[GET](https://github.com/ckdqja135/Typescript-restful-starter/blob/master/mdfile/2020-09-16/Go%20-%20RESTful%20API(GET).md)에 이어서 myapp/app_test.go를 수정한다.+

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

  func TestCreateUserInfo(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()
    
    resp, err := http.Post(resp, err := http.Post(ts.URL+"/users", "application/json",
		strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom2@naver.com"}`)) // 1
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
  }
  
```
 1. Post로 보낼 때 인자가 3개인데 URL, contentType, body이고, response는 response, error가 나온다.
    test server의 URL과 contentType은 JSON, body는 지난번에 JSON 보낸 것 처럼 strings.NewReader로 작성한다.
 
 그리고 같은 경로라도 어떤 메소드를 보내냐에 따라서 Handler가 달라져야 하기 때문에 <br />
 <code>myapp/app.go</code>의 코드를 수정하자! <br />
 myapp/app.go
``` Go

  package myapp

  import (
    "fmt"
    "net/http"

    "github.com/gorilla/mux"
  )
  
  type User struct { // 4
      ID        int       `json:"id"`
    	FirstName string    `json:"first_name"`
      LastName  string    `json:"last_name"`
      Email     string    `json:"email"`
      CreatedAt time.Time `json:"created_at"`
  }
  
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
  
  func createUserHandler(w http.ResponseWriter, r *http.Request) { // 3
    user := new(User)
    json.NewDecoder(r.Body).Decode(user)
    if err != nil {
      w.WriteHeader(http.StatusBadRequest)
      fmt.Fprint(w, err)
      return
    }
    // Created User
    user.ID = 2
    user.CreateAt = time.Now()
    w.WriteHeader(http.StatusCreated)
    data, _ := json.Marshal(user)
    fmt.Fprint(w, string(data))
  }

  // NewHandler make a new myapp handler
  func NewHandler() http.Handler {
    mux := mux.NewRouter()

    mux.HandleFunc("/", indexHandler)
    mux.HandleFunc("/users", usersHandler).Methods("GET") // 1
    mux.HandleFunc("/users", createUserHandler).Methods("POST") // 2
    mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler)
    return mux
  }

```

1 : GET 메소드로 들어왔을 때 usersHandler가 실행 되도록 한다. <br />
2 : POST 메소드로 들어왔을 때 createUserHandler가 실행 되도록 한다. <br />
3 : createUserHandler부분이다. err가 nil이 아니면 에러처리, nil이 아니면 Create해준다.
4 : 클라이언트가 JSON으로 보낼 때 JSON을 읽어드려야 하는데 그러기 위해 User struct를 만들어준다.

 그 후 터미널을 열고 go test로 실행하여 테스트를 진행해보자!
 
 <p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93309345-5ff87280-f83e-11ea-8ed1-b355d4f33de8.png" width = 70%> </img></p>
PASS를 확인 할 수 있다.

### 풀소스

myapp/app_test.go
``` Go
  
  package myapp

  import (
    "encoding/json"
    "io/ioutil"
    "net/http"
    "net/http/httptest"
    "strconv"
    "strings"
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
    assert.Contains(string(data), "No User Id:89")

    resp, err = http.Get(ts.URL + "/users/56")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ = ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "No User Id:56")
  }

  func TestCreateUser(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Post(ts.URL+"/users", "application/json",
      strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`))
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)

    user := new(User)
    err = json.NewDecoder(resp.Body).Decode(user)
    assert.NoError(err)
    assert.NotEqual(0, user.ID)

    id := user.ID
    resp, err = http.Get(ts.URL + "/users/" + strconv.Itoa(id))
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)

    user2 := new(User)
    err = json.NewDecoder(resp.Body).Decode(user2)
    assert.NoError(err)
    assert.Equal(user.ID, user2.ID)
    assert.Equal(user.FirstName, user2.FirstName)
  }

```

myapp/app.go

``` Go

  package myapp

  import (
    "encoding/json"
    "fmt"
    "net/http"
    "strconv"
    "time"

    "github.com/gorilla/mux"
  )

  // User struct
  type User struct {
    ID        int       `json:"id"`
    FirstName string    `json:"first_name"`
    LastName  string    `json:"last_name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
  }

  var userMap map[int]*User
  var lastID int

  func indexHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello World")
  }

  func usersHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Get UserInfo by /users/{id}")
  }

  func getUserInfoHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, err := strconv.Atoi(vars["id"])
    if err != nil {
      w.WriteHeader(http.StatusBadRequest)
      fmt.Fprint(w, err)
      return
    }
    user, ok := userMap[id]
    if !ok {
      w.WriteHeader(http.StatusOK)
      fmt.Fprint(w, "No User Id:", id)
      return
    }

    w.Header().Add("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    data, _ := json.Marshal(user)
    fmt.Fprint(w, string(data))
  }

  func createUserHandler(w http.ResponseWriter, r *http.Request) {
    user := new(User)
    err := json.NewDecoder(r.Body).Decode(user)
    if err != nil {
      w.WriteHeader(http.StatusBadRequest)
      fmt.Fprint(w, err)
      return
    }

    // Created User
    lastID++
    user.ID = lastID
    user.CreatedAt = time.Now()
    userMap[user.ID] = user

    w.Header().Add("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    data, _ := json.Marshal(user)
    fmt.Fprint(w, string(data))
  }

  // NewHandler make a new myapp handler
  func NewHandler() http.Handler {
    userMap = make(map[int]*User)
    lastID = 0
    mux := mux.NewRouter()

    mux.HandleFunc("/", indexHandler)
    mux.HandleFunc("/users", usersHandler).Methods("GET")
    mux.HandleFunc("/users", createUserHandler).Methods("POST")
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
