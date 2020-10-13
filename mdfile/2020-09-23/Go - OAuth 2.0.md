### 시작

#### OAuth?
자체 회원가입을 가지지 않고(또는 있음에도), 외부 유명한 사이트(구글, 페이스북, 등등)를 통해 계정의 정보를 가져오는것을 말한다. <br />

이것이 동작하는 구조는 클라이언트가 웹 사이트(A)에 로그인 요청을 하고, 그 사이트가 요청을 받으면 구글이나 페이스북 등에 OAuth를 요청하고, <br />
그러면 클라이언트에게 해당 사이트(구글, 페이스북 등)의 로그인화면을 알려주게 되고, 클라이언트가 그 화면에서 로그인을 하고, <br />
완료가 되면 콜백주소를 등록하게 되고, 그 해당 사이트(구글, 페이스북 등)가 클라이언트가 원래 로그인 하려고 했었던 사이트(A)에 콜백 주소를 통해 Refresh Key와 API Key를 알려주게 된다. <br />
그리고 그 API Key를 통해 회원의 정보를 인가받게 된다. 근데 이 Key는 무한정 있는게 아니라서 Refresh Key를 통해서 재승인 받아야 된다. <br />

그래서 이것을 개발하기 전에 구글, 네이버, 카카오, 페이스북 등에서 OAuth API와 Secret Key를 발급 받아야 한다. <br/ >

