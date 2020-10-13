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
    Age   int
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
    .Name 넘어간 data 인스턴스를 말한다. <br />
2 : Execute의 첫 번째 칸에는 어디에 결과를 쓸 거냐?에 대한 것이다. 화면에 결과를 출력 시킬 것이기 때문에 os.Stdout를, 두 번째는 어떻게 채울 것이냐? 인데 user데이터를 넣어준다. <br />

이 상태에서 실행을 하면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93727875-48333c80-fbf8-11ea-8d56-1274ca885813.png" width = 70%> </img></p>
정상적으로 데이터가 들어갔음을 알 수 있다. <br />

user2도 추가해보자 <br />

``` Go
  
  package main
  
  import "html/template"
  
  type User struct {
    Name string
    Email string
    Age   int
  }
  
  func main() {
    user := User{Name: "changbeom", Email: "changbeom@naver.com", Age: 23}
    user2 := User{Name: "aaa", Email: "aaa@gmail.com", Age: 40}
    tmpl, err := template.New("Tmp11").Parse("Name: {{.Name}}\nEmail: {{.Email}}\nAge: {{.Age}}") 
    if err != nil {
      panic(err)
    }
    tmpl.Execute(os.Stdout, user)
    tmpl.Execute(os.Stdout, user2)
  }
  
```

이 상태에서 실행 해보면 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93728115-76654c00-fbf9-11ea-9637-07880654b4b5.png" width = 70%> </img></p>

줄바꿈은 되지 않았지만 정상적으로 데이터가 출력 되었음을 알 수 있다. <br />

매번 템플릿을 코드에 남을 수 없으므로 외부 파일을 만들어 본다. <br />

<code>tmplates/tmpl1.tmpl</code>

``` Go 

  Name: {{.Name}}
  Email: {{.Email}}
  Age: {{.Age}}

```

확장자의 명은 아무거나 할 수 있는데, tmpl로 해보았고, 문서의 형태이다 보니 이와 같이 써 주면 된다. <br />

그리고 <code>main.go</code>로 넘어와서 main 부분을 수정해준다. <br />

``` Go
  
  func main() {
    user := User{Name: "changbeom", Email: "changbeom@naver.com", Age: 23}
    user2 := User{Name: "aaa", Email: "aaa@gmail.com", Age: 40}
    tmpl, err := template.New("Tmp11").ParseFiles("templates/tmpl1.tmpl") // 1
    if err != nil {
      panic(err)
    }
    tmpl.ExecuteTemplate(os.Stdout, "tmpl.tmpl1", user) // 2
    tmpl.ExecuteTemplate(os.Stdout, "tmpl.tmpl1", user2)
  }
```

1 : ParseFiles에 여러개의 파일들을 가져올 수 있는데 지금은 한 개 이므로 하나만 적는다. <Br />
2 : 마찬가지로 ExecuteTemplate함수를 사용하여 두번째에는 어떤 템플릿 파일을 사용했는지 파일명을 적어주어야 한다. <br />

이 상태에서 실행하면 정상적으로 출력 되는 것을 알 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93728453-fdff8a80-fbfa-11ea-814c-7b1128a89245.png" width = 70%> </img></p>

여기에 struct의 함수를 추가해보자 <br />

``` Go

  func (u User) IsOld() bool {
    return u.Age > 30
  }

```
이 함수를 템플릿에서도 사용 할 수 있는데 <br />

<code>tmplates/tmpl1.tmpl</code>
``` TEXT

  Name: {{.Name}}
  Email: {{.Email}}
  {{if .IsOld}}
  oldAge: {{.Age}}
  {{else}}
  Age: {{.Age}}
  {{end}}
  
```

이렇게 바꾼 뒤 실행을 하면 <Br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93728633-b62d3300-fbfb-11ea-9cbf-c46ab04cb036.png" width = 70%> </img></p>

30살이 넘은 경우 OldAge가 출력이 되고, 30살이 넘지 않는 경우 Age로 출력 되는 것을 확인 할 수 있다. <br />
그런데 user의 Email, Age user2의 Name위에 빈 공간이 생긴 것을 확인 할 수 있는데 그 이유는 <code>tmplates/tmpl1.tmpl</code>의 코드 중 <br />
<code>{{if .IsOld}}, {{else}}</code>부분이 없어지기 때문에 빈 칸으로 생각 하기 때문에 빈 공간이 생기는 건데 이것을 막으려면 <Br />
<code>{{if .IsOld}}, {{else}}</code> 뒷 쪽에 '-'를 붙여서 공백을 없애준다. <br />
그래서 앞쪽에 '-'를 붙이면 앞쪽의 공백이 사라지고, 뒷쪽에 '-'를 붙이면 뒷쪽의 공백이 사라지게 된다. <br />

이것을 적용 후 실행해 보면 빈 공백이 사라진 것을 알 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93728825-b1b54a00-fbfc-11ea-840e-5e8f9ca56e9a.png" width = 70%> </img></p>

그리고 <code>tmplates/tmpl1.tmpl</code>에 HTML 태그를 추가해보자 <br />

``` HTML

  Name: {{.Name}}
  Email: {{.Email}}
  {{if .IsOld}}
  oldAge: {{.Age}}
  {{else}}
  Age: {{.Age}}
  {{end}}
  
<a href="/user?email={{.Email}}">user</a>
  
```

이 상태에서 실행을 해보자 <Br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93729069-c6dea880-fbfd-11ea-8375-a1114b751126.png" width = 70%> </img></p>

템플릿된 결과를 보게 되면 이메일에서 특수문자가 자동으로 탈락되는 것을 볼 수 있는데 HTML태그 안에 쓰게 되면 오동작하기 때문에 자동으로 탈락시켜 준 것이다. <br />
만약 특수문자 탈락없이 해주고 싶다면 import에서 html/template가 아니라 text/template로 변경해주면 된다. <br />

