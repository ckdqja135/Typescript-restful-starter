## 시작
지난 시간에 이어서 Interface에 대해 이어 나가보자. <br />

지난 시간에 얘기했던 것을 정리해보면 OOP에서 Objcet란 상태와 기능을 합한거라고 했고, 이 기능을 외부에 공개된 공개기능, 외부에 공개되지 않은 내부기능 이 있다고 했다. <br />
외부 기능은 외부와 통신하는 기능이기 때문에 외부 Obejct와의 관계로 볼 수 있다. <br />
이 관계를 따로 정의 해놓은 것이 Interface라고 했다. 그래서 이 관계를 따로 Interface에서 정의할 수 있기 때문에 Object에세 관계의 종속성을 끊었고, <br />
이렇게 독립 시켜 놓았기 때문에 관계만 포함하고 있으면 ObjectA든 ObjectB이든 상관 없이 사용할 수 있고, 확장성이 생기게 되었고, OOP에서 가장 중요한 것이 확장성이며 이게 Interface의 목적이라고 얘기를 했었다. <br />

저번시간엔 Interface의 이론적인 부분을 설명했다면 지금은 문법적인 얘기를 해보자! <br />

저번에 Interface를 선언하는 방법은 <br />

``` Go
type Jam interface {
  이름(입력타입) 출력타입
  이름(입력타입) 출력타입
}
```

type 쓰고, 이름쓰고, 그 안에 관계인 외부 기능을 넣어주었다. <br />
위와 같이 여러개의 관계를 선언 해줄 수 도 있다. <br />

여기서 중요한게 Golang의 특징이 있는데 Golang은 DuckTyping이라고 한다. <br />
이게 C#, JAVA, C++과 다른 점이다. 이 말은 Duck이 오리를 뜻하는데 오리처럼 소리내고, 오리처럼 걷고, 오리처럼 헤엄치면 그건 오리다. 라는 것이다. <br />
그러니까 어떤 것이 있는데 그것이 오리라는 꼬리표를 달지 않아도 오리처럼 소리내고, 오리처럼 걷고, 오리처럼 헤엄치면 그건 오리다. 라는 것이다. <br />

예를 들어 C#의 Class를 선언할 때(Class와 Object는 같은거라고 보면된다.) 어떤 Class에 Interface를 구현하겠다고 한다면 선언부분에 Interface를 적어주어야 한다. <br />

``` C#
Class A : interfaceA
```

이는 JAVA도 마찬가지이다. <br />

``` Java
Class B implements interfaceB
```
그래야 컴파일러가 B Class는 interfaceB를 구현하고 있다는 것을 알게 되고, interfaceB를 쓰는 곳에 B의 객체의 인스턴스를 대입할 수 있게 된다. <br />

Golang은 이러한 선언이 필요 없다. 우리가 StrawberryJam을 만들었는데 이게 Jam이라는 Interface를 확장했다고 알려주지 않아도 이 객체가 가지고 있는 기능에 GetOneSpoon이라는 기능(행동방식)이 있기 때문에 이건 Jam의 Interface를 구현 한 것이다 라고 볼 수 있다. <br />
오리를 오리라고 정의하지 않아도 오리처럼 소리내고, 오리처럼 걷고, 오리처럼 헤엄치면 그건 오리다. 라는 것이 이 뜻이다. <br />

DuckTyping은 요즘에 나온 언어들이 지원을 하는데 Golang, Python등의 언어가 그 예이다. <br />

이제 예제를 하나 만들어보자! interface라는 폴더안에 main.go, interfaceA.go를 만들어 준다. <br />

<code>interface/interfaceA</code>
``` Go
package main

type InterfaceA interface {
	AAA(int) int
	BBB(int) string
}
```

이 안에 InterfaceA라는 interface를 정의해주고, 이 interface의 관계는 AAA라는 int를 받아서 int를 반환하는 관계와 BBB라는 int를 받아서 string 반환하는 관계가 있다고 쳐보자. <br />

main.go로 넘어와서 <br />

``` Go
package main

type StructA struct {

}

func (a * StructA) AAA(x int) int {
	return x*x
}

func (a *StructA) BBB(x int) string {
	return "X= " + strconv.Itoa(x)
}

func main() {

}
```

AAA와 BBB를 정의해주는데 AAA는 제곱을 해주는 함수, BBB는 int형을 string으로 바꿔주는 함수로 만들어 준다. <br />

