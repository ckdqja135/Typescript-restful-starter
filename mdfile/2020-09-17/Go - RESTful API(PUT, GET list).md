### 시작

먼저 테스트 코드 부터 작성하고 시작하자! <br />

<code>myapp/app_test.go</code> 맨 아래에 추가해준다.

``` Go

    func TestUpdateUser(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    req, _ := http.NewRequest("PUT", ts.URL+"/users", 
     strings.NewReader(`{"id":1, "first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`)))
    resp, err := http.DefaultClient.Do(req)
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    // data, _ := ioutil.ReadAll(resp.Body)
    // assert.Contains(string(data), "No User ID:1")

  }
  
  ```
  
먼저 StatusOK가 나오는지 확인하기 위해 밑에 두 줄은 주석처리 해둔다. <br />
  
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93438425-402d8100-f908-11ea-831c-67e395c189cb.png" width = 70%> </img></p>

Handler를 등록하지 않았기 때문에 정상적인 오류가 떴음을 확인할 수 있다. <br />

<code>myapp/app.go</code> 에서 Upate Handler를 만들어 준다.

``` Go 

...

func updateUserHandler(w http.ResponseWriter, r *http.Request) {
  w.WriteHeader(http.StatusOK)
}

  // NewHandler make a new myapp handler
func NewHandler() http.Handler {
	userMap = make(map[int]*User)
	lastID = 0
	mux := mux.NewRouter()

	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/users", usersHandler).Methods("GET")
	mux.HandleFunc("/users", createUserHandler).Methods("POST")
  mux.HandleFunc("/users", updateUserHandler).Methods("PUT")
	mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler).Methods("GET")
	mux.HandleFunc("/users/{id:[0-9]+}", deleteUserHandler).Methods("DELETE")
  
	return mux
} 

```
로 수정 해주고, 아까 작성했었던 <code>myapp/app_test.go</code> 부분으로 돌아와 Update 부분을 수정한다. <br />

여기서 알아야 할 것이 값을 바꿀 값이 있으면 바꾸면 되지만 바꿀 값이 없을 때 어떻게 할 것인지 크게 2가지로 나뉜다. <br />

1. Update or Create : Upate 할 값이 없으면 새로 생성한다. <br />
2. Update : Upate 할 값이 없으면 Error 처리. <br />

인데 지금은 2번 방식을 사용한다. <br />

``` Go

    func TestUpdateUser(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    req, _ := http.NewRequest("PUT", ts.URL+"/users", 
     strings.NewReader(`{"id":1, "first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`)))
    resp, err := http.DefaultClient.Do(req)
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "No User ID:1")

  }
  
```

아까 주석처리 했었던 코드를 주석해제 시켜 준 뒤 <code>myapp/app.go</code> 에서 Upate Handler를 수정해 준다.

``` Go 

...

func updateUserHandler(w http.ResponseWriter, r *http.Request) {
  user := new(User) // 1
  err := json.NewDecoder(r.Body).Decode(user) // 1
  if err != nil {
    w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, err)
		return
	}
  userMap[user.ID] // 2
  if !ok { // 3
    w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "No User ID:", id)
		return
}

  // NewHandler make a new myapp handler
func NewHandler() http.Handler {
	userMap = make(map[int]*User)
	lastID = 0
	mux := mux.NewRouter()

	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/users", usersHandler).Methods("GET")
	mux.HandleFunc("/users", createUserHandler).Methods("POST")
  mux.HandleFunc("/users", updateUserHandler).Methods("PUT")
	mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler).Methods("GET")
	mux.HandleFunc("/users/{id:[0-9]+}", deleteUserHandler).Methods("DELETE")
  
	return mux
} 

