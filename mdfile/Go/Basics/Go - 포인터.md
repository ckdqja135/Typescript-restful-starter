### 시작
C#, Java는 포인터가 없지만 명시적으로 없을 뿐이지 묵시적으로 내부에선 포인터를 사용하고 있다. <br />
Golang은 포인터가 있다. 대부분 현대언어는 포인터가 없다. 이해하기 어려운 부분도 있고, 포인터 연산자체가 메모리를 직접 접근하기 때문에 위험하기 때문에 <br />
다른 언어들은 포인터를 감추어 내부에서만 사용하고 있다. 포인터를 감추다보니 다른 언어에서는 또 다른 문제들이 생겨나게 되었다. <br />
내부 기능을 이해하기 어려운 부분도 있고, 이 타입이 Pointer타입인지, Value타입인지를 명시적으로 나와 있지 않다 보니까 프로그래머가 알고 있어야 되는데 <br />
그것을 잘 모르고 사용하면 문제가 되는 케이스가 발생하게 된다. <br />

그 반면에 C, C++은 포인터를 가지고 있다. 그런데 포인터의 연산이나 단순히 포인터가 주소 참조 뿐만 아니라 연산이나 형변환 등을 이용해서 굉장히 어려운 문제들이 생겨난다. <br />
그래서 처음에 C나 C++을 배우게 될 때 시험문제를 내주는 사람이 아주 까다롭게 내기 좋은게 포인터였다. (문제를 위한 문제같은....) <br />
그래서 실제로 개발하면서 별로 사용되지 않는 것들이 문제로 나오는 경우들이 많다. <br />

가령 예를 들면

``` C
  
  int * p = 0x0001;
  p += 0x10;
  *p = 1000;
  *((char *)p) = ?
  
```

이런 문제들을 묻는 경우들의 문제를 내기 좋은게 포인터이다. <br />

그래서 이렇게 생겨도 문제, 안생겨도 문제가 생겼는데 Golang은 조금 심플하게 접근을 하였다. <br />
Pointer라는게 어쨌든 존재하는 것이고, 명시적이든, 묵시적이든 개발자가 알아야 되는 것이라면 명시적으로 꺼내 놓았고, 대신 기존 C, C++에서 있었던 연산이나 Casting을 막았다. <br />
직관적으로 심플하고, 명확하게 사용하자는게 Golang의 포인터의 목적이다. <br />

이제 코드로 예제를 살펴보자! <br />

``` Go

  package main

  import "fmt"

  func main() {
    var a int
    var p *int

    p = &a
    a = 3
    
	  fmt.Println(a)
    fmt.Println(p)
  }

```
포인터도 하나의 형태의 타입이기 때문에 <code>*int</code>로 사용해야 하고, <br />
p는 a의 메모리 주소를 가지기 때문에 <code>p = &a</code>로 해야 하는데 <code>p = a</code>로 하면 <br />
**cannot use a (type int) as type *int in assignment**라는 에러가 난다. <br />
해석하면 포인터 타입에 int타입 값을 넣을 수 없다는 의미이다. <br />

이 상태에서 값이 어떻게 나오는지 확인해보자.

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97066655-011ed980-15f2-11eb-9a54-5ffea35f7622.png" width = 70%> </img></p>

3과 a값의 주소 값이 나온다. <br />
p의 메모리 주소가 실제 값을 나타내기 위해서는 


``` Go

  package main

  import "fmt"

  func main() {
    var a int
    var p *int

    p = &a
    a = 3

    fmt.Println(a)
    fmt.Println(p)
    fmt.Println(*p)
  }

```
이렇게 수정해주면 된다. 그 후 출력시키게 되면 다음과 같다.<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97066688-4c38ec80-15f2-11eb-99cd-035eb3b8fd05.png" width = 70%> </img></p>

여기에 변수를 더 추가해서 실행해보자! <br />
``` Go

  package main

  import "fmt"

  func main() {
    var a int
		var b int
    var p *int

    p = &a
    a = 3
		b = 2
	
    fmt.Println(a) // a의 값
    fmt.Println(p) // a의 메모리 주소
    fmt.Println(*p) // p의 메모리주소가 가르키는 메모리의 값
	
		p = &b
		fmt.Println(b)
    fmt.Println(p)
    fmt.Println(*p)
  }

```

