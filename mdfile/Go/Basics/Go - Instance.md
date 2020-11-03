## 시작
Slice를 확장해서 Instance에 대해 알아보자 <br />
Struct의 복사에 대해 알아 봤었었는데 예를 들어 Student라는 struct가 있다 가정하에 <br />

``` Go
type Student struct {
  name string
  age int
  grade int
}
```
 
이렇게 구성되어 있는게 Student일 때 이것이 복사가 된다 했는데 a라는 애를 만들어서 name이 "aaa", age가 20, grade가 10일 때 마찬가지로 메모리 공간에 a라는 애가 있을 것이다. <br />
그런데 이 때 <code>b = a</code>를 해버리게 되면 b라는 공간을 만들어서 a의 값을 복사하게 된다. <br />

코드 상으로 보겠다. <br />

``` Go
  package main

  type Student struct {
    name string
    age int
    grade int
  }

  func main() {
    a := Student{"aaa", 20, 10}

    b := a

    b.age = 30

    fmt.Println(a)
    fmt.Println(a)
  } 
```

이렇게 b에 a값을 복사한 뒤에 b의 age값을 30으로 두었을 때 어떻게 출력이 되는지 확인해보자 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97522424-12e1f180-19e3-11eb-9bc9-836f70a3029f.png" width = 70%> </img></p>

첫번째 a는 여전히 name이aaa, age가20 grade가 10인데 b는 name이 aaa, age가 30 grade가 10인 것을 알 수 있다. 어떻게 보면 당연한 것이다. <br />
이렇게 a는 변하지 않고 b만 바뀌는 이런 것을 값 형태로 구분 된다해서 Value type이라 한다. <br />

이번에는 값이 아니라 a의 주소를 b에 복사해보자 <br />

``` Go
package main

import "fmt"

type Student struct {
	name  string
	age   int
	grade int
}

func main() {
	a := Student{"aaa", 20, 10}

	var b *Student
	b = &a

	b.age = 30

	fmt.Println(a)
	fmt.Println(a)
}
```

b는 타입이 Student의 포인터 타입으로 해놓고, a의 주소를 b에 넣어주고, b의 age를 30으로 바꾸어 주었을 때 어떻게 되는지 보자 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97523643-22af0500-19e6-11eb-9652-5ce9c6e42573.png" width = 70%> </img></p>
a의 나이가 바뀌었다. 포인터 부분을 알고 있다면 당연하게 받아드려질 것이다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97523221-0494d500-19e5-11eb-8c8b-656faa1785fa.png" width = 70%> </img></p>
이 부분을 좀 더 살펴보면 저 과정들을 보면 메모리가 있고, 메모리 안에 a가 있다. a안에는 <code>{"aaa", 20, 10}</code> 값들이 있을 것이다. <br />
b는 a의 주소를 값으로 갖는데, b의 타입은 Student의 포인터 타입이다. 그 말은 Student변수의 주소를 값으로 갖는 것인데, <br />
가령 a의 주소가 0x000108일 때 b도 마찬가지로 0x000108을 값으로 갖는 것이다. <br />

그러면 컴퓨터 입장에서는 그냥 숫자가 카피되는 것일 뿐이지만 개발자 입장에서는 b가 a를 가리키고 있다.라고 말을 한다. 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97523541-ec718580-19e5-11eb-9b1b-53a7c741c20c.png" width = 70%> </img></p>
그래서 b의 age를 바꾸면 b가 가리키고 있는 age를 30으로 바꾸겠다는 의미이다. 그래서 a의 변수의 값도 바뀌게 되는 것이다. <br />

이렇게 포인팅하고 있는 형태에서 쓰는 것을 **Reference(참조하고 있다.)** 라고 표현 한다. <br />
그래서 이것을 **b가 a를 참조하고 있다**, 또는 **Reference type형태로 쓰고 있다.** 라고 말을 한다. <br />

또 하나 예를 들어보자 SetName이라는 함수가 있어서 Student를 받아서 새로운 이름을 받아서 새로운 이름을 바꾸는 함수가 있다고 가정해보자 <br />

``` Go
	package main

	import "fmt"

	type Student struct {
		name  string
		age   int
		grade int
	}

	func SetName(t Student, newName string) {
		t.name = newName
	}

	func main() {
		a := Student{"aaa", 20, 10}

		SetName(a, "bbb")
		fmt.Println(a)
	}
```

그 함수를 사용하여 a의 이름을 bbb로 변경했을 때 어떻게 출력이 되는지 확인해보자 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97528161-5f7ff980-19f0-11eb-9152-39a1c5f265ad.png" width = 70%> </img></p>
SetName으로 호출해서 이름을 넘겼는데 이름이 변경되지 않은 상태에서 나왔다. 당연히 포인터를 쓰지 않았기 때문에 발생한 일이다. <br />
그래서 포인터 형태로 바꾸어서 실행을 시켜보면 <br />

