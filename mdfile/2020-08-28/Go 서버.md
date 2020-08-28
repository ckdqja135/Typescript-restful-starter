## Go(Golang) - Http 활용 기본 설명
보통 Golang net/http 패키지 실행 흐름 구조는 아래와 같이 쉽게 나타낼 수 있으며, 관련 예제는 하단에서 설명합니다.

#### Golang Http 처리 기본 흐름
[출처](https://astaxie.gitbooks.io/build-web-application-with-golang/content/en/03.3.html)
<p align = "left"> <img src = "https://user-images.githubusercontent.com/33046341/91539041-abacb000-e953-11ea-87c4-2c043c3651f1.png" width = 20%> </img></p>

## Go(Golang) - Http 활용 예제 소스 코드
Golang - net/http 패키지의 ListenAndServe메소드를 통해서 서버를 실행 한 후 기본 요청에 대해서 응답 후 관련 Log내용을 콘솔(Console)에 출력하는 쉬운 예제 입니다.

아래 예제를 통해서 요청과 응답의 기본 흐름을 익히실 수 있습니다.

''' text
  go_http.go
```


``` Go
  package main

  //필요 패키지 임포트
  import (
    "fmt"
    "log"
    "net/http"
    "strings"
  )

  func defaultHandler(w http.ResponseWriter, r *http.Request) {
    r.ParseForm()
    //Get 파라미터 및 정보 출력
    fmt.Println("default : ", r.Form)
    fmt.Println("path", r.URL.Path)
    fmt.Println("param : ", r.Form["test_param"])
    //Parameter 전체 출력
    for k, v := range r.Form {
      fmt.Println("key:", k)
      fmt.Println("val:", strings.Join(v, ""))
    }
    //기본 출력
    fmt.Fprintf(w, "Golang WebServer Working!")
  }

  func main() {
    //기본 Url 핸들러 메소드 지정
    http.HandleFunc("/", defaultHandler)
    //서버 시작
    fmt.Println("Server start 8080")
    err := http.ListenAndServe(":8080", nil)

    //예외 처리
    if err != nil {
      log.Fatal("ListenAndServe: ", err)
    } else {
      fmt.Println("ListenAndServe Started! -> Port(8080)")
    }
  }
  
```

- 4 ~ 8번 라인 : Golang Http 예제 작성을 위한 필요 패키지 로드
- 11번 라인 : 기본 Url 요청(/)에 대한 Response Handler(처리 함수)선언
- 14 ~ 16번 라인 : Get방식의 Url요청에 대한 Path(경로), Parameter등 출력
- 18 ~ 21번 라인 : Get방식의 Request의 Parameter에 대한 모든 Key, Value 값 출력
- 30번 라인 : 서버 시작 -8080 포트
- 32 ~ 36번 라인 : 서버 시작 실패 시 예외 처리
