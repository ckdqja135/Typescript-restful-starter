## 시작
지난번에 만들었던 Todos에 Login 화면을 추가 해보자! 풀소스 부분에 <code>public/signin.css</code>와 <code>public/signin.html</code>파일이 있다. <br />

이것을 열어보면 아래와 같이 단순하게 구글 로그인과 페이스북 로그인을 지원하는 Page이다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95153707-0d6dfe80-07cb-11eb-850d-c70114398bf6.png" width = 70%> </img></p> 

이번에는 지난 번에 했었던 Google OAuth를 가지고 구글 로그인을 할 수 있도록 구현해본다. <br />

먼저 app폴더에 signin.go 라는 파일을 추가해서 지난번에 했었던 OAuth 코드를 main()을  가져온다. <br />
<code>app/signin.go</code>
``` Go

  package app

  import (
    "context"
    "crypto/rand"
    "encoding/base64"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "os"
    "time"

    "github.com/gorilla/pat"
    "github.com/urfave/negroni"
    "golang.org/x/oauth2"
    "golang.org/x/oauth2/google"
  )

  var googleOauthConfig = oauth2.Config{
    RedirectURL:  "http://localhost:3000/auth/google/callback",
    ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
    ClientSecret: os.Getenv("GOOGLE_SECRET_KEY"),
    Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
    Endpoint:     google.Endpoint,
  }

  func googleLoginHandler(w http.ResponseWriter, r *http.Request) {
    state := generateStateOauthCookie(w)
    url := googleOauthConfig.AuthCodeURL(state)
    http.Redirect(w, r, url, http.StatusTemporaryRedirect)
  }

  func generateStateOauthCookie(w http.ResponseWriter) string {
    expiration := time.Now().Add(1 * 24 * time.Hour)

    b := make([]byte, 16)
    rand.Read(b)
    state := base64.URLEncoding.EncodeToString(b)
    cookie := &http.Cookie{Name: "oauthstate", Value: state, Expires: expiration}
    http.SetCookie(w, cookie)
    return state
  }

  func googleAuthCallback(w http.ResponseWriter, r *http.Request) {
    oauthstate, _ := r.Cookie("oauthstate")

    if r.FormValue("state") != oauthstate.Value {
      log.Printf("invalid google oauth state cookie:%s state:%s\n", oauthstate.Value, r.FormValue("state"))
      http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
      return
    }

    data, err := getGoogleUserInfo(r.FormValue("code"))
    if err != nil {
      log.Println(err.Error())
      http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
      return
    }

    fmt.Fprint(w, string(data))
  }

  const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

  func getGoogleUserInfo(code string) ([]byte, error) {
    token, err := googleOauthConfig.Exchange(context.Background(), code)
    if err != nil {
      return nil, fmt.Errorf("Failed to Exchange %s\n", err.Error())
    }

    resp, err := http.Get(oauthGoogleUrlAPI + token.AccessToken)
    if err != nil {
      return nil, fmt.Errorf("Failed to Get UserInfo %s\n", err.Error())
    }

    return ioutil.ReadAll(resp.Body)
  }

```

그 후 저장을 해주고, main()에 있는 핸들러 부분을 app.go에 핸들러 추가해주는 부분에 넣어준다. <br />

<code>app/app.go</code>
``` Go

  func MakeHandler(filepath string) *AppHandler {
    r := mux.NewRouter()
    n := negroni.New(
      negroni.NewRecovery(),
      negroni.NewLogger(),
      negroni.HandlerFunc(CheckSignin),
      negroni.NewStatic(http.Dir("public")))
    n.UseHandler(r)

    a := &AppHandler{
      Handler: n,
      db:      model.NewDBHandler(filepath),
    }

    r.HandleFunc("/todos", a.getTodoListHandler).Methods("GET")
    r.HandleFunc("/todos", a.addTodoHandler).Methods("POST")
    r.HandleFunc("/todos/{id:[0-9]+}", a.removeTodoHandler).Methods("DELETE")
    r.HandleFunc("/complete-todo/{id:[0-9]+}", a.completeTodoHandler).Methods("GET")
    r.HandleFunc("/auth/google/login", googleLoginHandler)
    r.HandleFunc("/auth/google/callback", googleAuthCallback)
    r.HandleFunc("/", a.indexHandler)

    return a
  }

```

