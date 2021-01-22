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
##

인터페이스의 가장 대표적인 활용법중에 하나가 `Println`을 보는 게 대표적인 활용법인데 이게 어떻게 되어 있는지 보자!<br />
우리가 지난시간에 `Println`을 써보았었는데 <br />

``` Go
package main

import (
	"fmt"
)

type StructA struct {
	val string
}

func main() {
	a := &StructA{val: "AAA"}
	fmt.Println(a)
}
```

이렇게 StructA라는 struct를 만들어주고, 그 안에 string값이 들어갈 수 있게 만들어준다. 그 후 main()에서 val값을 AAA로 넣어 출력하게 되면 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/105439788-cee04f00-5ca8-11eb-8d2c-ee6bead881db.png" width = 70%> </img></p>

이렇게 주소형객체이고, AAA값을 갖고 있다고 출력이 되는데 여기에 메소드를 추가해보자! <br />

``` Go
func (s *StructA) String() string {
	return "Val :" + s.val
}
```

이렇게 string을 반환하는 String이라는 메소드를 만들어 주고 출력하게 되면 어떻게 될까? <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/105439981-2a124180-5ca9-11eb-8747-08ae64fef0eb.png" width = 70%> </img></p>

출력값이 다르게 된 것을 알 수있는데 지금은 String()의 return값을 출력하고 있는 것이다. <br />

`Println`의 동작 방법이 어떻게 되냐면 어떤 객체를 넘겼을 때 그 객체가 string이라는 interface가 없으면 그 값을 출력시키는데 string이라는 interface가 있으면 그 string객체의 return값을 출력하게 된다. <br />

이걸 자세히 보면 이렇게 된다고 보면 된다. <br />

``` Go
package main

import (
	"fmt"
)

type StructA struct {
	val string
}

type Printable interface {
	String() string
}

func Println(p Printable) {
	fmt.Println(p.String())
}

func (s *StructA) String() string {
	return "Val :" + s.val
}

func main() {
	a := &StructA{val: "AAA"}
	Println(a)
}
```
Printable라는 interface를 만들어주고, String()을 관계로 맺고, return 값을 string으로 해준 뒤 <br />
Println이라는 함수를 만들어 Printable이라는 interface를 결과로 받으면 출력은 p의 String()함수를 출력한 것과 같다고 보면 된다. <br />
main에서 Println함수를 쓰면 결과는 똑같다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/105440573-2337fe80-5caa-11eb-9fa0-2bd99edfff3b.png" width = 70%> </img></p>

Struct를 만든 이유가 종속성을 낮추고 응집성을 낮추겠다는데에 있는데 프로그램의 과정 또한 마찬가지이고, 좋은 코딩이 가져야할 모습이 이것이다. <br />
그래서 Interface라는 것은 이것을 하기 위한 도구라고 보면 된다. <br />
여기서 응집성이라는 것은 관계에 있는 상태와 기능을 묶었다는 의미이다. <br />

그래서 빵은 빵으로 묶이고, 잼은 잼으로 묶인 그 형태를 의미한다. <br />
관계있는 것들은 묶어주고, 독립시켜줘야 할 것은 독립시켜주는 것이다. 그렇게 되면 확장성이 좋아지는데 이것이 Interface의 목적이고, Object의 목적이고, OOP의 목적이고, 더 나아가서는 좋은 프로그래밍의 목적이다. <br />

다음 시간에는 OOP의 디자인 법칙(원칙)이 있는데 OOP 프로그래밍 할 때 5가지 설계의 원칙에 대해 얘기해보자! <br />
