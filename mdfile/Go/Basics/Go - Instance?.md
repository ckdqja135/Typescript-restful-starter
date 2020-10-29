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
