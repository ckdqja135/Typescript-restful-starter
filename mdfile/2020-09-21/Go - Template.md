### 시작

#### Template?
쉽게 얘기하면 어떤 틀을 의미한다.

코드로 알아보면

<code>main.go</code>

``` Go
  
  package main
  
  import "html/template"
  
  type User struct {
    Name string
    Email string
    Age string
  }
  
  func main() {
    user := User{Name: "changbeom", Email: "changbeom@naver.com", Age: 23}
    tmpl, err := template.New("Tmp11").Parse("Name: {{.Name}}\nEmail: {{.Email}}\nAge: {{.Age}}") // 1
    if err != nil {
      panic(err)
    }
    tmpl.Execute(os.Stdout, user) // 2
    
    
```

1 : Tmp11라는 템플릿을 만들고 Parse를 통해 내용을 채워준다. <br />
2 : Execute의 첫 번째 칸에는 어디에 결과를 쓸 거냐?에 대한 것이다. 화면에 결과를 출력 시킬 것이기 때문에 os.Stdout를, 두 번째는 어떻게 채울 것이냐? 인데 user데이터를 넣어준다. <br />

이 상태에서 실행을 하면 

<p align="center" img src = "https://user-images.githubusercontent.com/33046341/93727875-48333c80-fbf8-11ea-8d56-1274ca885813.png" width=70%></img></p>