```
1 : update에 json이 와야 하기 때문에 파싱해주기 위해, user struct를 만들어주고, 파싱해온다. <br />
2 : 해당하는 맵에 user.ID가 있는지 여부 확인 <Br />
3 : 없을 때 <br />

이 상태에서 테스트를 해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93442795-145fca80-f90b-11ea-90ef-0f89ea3e52fb.png" width = 70%> </img></p>

data가 없는 상태에서 PASS OK가 나왔기 때문에 <code>"No User ID:", id</code>가 출력되었다는 것을 알 수 있다. <br />

이제 data를 create해서 실제로 Update되는지 확인하는 코드를 작성하려 한다. <br />

<code>myapp/app_test.go</code>로 돌아와서 코드를 수정해준다.

``` Go

    func TestUpdateUser(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    req, _ := http.NewRequest("PUT", ts.URL+"/users", 
     strings.NewReader(`{"id":1, "first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`)))
    resp, err := http.DefaultClient.Do(req)
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "No User ID:1")
  
    // 수정된 부분
    resp, err := http.Post(ts.URL+"/users", "application/json", // 1
    strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`))
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
    
    user := new(User)
    err = json.NewDecoder(resp.Body).Decode(user)
    assert.NoError(err)
    assert.NotEqual(0, user.ID)  // 1
    
    updateStr := fmt.Sprintf(`{"id": %d, "first_name":"updated"}`, userID) // 2   
    req, _ := http.NewRequest("PUT", ts.URL+"/users", strings.NewReader(updateStr))
    resp, err := http.DefaultClient.Do(req)
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
    
    user := new(User) // 3
    err = json.NewDecoder(resp.Body).Decode(user)
    assert.NoError(err)
  }
  
```

1 : POST Handler의 코드를 복붙했다. <br />
2 : id값을 동적으로 바꾸어주어야 하기 때문에 문자열을 다시 만들어 주었고, first_name만 변경되도록 하였다. <br />
3 : Update된 유저의 정보를 가져온다. <br />

여기까지 하고 테스트를 진행 해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93447830-d617da80-f90d-11ea-9097-f1a992fc3b9e.png" width = 70%> </img></p>

유저의 정보가 있는지 없는지에 대한 코드를 작성했지 Update에 대한 코드를 작성하지 않았기 때문에 난 에러이다. <br />

<code>myapp/app.go</code>로 돌아와서 코드를 수정해준다.

``` Go

  func updateUserHandler(w http.ResponseWriter, r *http.Request) {
    user := new(User) // 1
    err := json.NewDecoder(r.Body).Decode(user)
    if err != nil {
      w.WriteHeader(http.StatusOK)
      fmt.Fprint(w, err)
      return
    }
    userMap[user.ID]
    if !ok {
      w.WriteHeader(http.StatusOK)
      fmt.Fprint(w, "No User ID:", id)
      return
  }
  _, ok := userMap[updateUser.ID] // 1
  if !ok {
    w.Writeheader(http.StatusOK)
    fmt.Fprint(w, "No User ID:", updateUser.ID)
  }
  userMap[updateUser.ID] = updateUser
  w.Header().Add("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK) // 2
  data, _: = json.Marshal(updateUser) // 3
  fmt.Fprint(w, string(data)) // 3
  
```

1 : 그 id에 해당하는 것에 클라이언트가 원하는 값으로 넣어준다.
2 : 바꾸어 주었으니 정상 처리 메세지를 보내주고,
3 : 그 데이터를 Marshal()해서 나온 데이터를 써준다.

이 상태로 테스트를 해보면

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93438425-402d8100-f908-11ea-831c-67e395c189cb.png" width = 70%> </img></p>

PASS가 떴음을 확인 할 수 있다. <br />

이제 update가 잘 되는지 확인해보아야 하는데 <code>myapp/app_test.go</code>로 돌아와서 코드를 수정해준다.<br />

``` Go

    func TestUpdateUser(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    req, _ := http.NewRequest("PUT", ts.URL+"/users", 
     strings.NewReader(`{"id":1, "first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`)))
    resp, err := http.DefaultClient.Do(req)
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "No User ID:1")
  
  
    resp, err := http.Post(ts.URL+"/users", "application/json",
    strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`))
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
    
    user := new(User)
    err = json.NewDecoder(resp.Body).Decode(user)
    assert.NoError(err)
    assert.NotEqual(0, user.ID) 
    
    updateStr := fmt.Sprintf(`{"id": %d, "first_name":"updated"}`, userID) 
    req, _ := http.NewRequest("PUT", ts.URL+"/users", strings.NewReader(updateStr))
    resp, err := http.DefaultClient.Do(req)
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
    
    user := new(User)
    err = json.NewDecoder(resp.Body).Decode(user)
    assert.NoError(err)
    // 수정된 부분
    assert.Equal(updateUser.ID, user.ID) // 1
    assert.Equal("updated", upadateUser.FirstName) // 2
    assert.Equal(user.LastName, user.LastName) // 3
    assert.Equal(user.Email, user.Email) // 4
  }
  
```

1 : ID가 일치한 지 확인하고, <br />
2 : FirstName값이 updated로 정상적으로 바뀌었는지 확인하고, <br />
3 : LastName은 수정하지 않았으므로 같은지 확인하고. <br />
4 : Email도 같은지 확인한다.

이 상태에서 테스트를 진행해보면 LastName, Email이 아무것도 없는 빈 값으로 변해 있는 것을 확인할 수 있는데. <br />
지워진 이유는 Update 패킷을 보낼 때 first_name만 셋팅해서 보냈다. 그렇게 되면 JSON파서가 파싱을 할 때 <br />
Update된 정보를 읽을 때 오지 않은 나머지 data를 default값으로 바꿔버린다. 그렇기 때문에 String의 default값인 ""값이 나온 것이다. <br />

근데 그 상태에서 <code>userMap[updateUser.ID] = updateUser</code>로 덮어져서 기존의 data가 사라진 것이다. <br />
그래서 기존의 Update되지 않는 data를 유지한 채로 Update 되도록 수정해야한다. <br />

<code>myapp/app.go</code>로 돌아와서 코드를 수정해준다.

``` Go

  func updateUserHandler(w http.ResponseWriter, r *http.Request) {
    user := new(User) // 1
    err := json.NewDecoder(r.Body).Decode(user)
    if err != nil {
      w.WriteHeader(http.StatusOK)
      fmt.Fprint(w, err)
      return
    }
    userMap[user.ID]
    if !ok {
      w.WriteHeader(http.StatusOK)
      fmt.Fprint(w, "No User ID:", id)
      return
  }
  user , ok := userMap[updateUser.ID]
  if !ok {
    w.Writeheader(http.StatusOK)
    fmt.Fprint(w, "No User ID:", updateUser.ID)
    return
  }
  if updateUser.FirstName != "" { // 1
    user.FirstName = updateUser.FirstName
  }
  if updateUser.LastName != "" {
    user.LastName = updateUser.LastName
  }
  if updateUser.Email != "" {
    user.Email = updateUser.Email
  }
  // userMap[updateUser.ID] = updateUser // 2
  w.Header().Add("Content-Type", "application/json")
  w.WriteHeader(http.StatusOK)
  data, _: = json.Marshal(user) // 3
  fmt.Fprint(w, string(data))
  
```

1 : 빈 문자열이 아닌경우가 사용자가 바꾸길 원하는 data를 넣었을 때 이므로 빈 문자열이 아닐 때 Update 시켜준다. <br />

2 : 이렇게 바꾸어주면 user값이 포인터 타입이기 때문에 포인터 타입의 값을 바꿔주면 실제 userMap[updateUser.ID]값이 바뀌는 것이기 때문에 있을 필요가 없다. <br />
    물론 지우지 않아도 달라지는 값이 없기 때문에 달라질 것은 없다. <br />

3 : 그래서 Marshal을 해줄 때 기존 user의 데이터를 해주면 된다. <br />

이 상태에서 테스트를 진행 하면 PASS가 뜨는 것을 확인 할 수 있다. <br />

PASS가 되었지만 여기서 또 다른 문제가 있는 게  <code>myapp/app_test.go</code>에서
``` Go

  updateStr := fmt.Sprintf(`{"id": %d, "first_name":"updated", "last_name":""}`, userID) 
  assert.Equal("", user.LastName)

```

으로 해서 last_name값을 ""으로 바꾸어 주려하면 error가 나면서 바뀌지 않는다. <br />

그 이유는 빈 문자열과 default값을 비교 할 수 없기 때문이다. <br />

그래서 이런 경우에 어떻게 하냐면 update용 struct를 따로 만든다. <br />

<code>myapp/app.go</code>
``` Go

 type UpdateUser struct {
    ID        int       `json:"id"`
    UpdateFirstName bool `json:"updated_first_name"`
    FirstName string    `json:"first_name"`
    UpdateLastName bool `json:"updated_last_name"`
    LastName  string    `json:"last_name"`
    UpdateEmail bool `json:"updated_email"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
  }

```
이런식으로 따로 만든 뒤 Update의 여부의 플래그를 하나씩 만들어서 Update를 받고 싶은 것만 true로 받게 할 수 있지만 복잡하기 때문에 '이렇게 쓸 수 도 있다.' 정도로만 알아두면 된다. <br />

이렇게 PUT부분은 끝이 났고, 마지막으로 GET으로 전체 list를 가져오는 걸 안했기 때문에 이것을 구현해보자! <br />

우리가 usersHandler가 호출 되었을 때 

``` Go
  
  func usersHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Get UserInfo by /users/{id}")
  }
  
