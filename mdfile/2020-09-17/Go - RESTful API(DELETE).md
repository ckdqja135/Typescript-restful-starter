### 시작

기존에 있는 코드에 이어서 테스트 코드 부터 만든다.

<code>myapp/app_test.go</code>
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
  
  ...
  
func TestDeleteUsers(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()
    
    req, _ := http.NewRequest("DELETE", ts.URL + "/users/1", nil) // 1
    resp, err := http.DefaultClient.Do(req) // 1
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
}
```

1 : http 자체에서 GET, POST는 지원하지만 DELETE는 지원하지 않아서 저렇게 사용해야 한다. <br />

이 상태에서 테스트를 해보도록 한다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93432175-1e300080-f900-11ea-813c-d5f828f49a40.png" width = 70%> </img></p>

이상한 점이 있다. 메소드를 보냈는데 통과가 되었기 때문인데 <br />

바로 아래에 
``` Go
  
  data, _ := ioutil.ReadAll(resp.Body)
  log.Print(string(data))

```
를 추가한 뒤 테스트를 해보면 확인해 볼 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93432598-baf29e00-f900-11ea-9b42-b9910fd0ec4d.png" width = 70%> </img></p>

<code> No User Id:1</code>라는 문구가 나왔다. <br />

이 말은 <code>myapp/app.go</code>의 getUserInfoHandler의 
``` Go 

  fmt.Fprint(w, "No User Id:", id)
  
```
부분이 호출이 되었다는 것을 의미한다. <br />

그래서 저 부분이 GET만 호출 될 수 있도록 <br />

``` Go

  mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler)
  
```

이 부분을 <br />

``` Go
  
  mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler).Method("GET")

```
으로 수정해준다. <br />

이 상태에서 테스트를 해보면 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93433229-7ddadb80-f901-11ea-9079-f108e3a794c8.png" width = 70%> </img></p>

이런 문구가 뜨는데 <br />
우리는 200번의 status를 원했는데 405번인 Handler가 없다는 에러가 떴음을 확인 할 수 있다. <br />

이제 PUT관련 Handler를 만들어주면 된다. <br />

<code>myapp/app.go</code>로 들어와서 MewHandler() 부분을 수정해준다.

``` Go
  func deleteUserHandler(w http.ResponseWriter, r *http.Request) { 
    vars := mux.Vars(r) // 1 
    id, err := strconv.Atoi(vars["id"]) // 1
    if err != nil { // 1
      w.WriteHeader(http.StatusBadRequest)
      fmt.Fprint(w, err)
      retrun 
    }
    _, ok := userMap[id] // 2
    if !ok { // 2
      w.WriteHeader(http.StatusOK)
      fmt.Fprint(w, "No User ID:", id)
      return
    }
    delete(userMap, id) // 3
    w.WriteHeader(http.StatusOK)
    fmt.Fprint(w, "Deleted User ID:", id)
  }
  
  // NewHandler make a new myapp handler
  func NewHandler() http.Handler {
    userMap = make(map[int]*User)
    lastID = 0
    mux := mux.NewRouter()

    mux.HandleFunc("/", indexHandler)
    mux.HandleFunc("/users", usersHandler).Methods("GET")
    mux.HandleFunc("/users", createUserHandler).Methods("POST")
    mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler).Methods("GET")
    mux.HandleFunc("/users/{id:[0-9]+}", deleteUserInfoHandler).Methods("POST")
    return mux
  }

```

1 : 삭제할 ID를 추출하기 위해 GET방식에 쓰였던 코드와 유사하다. GET과 마찬가지로 id를 가져오고 nil여부에 따라 결과값이 나오게 되고, <br />
    
2 : id가 정상적으로 들어왔지만 user map에 없는 데이터를 지우려 할 때 체크하기 위해 사용했다. <br />
  
3 : 여기서 부터는 정상적으로 삭제가 되었을 때 실행되는 코드이다. delete()에서 map을 넣고, map에 해당하는 키를 집어넣으면 거기에 해당하는 data를 알아서 지워준다. <br />

그리고 <code>myapp/app_test.go</code>로 넘어와서 Handler를 새로 만들면 기존에 등록했던 data들은 날아가게 되는데, 더 이상 지울 data가 없음을 알려주는 코드를 추가하도록 한다. <br />

<code>myapp/app_test.go</code>
``` Go
  
  ...
  
    func TestDeleteUsers(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()
    
    req, _ := http.NewRequest("DELETE", ts.URL + "/users/1", nil) // 1
    resp, err := http.DefaultClient.Do(req) // 1
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "No User ID:1")
    
```

이 상태에서 테스트를 진행해하면 PASS 되었음을 알 수 있다. <br />

이제 정상적으로 DELETE가 작동하는지 확인해보자. data가 사라졌으므로 다시 등록해보자. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93436303-9220d780-f905-11ea-8524-83141bf2851b.png" width = 70%> </img></p>

등록 확인 후 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93436318-96e58b80-f905-11ea-9031-281bc5821745.png" width = 70%> </img></p>

메소드를 DELETE로 맞추고 아래와 같은 URL을 입력한다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93436348-a1a02080-f905-11ea-8a7a-7c9141320afe.png" width = 70%> </img></p>
현재 id값이 1번인 data가 없으므로 정상적으로 삭제할 수 없다는 문구가 뜨는 것을 확인 할 수 있다. <br />

다시 id값을 2로 했을 때 정상적으로 삭제 되는 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93436372-aa90f200-f905-11ea-9eb0-ffdc1e5bc19e.png" width = 70%> </img></p>

### 풀 소스
<code>myapp/app_test.go</code>
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

  func TestDeleteUser(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    req, _ := http.NewRequest("DELETE", ts.URL+"/users/1", nil)
    resp, err := http.DefaultClient.Do(req)
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "No User ID:1")

    resp, err = http.Post(ts.URL+"/users", "application/json",
      strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`))
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)

    user := new(User)
    err = json.NewDecoder(resp.Body).Decode(user)
    assert.NoError(err)
    assert.NotEqual(0, user.ID)

    req, _ = http.NewRequest("DELETE", ts.URL+"/users/1", nil)
    resp, err = http.DefaultClient.Do(req)
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ = ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "Deleted User ID:1")
  }

```

<code>myapp/app_test.go</code>
package myapp
``` Go
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

func deleteUserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		return
	}
	_, ok := userMap[id]
	if !ok {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "No User ID:", id)
		return
	}
	delete(userMap, id)
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "Deleted User ID:", id)
}

// NewHandler make a new myapp handler
func NewHandler() http.Handler {
	userMap = make(map[int]*User)
	lastID = 0
	mux := mux.NewRouter()

	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/users", usersHandler).Methods("GET")
	mux.HandleFunc("/users", createUserHandler).Methods("POST")
	mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler).Methods("GET")
	mux.HandleFunc("/users/{id:[0-9]+}", deleteUserHandler).Methods("DELETE")
	return mux
} 

```

<code>main.go</code>
``` GO
	package main

	import (
		"net/http"

		"./myapp"
	)

	func main() {
		http.ListenAndServe(":3000", myapp.NewHandler())
	}

```
