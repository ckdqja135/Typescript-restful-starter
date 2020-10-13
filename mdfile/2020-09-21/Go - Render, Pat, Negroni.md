### 시작

먼저 심플한 코드 부터 작성하자 <br />
<code>main.go</code>
``` Go
  
  package main
  
  type User struct {
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

func getUserInfoHandler(w http.ResponseWriter, r *http.Request) {
	user := User{Name: "turcker", Email: "turcker@naver.com"}
  
  w.Header().Add("Content-type", "application/json")
  w.WriteHeader(http.StatusOK)
  data, _ := json.Marshal(user)
  fmt.Fprint(wm string(data))
}

func addUserHandler(w http.ResponseWriter, r *http.Request) {
	user := new(User)
	err := json.NewDecoder(r.Body).Decode(user)
	if err != nil {
		rd.Text(w, http.StatusBadRequest, err.Error())
		return
	}
	user.CreatedAt = time.Now()
  w.Header().Add("Content-type", "application/json")
  w.WriteHeader(http.StatusOK)
  data, _ := json.Marshal(user)
  fmt.Fprint(wm string(data)
}

func helloHandler(w http.ResponseWriter, r *http.Request) { // 2
  tmpl, err := template.new("Hello").ParseFiles("templates/hello.tmpl")
  if err != nil {
    w.WriteHeader(http.StatusInternalServerError)
    fmt.Fprint(w, err)
    return
  }
  tmpl.ExecuteTemplate(w, "hello.tmpl", "changbeom")
}

  func main() {
    mux := pat.New()
    
    mux.Get("/users", getUserInfoHandler) // 1
	  mux.Post("/users", addUserHandler)
    mux.Get("/hello", helloHandler)
    
    http.ListenAndServe(":3000", mux)
    
```