그리고 script 태그안에선 어떻게 출력이 되는지 확인해 보자 <br />

<code>tmplates/tmpl1.tmpl</code>에 script 태그를 추가해보자 <br />

``` HTML

  Name: {{.Name}}
  Email: {{.Email}}
  {{if .IsOld}}
  oldAge: {{.Age}}
  {{else}}
  Age: {{.Age}}
  {{end}}
  
  <a href="/user?email={{.Email}}">user</a>
  
  <script>
   var email={{.Email}}
   var name={{.Name}}
   var age={{.Age}}
  </script>

```

이렇게 수정 해준 뒤 확인해자 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93729348-15d90d80-fbff-11ea-954f-bb7ffd90ec97.png" width = 70%> </img></p>

특수문자 탈락없이 들어갔고, 중요한건 따옴표로 묶여있는데 따로 값에 따옴표를 넣지 않았지만 값이 String이기 때문에 String이 value일 경우 자동으로 따옴표를 묶어준다. <br />

<code>tmplates/tmpl2.tmpl</code>에 템플릿을 하나 더 추가해준다. <br />

``` Go

  <html>
  <head>
  <title>Template</title>
  </head>
  <body>
  {{template "tmpl1.tmpl" .}} // 1
  </body>
  </html>

```

1 :  "tmpl1.tmpl"를 포함시켜서 가져오는데 이 때 인스턴스는 자기가 받았던 것들 그대로 가져온다. <br />


그 후 <br />
<code>main.go</code>에서 코드를 수정해준다. <Br />

``` Go

  
  func main() {
    user := User{Name: "changbeom", Email: "changbeom@naver.com", Age: 23}
    user2 := User{Name: "aaa", Email: "aaa@gmail.com", Age: 40}

    tmpl, err := template.New("Tmpl1").ParseFiles("templates/tmpl1.tmpl", "templates/tmpl2.tmpl")

    if err != nil {
      panic(err)
    }

    tmpl.ExecuteTemplate(os.Stdout, "tmpl2.tmp", user)
    tmpl.ExecuteTemplate(os.Stdout, "tmpl2.tmp", user2)

  }

```
이 것을 실행해보면 <Br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93730117-32c31000-fc02-11ea-96fe-0da7a59ed93b.png" width = 70%> </img></p>

body내용이 include한 tmpl1내용이 오는것을 확인할 수 있다. <Br />

이런식으로 어떤 틀안에 틀을 만들어서 바뀌지 않는 부분은 tmpl2에, 바뀌는 부분은 tmpl1에 넣어서 사용 할 수 있다. <Br />

마지막으로 list로 넘길 때 어떻게 되는지 확인해보자! <Br />

<code>main.go</code>로 넘어와서 main 부분을 수정해준다. <Br />

``` Go
  
  package main

  import (
    "html/template"
    "os"
  )

  type User struct {
    Name  string
    Email string
    Age   int
  }

  func (u User) IsOld() bool {
    return u.Age > 30
  }

  func main() {
    user := User{Name: "changbeom", Email: "changbeom@naver.com", Age: 23}
    user2 := User{Name: "aaa", Email: "aaa@gmail.com", Age: 40}
    users := []User{user, user2}
    tmpl, err := template.New("Tmpl1").ParseFiles("templates/tmpl1.tmpl", "templates/tmpl2.tmpl")
    if err != nil {
      panic(err)
    }
    tmpl.ExecuteTemplate(os.Stdout, "tmpl2.tmpl", users)
  }

```
<code>tmplates/tmpl2.tmpl</code>도 아래와 같이 수정해준다. <br />

``` HTML

  <html>
  <head>
  <title>Template</title>
  </head>
  <body>
  {{range .}}
  {{template "tmpl1.tmpl" .}}
  {{end}}
  </body>
  </html>

```

여기서 range옆에 '.'과 template옆에 '.'은 다른 의미인데, range안에서의 인스턴스는 각 항목을 나타내는데, 그 각 항목별로 tmpl1.tmpl에 넣어주게 된다. <br />

이것을 실행하면 다음과 같다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93732491-905c5a00-fc0c-11ea-8aec-253fca1cc331.png" width = 70%> </img></p>


### 풀 소스

<code>main.go</code>
``` Go
  
  package main

  import (
    "html/template"
    "os"
  )

  type User struct {
    Name  string
    Email string
    Age   int
  }

  func (u User) IsOld() bool {
    return u.Age > 30
  }

  func main() {
    user := User{Name: "changbeom", Email: "changbeom@naver.com", Age: 23}
    user2 := User{Name: "aaa", Email: "aaa@gmail.com", Age: 40}
    users := []User{user, user2}
    tmpl, err := template.New("Tmpl1").ParseFiles("templates/tmpl1.tmpl", "templates/tmpl2.tmpl")
    if err != nil {
      panic(err)
    }
    tmpl.ExecuteTemplate(os.Stdout, "tmpl2.tmpl", users)
  }

```

<code>templates/tmpl1.tmpl</code>
  
``` HTML
  
    Name: {{.Name}}
    Email: {{.Email}}
    {{if .IsOld}}
    oldAge: {{.Age}}
    {{else}}
    Age: {{.Age}}
    {{end}}

    <a href="/user?email={{.Email}}">user</a>

    <script>
     var email={{.Email}}
     var name={{.Name}}
     var age={{.Age}}
    </script>

```

<code>templates/tmpl2.tmpl</code>

``` Go
    
  <html>
  <head>
  <title>Template</title>
  </head>
  <body>
  {{range .}}
  {{template "tmpl1.tmpl" .}}
  {{end}}
  </body>
  </html>

```
