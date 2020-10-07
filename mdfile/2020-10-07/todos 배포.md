### 시작
우선 기존에 만들었었던 todos 파일을 사용자 계정 폴더에 빼내어 준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311049-14c70200-08c8-11eb-8ff8-82905756c76e.png" width = 70%> </img></p> 

여기에 Go 모듈을 만들어준다. <br />
명령 프롬프트 창을 키고 방금 옮겼던 폴더로 이동한다. <br /> 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311288-5f487e80-08c8-11eb-92c9-2b66f747243a.png" width = 70%> </img></p> 

그 다음 go mod init changbeomWeb/todos를 입력해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311490-a767a100-08c8-11eb-830f-6ff44d736482.png" width = 70%> </img></p> 

go mod init하면 mod가 initialize하게 되는데 그 때 뒷부분에 만들려는 모듈의 이름을 적어준다. 되도록 겹치지 않게 해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311701-f1e91d80-08c8-11eb-87f2-b8ce5259f09d.png" width = 70%> </img></p> 

이렇게 하면 MOD파일이 생성된 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311818-180ebd80-08c9-11eb-83ba-84486e4a8ddd.png" width = 70%> </img></p> 

그 후 git init를 사용하여 git을 initialize하게 해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311949-47252f00-08c9-11eb-9601-388a52db39c4.png" width = 70%> </img></p> 

그 후 해당 폴더를 열어서 import 부분들을 mod init했던 부분과 맞추어 수정해준다. <br />
<code>app/app_test.go</code>

``` Go
import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strconv"
	"testing"

	"changbeomWeb/todos/model" // 여기

	"github.com/stretchr/testify/assert"
)

```

<code>app/app.go</code>

``` Go

import (
	"net/http"
	"strconv"
	"strings"

	"changbeomWeb/todos/model" // 여기

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/unrolled/render"
	"github.com/urfave/negroni"
)

```

<code>main.go</code>
``` Go

  import (
    "log"
    "net/http"

    "changbeomWeb/todos/app" // 여기
  )

```
그 다음 go build -o ./bin/todos.exe -v . 를 사용하여 빌드를 시켜준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95313952-abe18900-08cb-11eb-926a-917fcecff6dd.png" width = 70%> </img></p> 
.은 현재 폴더를 빌드하겠다는 의미이고, v는 메세지가 나오게 하겠다는 의미이다. <br />
이 프로젝트에서 사용되는 모듈들을 찾아서 go mod파일에 정의하는 것을 알 수 있다. <br />

그리고 빌드는 끝이났고, bin폴더가 생성 되는 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95314282-109ce380-08cc-11eb-9466-ecff7d7e3cca.png" width = 70%> </img></p> 

그 후 bin\todos.exe를 사용하여 서버를 실행시켜보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95316250-873ae080-08ce-11eb-9066-9a67278b27b5.png" width = 70%> </img></p> 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95315957-1f849580-08ce-11eb-8995-3eb4622164ff.png" width = 70%> </img></p> 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95315973-24494980-08ce-11eb-9ae2-a58eefa118aa.png" width = 70%> </img></p> 

그 후 heroku에 배포하기 위해 heroku에 로그인을 시켜준다. <br />
``` linux

  heroku login

```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95316510-dda81f00-08ce-11eb-89d5-b1e69f1a843a.png" width = 70%> </img></p> 


그 다음 로그인이 완료된 상태에서 다음 명령어를 입력한다. <br />
``` linux
  
  heroku create

```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95316526-e26cd300-08ce-11eb-8588-ebe2e2cdfd5a.png" width = 70%> </img></p> 

그 후 커밋을 위해 기존 파일에 있던 test.db파일과 bin폴더에 있는 todos.exe 파일들을 지워준다. <br />

그 후 add 시켜준다. <br />