이런식으로 수정 해준 뒤 실행해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97125137-40763300-1776-11eb-86f7-a2d128ce577e.png" width = 70%> </img></p>

위에서 찍힌 a의 메모리 주소와 아래에 찍힌 b의 메모리 주소는 서로 다른 것을 볼 수 있다. <Br />

다시 자세히 설명을 하자면 <br />

``` Go

	a := 3
	b := 2
	p *int
	
	p = &a // p == 0xc0000a2058(a의 주소) / *p == 3
	p = &b // p == 0xc0000a2070(b의 주소) / *p == 2
```

a가 있고, b가 있을 때 a와 b의 메모리가 어딘가에 있을 것이다. <br />
그리고 int형 포인터 p가 추가 되어 p의 메모리도 어딘가에 있을 것인데 <br />
p의 값은 a의 주소가 된다. 이 때 a의 주소가 p의 변수의 값으로 쓰이게 된다. <br/ >
그랬을 때 p의 메모리 수가 가리키는 값을 가져오면 3이 나오게 되고 <br />
p에 b의 주소를 넣게 되면 기존에 있던 값은 지워지게 되고, b의 주소가 p에 다시 쓰여지게 되며 이런게 바로 포인터라고 한다. <br />

그래서 이 포인터를 어떻게 쓰고, 왜 포인터가 필요하냐면 Struct를 function의 인자를 보냈을 때 그 값을 변경해도 변경되지 않는다. 는 점 때문인데 <br />
왜 쓰는지 살펴보자면 <br />

``` Go
  package main

  import "fmt"

  func main() {
    var a int
		a = 1
		
		Increase(a)
		fmt.Println(a)
  }
  
  func Increase(x int) {
		x++
	}

```
a의 값을 1로 설정하고, int형 변수를 받는 Increase()라는 함수가 있고, 이 함수가 하는 일은 단순하게 x를 1증가시켜주는 함수인데 여기에 a를 넣고, a의 값을 출력시키게 되면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97126324-e11a2200-1779-11eb-86e2-c7545ce5cc02.png" width = 70%> </img></p>
a의 값은 1이 출력 되는 것을 확인 할 수 있다. 증가가 되지 않았다는 것인데 <br />
이 이유는 실제로 이 함수의 x라는 변수와 a라는 변수는 서로 다른 메모리 공간에 존재하는 변수이다. 그런데 이 함수를 호출 할 때 이 a의 값인 1을 x에 그냥 복사한 것 뿐이다. <br />
그래서 x의 값도 1이 되지만 이 둘은 서로 다른 변수라는 것이다. 서로 다른 메모리 주소를 가지고 있는 다른 변수이기 때문에 Increase()에서 1을 증가시켜도 <br />
이 a는 증가되지 않게 되는 것이다. 그래서 출력시켰을 때 x는 2겠지만 여전히 a는 1인 것이다. <br />
x라는 변수의 생명 주기는 <br />
``` Go

  func Increase(x int) {
		x++
	}
	
```
여기에 있는 중괄호까지이다. 그 중괄호를 벗어나면 더 이상 쓸모 없기 때문에 x는 사라지게 된다. <br />
그래서 남게 되는건 처음에 있었던 a만 있게 되어 값의 변화가 없게 된다. <br />

그런데 이거를 다르게 써보자. x가 int형 포인터라고 가정하고, 그랬을 때 x값은 x에 메모리 주소에 나타내는 값 +1 이라고 해보자 <br />