```

<code>Get UserInfo by /users/{id}</code>이 문자열만 출력되게 했는데 user의 list가 출력되게 해야 한다.

``` Go
  
  func usersHandler(w http.ResponseWriter, r *http.Request) {
      if len(userMap) == 0 { // 1
          w.Writeheader(http.StatusOK)
          fmt.Fprint(w, "No Users")
          return
      }
  }
  
```

1 : user의 list가 없는 경우

그리고 <code>myapp/app_test.go</code>의 TestUsers()함수도 수정해준다.
``` Go

func TestUsers(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Get(ts.URL + "/users")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, _ := ioutil.ReadAll(resp.Body)
    assert.Contains(string(data), "No Users")
}

```  

이 때 테스트를 하면 PASS OK가 뜰 것이고, 이어서 맨 아랫줄에 TestUsers_WithUsersData()를 만들어준다.<br />
users를 실제로 등록을 한 다음에, 다시 users를 보냈을 때 list가 나와야 하기 때문에 만들어 준 것이다. <br />

``` Go

func TestUsers_WithUsersData(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Post(ts.URL+"/users", "application/json",
    strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`))
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
    
      resp, err := http.Post(ts.URL+"/users", "application/json",
    strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`))
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
    
    resp, err := http.Get(ts.URL+"/users")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, err := ioutil.ReadAll(resp.Body)
    assert.NoError(err)
    assert.NoZero(len(data))
}