그 후 버튼을 클릭 했을 때 페이지가 <code>/auth/google/login</code>로 요청이 될 수 있도록 변경 해준다. <br />

<code>public/signin.html</code>

``` HTML
...
 <button onclick="window.location.href='/auth/google/login';return false;" class="btn btn-lg btn-google btn-block text-uppercase" type="submit"><i class="fab fa-google mr-2"></i> Sign in with Google</button>
 <button class="btn btn-lg btn-facebook btn-block text-uppercase" type="submit"><i class="fab fa-facebook-f mr-2"></i> Sign in with Facebook</button>
...
         
```
위 코드를 보면 하나는 구글 로그인 버튼이고, 하나는 페이스북 로그인 버튼인데 구글 로그인 버튼 태그안에 onclick 이벤트를 넣어서 클릭되었을 때 발생하는 이벤트를 추가해준다. <br />
<code>window.location.href</code>를 사용하면 현재 창의 주소를 바꾸어준다. <br />
그리고 return false를 해주어야 하는데 form태그에 걸려 summit이 되서 화면만 새로고침 되고 경로가 바뀌지 않는다. <br />

이제 저장 후에 서버를 실행해보자! <br />

<code>localhost:3000/signin.html</code>를 주소창에 입력해야 로그인창에 들어가진다. <br />

그 후 버튼을 구글 로그인 버튼을 클릭 후에 로그인을 하게 되면 아래와 같은 화면이 뜬다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95153882-82413880-07cb-11eb-956a-c0ec33dbbe32.png" width = 70%> </img></p> 