``` Go
  package main

  import "fmt"

  func main() {
    var a int
		a = 1
		
		Increase(&a)
		fmt.Println(a)
  }
  
  func Increase(x *int) {
		*x++
	}

```
그러니까 x의 x가 가지고 있는 값은 메모리 주소인데 그 메모리 주소가 가리키는 메모리의 값은 그 메모리 주소가 가르키는 주소의 값(원래 있던 값)에다가 1을 더한 값을 다시 대입한다. <br />
그랬을 때 a의 값을 넘기는게 아니라 a의 주소값을 넘겨야한다. <br />
이 후 실행해보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97127426-ea58be00-177c-11eb-8fab-2989729194b3.png" width = 70%> </img></p>
아까는 1이 출력되었는데 지금은 2가 출력되는 것을 확인할 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97128997-22fa9680-1781-11eb-83e6-d85a53532d64.png" width = 70%> </img></p>
Increase()함수를 호출 할 때 a의 주소를 넘겼는데 이 주소값은 0xC01...이라고 가정했을 때 이 메모리 값이 x에 복사가 되는 것이다. <br />
x는 역시 변수니까 어딘가에 x를 위한 메모리 공간이 있을 것이다. <br />
이 타입이 int형 포인터 일 뿐이다. 그랬을 때 그 값은 이 인자값이 그대로 복사해서 x에 들어 갈 것이다. <br />
x의 메모리 주소값이 가리키고 있는 값은 x의 메모리 주소값이 가리키고 있는 값 +1이다. <br />
그러니까 여기에 갈 주소가 가리키고 있는 곳에 값은 여기에 그러니까 여기에 갈 주소가 가리키고 있는 곳에 값에 1을 더한 값이다. <br />
a는 1이니까 하나를 더해서 2가 되는 것이다. 그래서 x의 값이 바뀌는게 아니라 a의 값이 변하게 된다.<br />

이게 포인터의 역할이다. 가장 중요한 역할이자, 포인터가 필요한 이유이다. <br />

``` Go

	package main

	import "fmt"

	type Student struct {
		name string
		age  int

		class string
		grade string
	}

	func (s Student) ViewGrade() {
		fmt.Println(s.class, s.grade)
	}

	func (s Student) InputGrade(name string, grade string) {
		s.name = name
		s.grade = grade
	}

	func main() {
		var s Student = Student{name: "Chulsu", age: 23, class: "Science", grade: "A+"}

		s.InputGrade("Math", "C")
		s.ViewGrade()
	}

```
저번에 했었던 내용을 다시 보면 저번에 Student라는 Struct을 만들고, <br />
그 안에 이름과 나이를 넣어주고, 이번에는 여기 안에 성적과 과목을 적어서 속성들을 만들어준다. <br />

그리고 여기에 s라는 Student를 받아서 성적을 출력해주는 기능도 만들었었고, 성적을 입력하는 기능도 추가했었다. <br />
그 후 InputGrade()를 통해 성적을 다시 재조정해서 출력을 했을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97130010-99989380-1783-11eb-85ff-a0e342878be1.png" width = 70%> </img></p>
위와 같이 나온 것을 확인할 수 있다. <br />

<code>s.InputGrade("Math", "C")</code> 부분이 적용이 안된 것을 알 수 있다. <br />
이것도 마찬가지로 함수에서 그냥 s를 받을게 아니라 <br />

``` Go

	func (s *Student) ViewGrade() {
		fmt.Println(s.class, s.grade)
	}

	func (s *Student) InputGrade(name string, grade string) {
		s.name = name
		s.grade = grade
	}
	
```
이렇게 포인터 형태로 s를 받으면 문제가 해결된다. <br />
이렇게 바꾸고 다시 실행시켜보자! <br />

``` Go

	package main

	import "fmt"

	type Student struct {
		name string
		age  int

		class string
		grade string
	}

	func (s *Student) ViewGrade() {
		fmt.Println(s.class, s.grade)
	}

	func (s *Student) InputGrade(class string, grade string) {
		s.class = class
		s.grade = grade
	}

	func main() {
		var s Student = Student{name: "Chulsu", age: 23, class: "Science", grade: "A+"}

		s.InputGrade("Math", "C")
		s.ViewGrade()
	}

```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97130634-4e7f8000-1785-11eb-9c74-c98b8318203e.png" width = 70%> </img></p>
위와 같이 결과가 바뀐것을 알 수 있다. <br />

달라진건 저 함수에 <code>*</code> 하나 추가가 되었을 뿐인데 결과는 완전히 달라졌다. <br />

그래서 요약하자면 포인터를 함수 인자로 받으면 메모리주소만 복사되고, 값을 함수 인자로 받으면 전체의 속성(이 속성이 Struct 타입이면 그 Struct의 모든 속성이)이 복사 된다. <br />
이 둘은 서로 다른 메모리를 가리키고 있기 때문에(메모리 변수기 때문에) 여기서 값을 변경해도 원래 호출 했던 값(Original값)은 변경되지 않지만 <br />
포인터로 호출하면 그게 같은 메모리 주소를 가리키고 있는 포인터이기 때문에 변경을 했을 때 Original값도 변경이 된다. 라고 기억하면 된다. <br />