``` linux
  
  git add .
  
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95316960-76d73580-08cf-11eb-9bcd-2cbc3d2e3873.png" width = 70%> </img></p> 

그 다음 커밋을 시켜준다. <br />

``` linux

  git commit -m "first commit of todos"

```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95317282-ec430600-08cf-11eb-8c4d-f46d228a7585.png" width = 70%> </img></p> 

이제 커밋이 되었는데, 이 상태에서 heroku server로 push 시켜준다. <br />

``` linux
  
  git push heroku master
  
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95317411-1e546800-08d0-11eb-9a34-b8db8e37d381.png" width = 70%> </img></p> 

그 다음 현재 돌아가고 있는 프로세스 정보를 확인 해보자! <br />

``` linux
  
  heroku ps
  
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95318035-f0235800-08d0-11eb-8c06-fb3132cf4a64.png" width = 70%> </img></p> 

그리고 log를 확인하여 제대로 돌아가고 있는지 확인해보자! <br />

``` linux

  heroku logs --tail

```

그 다음 접속을 해보자! <br />

``` Go 

  heroku open
  
```

그러면 오류가 난 창이 뜨는데 로그를 확인해보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95319036-5492e700-08d2-11eb-98fa-3e921e3d9cbb.png" width = 70%> </img></p> 

그러면 무언가 crashed가 났다고 뜬다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95318932-2f05dd80-08d2-11eb-807e-4a6af1ff5699.png" width = 70%> </img></p> 

어떤게 crashed 났는지 확인해보자! <br />
먼저 heroku 테스트 코드를 보게 되면 <br />

``` Go

package main

import (
  "log"
  "net/http"
  "os"

  "github.com/gin-gonic/gin"
_ "github.com/heroku/x/hmetrics/onload"
)

func main() {
  port := os.Getenv("PORT")

  if port == "" {
   log.Fatal("$PORT must be set")
  }

  router := gin.New()
  router.Use(gin.Logger())
  router.LoadHTMLGlob("templates/*.tmpl.html")
  router.Static("/static", "static")

  router.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "index.tmpl.html", nil)
  })

  router.Run(":" + port)
}

```

여기를 확인하면 포트번호는 임의적으로 설정하는 게 아니라 환경변수에서 설정되어 있는 포트번호를 써야 되는 것을 알 수 있다. <br />
수정해주자! <br />

``` Go

package main

import (
  "log"
  "net/http"
  "os"

  "changbeomWeb/todos/app"
)

func main() {
  port := os.Getenv("PORT")
  m := app.MakeHandler("./test.db")
  defer m.Close()

  log.Println("Started App")
  err := http.ListenAndServe(":"+port, m)
  
  if err != nil {
    panic(err)
  }
}

```

그리고 heroku 테스트 파일 폴더에 procfile에 실행파일 경로가 적혀있는데 이것을 현재 만든 프로젝트에 가져온다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95319768-5d37ed00-08d3-11eb-9ff6-3938d9d14bd0.png" width = 70%> </img></p> 

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95319792-67f28200-08d3-11eb-84e4-53f97db79dec.png" width = 70%> </img></p> 

그 후 procfile를 수정해준다. <br />

``` text
	
  web: bin/todos
  
```

파일을 수정했기 때문에 명령프롬프트를 열어 다시 git에 add 해준 뒤 커밋을 하고 push를 서버에 시켜준다. <br />

``` linux
  
  git add .
  
```

``` linux
  
  git commit -m "use port env var"
  
```

``` linux

  git push heroku master

```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95320176-11397800-08d4-11eb-9f65-f405102cff9b.png" width = 70%> </img></p> 

이 상태에서 다시 한번 실행시켜보자! <br />

``` linux
 
  heroku open
  
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95320515-886f0c00-08d4-11eb-84c4-7982c1cd46ce.png" width = 70%> </img></p> 

근데 이 상태에서 구글 로그인을 눌러보면 에러가 난다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95320572-9f156300-08d4-11eb-859a-396019015d61.png" width = 70%> </img></p> 

