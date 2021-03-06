### 시작
영어로는 Struct라고 쓰이는데 말 그대로 어떤 구조를 가진 것이라고 보면 된다. <Br />
예를 들면 이런 것이다.
``` Go
  
  type Person struct {
    name string
    age int
  }
  
```
이런식으로 여러가지 변수들을 하나로 묶어서 하나의 이름으로 말하는게 구조체라고 보면 된다. <br />
이것이 나온 이유는 프로그래밍이 발전된 과정을 보면 응집성(Cohesive)이 올라가고, 종속성(Dependency)이 낮아지는 방향으로 프로그래밍이 발전해 왔다고 보면 된다. <br />
이렇게 만들어야 좋은 프로그래밍을 할 수 있기 때문에 이런 방향으로 계속 발전해 왔다. <br />

그래서 이 Struct는 응집성을 높이는 방법이다. 어떤 결합된 개념들이 있는데 예를 들면 성적 처리 프로그램을 만든다 했을 때 중요한 객체는 학생이 되고, <br />
학생을 가지고 있는 정보들이 있고, 학생의 이름, 나이, 몇 반인지? 등등 이 학생을 포함하고 있는 여러 속성들이 있을 것이다. <br />

예를 들어 학생의 Struct를 만든다 하면 <br />
``` Go
  
  type Student struct {
    name string
    age int
    class int 
  }

```
이런식으로 하나로 묶어서 하나의 변수로 관리 할 수 있게 만들어 주는게 Struct라고 보면 된다. <br />

구조체를 선언하는 방법은 아까 썼듯이 <br />

``` Go
  
  type Person struct {
    name string
    age int
  }
  
```
'Type'은 어떤 타입을 선언한다는 의미이고, 이 타입은 Person이라는 이름을 가지며 구조체를 가지있다고 선언한다는 의미이고, 이 구조체에는 <br />
name이라는 string속성이 있고, age라는 int속성이 있는데 이것들을 묶어서 Person이라는 하나의 구조체를 만들었고, 이거는 새로운 타입이라는 얘기이다. <br />
그래서 이 Person을 사용할 때는 main함수에서 사용하고 싶을 때 그냥 일반적인 변수 선언하듯이 <br />
``` Go
  
  func main() {
    var p Person 
    
```
이렇게 쓰거나 <br />

``` Go
  
  func main() {
    p := Person {name:"김철수", 20}
    
```
선언 대입문을 써서 Person이란 타입을 만들고 이름은 "김철수", 나이는 20세로 넣을 수도 있다. <Br />

실제로 해보자. <br />

``` Go

  package main

  import "fmt"

  type Person struct {
    name string
    age  int
  }
  
  func main() {
    var p Person
    p1 := Person{"김철수", 15}
    p2 := Person{name:"홍길동",age:21}
    p3 := Person{name:"lala"}
    p4 := Person{}
    
    fmt. Println(p, p1, p2, p3, p4)
  }
  
  
```

기본 형태에서 struct를 만들어준다. 처음에 type이라고 적고, 그 다음에 struct이름을 Person이고, struct형태라고 선언해준다. <br />
거기안에 이름, 나이가 있다고 넣어주고, main함수에 이 struct를 선언 하는 방법은 다음과 같다. <br />
p1 변수처럼 추가를 해주어도 되고, p2변수 처럼 추가를 해주어도 되고, p3변수 처럼 하나만 하고 싶을 때 저렇게 해준다. p3에서 나이를 대입을 안해주었기 때문에 초기값인 0이 될 것이다. <br />
그리고 p4 처럼 아무것도 대입을 안해주면 이름에선 아무 문자열이 없는 초기값이 들어갈 것이고, 나이는 0이 들어가 있을 것이다. <br />
그래서 Println()으로 모두 출력시켜준다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/96970056-14786900-154e-11eb-9929-c269a5b40058.png" width = 70%> </img></p>

출력 값을 보면 P는 변수를 그냥 선언했고, 아무런 값을 주지 않았기 떄문에 초기값이 들어갔고, 마찬가지로 p1 ~ p4도 입력한대로 출력된 것을 확인 할 수 있다. <br />
각각의 속성들을 가져오는 방법은 변수뒤에 '.'을 찍으면 그 안에 있는 속성들을 가져 올 수 있다. 이 방법으로 p를 수정해주자! <br />

