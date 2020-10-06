### 시작
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