이번에는 gorilla mux가 아닌 gorilla pat을 사용할 것인데, 좀 더 심플한 라우터라고 생각하면 된다. <br />
[링크](https://github.com/gorilla/pat)를 들어가면 자세한 내용을 볼 수 있으며  <br />

``` Linux
  
  go get github.com/gorilla/pat
  
```
를 사용하여 다운을 받자! <br />

1 : 기존 gorilla mux를 사용하여 GET,POST를 했을 때 쓰는 방식이 조금 다른 것을 확인 할 수 있다.  <br />
2 : 지난번에 했던 템플릿을 사용해보려 한다.

코드 구조들은 지난번에 했었던 RESTful API와 비슷한 것을 확인 할 수 있다. <br />

이어서 <code>templates/hello.tmpl</code>를 추가하여 코드를 작성한다.

``` html
  
  <html>
  <head>
  <title>Hello Go in Web</title>
  </head>
  <body> 
  Hello World{{.}}
  </body>
  </html>

```

이제 동작을 확인해보기 위해 클라이언트 앱으로 동작시켜보자! <br />
#### GET
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93737442-2ea4eb80-fc1e-11ea-96f9-c659aae860d0.png" width = 70%> </img></p>

#### POST
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93737515-6318a780-fc1e-11ea-8fbf-7c5401b84683.png" width = 70%> </img></p>

#### Hello
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93737547-79befe80-fc1e-11ea-8121-f1f5709a5f52.png" width = 70%> </img></p>

이렇게 결과를 확인 할 수 있다. 이제 매번 JSON을 쓰고, 템플릿을 전하는게 귀찮기 때문에 간단하게 해주는 패키지를 추가할 것인데,  <br />
(unrolled -render)(https://github.com/unrolled/render)이다. 해당 링크에 들어가면 자세한 내용이 나오며,
설치는 
``` Linux
  
  github.com/unrolled/render
  
```
으로 해주면 된다. <br />

사용법은 간단하다. 먼저 전역변수인 rd를 추가해준다. <br />

``` Go

  var rd *render.Render
  
```
이렇게 하면 render의 패키지가 import하게 된다. <br />

그 다음 <code>main.go</code>에서 인스턴스를 만든뒤 코드를 수정해준다. <br />

``` Go

  func getUserInfoHandler(w http.ResponseWriter, r *http.Request) {
    user := User{Name: "tucker", Email: "tucker@naver.com"}

    rd.JSON(w, http.StatusOK, user) // 1
  }
  
  func addUserHandler(w http.ResponseWriter, r *http.Request) {
    user := new(User)
    err := json.NewDecoder(r.Body).Decode(user)
    if err != nil {
      rd.Text(w, http.StatusBadRequest, err.Error())
      return
    }
    user.CreatedAt = time.Now()
    rd.JSON(w, http.StatusOK, user)
  }
  
  func helloHandler(w http.ResponseWriter, r *http.Request) {
    rd.HTML(w, http.StatusOK, "hello", "Tucker") // 2
  }
  
  func main() {
    rd = render.New() // 2
    mux := pat.New()

    mux.Get("/users", getUserInfoHandler)
    mux.Post("/users", addUserHandler)
    mux.Get("/hello", helloHandler)
    
    http.ListenAndServe(":3000", n)
}

```

1 : 첫번째 인자가 ResponseWriter, 두번째 인자가 status, 세번째 인자가 JSON으로 바꾸고싶은 인스턴스이다. 이 한줄로 끝이 난다. <br />
2 : 첫번째 인자가 ResponseWriter, 두번째 인자가 status, 세번째 인자가 템플릿 파일, 네번째 인자가 템플릿에 넣을 인스턴스 값이다. <br />

이제 실행을 시켜보자 <br />

#### GET
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93738378-99efbd00-fc20-11ea-831a-7011859751f2.png" width = 70%> </img></p>

#### POST
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93738408-ac69f680-fc20-11ea-86b3-daf4379b04a5.png" width = 70%> </img></p>

#### HELLO
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93738499-e4713980-fc20-11ea-99fe-0ec66ab184e1.png" width = 70%> </img></p>

그리고 Hello 템플릿에서 .tmpl외에도 .HTML이 될 수 있는데 이 때 템플릿을 .HTML로 변경하면 클라이언트 앱에서 읽어오지 못한다. <br />
HTML도 읽어 줄 수 있게 하기 위해 Main 부분을 수정해준다. <Br />

``` Go
  
  func main() {
	rd = render.New(render.Options{
    Directory:  "template",
		Extensions: []string{".html", ".tmpl"},
	})
	mux := pat.New()

	mux.Get("/users", getUserInfoHandler)
	mux.Post("/users", addUserHandler)
	mux.Get("/hello", helloHandler)

	http.ListenAndServe(":3000", n)
}

```

Extensions이라는 옵션이 있는데 템플릿을 읽어올 때 어떤 확장자를 읽을지 알려주는 옵션이다. <br />
마찬가지로 디렉토리가 바뀔 수 있는데, 어떤 디렉토리를 읽고자 하는지 사용하는 옵션이다. <br />

이번에는 템플릿에 어떤 레이아웃을 추가하는 것을 해보고자한다. <br />
저번 시간에 템플릿을 기능에 따라 2개 나누었듯이 나눠보자! <br />

<code>template/body.html</code>

``` HTML
  
  Name: {{.Name}}
  Email : {{.Email}}
  
```

그리고 <code>template/hello.HTML</code>를 body를 넣을 부분을 수정해주자! <br />

``` HTML
  
 <html>
  <head>
  <title>Hello Go in Web</title>
  </head>
  <body> 
  Hello World
  {{ yield }}
  </body>
</html> 

```

그리고 다시 돌아와 Main 부분을 수정해준다. <Br />

``` Go

  func helloHandler(w http.ResponseWriter, r *http.Request) {
    user := User{Name: "tucker", Email: "tucker@naver.com"} // 1
    rd.HTML(w, http.StatusOK, "body", user)
  }
  
  func main() {
	rd = render.New(render.Options{
    Directory:  "template",
		Extensions: []string{".html", ".tmpl"},
    Layout:     "hello",
	})
	mux := pat.New()

	mux.Get("/users", getUserInfoHandler)
	mux.Post("/users", addUserHandler)
	mux.Get("/hello", helloHandler)

	http.ListenAndServe(":3000", n)
}

```
1 : body 템플릿에 넣어주기 위해 수정했다.

이 상태에서 실행하게 되면
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93739238-cdcbe200-fc22-11ea-82c3-11b1a3f03d97.png" width = 70%> </img></p>

정상적으로 작동 되는 것을 확인 할 수 있다.

body는 {{ yield }}로 템플릿을 지정했지만 title부분도 템플릿으로 지정해주고 싶다면 이렇게 수정해주면 된다.

``` HTML
  
 <html>
  <head>
  <title>{{ partial "title" }}</title>
  </head>
  <body> 
  Hello World
  {{ yield }}
  </body>
</html> 

```
이렇게 만들어 준 뒤 title에 해당하는 템플릿을 만들면 된다! <br />
</code>template/title-body.html<code>

``` HTML

  Partial Go in Web
  
```
title-body라고 이름을 만들면 layout에서 해당 title에 해당하는 이름과 main.go의 body값을 읽은 부분을 채워주게 된다.
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93739730-ee486c00-fc23-11ea-957c-6f5bb9dcbf41.png" width = 70%> </img></p>

마지막으로 설치해볼 패키지는 negroni라는 패키지인데 HTTP 미들웨어이다. <br />
기본적으로 많이 쓰이는 부가기능들을 제공하는 패키지 라고 생각하면 된다. <br />

[링크](https://github.com/urfave/negroni)에 들어가면 자세한 내용을 알 수 있는데
기본적으로 제공하는 것이 Recovery, Logger, Static이다.

이것 또한 설치한다.

``` Linux
  
  go get github.com/urfave/negroni
  
```
main.go를 수정하기 앞서 public 폴더에 index.html을 생성한다. <br />
``` HTML

  <html>
    <head>
        <title>Go in Web 11</title>
    </head>
    <body>
        <h1>Hello Go in Web</h1>
    </body>
</html>

```
기본적인 것을 사용할 때는 간단한데 <br />
``` Go

    func main() {
    rd = render.New(render.Options{
      Directory:  "template",
      Extensions: []string{".html", ".tmpl"},
      Layout:     "hello",
    })
    mux := pat.New()

    mux.Get("/users", getUserInfoHandler)
    mux.Post("/users", addUserHandler)
    mux.Get("/hello", helloHandler)

    n := negroni.Classic() // 1
    n.UseHandler(mux) // 2
    http.ListenAndServe(":3000", n) // 3
  }

```

1 : 이걸 사용하면 핸들러가 하나 나온다.
2 : mux를 매핑해서 부가기능들을 추가해준다.
3 : 핸들러의 n을 추가해준다.

그러면 n이 가지고 있는것이 기본 파일 서버를 가지고 있고, log를 찍는 기능을 제공하고 있다. <br />
실행해보면 <br />
정상적으로 화면이 나오고, <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93740271-200e0280-fc25-11ea-8361-380550c609d0.png" width = 70%> </img></p>

터미널창에 log가 찍힌 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93740537-aaeefd00-fc25-11ea-9e79-4273c75a0321.png" width = 70%> </img></p>
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93740641-e12c7c80-fc25-11ea-8889-e5a67a9907d9.png" width = 70%> </img></p>

### 풀소스
<code>main.go</code>
``` Go
  
  package main

  import (
    "encoding/json"
    "net/http"
    "time"

    "github.com/gorilla/pat"
    "github.com/unrolled/render"
    "github.com/urfave/negroni"
  )

  var rd *render.Render

  type User struct {
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
  }

  func getUserInfoHandler(w http.ResponseWriter, r *http.Request) {
    user := User{Name: "tucker", Email: "tucker@naver.com"}

    rd.JSON(w, http.StatusOK, user)
  }

  func addUserHandler(w http.ResponseWriter, r *http.Request) {
    user := new(User)
    err := json.NewDecoder(r.Body).Decode(user)
    if err != nil {
      rd.Text(w, http.StatusBadRequest, err.Error())
      return
    }
    user.CreatedAt = time.Now()
    rd.JSON(w, http.StatusOK, user)
  }

  func helloHandler(w http.ResponseWriter, r *http.Request) {
    user := User{Name: "tucker", Email: "tucker@naver.com"}
    rd.HTML(w, http.StatusOK, "body", user)
  }

  func main() {
    rd = render.New(render.Options{
      Directory:  "template",
      Extensions: []string{".html", ".tmpl"},
      Layout:     "hello",
    })
    mux := pat.New()

    mux.Get("/users", getUserInfoHandler)
    mux.Post("/users", addUserHandler)
    mux.Get("/hello", helloHandler)

    n := negroni.Classic()
    n.UseHandler(mux)
    http.ListenAndServe(":3000", n)
  }

```
<code>template/body.html</code>
``` HTML 
  
  Name: {{.Name}}
  Email: {{.Email}}

```
<code>template/hello.html</code>
``` Go
  
  <html>
  <head>
  <title>{{ partial "title" }}</title>
  </head>
  <body> 
  Hello World
  {{ yield }}
  </body>
  </html>

```

<code>template/title-body.html</code>
``` Go
  
  Partial Go in Web
  
```

<code>public/index.html</code>
``` Go
  
  <html>
      <head>
          <title>Go in Web 11</title>
      </head>
      <body>
          <h1>Hello Go in Web</h1>
      </body>
  </html>
```