```  

이 때 테스트를 해보면 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93454230-a5d43a00-f915-11ea-9aaa-b4046054caea.png" width = 70%> </img></p>

0가 아니여야 하는데 0라고 뜬다. 그 이유는 데이터를 보내지 않았기 때문이다. <br />

<code>myapp/app.go</code>에서 아까 수정했던 부분을 보게되면

``` Go
  
  func usersHandler(w http.ResponseWriter, r *http.Request) {
      if len(userMap) == 0 { // 1
          w.Writeheader(http.StatusOK)
          fmt.Fprint(w, "No Users")
          return
      }
  }
  
```
0이 아닌 경우에 아무것도 안하기 때문에 여기에 userlist를 알려주는 코드를 수정 해주면 된다. <br />

``` Go
  
  func usersHandler(w http.ResponseWriter, r *http.Request) {
      if len(userMap) == 0 { // 1
          w.Writeheader(http.StatusOK)
          fmt.Fprint(w, "No Users")
          return
      }
      user := []*User{} // 1
      for _, u := range userMap { // 2
          users = append(users, u)
      }
      data, _ := json.Marshal(users)
      w.Header().Add("Content-Type", "application/json")
      w.WriteHeader(http.StatusOK)
      fmt.Fprint(w, string(data))
  }
  
```

1 : user list <br />
2 : user map을 돌면서 user list를 채워주는 for문 <br />

이 상태에서 테스트를 하면 PASS OK가 뜨게 된다. <br />

이제 <code>myapp/app_test.go</code>로 돌아와서 data를 받았을 때 잘 받아지는지 확인해야 한다.

``` Go

func TestUsers_WithUsersData(t *testing.T) {
    assert := assert.New(t)

    ts := httptest.NewServer(NewHandler())
    defer ts.Close()

    resp, err := http.Post(ts.URL+"/users", "application/json",
    strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`))
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
    
      resp, err := http.Post(ts.URL+"/users", "application/json",
    strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`))
    assert.NoError(err)
    assert.Equal(http.StatusCreated, resp.StatusCode)
    
    resp, err := http.Get(ts.URL+"/users")
    assert.NoError(err)
    assert.Equal(http.StatusOK, resp.StatusCode)
    data, err := ioutil.ReadAll(resp.Body)
    
    // 수정된 부분
    users := []*User{}
    json.newDecoder(resp.Body).Decode(&users) // 1
    assert.NoError(err)
    assert.Equal(2, len(users))
    // assert.NoError(err)
    // assert.NoZero(len(data))
}

``` 

기존 두 줄 코드는 지우고 새로운 코드를 넣었다. <br />
1 : marshal할 때 포인터 타입을 넣어주어야 하는데 <code>[]*User{}</code>가 포인터 타입이 아니여서 users앞에 &를 넣어주었다.

이제 정상적으로 List를 뽑아내는지 확인해보자! <br />

먼저 POST메소드로 id가 1,2만 바꾸어서 등록해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93455773-bc7b9080-f917-11ea-9d79-de14bb904c92.png" width = 70%> </img></p>

그 후 GET메소드를 호출 했을 때 전체 List가 나오는지 확인해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93455898-eaf96b80-f917-11ea-96fa-40d126701ca0.png" width = 70%> </img></p>
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93456116-3744ab80-f918-11ea-8046-2549d049767c.png" width = 70%> </img></p>

### 풀 소스

<code>myapp/test_app.go</code>
``` Go