그 이유는 <code>app/app.go</code>를 보면

``` Go

var googleOauthConfig = oauth2.Config{
	RedirectURL:  "http://localhost:3000/auth/google/callback",
	ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
	ClientSecret: os.Getenv("GOOGLE_SECRET_KEY"),
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
	Endpoint:     google.Endpoint,
}

```
여기서 가져오는 ClientID, ClientSecret가 내 컴퓨터의 환경변수에서 가져오는 것인데, 현재 서버가 돌아가는 상태가 내 컴퓨터가 아닌 장치에서 돌아가기 때문에 저런 페이지가 뜬 것이다. <br />
그래서 heroku server에도 이것들을 알려주어야 한다. <br />

heroku config를 통해 설정할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95320889-2531a980-08d5-11eb-9557-c101a91288a1.png" width = 70%> </img></p> 

지금은 아무것도 설정 되어 있지 않기 때문에 빈 공간이다. <br />
그래서 다음과 같이 해주면 된다. <br />
``` linux
 
  heroku config:set GOOGLE_CLIENT_ID=발급받은 클라이언트 ID
  
  heroku config:set GOOGLE_SECERT_KEY=발급받은 SECERT KEY
  
  heroku config:set SESSION_KEY=설정한 SESSION_KEY
  
```

새로 오픈하기 전에 수정해야 할 것이 있다. <br />
<code>app/signin.go</code>를 보면 <br />
``` Go

var googleOauthConfig = oauth2.Config{
    RedirectURL:  "http://localhost:3000/auth/google/callback",
    ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
    ClientSecret: os.Getenv("GOOGLE_SECRET_KEY"),
    Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
    Endpoint:     google.Endpoint,
}

```
RedirectURL가 로그인을 한 다음에 돌아 갈 주소인데, localhost:3000이 아니라 도메인을 가져와서 뒷 주소들을 붙여 주도록 수정했다. <br />

``` Go

var googleOauthConfig = oauth2.Config{
    RedirectURL:  "os.Getenv("DOMAIN_NAME") + /auth/google/callback",
    ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
    ClientSecret: os.Getenv("GOOGLE_SECRET_KEY"),
    Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
    Endpoint:     google.Endpoint,
}

```

그 다음 DOMAIN_NAME이라는 환경변수를 설정해주어야 하는데 

``` linux
 
  heroku apps
  
``` 

를 사용하면 도메인 이름이 나온다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95321843-92920a00-08d6-11eb-8c4a-dc27b393e383.png" width = 70%> </img></p> 

위와 같이 2개가 나왔을 땐 heroku open해서 확인해주도록 하자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95321978-c5d49900-08d6-11eb-91ac-978428ac82de.png" width = 70%> </img></p> 

저 부분을 복사해서 환경변수에 설정해주자! <br />

``` linux

   heroku config:set DOMAIN_NAME=frozen-meadow-93432.herokuapp.com
   
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95322148-046a5380-08d7-11eb-9b26-9855f1dd5e0f.png" width = 70%> </img></p> 

그 다음 파일이 변경되었기 때문에 add, commit, push를 다시 진행해준다. <br />

완료 되었으면 다시 heroku open해서 열어주자! <br />

구글 로그인 버튼을 클릭하면 다시 에러가 뜨는데 등록된 URL이 아니라는 문구가 뜬다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95322989-6081a780-08d8-11eb-85a5-b8b4a5d1cf39.png" width = 70%> </img></p> 

그래서 구글 클라우드 플랫폼에 추가를 해주어야 한다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95323350-fddcdb80-08d8-11eb-963d-62318c9194d7.png" width = 70%> </img></p> 

변경이 완료 된 다음에 다시 heroku open해서 열어준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95324010-07b30e80-08da-11eb-8696-f5dc966555ab.png" width = 70%> </img></p> 