``` Go

  package main

  import "fmt"

  type Person struct {
    name string
    age  int
  }

  func main() {
    var p Person
    p1 := Person{"김철수", 15}
    p2 := Person{name: "홍길동", age: 21}
    p3 := Person{name: "lala"}
    p4 := Person{}

    fmt.Println(p, p1, p2, p3, p4)

    p.name = "Kevin"
    p.age = 22

    fmt.Println(p)
  }

```
p의 이름과 나이를 변경해주었다. 결과를 보자 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/96970626-f101ee00-154e-11eb-839e-8e09e474d798.png" width = 70%> </img></p>

정상적으로 p가 잘 바뀐것을 확인할 수 있다. <br />

이게 Sturct의 기본적인 내용이다. <br />

아까도 말했지만 Sturct는 어떤 개념을 한 곳에 모아 놨다고 보면 된다. 이것들 대부분을 '객체'라고 보면 되고, 객체를 하나 만들었다고 보면 된다. <br />
어떤 프로그램을 만들 때 ER다이어그램이라고 하는 그래프가 있는데 이것은 프로그램에 드러나는 객체들이 어떤 것들이 있는지 뽑고 그 각 객체들이 서로 어떤 상호작용을 하는지를 나타내는 형태의 그래프인데 <br />
이 그래프를 만들어 놓으면 프로그램 할 때 거기에 맞춰서 프로그램 하면 편하다. <br />

그래서 예를 들면 성적처리 프로그램을 만든다고 했을 때 객체를 뽑아보면 성적처리의 객체는 학생이 있을 것이고, 성적이 있을 것이고, 성적을 입력하는 사람인 선생님이라는 객체도 있을 것이다. <br />
이런 Entity를 뽑을 수 있고, 서로 간에 어떤 릴레이션이 있는지 간략하게 보자. <br />

``` Text

  선생님 -------> 학생의 성적
         (입력)
         
  학생 --------> 자신의 성적
         (조회) 

```

우선 선생님이 성적을 입력한다. 그리고 학생은 자신의 성적을 조회 할 수 있다. <br />
이런식으로 객체들 간에 릴레이션을 뽑고, 각 릴레이션을 정의 하는 다이어그램이 ER 다이어그램인데 이 프로그램을 말할 때 필요한 개체(Entity)들이 어떤 개체들이 필요하고, <br />
이 각 개체들간에 어떤 상호작용을 하는지를 파악할 수 있고, 그것들을 구현하면 그 자체가 성적처리 프로그램이 된다. <Br />

그래서이 객체들은 Struct로 표현 할 수 있는데 과거 C언어에서는 이 Struct가 말 그대로 구조만 가지고 있었다. 그러니까 학생인 Student라는 Struct가 있을 때 <br />
이 Student의 구조는 이름과 나이 같은 속성들만 가지고 있는데 현대 언어(Golang)에서는 Struct에다가 기능을 더했다. 이것을 **FirstClass** 라고 하는데 <br />
어떤 객체가 있을 때 이 객체가 단순히 속성만 가지고 있는게 아니라 기능(메소드)도 가지고 있는 걸 **FirstClass** 라고 한다. <Br />

그래서 Go언어의 Struct는 **FirstClass** 이다. 그래서 기능을 추가해보자! <Br />
Person이라는 Struct가 있는데 기능을 추가해볼 것인데 기능이라는 것은 다름이 아니라 function이다. 그래서 이 속성에 해당하는 function을 추가할 수 있다. <br />

``` Go

  package main

  import "fmt"

  type Person struct {
    name string
    age  int
  }
  
  func (p Person) PrintName() { // 1
    fmt.Print(p.name) // 2
  }

  func main() {
    var p Person
    p1 := Person{"김철수", 15}
    p2 := Person{name: "홍길동", age: 21}
    p3 := Person{name: "lala"}
    p4 := Person{}

    fmt.Println(p, p1, p2, p3, p4)

    p.name = "Kevin"
    p.age = 22

    fmt.Println(p)
    
    p.PrintName() // 3
  }

```
1 : 함수 이름이 나오기 전에 괄호안에 어떤 타입이 가지고 있는 function인지를 나타내준다. 그래서 Person이 가지고 있는 기능이라는 의미이다. <br />
    그리고 그 이름을 "PrintName"이라고 이름을 지어주고, 이 함수의 입력값은 없는 것으로 작성한다. <br />