package myapp

import (
	"encoding/json"
	"fmt"
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
	assert.Equal(string(data), "No Users")
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
		strings.NewReader(`{"first_name":"tucker", "last_name":"kim", "email":"tucker@naver.com"}`))
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
		strings.NewReader(`{"first_name":"tucker", "last_name":"kim", "email":"tucker@naver.com"}`))
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

func TestUpdateUser(t *testing.T) {
	assert := assert.New(t)

	ts := httptest.NewServer(NewHandler())
	defer ts.Close()

	req, _ := http.NewRequest("PUT", ts.URL+"/users",
		strings.NewReader(`{"id":1, "first_name":"updated", "last_name":"updated", "email":"updated@naver.com"}`))
	resp, err := http.DefaultClient.Do(req)
	assert.NoError(err)
	assert.Equal(http.StatusOK, resp.StatusCode)
	data, _ := ioutil.ReadAll(resp.Body)
	assert.Contains(string(data), "No User ID:1")

	resp, err = http.Post(ts.URL+"/users", "application/json",
		strings.NewReader(`{"first_name":"tucker", "last_name":"kim", "email":"tucker@naver.com"}`))
	assert.NoError(err)
	assert.Equal(http.StatusCreated, resp.StatusCode)

	user := new(User)
	err = json.NewDecoder(resp.Body).Decode(user)
	assert.NoError(err)
	assert.NotEqual(0, user.ID)

	updateStr := fmt.Sprintf(`{"id":%d, "first_name":"jason"}`, user.ID)

	req, _ = http.NewRequest("PUT", ts.URL+"/users",
		strings.NewReader(updateStr))
	resp, err = http.DefaultClient.Do(req)
	assert.NoError(err)
	assert.Equal(http.StatusOK, resp.StatusCode)

	updateUser := new(User)
	err = json.NewDecoder(resp.Body).Decode(updateUser)
	assert.NoError(err)
	assert.Equal(updateUser.ID, user.ID)
	assert.Equal("jason", updateUser.FirstName)
	assert.Equal(user.LastName, updateUser.LastName)
	assert.Equal(user.Email, updateUser.Email)
}

func TestUsers_WithUsersData(t *testing.T) {
	assert := assert.New(t)

	ts := httptest.NewServer(NewHandler())
	defer ts.Close()

	resp, err := http.Post(ts.URL+"/users", "application/json",
		strings.NewReader(`{"first_name":"tucker", "last_name":"kim", "email":"tucker@naver.com"}`))
	assert.NoError(err)
	assert.Equal(http.StatusCreated, resp.StatusCode)

	resp, err = http.Post(ts.URL+"/users", "application/json",
		strings.NewReader(`{"first_name":"jason", "last_name":"park", "email":"jason@naver.com"}`))
	assert.NoError(err)
	assert.Equal(http.StatusCreated, resp.StatusCode)

	resp, err = http.Get(ts.URL + "/users")
	assert.NoError(err)
	assert.Equal(http.StatusOK, resp.StatusCode)

	users := []*User{}
	err = json.NewDecoder(resp.Body).Decode(&users)
	assert.NoError(err)
	assert.Equal(2, len(users))
}


```
<code>myapp/app.go</code>
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
	if len(userMap) == 0 {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "No Users")
		return
	}
	users := []*User{}
	for _, u := range userMap {
		users = append(users, u)
	}
	data, _ := json.Marshal(users)
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, string(data))
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

func updateUserHandler(w http.ResponseWriter, r *http.Request) {
	updateUser := new(User)
	err := json.NewDecoder(r.Body).Decode(updateUser)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		return
	}
	user, ok := userMap[updateUser.ID]
	if !ok {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "No User ID:", updateUser.ID)
		return
	}
	if updateUser.FirstName != "" {
		user.FirstName = updateUser.FirstName
	}
	if updateUser.LastName != "" {
		user.LastName = updateUser.LastName
	}
	if updateUser.Email != "" {
		user.Email = updateUser.Email
	}
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
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
	mux.HandleFunc("/users", updateUserHandler).Methods("PUT")
	mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler).Methods("GET")
	mux.HandleFunc("/users/{id:[0-9]+}", deleteUserHandler).Methods("DELETE")
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
	http.ListenAndServe(":3000", myapp.NewHandler())
}


```