구글의 경우 [여기](https://console.developers.google.com/)에 들어가서 <br />

표시 되어있느 OAuth 동의 화면을 설정해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93968587-e7953280-fda4-11ea-9c96-f2559139300c.png" width = 70%> </img></p> 

그러면 임의적인 애플리케이션이름을 지정해 주고, 맨 아래에 있는 저장 버튼을 눌러준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93968812-68542e80-fda5-11ea-95f1-9ca98856bf7b.png" width = 70%> </img></p> 

특별한 권한을 요구하는 것을 설정하지 않았기 때문에 빠르게 승인이 되고, 그 후 사용자 인증 정보로 들어간다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93969166-3394a700-fda6-11ea-9b67-bb147b7d97a6.png" width = 70%> </img></p> 

그 뒤 URL 칸에 http://localhost:3000을, 승인된 리디렉션 URL에는 http://localhost:3000/auth/google/callback을 넣어준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93969274-78204280-fda6-11ea-9492-319e72d0174b.png" width = 70%> </img></p> 

그 뒤 확인을 눌러주면 이렇게 정상적으로 등록 된 것을 알 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93969370-ba498400-fda6-11ea-8981-65cc9c069b8b.png" width = 70%> </img></p> 

그 뒤 발급받은 ID와 비밀번호는 환경변수에서 설정을 해주어야 한다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93969902-eca7b100-fda7-11ea-9b3b-5988de938bcf.png" width = 70%> </img></p> 

그 후 <code>main.go</code> 파일을 만들어 코딩을 시작해보자! <br />

``` Go 
  
  package main
  
  import "github.com/urfave/negroni"
  
  func main() {
    mux := pat.New() // 1
    
    n := negroni.Classic() // 2
    n.UseHandler(mux)
    http.ListenAndServe(":3000", n)
    
```

1 : pat라우터를 생성해주고, <br />
2 : negroni로 pat라우터를 감싸준다. <br />

이렇게 기본적인 서버 구축이 완성 되었고, <br />

<code>public/index.html</code>를 만들어 작성해준다. <br />

``` HTML
  
  <html>
  <head>
  <title>Go Oauth2.0 Test</title> 
  </head>
  <body>
  <p><a href='./auth/google/login'>Google Login</a></p>
  </body>
  </html>

```

그 후 서버를 실행해보면 구글 로그인 관련 하이퍼링크가 생겼고, 클릭해서 들어가면<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93970272-c0d8fb00-fda8-11ea-94e2-47d4f9422ad1.png" width = 70%> </img></p> 
관련 핸들러를 만들지 않았기 때문에 404Page가 뜨는 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93970255-b7e82980-fda8-11ea-8a13-a9fe6a94a4c8.png" width = 70%> </img></p> 

<code>main.go</code>로 돌아와 핸들러를 만들어 보자!
``` Go 
  
  package main
  
  import (
            "github.com/gorilla/pat"
            "github.com/urfave/negroni"
            "golang.org/x/oauth2"
            "golang.org/x/oauth2/google"
  )
  
  var googleOauthConfig = oauth2.Config{ // 2
    RedirectURL:  "http://localhost:3000/auth/google/callback", // 1
    ClientID:     os.Getenv("GOOGLE_CLIENT_ID"), // 2
    ClientSecret: os.Getenv("GOOGLE_SECRET_KEY"), // 3
    Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"}, // 4
    Endpoint:     google.Endpoint, // 5
  }
  
  func googleLoginHandler(w http.ResponseWriter, r *http.Request) { // 3
    state := generateStateOauthCookie(w) // 1
    url := googleOauthConfig.AuthCodeURL(state) // 2
    http.Redirect(w, r, url, http.StatusTemporaryRedirect) // 3
  }
  
  func generateStateOauthCookie(w http.ResponseWriter) string {
      expiration := time.Now().Add(1 * 24 * time.Hour) // 4

      b := make([]byte, 16) // 5
      rand.Read(b) // 6
      state := base64.URLEncoding.EncodeToString(b) // 7
      cookie := &http.Cookie{Name: "oauthstate", Value: state, Expires: expiration} // 8
      http.SetCookie(w, cookie) // 9
      return state // 10
    }

    func googleAuthCallback(w http.ResponseWriter, r *http.Request) { 
    oauthstate, _ := r.Cookie("oauthstate") // 12

    if r.FormValue("state") != oauthstate.Value {  // 13
      log.Printf("invalid google oauth state cookie:%s state:%s\n", oauthstate.Value, r.FormValue("state"))
      http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
      return
    }

    data, err := getGoogleUserInfo(r.FormValue("code")) // 14
    if err != nil { // 15
      log.Println(err.Error())
      http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
      return
    }

    fmt.Fprint(w, string(data)) // 16
  }
  
  const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" // 21 
  
  func getGoogleUserInfo(code string) ([]byte, error) { // 17
    token, err := googleOauthConfig.Exchange(context.Background(), code) // 18
    if err != nil { // 19
      return nil, fmt.Errorf("Failed to Exchange %s\n", err.Error())
    }

    resp, err := http.Get(oauthGoogleUrlAPI + token.AccessToken) // 20
    if err != nil { // 21
      return nil, fmt.Errorf("Failed to Get UserInfo %s\n", err.Error())
    }

    return ioutil.ReadAll(resp.Body) // 23
  }
  
  func main() {
    mux := pat.New()
    mux.HandleFunc("/auth/google/login", googleLoginHandler) // 1
    mux.HandleFunc("/auth/google/callback", googleAuthCallback) // 11
    n := negroni.Classic()
    n.UseHandler(mux)
    http.ListenAndServe(":3000", n)
    
```

1 : 구글 로그인 핸들러 <br />
2 : 구글 OAuth를 지원해야 하기 때문에 googleOauthConfig를 만들어 준다. <br />
    이 때 터미널을 열어서<code>go get golang.org/x/oauth2</code>를 입력하여 패키지를 다운 받아준다. <br />
    이어서 <code>go get cloud.google.com/go</code>로 패키지를 다운받아 준다. <br />
    이 두 패키지를 다운 받아야 OAuth를 사용할 수 있다.

2-1 : 리디렉션 URI을 입력해준다.
2-2 : 발급받은 클라이언트 ID를 입력해주는데, 환경변수에 저장한 것을 가져오기 위해 os.Getenv()를 사용하고,
2-3 : 마찬가지로 Secret Key를 가져온다.
2-4 : 요청하는 data의 스코프인데 userinfo의 email에 접근하겠다는 권한을 의미한다.
2-5 : 구글의 endpoint인데 이건 구글에 어떤 endpoint를 보낼건지 정의되어 있다.

3 : googleLoginHandler 함수. 구글 로그인을 요청받으면 googleOauthConfig를 통해 구글의 어떤 경로로 보내야 되는 지가 나오고, <br /> 
    유저가 그 경로로 접근해서 로그인 할 수 있도록 리다이렉트 시켜주면 된다. <br />
3-1 : AuthCodeURL에 인자로 들어가는 state <br />
      -> CSRF attacks인 URL 변조 공격을 막아주는 키가 된다. <br />
      그래서 리다이렉트로 콜백이 왔을 때 그 키가 맞는지 확인하기 위해 유저 브라우저 쿠키에 StatusTemporaryRedirect싣고, <br />
      Redirect로 콜백이 왔을 때 그 쿠키를 비교해보는 방식으로 작성했다. <br />
3-2 : googleOauthConfig.AuthCodeURL가 유저를 어떤 경로로 보내야 하는지 URL코드를 보내준다. <br />
3-3 : 보내게 되면 http.Redirect함수가 있는데 w, r을 쓰고 리다이렉트 하는 경로를 적어주고, 왜 리다이렉트하는지 코드를 알려주어야한다. <br />

그렇게 해서 로그인이 완료되면 콜백URL을 구글에서 다시 알려준다. <br />

4 : 쿠키의 만료시간을 현재 시간으로 부터 하루로 설정한다. <Br />
5 : 랜덤한 16byte 짜리 array를 만들어준다. <br />
6 : 위의 b를 랜덤하게 채워주는 코드 <br />
7 : 그 다음 byte들을 HTML Encoding을 해주기 위한 코드. <br />
    EncodeToString로 소스를 집어 넣으면 string으로 바꾸어준다. <br />
8 : 이렇게 된 것을 쿠키에 집어 넣어주는데, 그러기 위해 쿠키struct를 만들어 준다.
    쿠키struct는 Name, Value, Path, Domain, Expires, RawExpires값이 들어가는 데 Name, Value는 필수고 나머지는 옵션값이다. <br />
    지금은 Name, Value, Expries값을 넣어준다. <br />
9 : write에 지금 만든 쿠키를 넣어주고, <br />
10 : string을 리턴해야 하기 때문에 state값을 리턴 해준다. <br />

11 : 구글 콜백 핸들러. <br />
12 : 이 핸들러가 불리면 아까 저장했던 쿠키를 읽어오고 <br />
13 : request값에 state값을 넣어주기 위해 FormValue()를 사용한다. <br />
     oauthstate의 값과 FormValue()의 값이 다르면 Redirect시켜준다. <br />
     여기서 에러를 반환하면 해커가 무엇이 문제인지 단서를 제공하는 것이 되므로 바로 기본경로로 Redirect시켜준다. <br />
     그리고 공격시도가 있었기 때문에 log를 남겨준다. <br />
14 : 구글이 Request에 코드를 알려주는데 그 코드를 가지고 구글에 다시 요청을 해서 userinfo를 가져올 수 있다. <br />
15 : 에러가 있을 시 에러처리 후 Redirect시켜준다. <br />
16 : 에러가 없을 시 유저의 정보를 보낸다. <br />
17 : 14번의 함수를 작성한다. code가 오게되고 반환값은 data와 error가 된다. <br />
18 : googleOauthConfig을 이용해서 tokken을 받아오는 코드인데, <br />
     받은 code와 tokken을 Exchange()(교환)한다. 이 때 Exchange할 때 들어가는 인자가 context값과 code값이 들어가는데, <br />
     context값은 쓰레드간에 어떤 데이터를 주고받을 때 사용되는 저장소 라고 생각하면 된다. <br />
     여기서는 간단하게 기본 context인 context.Background()를 사용해준다. <br />
     이 함수는 tokken과 error를 반환하게 된다. <br />
19 : 에러 발생 시 처리. <br />
     문자열로 에러를 만들어 주고, 받은값이 없으므로 nil을 반환해준다. <br />

20 : tokken이 온 상태 이므로 그 tokken 가지고 userinfo를 request해야 한다. <br />
     21번 URL 맨 뒤쪽에 access_tokken 부분에 access_tokken인자를 넣어주면 구글에서 리턴값으로 userinfo를 알려주게 된다. <br />
     Token struct를 보게 되면 AccessToken이 있고, RefreshToken이 있다. <br />
     AccessToken은 구글에 정보를 요청할 때 사용되는 토큰이고, 이 토큰이 만료 될 때 RefreshToken으로 다시 AccessToken을 받아야 하는데 <br />
     한번만 유저정보를 요청 할 것이므로 Access Token을 쓰면 된다. 그래서 저 경로에 Access Token을 붙여서 http.Get으로 요청하면 된다. <br />
     그렇게 할 때 response와 erorr가 나오게 되는데, <br />
21 : userinfo를 request하는 경로.
22 : (20번 이어서) 19번과 마찬가지로 처리 해주고,
23 : error가 없다면 resp의 데이터를 읽어오면 되는데, resp.Body를 모두 읽어서 data를 반환 해준다.


이제 저장 후 실행을 시켜보자! <br />

혹시나 실행 시 아래와 같은 창이 뜬다면
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93979391-3d270a80-fdb8-11ea-8b31-2b91e653616b.png" width = 70%> </img></p> 

``` Go 
  
  var googleOauthConfig = oauth2.Config{
    RedirectURL:  "http://localhost:3000/auth/google/callback",
    ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
    ClientSecret: os.Getenv("GOOGLE_SECRET_KEY"),
    Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
    Endpoint:     google.Endpoint,
  }

```
이 부분에서 ClientID와 ClientSecret값을 직접 넣어주면 해결된다. <br />

구글 로그인 링크로 접속 후 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93979149-ee797080-fdb7-11ea-8b8d-b1d442b82104.png" width = 70%> </img></p> 

로그인을 하게 되면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93979094-e15c8180-fdb7-11ea-9be8-c8e058f9699a.png" width = 70%> </img></p> 

아래와 같이 그 유저의 정보가 뜨게 된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93979220-03ee9a80-fdb8-11ea-819f-8e18a095a3cf.png" width = 70%> </img></p> 


### 풀소스

<code>main.go</code>

``` Go
  
  package main

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

  func main() {
    mux := pat.New()
    mux.HandleFunc("/auth/google/login", googleLoginHandler)
    mux.HandleFunc("/auth/google/callback", googleAuthCallback)

    n := negroni.Classic()
    n.UseHandler(mux)
    http.ListenAndServe(":3000", n)
  }

```

<code>public/index.html</code>
  
``` HTML

  <html>
  <head>
  <title>Go Oauth2.0 Test</title> 
  </head>
  <body>
  <p><a href='./auth/google/login'>Google Login</a></p>
  </body>
  </html>

```