2 : 그래서 이 함수의 역할은 p의 이름을 출력하는 함수가 된다.
그래서 Person이라는 객체에 이런 기능(메소드)을 추가 했다고 볼 수 있다. <br />

3 : 이 함수를 사용하는 방법은 다음과 같다. <Br />

그 후 실행 시켜 보면 맨 마지막에 "Kevin"이 뜨는 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/96973041-52778c00-1552-11eb-8d8d-73d558ee36d8.png" width = 70%> </img></p>

이제 성적처리프로그램을 만들것인데, 아까 ER다이어그램을 그렸듯이

``` Text

  학생 --------> 자신의 성적
         (조회) 
         
```
학생이 자신의 성적을 조회 하는데 여기서 '조회'는 기능 부분이 된다. 각 Struct간에 어떤 릴레이션을 기능으로 볼 수 있는데 메소드로 만들 수 있다. 이렇게 만들어보자!<Br />
``` Go

  package main

  import "fmt"

  type Student struct { // 1
    name string
    class  int

    grade Grade
  }

  type Grade struct { // 2
    name string
    grade string
  }
  
  func (s Student) ViewGrade() { // 3
    fmt.Println(s.grade)
  }
  
  func main() { // 4 
    var s Student
    s.name = "길동"
    s.class = 1
    
    s.grade.name = "과학"
    s.grade.grade = "C"
    
    s.ViewGrade()
  }

```

1 : 학생 Struct 선언. 이름과 반, 자신의 성적을 가지고 있다. <br />
2 : 점수 Struct 선언. 과목명, 과목 점수를 가지고 있다. <br />
3 : 성적을 조회하는 함수. <br />
4 : 다음과 같이 main함수에 각 형식에 맞게 데이터를 넣어준다. <br />

이제 출력시켜보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/96974261-f1e94e80-1553-11eb-8b25-f2d2097d3c1d.png" width = 70%> </img></p>
입력한대로 출력 되는 것을 확인 할 수 있다. <br />

다만 Student에서 알아야 할 것은 int, string은 Golang에서 자체로 지원하는 타입이고 Grade는 만든 타입이라는 점이다. <br />
그래서 Student는 grade라는 성적을 가지고 있고, ViewGrade이라는 메소드를 가지고 있다. <br />

이 Struct는 이 외에도 기능이 굉장히 많다. Golang에서 대응되는 것이 C#, Java, C++에서는 class와 같은 것이라고 보면 된다. <br />
이게 바로 객체지향 프로그램(OOP)의 가장 기본이 되는 개념이기 때문에 굉장히 중요하다. <br />

그리고 Golang에서 특이한게 메소드가 Struct안에서 정의 되는게 아니라 바깥에서 정의 되는 것이 다른 점이다. <br />
그리고 메소드라고 하지만 일반 함수와 같다. 그래서 어떻게도 표시 할 수 있냐면

``` Go
  
  func (s Student) ViewGrade() {
    fmt.Println(s.grade)
  }
  
  func ViewGrade(s Student) {
    fmt.Println(s.grade)
  }
  
  func main() {
    s.ViewGrade()
    ViewGrade(s)
  }
  
```
이렇게도 표현할 수 있다. 위의 것은 어떤 객체에 속한 메소드이고, 아래 것은 개체에 속하지 않는 그냥 함수인데 기능은 똑같다. <br />
호출하는 방법은 객체에 속한 메소드는 이렇게 s에 '.'을 찍고 호출해주고,  일반 함수는 입력값을 s로 집어넣으면 된다. <br />
출력해보면 다음과 같다.<br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/96975301-3f19f000-1555-11eb-9e72-f006c68612e8.png" width = 70%> </img></p>