그 다음 <br />

``` Go
func main() {
	var c InterfaceA
	c = &StructA{}

	fmt.Println(c.BBB(3))
}
```
InterfaceA를 타입으로 갖는 c를 선언하고, c에 structA라는 인스턴스 포인터를 대입해서 출력시켜보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/105437847-2da3c980-5ca5-11eb-8b59-5653d65032ef.png" width = 70%> </img></p>
X=3이 출력되는 단순한 프로그램인데 c는 InterfaceA 타입이지 StructA타입이 아니다. InterfaceA라는 것은 interfaceA.go라는 파일에 정의 되어 있다. <br />
그리고 Interface라는 것은 AAAA와 BBB라는 관계를 가지고 있는데 이 관계들이 어떤 기능을 하는지는 interface가 관심이 없다. 단순히 그 인스턴스가 이 두 관계를 가지고 있냐 없냐만 본다. <br />

그래서 StructA는 AAA와 BBB를 가지고 있기 때문에 대입이 되는 것이다. <br />

만약에 StructB가 있다 가정하고, AAA를 만들어서 main()에 사용해보자 <br />

``` Go
type StructB struct {
}

func (b *StructB) AAA(x int) int {
	return x * 2
}

func (a *StructA) AAA(x int) int {
	return x * x
}

func (a *StructA) BBB(x int) string {
	return "X= " + strconv.Itoa(x)
}

func main() {
	var c InterfaceA
	c = &StructA{}

	var d InterfaceA
	d = &StructB{}
	fmt.Println(c.BBB(3))
}
```

이런식으로 사용하면 `d = &StructB{}`부분에 컴파일러 에러가 뜨게 되는데 <br />

``` Text
cannot use &StructB literal (type *StructB) as type InterfaceA in assignment:
	*StructB does not implement InterfaceA (missing BBB method)
```

위와 같은 문구가 뜨게 된다. <br />

StructB는 InterfaceA를 구현하고 있지 않는다는 의미인데 그 이유는  AAA메소드는 있지만 InterfaceA에 정의된 BBB메소드가 없기 때문에 StructB는 InterfaceA와 같은 관계를 가지고 있지 않게 되는 것이다. <br />

이번에는 StructA로 만들어서 대입을 하면<br />

``` Go
func main() {
	var c InterfaceA
	c = StructA{}

	fmt.Println(c.BBB(3))
}
``` 

아래와 같은 문구가 뜨게 된다. <br />

``` Text
cannot use StructA literal (type StructA) as type InterfaceA in assignment:
	StructA does not implement InterfaceA (AAA method has pointer receiver)
```

StructA는 InterfaceA를 implement하지 않았다고 써 있는데 <br />
Golang에서는 포인터 타입과 값 타입과는 엄연히 다른 타입이다. <br />

예를 들어 <br />

``` Go
var s *StructA
var t StructA
```

가 있다고 했을 때 이 둘은 엄연히 서로 다른 타입이다. <br />
메소드도 다르다. <br />

``` Go
func (a *StructA) AAA(x int) int {
	return x * x
}

func (a *StructA) BBB(x int) string {
	return "X= " + strconv.Itoa(x)
}
```

우리가 만들었던 메소드 AAA, BBB는 StructA의 포인터 타입 메소드이다. <br />
그래서 아래와 같이 쓸 수도 있는데 <br />

``` Go
func (a *StructA) AAA(x int) int {
	return x * x
}

func (a StructA) AAA(x int) int {
	return x * x
}
```

이 두 함수들은 타입이 다르기 때문에 다른 함수이다. <br />

## 풀 소스

<code>interfaceA.go</code>
``` Go
package main

type InterfaceA interface {
	AAA(int) int
	BBB(int) string
}
```

<code>main.go</code>
``` Go
package main

import (
	"fmt"
	"strconv"
)

type StructA struct {
}

type StructB struct {
}

func (b *StructA) AAA(x int) int {
	return x * 2
}

func (a *StructA) BBB(x int) string {
	return "X= " + strconv.Itoa(x)
}

func main() {
	var c InterfaceA
	c = &StructA{}

	fmt.Println(c.BBB(3))
}
```
===========

인터페이스의 가장 대표적인 활용법중에 하나가 `Println`을 보는 것인데 <br />
