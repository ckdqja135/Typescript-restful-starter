## 시작
[HEROKU](https://id.heroku.com/login)를 들어가 회원가입 후 로그인을 해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95299531-d7a74380-08b8-11eb-83b0-27373f2b24cb.png" width = 70%> </img></p> 

그 후 Documentation에 들어가서 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95299775-340a6300-08b9-11eb-8838-382e44d004fe.png" width = 70%> </img></p> 

Get Started를 클릭 후 Go언어를 선택해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95299923-6a47e280-08b9-11eb-9333-5039f3ca3c3b.png" width = 70%> </img></p> 

그러면 Go언어를 올릴 수 있는 튜토리얼이 진행이 되는데, Start를 클릭한다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95300016-8c416500-08b9-11eb-8eda-9c7d9fe2aaf2.png" width = 70%> </img></p> 

그러면 설치하는 화면이 나오는데, Git을 먼저 설치 한 뒤, 각 운영체제에 맞게 HEROKU Tool을 설치해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95300140-bbf06d00-08b9-11eb-9275-d43ad39806a3.png" width = 70%> </img></p> 

설치가 완료 되었다면, 명령프롬프트 창을 열고, heroku login 을 입력해주면 이러한 문구가 뜨는데 아무키나 눌러준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95300763-92841100-08ba-11eb-8b88-8abc7aff51ee.png" width = 70%> </img></p> 

그러면 새 창이 뜨면서 로그인 창이 뜬다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95300904-d1b26200-08ba-11eb-82e6-77fed295b0a3.png" width = 70%> </img></p> 

그 후 로그인을 하고 브라우저를 닫아주면 로그인이 완료 되어 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95301060-0aead200-08bb-11eb-8248-c4753cbbbb90.png" width = 70%> </img></p> 

그 다음 다음단계로 넘어가 준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95301152-29e96400-08bb-11eb-9d70-7cd77e40e9a7.png" width = 70%> </img></p> 

그러면 App을 Prepare 하는 페이지가 뜨는데, 아래의 테스트 코드를 받아주면 된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95301199-3e2d6100-08bb-11eb-9350-14f51c56517d.png" width = 70%> </img></p> 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95301315-6321d400-08bb-11eb-9fd1-e34d45454b07.png" width = 70%> </img></p> 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95301361-7765d100-08bb-11eb-880a-9fc62e38c601.png" width = 70%> </img></p> 

이제 설치된 경로로 들어가서 파일을 확인해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95301677-dfb4b280-08bb-11eb-932e-e58fbfc99a8a.png" width = 70%> </img></p> 

main파일을 열어준다. <br />

<code>main.go</code>
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

이것이 하는 일은 간단하다. template, static, index폴더에서 index.tmpl.html 파일을 보여주며, 포트번호는 환경변수에서 포트값을 가져오는 단순한 웹 서비스이다.<br />

이것을 배포해보도록 하자! <br />

지금까지 Git Clone까지 완료했고, 다음단계로 넘어가자 <br />

그 다음은 app을 Deploy하는 것인데, 아까 프롬프트 창에서 heroku create를 입력해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95302255-a892d100-08bc-11eb-8273-06879c97a58f.png" width = 70%> </img></p> 

그러면 heroku가 git이랑 연동을 해서 내 계정에 app을 하나 만들어준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95302407-ded05080-08bc-11eb-9559-b3715cf8fe5e.png" width = 70%> </img></p> 
여기에서 https://infinite-beyond-51893.herokuapp.com/ 은 heroku가 랜덤하게 뽑아주는 것이다. 그래서 정해진 도메인이 아니다. <br />

app을 만들었으므로 git app을 배포해주기 위해 git push heroku main를 입력해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95302748-530af400-08bd-11eb-909c-56a411351e59.png" width = 70%> </img></p> 
그러면 heroku server에 방금 받은 app을 업로드 하게 되고, 빌드, 실행을 알아서 해준다. <br />

depoly가 완료 된 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95302890-7df54800-08bd-11eb-8c33-fc773f73652d.png" width = 70%> </img></p> 

그 후 heroku open을 입력한다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95303028-a9783280-08bd-11eb-9c4c-e1760b564300.png" width = 70%> </img></p> 

그러면 아래와 같이 새 창이 열리게 된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95303044-af6e1380-08bd-11eb-8fa8-eb053a104582.png" width = 70%> </img></p> 

이 페이지가 아까 올린 페이지이다. <br />

그 다음 이 웹서버가 잘 돌아가는지 확인하고 싶다면 <br />

``` linux
  
  heroku logs --tail
  
```
를 입력해준다. <br />
--tail를 입력해주었기 때문에 뒷부분 부터 나온다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95303599-5b176380-08be-11eb-8dd6-a5accce5b70b.png" width = 70%> </img></p> 
이런식으로 log가 나오며, 이 log는 main함수에 넣어주었던 gin이라는 웹 플랫폼에서 자동으로 log기능을 가지고 있는데 그것이 뽑아주는 log이다. <br />
Go에서 많이 사용되는 웹 플랫폼이기도 하지만 무겁기 때문에 다루지 않았다. <br />

이렇게 하면 heroku배포가 끝이났다. <br />

그리고 heroku ps를 입력해주면 현재 돌아가는 서버들을 확인할 수 있다.<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95304015-f01a5c80-08be-11eb-9081-03107f914fd5.png" width = 70%> </img></p> 

bin/go-getting-started가 웹서비스이고, 프리버전이고, 1개가 돌고있다는 것을 의미한다. <br />