한가지 주의할 점이 있는데 가령 Student에 성적을 입력하는 기능이 있다고 보자.  <br />

``` Go
    package main

    import "fmt"

    type Student struct { 
      name string
      class  int

      grade Grade
    }

    type Grade struct {
      name string
      grade string
    }

    func (s Student) ViewGrade() { 
      fmt.Println(s.grade)
    }
    
    func (s Student) InputGrade(name string, grade string) {
      s.grade.name = name
      s.grade.grade = grade
    }
  
    func ViewGrade(s Student) {
      fmt.Println(s.grade)
    }

    func main() { 
      var s Student
      s.name = "길동"
      s.class = 1

      s.grade.name = "과학"
      s.grade.grade = "C"

      s.ViewGrade()
      ViewGrade(s)
      
      s.InputGrade("수학", "A+")
      s.ViewGrade()
    }
  
```
이렇게 성적을 입력하는 함수를 만들고, s의 성적을 입력하고, s를 다시 출력시키면 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/96976135-6c1ad280-1556-11eb-9c28-07852ceafed6.png" width = 70%> </img></p>

분명히 "수학", "A+"로 입력을 했는데 출력 값은 "과학", "C"가 되었다. <br />

이게 중요한 문제인데 Golang에서 함수 호출의 변수는 무조건 무조건 복사로 일어난다. <br />
InputGrade()는 Student의 메소드이지만 그 안에 있는 함수의 입력값들이 모두 복사가 된다. 그래서 s Student도 복사가 되고, name string, grade string도 복사가 된다. <br />

가령 예를 들어서 
``` Go

  func Add(x, y int) {
  
  }
  
  func main() {
    a := 2 
    b := 3
    
    Add(a,b)
  }
  
```

Add라는 함수가 있고, 이 Add의 a,b를 호출하면 a라는 값이 복사되어 x는 2가 되고, y는 3이 되는데 <br />
main함수에 있는 a와 Add함수에 있는 x와 b와 y는 서로 다른 것이다. <br />

그렇기 때문에 여기서 

``` Go
    package main

    import "fmt"

    type Student struct { 
      name string
      class  int

      grade Grade
    }

    type Grade struct {
      name string
      grade string
    }

    func (s Student) ViewGrade() { 
      fmt.Println(s.grade)
    }
    
    func (s Student) InputGrade(name string, grade string) {
      s.grade.name = name
      s.grade.grade = grade
    }
    
    func InputGrade(s Student, name string, grade string) {
      s.grade.name = name
      s.grade.grade = grade
    }
  
    func ViewGrade(s Student) {
      fmt.Println(s.grade)
    }

    func main() { 
      var s Student
      s.name = "길동"
      s.class = 1

      s.grade.name = "과학"
      s.grade.grade = "C"

      s.ViewGrade()
      ViewGrade(s)
      
      s.InputGrade("수학", "A+")
      s.ViewGrade()
    }
      
  ```
  
<code> s.InputGrade("수학", "A+") </code> 이 부분의 s는 InputGrade 함수의(메소드지만) 입력값으로 처리가 되는 것이다. <br />
그래서 수학, A+은 InputGrade함수의 입력 값이된다. s, name, grade모두 입력값이 된다. <br />
그런식으로 봤을 때 이 값들은 복사되어 넘어가기 때문에 <code>s.InputGrade("수학", "A+")</code>의 s와 <code>InputGrade(s student, name string, grade string)</code>의 s는 서로 다른 값이다. <br />
서로 메모리 변수를 가지고 있다고 보면 되고, 서로 값만 복사되서 같을 뿐이지 서로 다르다. <br />
그래서 <code>InputGrade(s Student, name string, grade string)</code>의 과목명과 성적을 바꾼다 하더라도 실제 s의 name이 바뀌지 않는다. <br />

그래서 저것들 변경시키기 위해서는 포인터가 필요하다. <br />
함수 호출 과정에서는 무조건 복사로 일어난다는 것, 복사가 일어났을 때 값이 전달 되는 것이지 그 메모리가 그대로 전달되는 것이 아니라는 것이다. <br />
그래서 이것들을 해결하기 위해서는 '포인터'가 나온 것이다. <br />
