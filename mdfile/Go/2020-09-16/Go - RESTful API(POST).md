## 시작
[GET](https://github.com/ckdqja135/Typescript-restful-starter/blob/master/mdfile/2020-09-16/Go%20-%20RESTful%20API(GET).md)에 이어서 myapp/app_test.go를 수정한다.

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
 1. Post로 보낼 때 인자가 3개인데 URL, contentType, body이고, response는 response, error가 나온다. <br /> 
    test server의 URL과 contentType은 JSON, body는 지난번에 JSON 보낸 것 처럼 strings.NewReader로 작성한다. <br />
 
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
3 : createUserHandler부분이다. err가 nil이 아니면 에러처리, nil이 아니면 Create해준다. <br />
4 : 클라이언트가 JSON으로 보낼 때 JSON을 읽어드려야 하는데 그러기 위해 User struct를 만들어준다. <br />

 그 후 터미널을 열고 go test로 실행하여 테스트를 진행해보자! <br />
 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93309345-5ff87280-f83e-11ea-8ed1-b355d4f33de8.png" width = 70%> </img></p>
PASS를 확인 할 수 있다.

이제 <code>myapp/app_test.go</code>로 넘어와서 제대로 데이터가 넘어왔는지 TestCreateUserInfo()부분을 수정해준다.

``` Go

  func TestCreateUserInfo(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()
    
    resp, err := http.Post(resp, err := http.Post(ts.URL+"/users", "application/json",
		strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom2@naver.com"}`)) // 1
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
    // 수정 된 부분.
    user := new(User)
    err := json.NewDecoder(resp.Body).Decode(user)
    assert.NoError(err)
    assert.NotEqual(0, user.ID)
    
    id := user.ID
    resp, err = http.Get(ts.URL + "/users/" + strconv.Itoa(id)) // 1
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    
    user2 := new(User)
    err := json.NewDecoder(resp.Body).Decode(user2)
    assert.NoError(err)
    assert.Equal(user.ID, user2.ID)
    assert.Equal(user.FirstName, user2.FirstName)
  }
  
```
1 : id값이 int값이기 때문에 string형으로 바꾸어주기 위해 strconv.Itoa(id)를 사용했다. <br />

여기서 user2를 넣어주는 이유는 resp.Body는 user의 info가 와야 하는데 JSON포맷으로 와야하기 때문에 넣어주었고, <br />
user와 user2는 사실상 같은 것이기 때문에  assert.Equal(user.ID, user2.ID) , assert.Equal(user.FirstName, user2.FirstName)를 사용하여 비교해주었다. <br />

이제 실행을 해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93415325-3858e700-f8de-11ea-947a-f2da2688c958.png" width = 70%> </img></p>

83번째 줄에서 에러가 났다. <br />
<code>err := json.NewDecoder(resp.Body).Decode(user2)</code> 여기서 decode하는데 첫번째 글자가 'U'가 왔다는 의미이다. <br />
<code>strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom2@naver.com"}`))</code> <br />
이 포맷을 보면 '{'가 먼저 와야 하는데 포맷이 안 맞아서 생긴 오류이다. <br />

우리가 아직 유저 정보를 주는 것을 구현을 하지 않았기 때문에 <code>myapp/app.go</code>에 있는 <br />
<code>getUserInfoHandler(w http.ResponseWriter, r *http.Request)</code>에서 <br />
<code>fmt.Fprint(w, "User Id:", vars["id"])</code>의 'U'가 나온 것이다. <br />

이 부분을 바꾸어 주어야 하는데 우선 테스트가 통과 되도록 수정해보자.

<code>myapp/app.go</code>
```Go
  var userMap map[int]*User
  var lastID int
...
  func getUserInfoHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r) // 1
    id, err := strconv.Atoi(vars["id"]) // 2
    if err != nil { // 3
      w.WriteHeader(http.StatusBadRequest)
      fmt.Fprint(w, err)
      return
    }
    user, ok := userMap[id] // 4
    if !ok { // 5
      w.WriteHeader(http.StatusOK)
      fmt.Fprint(w, "No User Id:", id)
      return
    }
    
    w.Header().Add("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    data, _ := json.Marshal(user)
    fmt.Fprint(w, string(data))
 }

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
 1 : 파싱한 값을 가져온다. <br />
 2 : vars["id"]값이 string이기 때문에 string -> int로 바꾸어 주기 위해 사용했다. <br />
 3 : error가 있을 시 <br />
 4 : id에 해당하는 값이 map에 있는지 확인 <br />
 5 : 있으면 true 없으면 false <br />
 
 기존에는 고정으로 사용했지만 user map을 하나 만들어서 create했던 user정보를 등록하고 있다가 <br />
 그 유저 정보의 data가 있으면 그것을 return하고, 없으면 No User ID: id값이 나오도록 변경했다. <br />
 
 
 그 후
 <code>myapp/app_test.go</code>부분에서 <code>TestGetUserInfo(t *testing.T)</code>를 수정해준다. <br />

```Go

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
  
```

아직까지 89번의 userId를 만든적이 없기 떄문에 없는 id라고 뜨게 해야한다. <br />

이제 실행을 해보자 <br />

<code>go test</code> 명령어를 통해 테스트를 해보면 통과가 되었음을 알 수 있다. <br /> 

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93417663-a05dfc00-f8e3-11ea-87e9-e13f102373f9.png" width = 70%> </img></p>

이제 클라이언트 앱으로 등록을 한 뒤 확인을 해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93417861-e7e48800-f8e3-11ea-9312-49d3fd5a8022.png" width = 70%> </img></p>

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93417867-ed41d280-f8e3-11ea-942f-0403f050b362.png" width = 70%> </img></p>

지금까지 한 것을 되새김 해보면 특정 id에 해당하는 유저의 정보를 가져오는 것, 그게 없다면 No User id가 출력 되도록 하는 것, <br />
POST로 정보를 JSON 형태로 보냈을 때 이 정보를 서버가 받아서 새로운 등록을 해서 그 유저의 정보를 return하게 했고, 해당 유저의 정보의 기록을 map에 기록을 했고, <br />
그 뒤 유저가 등록되어 있어 GET으로 /users/에 똑같이 id를 붙여 보낼 시 해당하는 유저의 정보를 JSON으로 보내준 것이기 때문에 user2로 파싱을 해서 테스팅 할 수 있게 했다. <br />

## 풀소스

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