``` Go
	package main

	import "fmt"

	type Student struct {
		name  string
		age   int
		grade int
	}

	func SetName(t *Student, newName string) {
		t.name = newName
	}

	func main() {
		a := Student{"aaa", 20, 10}

		SetName(&a, "bbb")
		fmt.Println(a)
	}
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97528337-d2897000-19f0-11eb-9b0a-57a54ac6b693.png" width = 70%> </img></p>
정상적으로 바뀐것을 볼 수 있다. <br />

다시 한번 정리하면 값 형태로 넘기는 걸 **Value type(값 타입)** 이라고 하고, 위와 같이 포인터로 넘기는 것을 **Reference Type(참조 타입)** 이라고 한다. <br />
값 타입으로 넘기면 해당 struct의 모든 값들이 다 복사 되는 것이고, 참조 타입으로 넘기면 해당 struct의 요소들이 복사되는게 아니라 메모리 주소가 복사가 된다. <br />
컴퓨터 입장에선 결국엔 다 복사인데 중요한 건 메모리 주소가 복사가 될 것이냐? 요소(Property)가 복사 될 것이냐의 차이이다. <br />
그래서 값 타입과 참조 타입을 넘기는 방식을 잘 이해해야 한다. <br />

## 그러면 이제 Instance 라는 것은 무엇인가 알아보자
Struct를 얘기한 다음에 Method를 얘기했다. Golang에서 Struct는 어떤 Property만 가지고 있는 게 아니라 어떤 **개체(Entity)** 또는 **객체(Object)** 가 될 수 있다. <br />
**객체(Object)** 라는 것은 Property와 Method를 가지고 있는 것이므로 객체(Object)가 될 수 있다는 것은 Method를 가지고 있다는 얘기이다. <br />

그래서 코드로 넘어오면 <br />

``` Go
	type Student struct {
		name  string
		age   int
		grade int
	}

	func SetName(t *Student, newName string) {
		t.name = newName
	}
```

Student라는 struct를 가지고 있고, SetName이 있는데 이걸 Method로 바꾸어 버리면 

``` Go
	type Student struct {
		name  string
		age   int
		grade int
	}

	func (t *Student) SetName(newName string) {
		t.name = newName
	}
```

이렇게 바꾸면 그냥 메소드가 되는 것이다. 그래서 이렇게 하면 메소드의 형태의 표현이 되는 것이고 <br />

``` Go
	func SetName(t *Student, newName string) {
		t.name = newName
	}
```

로 하면 일반 함수의 형태가 된다. 저번에도 말했듯이 함수와 메소드는 완전히 똑같은데 다만 앞에 인자에 어떤 것에 속해있는 함수인지를 표시하기 위해 첫번째 인자(Argument)값이 앞으로 오는 것만 다르다. <br />

이제 SetName은 어떤 객체(Object)에 속해 있는 함수인데 Student의 포인트 타입에 속해있는 함수다. 라는 표시가 된다. <br />
이제 main()부분도 변경시켜주자! <br />

``` Go
	package main

	import "fmt"

	type Student struct {
		name  string
		age   int
		grade int
	}

	func (t *Student) SetName(newName string) {
		t.name = newName
	}

	func main() {
		a := Student{"aaa", 20, 10}

		a.SetName("bbb")
		fmt.Println(a)
	}
```

이렇게 메소드 형태의 표현으로 변경시켜주면 된다. <br />

누누이 강조하지만 컴퓨터 입장에서는 일반함수 형태로 쓰는지, 메소드 형태로 쓰는지 아무런 차이가 없다. <br />
하지만 개발자 입장에서는 엄청난 차이가 생기는데 객체단위로 볼거냐? 기능단위로 볼거냐?(또는 프로시져 형태로 볼거냐?)의 차이가 생긴다. <br />

이는 OOP방식과 프로시저방식을 알아두면 좋은데 프로시저방식으로 개발 했었을 때는 어떤 절차가 중요했다. 그래서 순서도를 그리고 A가 이걸하고, B가 이걸하는 등의 식의 절차가 중요했는데 <br />
그런데 프로그램이 복잡해지다보니 유지보수하기가 힘들어졌다. 그래서 OOP로 넘어갔다. <br /> 
OOP는 절차보다 Object가 중요하다라는 것이다. Object는 아까 말했듯이 Property와 Method를 가지고 있는 것이다. <br />
이제 Object가 되면서 Subject(주어)와 Verb(어떤 관계)가 생기기 시작했다. 그래서 <br />

``` Text
Subject  Verb   Object
 주어 	  관계   목적어 
``` 

의 형태가 되면서 주어와 목적어 사이에 어떤 관계를 나타낼 수 있게 되었다. <br />

그래서 OOP로 넘어가서 성적처리 프로그램을 만들게 되면 Teacher가 성적을 Input 한다. 누구의 성적을 ? Student의 성적을. <br />

``` Text
Teacher Input Student
```

기존의 프로시저 방식은 기능이 먼저 왔다. 그래서 Input이 먼저 와서 기능위주로 구현을 했고, 인자로 Teachuer와 Student가 왔다면 <br />

``` Go
Input(Teacher, Student)
```

OOP 방식은 주어가 먼저 나타나기 시작했다 누가 할 것이냐? 주체가 누구냐?가 중요해졌다. 그래서 여기선 Teacher가 주체가 되고, 그 다음 '.'을 찍고 무엇을 할거냐?, 어떤 메소드를 호출할거냐에 대한 관계가 표현이 되었고 <br />
무엇과 관계를 맺을거냐?에 대한 Object로 표현된다. <br />

``` Text
Teacher.Input(Student)
 주체    관계   목적어(누구와 관계를 맺을 것인가?)