이제 세션정보를 저장해서 사용하도록 수정해보겠다. <br />
어떤 웹사이트에 로그인을 할 때 세션이 생기는데 그것이 로그인했는지 안했는지 여부를 확인하는 방법은 쿠키에 로그인된 정보들을 넣는다. <br />
이 말은 브라우저가 그 데이터를 가지고 있고, 다른 요청을 할 때 쿠키 데이터가 같이 가는데 웹 서버에서 쿠키 데이터를 가지고 로그인 여부를 판단을 한다. <br /> 
하지만 이것은 쿠키 정보가 같이 가기 때문에 해킹에 취약하다. <br />
 
 예를 들면 쿠키에 민감한 데이터 같은 ID라던지, PW라던지, 세션 정보를 넣으면 이것이 HTML을 통해서 데이터가 서버로 가는데, 패킷 스누핑이라 하는데 HTML과 서버 중간에 껴서 <br />
 패킷을 읽어볼 수 있다. 그 때 쿠키를 확인하게 되면 그 안에 있는 정보를 다 확인할 수 있다. <br />
 그래서 이것을 확인하지 못하게 해야하는데 가장 간단한 방법은 쿠키에 세션 아이디를 넣는데 그것을 암호화 해서 쿠키에 넣고, 그 정보를 웹서버에 보내주고, 보내준 것을 복호화해서 <br />
 쿠키 데이터를 읽어 로그인이 되었는지, 안되었는지를 확인하게 할 것이다. <br/>
 
 그래서 Gorilla sessions이라는 패키지를 사용하도록 할 것이다. <br />
 [여기](https://github.com/gorilla/sessions)에서 자세한 내용을 확인할 수 있다. <br />
 기본적으로 이 패키지는 쿠키데이터를 저장하는데, 암호화를 해도 복호화를 자동으로 해주는 패키지이다. <br />
 
 먼저 Gorilla sessions을 설치해주자! <br />
 ``` linux
 
  go get github.com/gorilla/sessions
  
```

설치가 되면 홈페이지에 나와있는 예제 소스를 사용 할 것인데 <br />

``` Go

  var store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))

```
 
이 부분을 복사하여 <code>app/app.go</code>에 맨위(전역변수로 사용할 것이기 때문에)에 붙여준다. <br />

``` Go

...
  var store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
...

```

이 소스는 암호를 해주는 쿠키 스토어를 만드는 소스인데, 암호를 할 때 사용하는 키는 환경변수의 SESSION_KEY이다. <br />
환경변수에 SESSION_KEY를 추가해주자! <br />
SESSION_KEY의 Value는 암호화 Key인데 의미는 없는데 유니크한 값을 넣어주어야 주면 된다. <br />
더 좋은 방법은 간단한 프로그램을 만들어주면 되는데 <br />
https://github.com/google/uuid
<code>main.go</code>
``` Go 

  package main

  import (
    "fmt"

    "github.com/google/uuid"
  )

  func main() {
    id := uuid.New()
    fmt.Println(id.String())
  }

```

Google에 [uuid](https://github.com/google/uuid)라는 패키지가 있는데 이것을 설치 후에 사용하면 된다. <br />
그 후 실행을 하면 아래와 같은 uuid가 생성된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95155858-0eedf580-07d0-11eb-9c2c-08d1c0b5f571.png" width = 70%> </img></p> 
uuid이기 때문에 위와 같은 id가 없다는 것이 보장이 된다. <br />
이제 이것을 환경변수에 추가해주자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95156217-f92d0000-07d0-11eb-8f57-8746c95334eb.png" width = 70%> </img></p> 

uuid가 노출이 되면 암호화를 복호화 할 수 있기 때문에 노출에 주의해야 하고, 외부에 웹 사이트가 배포되었을 시 이 키를 주기적으로 바꾸어 주어야 한다. <br />

이제 store변수를 가지고 <code>app/signin.go</code>에 가서 코드를 수정 해줄 것인데 <br />
<code>app/signin.go</code>
```Go

  type GoogleUserId struct { // 1
    ID            string `json:"id"`
    Email         string `json:"email"`
    VerifiedEmail bool   `json:"verified_email"`
    Picture       string `json:"picture"`
  }

  func googleAuthCallback(w http.ResponseWriter, r *http.Request) {
    oauthstate, _ := r.Cookie("oauthstate")

    if r.FormValue("state") != oauthstate.Value {
      log.Printf("invalid google oauth state cookie:%s state:%s\n", oauthstate.Value, r.FormValue("state"))
      http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
      return
    }

    data, err := getGoogleUserInfo(r.FormValue("code"))
    if err != nil {
      log.Println(err.Error())
      http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
      return
    }
    // 여기가 데이터를 받은 상태임.
    // Store Id info into Session cookie
    var userInfo GoogleUserId
    err = json.Unmarshal(data, &userInfo) // 2
    if err != nil { // 3
      log.Println(err.Error())
      http.Error(w, err.Error(), http.StatusInternalServerError) // 4
      return
    }
    session, err := store.Get(r, "session") // 5
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError) // 4
      return
    }
    // Set some session values.
    session.Values["id"] = userInfo.ID // 5
    // Save it before we write to the response/return from the handler. 
    err = session.Save(r, w) // 5
    if err != nil { // 5
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }
    http.Redirect(w, r, "/", http.StatusTemporaryRedirect) // 6
  }

```
Google에서 signin이 된 다음에 다시 콜백 주소로 알려주게 되는데 그 주소를 통해 유저의 정보를 받아올 수 있게 되었고, <br />
그 다음에 데이터를 웹 화면상에 result로 뿌려줬는데 그 id 정보를 세션에 저장할 것이다. <br />

1 : 먼저 구글에서 보내준 데이터를 파싱하기 위해 보내준 형태 그대로 struct를 만들어 준다. <br />
2 : 구글에서 보내준 데이터가 data변수 포맷에 맞는 데이터이기 때문에 json패키지를 이용해서 Unmarshal해준다. <br />
    첫번째로 데이터를 집어넣고, 두번째에 userInfo라는 객체를 만든 뒤 userInfo의 주소를 넘겨서 GoogleUserId 데이터가 Unmarshal되서 값이 들어가게 해준다. <br />
3 : 에러가 있으면 에러 처리를 해준다. <br />
4 : 기존에는 에러가 생겼을 때 Redirect()했었는데 에러를 반환하는 것으로 수정해준다. <br />
5 : 2번이 정상적으로 처리 되었으면 유저의 ID값이 들어왔을텐데, 이것을 세션 쿠키에 저장해주는데, 해당 소스는 gorilla sessions에 예제 코드에 나와있다. <br />
    <code>session.Values["id"] = userInfo.ID</code>에 아무거나 저장해도 되는데, Email이나 Picture를 추가로 저장해도 무방하다. <br />
    그후 Save()를 통해 저장하고, 에러가 있을 시 에러를 반환해준다. <br />
6 : 로그인이 끝났으므로 메인페이지로 redirect시켜준다. 

그 다음 <code>app/app.go</code>에 넘어와서 코드를 수정할 것인데 <br />
로그인 하면 세션 쿠키에 저장이 되었을 것이고, 그것을 indexHandler가 호출 될 때 그 세션 아이디를 읽어와야 한다. <br />
그래서 쿠키에서 세션 아이디를 읽어오는 함수를 추가해준다. <br />

``` Go

  func getSesssionID(r *http.Request) string { // 1
    session, err := store.Get(r, "session") // 2
    if err != nil { // 3
      return ""
    }

    // Set some session values.
    val := session.Values["id"] // 4
    if val == nil { // 5
      return ""
    }
    return val.(string) // 6
  }

```

1 : 쿠키는 Request안에 들어있기 때문에 Request가 필요하고, id의 return값이 string으로 나오게 된다. <br />
2 : 그 후 세션에 저장했고, 아이디를 넣었기 때문에 저장할 때 사용 했던 코드들을 그대로 가져온다. <br />
    가져오는 방법도 똑같다. store에서 세션을 Get한 다음, id를 가져오면 된다. <br />
3 : 에러가 났을 때 빈 문자열을 반환 시켜준다. <br />
4 : 이것이 map으로 되어 있는데 <code>map[interface{}]interface{}</code> 이런식으로 interface의 interface로 되어 있어 어떤 타입도 다 된다. <br />
    그래서 nil도 가능하다. 그래서 이 부분이 비어있는 경우에 var는 nil이 된다. <br />
5 : 그래서 비어있는지 여부를 체크한다. (비어있을 시 로그인이 안된 상태) <br />
6 : val에 구글id를 string으로 넣기 때문에 string으로 바꾸어서 return 해준다. <br />

여기까지 하면 session id가 나오는데, indexHandler도 그렇고, getTodoListHandler, addTodoHandler, removeTodoHandler들의 모든 요청에 대해서 <br />
로그인이 되지 않은 상태면 로그인 화면으로 보내주어야 한다. 그렇게 하면 모든 Handler에 세션 id검사하는 부분을 만들기가 번거롭기 때문에 <br />
지난 번에 Decorator Handler를 만들었었는데 Decorator Handler가 먼저 로그인 여부를 체크해서 로그인이 안되었을 경우에는 로그인 화면으로 보내버리고, <br /> 
아닐 경우엔 나머지를 처리하도록 할 것인데 Decorator Handler를 새로 만든다기 보다는 negroni가 커스텀 미들웨어를 지원하기 때문에 negroni를 그대로 사용해보자! <br />

<code>main.go</code>에 있는 negroni를 지워버리고 <code>app.go</code>에서 negroni를 가져온다. <br />

``` Go

  func CheckSignin(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) { // 2
    // 이미 signin URL을 요청하거나 auth URL을  경우에 next()로 가야한다. (무한루프 방지)
    if strings.Contains(r.URL.Path, "/signin.html") || 
      strings.Contains(r.URL.Path, "/auth") {
      next(w, r)
      return
    }
    // 로그인 여부 체크 
    // 유저가 signin되어 있으면 next로 가서 Write하고, 다음 next의 핸들러를 호출해준다.
    sessionID := getSesssionID(r)
    if sessionID != "" {
      next(w, r)
      return
    }

    //  유저가 signin이 안되어 있으면 signin화면으로 redirect시켜준다.
    http.Redirect(w, r, "/signin.html", http.StatusTemporaryRedirect)
  }

  func MakeHandler(filepath string) *AppHandler {
    r := mux.NewRouter()
    n := negroni.New( // 1
      negroni.NewRecovery(),
      negroni.NewLogger(),
      negroni.HandlerFunc(CheckSignin),
      negroni.NewStatic(http.Dir("public")))
    n.UseHandler(r)

    a := &AppHandler{
      Handler: n,
      db:      model.NewDBHandler(filepath),
    }

    r.HandleFunc("/todos", a.getTodoListHandler).Methods("GET")
    r.HandleFunc("/todos", a.addTodoHandler).Methods("POST")
    r.HandleFunc("/todos/{id:[0-9]+}", a.removeTodoHandler).Methods("DELETE")
    r.HandleFunc("/complete-todo/{id:[0-9]+}", a.completeTodoHandler).Methods("GET")
    r.HandleFunc("/auth/google/login", googleLoginHandler)
    r.HandleFunc("/auth/google/callback", googleAuthCallback)
    r.HandleFunc("/", a.indexHandler)

    return a
  }

```

이 때 핸들러는 mux핸들러를 사용한다. <br />
즉, AppHandler가 negroni Handler를 사용하고, negroni Handler가 mux Handler를 사용하는 물고 물리는 관계가 된다. <br />
그래서 serverhttp(a) 함수가 호출되면 negronihttp 함수가 호출이 되고, negronihttp 함수가 호출이 되면, 데코레이터 모듈들이 호출이 된 다음에 <br />
muxRouter가 호출이 되는 구조가 된다. <br />

1 : negroni.Classic()의 구조를 보면
``` Go

  func Classic() *Negroni {
    return New(NewRecovery(), NewLogger(), NewStatic(http.Dir("public")))
  }

```

3가지 데코레이터를 가지고 있다는 것을 알 수 있다. <br />
* NewRecovery() - 핸들러를 처리하다가 Panic()이 일어 났을 때 웹서버가 죽지 않도록 Recovery해주는 것.
* NewLogger() - Log를 찍는 부분.
* NewStatic(http.Dir("public")) - File Static을 해주는 부분.

NewRecovery와 NewLogger는 그냥 사용할 수 있는데, NewStatic같은 경우엔 파일 요청을 들어오기전에 로그인 여부를 판단해야 하기 때문에 이 것을 바로 쓸 수 없고, <br />
이 둘을 먼저 한 다음 CheckSignin이라는 데코레이터를 먼저 처리한 다음에 로그인이 안됐을 경우에 여기에서 끊어 버려준다. <br />
앞쪽부터 체인으로 물려있다 생각하면 된다. <br />
그래서 HandlerFunc안에 데코레이터 함수를 넣으면 데코레이터 핸들러로 바꾸어주는데 <br />
HandlerFunc은 function type인데 저 3가지의 인자로 구성되어 있다. <br />

``` Go

  type HandlerFunc func(rw http.ResponseWriter, r *http.Request, next http.HandlerFunc)
  
```

2 : 그래서 거기에 해당하는 함수를 만들어준다. <br />

이렇게 저장후에 실행을 시켜보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95153707-0d6dfe80-07cb-11eb-850d-c70114398bf6.png" width = 70%> </img></p> 
화면 진입 후 Google 로그인 버튼을 클릭하면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95166513-fe964480-07e8-11eb-82d3-fe343e4bfb7d.png" width = 70%> </img></p> 
아래와 같이 Google로그인 창이 뜨게 되고 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95166549-0d7cf700-07e9-11eb-8673-e7cef4a548d3.png" width = 70%> </img></p> 
로그인을 하게 되면 todos 앱 화면으로 넘어가는 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95166616-2c7b8900-07e9-11eb-9499-6a49b208570d.png" width = 70%> </img></p> 

지금은 data를 세션 id별로 따로 따로 보관하는 것이 아니라 어떤 계정으로 들어와도 같은 todos가 나오게 된다. <br />