```

Subject도 Object이기 때문에 Object와 Object간의 관계를 나타낼 수 있게 되었다. <br />

기존 프로시져에서는 기능이 중요했고, 기능간에 어떤 순서를 나타내는게 중요했다면 OOP로 넘어오면서 이제는 기능이 아니라 Object와 Object간의 관계가 중요하더라.라는 형태로 가는 것이다. <br />

그래서 이것을 ER(Entity - Relationship) (Entity는 Object라 봐도 된다.) 이게 중요하게 되었다. 어떤 Entity간에 어떤 Relationship을 갖느냐? 이걸 정의 하는게 프로그래밍이 다다. 라고 하는 게 OOP다. <br />

그래서 아까 코드를 보면 <code>a.SetName("bbb")</code> 형태가 같은데 <br />

``` Go
	a.           SetName          ("bbb")
어떤 서브젝트가 어떤 메소드를    무엇과 할 것인가?
```

가 되는 것이다. 그래서 표현의 방식만 다를 뿐이지 컴퓨터 입장에서는 똑같지만 이제는 '주체'가 나타나기 시작한다. <br />
어떤 주어가 나타나기 시작했는데 그래서 이 주어를 무엇이라 할 것인가?  <code>a.SetName("bbb")</code>에서 <code>a.</code>를 Instance, 어떤 객체 라고 한다. <br />

Instance라는 것은 생명주기의 표현이라 보면 된다. <Br />
그래서 이 <code>a.</code>게 하나의 생명을 가지게 되는 것이다. 이거는 어디까지나 개발자 입장에서 그렇다는 것이다. 컴퓨터 입장에서는 별 차이, 의미가 없다. <br />
그렇지만 개발자 입장에서 <code>a.</code>라는 것에다 어떤 생명을 부여하고, 그것을 Instance라고 부르자고 하는 것이다. <Br />
단순하게 보면 포인터 형태의 Struct라고 봐도 무방하다. <br />

예를 들어보자 코드로 넘어와서 a를 만들 때 <br />

``` Go
a := Student{"aaa", 20, 10}
```

이렇게 값 형태로 만들 수 있지만 포인터 형태로도 만들 수 있다.<br />

``` Go
	func main() {
		var a *Studnet
		a = &Student{"aaa", 20, 10}
		a.SetName("bbb")
	}
```

그래서 a에 이렇게 새로운 Student객체를 만든 다음에 그거의 주소를 a에 복사하는 것이다. <br />
그리고 a의 SetName에서 bbb가 되었다. <br />
이제 또 다른 메소드를 하나 더 만들어서 Student 포인터 형태로 SetAge()를 만들어보자 <br />
``` Go
	package main

	import "fmt"

	type Student struct {
		name  string
		age   int
		grade int
	}

	func (t *Student) SetName(newName string) {
		t.name = newName
	}

	func (t *Student) SetAge(age int) {
		t.age = age
	}

	func main() {
		var a *Studnet
		a = &Student{"aaa", 20, 10

		a.SetName("bbb")
		a.SetAge(30)
		fmt.Println(a)
	}
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97531564-c6ed7780-19f7-11eb-8f94-38771857199b.png" width = 70%> </img></p>
그렇게 하면 a의 age가 바뀌는 것을 알 수 있다. <br />

이번에는 PrintStudnet()라는 함수를 추가해보자. <br />
``` Go
package main

import "fmt"

type Student struct {
	name  string
	age   int
	grade int
}

func (t *Student) SetName(newName string) {
	t.name = newName
}

func (t *Student) SetAge(age int) {
	t.age = age
}

func printStudent(u *Student) {
	fmt.Println(u)
}

func main() {
	a := Student{"aaa", 20, 10}

	a.SetName("bbb")
	a.SetAge(30)
	printStudent(&a)
}
```

가령 이렇게 PrintStudent()라는 함수가 있다 가정하고, 이 함수의 인자로 Student의 포인터를 받았다 했을 때 <br />
이 u를 Student의 포인터 타입인데 메모리 주소가 왔다 갔다 하는 것이다. 그래서 a의 메모리 주소가 u에 가서 u를 출력하는 것인데 <br />
일반 프로그램에서는 a의 인스턴스를 PrintStudent()인자로 넘겼다고 말을 할 수 있다. <br />

그래서 인스턴스라는 것은 추상적인 개념이기 때문에 어떤 실제, 물리적으로 나타내는 게 아니라 추상적으로 어떤 생명이 살아움직였을 때, 객체의 생명체로써 나타낼 때 인스턴스라고 말을 한다. <br />

그래서 인스턴스라는 것은 어떤 생명체로써 나타내는 추상적인 개념이라 보면 되고, 단순하게 보면 어떤 Struct의 포인터 타입(* Struct)이다.라고 볼 수 있다. <br />
