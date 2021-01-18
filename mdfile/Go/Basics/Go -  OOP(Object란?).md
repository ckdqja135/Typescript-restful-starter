## 시작
저번 시간에 이어서 절차적 프로그래밍이 어떤점이 나빴기 때문에 OOP가 나타났는지를 살펴보자! <br />
저번시간에 딸기잼 샌드위치를 만드는 프로그램을 만들었었는데 이번에는 그 프로그램이 변경되서 딸기잼이 아니라 오렌지잼 샌드위치를 만드는 프로그램을 만든다고 했을 때 <br />
어떤 부분들이 수정되야 하는지 살펴보자! <br />

``` Go
type OrangeJam struct {
	opened bool
}
```

먼저 딸기 잼이 아니라 오렌지 잼이 있어야 할 것이다. 그 다음에 <br />

``` Go
func main() {
	// 1. 빵 두개를 꺼낸다.
	breads := GetBreads(2)

	//jam := &StrawbrreyJam{}
	jam := &OrangeJam{}
	// 2. 딸기잼 뚜껑을 연다.

	// OpenStrawberryJam(jam)
	OpenOrangeJam(jam)

	// 3. 딸기잼을 한 스푼 퍼서 빵위에 올린다.
	// spoon := GetOneSpoon(jam)
	spoon := GetOneOrangeJamSpoon(jam)

	// 4. 딸기잼을 잘 바른다.
	// PutJamOnBread(breads[0], spoon)
	PutOrangeJamOnBread(breads[0], spoon)
	// 5. 빵을 덮는다.
	sandwitch := MakeSandwitch(breads)
	// 6. 완성.
	fmt.Println(sandwitch.val)
}
```
여기에서 딸기잼이 아니라 오렌지 잼으로 만들도록 바꾸어 주어야 하고, 딸기잼 뚜껑을 여는게 아니라 오렌지 잼 뚜겅을 열어야 한다. <br />
또한 오렌지 잼 스푼 을 떠야 하고, 오렌지잼을 발라야 한다. <br />

이에 맞게 함수도 변경해준다. <br />

``` Go
type SpoonOfOrangeJam struct {
}

func OpenOrangeJam(jam *OrangeJam) {
	jam.opened = true
}

func GetOneOrangeJamSpoon(_ *OrangeJam) *SpoonOfOrangeJam {
	return &SpoonOfOrangeJam{}
}

func PutOrangeJamOnBread(bread *Bread, jam *SpoonOfOrangeJam) {
	bread.val += " + Orange Jam"
}
```

이렇게 저장한 뒤, 결과를 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104868689-74cd4a00-5987-11eb-8874-403a972a2b36.png" width = 70%> </img></p>

지금까지 딸기잼 샌드위치 프로그램에서 오렌지잼 샌드위치 프로그램으로 바꾸는데 변경한 부분들을 다시한번 되짚어 보자면 <br />
처음에 OrangeJam이라는 struct를 추가 해주었다. 이걸 추가해주었기 때문에 기존에 있었던 함수들을 그대로 쓸 수 없게 되었다.(타입이 다르기 때문에) <br />
그래서 OrangeJam을 인자로 받는 새로운 함수들을 만들어 주어야 했었다. <br />
그 다음 OpenOrangeJam이라는 함수를 만들었었고, GetOneOrangeJamSpoon을 만들었었고, 여기서 return 값이 SpoonOfOrangeJam이 되어야 했었기 때문에 SpoonOfOrangeJam이라는 struct를 만들어 주었다. <br />
그리고 PutOrangeJamOnBread도 새로 만들어 주었다. <br />
하는일은 다 비슷 비슷하지만 달라진 점이라면 StrawbrreyJam에서 OrangeJam으로 바뀐 점이다. <br />

사실 딸기잼 -> 오렌지 잼으로 바뀐거 뿐인데 바꿔야 할 코드의 양이 이렇게 많아졌다. <br />
실제 실무에서 어떤 복잡한 프로그램의 수정을 할 때 절차적인 프로그래밍 방식에서는 수정의 범위가 굉장히 크다. <br />
그래서 유지보수가 힘들다는 단점이 있다. 가독성이 좋다는 장점이 있는데 유지보수를 통해 코드들이 늘어나면 가독성이 떨어지게 된다.  <br />
그렇게 되면 스파게티 코드라해서 복잡한 코드가 만들어지게 된다. <br />

그리고 산탄총 수정이라고 하는데 산탄총을 발사하면 총알이 퍼치게 되는데 이 처럼 수정을 할 때 단순한 변경사항인데도 수정해야 할 영역이 많이지는 상황이 발생된다. <br />
이러한 현상은 스파게티 코드가 되어 복잡한 코드가 생겨날 때 생기는 현상이다. <br />

이러한 문제들이 절차적 프로그래밍 방식에 있었기 때문에 OOP가 나와서 이런 문제를 쉽고, 빠르게 개선할 수 있었다. <br />
문제는 OOP가 만병통치약은 아니다. 아까 절차적 프로그래밍 방식에서 나온 문제점인 

> * 유지보수가 힘들다. <br />
> * 스파게티 코드로 인해 가독성이 떨어짐. <br />
> * 그래서 산탄총 수정을 해야한다. <br />

이 문제점이 절차적 프로그램만 가지고 있는 문제점이 아니라는 것이다. OOP를 썼을 때 이러한 문제들을 개선하는데 도움을 줄 수 있지만 OOP를 썼다고 해서 무조건 이 문제들을 해결 할 수 있는게 아니라는 것이다. <br />

OOP라고 해도 코드를 어떻게 짜느냐에 따라서 마찬가지로 위의 문제가 발생할 수 있다는 점이다. <br />
그러니까 OOP를 쓰느냐, 절차적 프로그래밍을 쓰느냐로 위의 문제를 해결하는 가장 근본적인 이유가 되는게 아니라 어떤걸 쓰더라도 **코드를 잘 짜는게 중요하다.**는 것이다. <br />

그렇기 때문에 OOP를 배우더라도 제대로 배워야 하고, 코드를 잘 짜야 한다. <br />

## OOP가 무엇인가를 알아보기전에 Object가 무엇인지 알아보자. 
**Object**라는 것은 **상태 + 기능**이라고 보면 된다. <br />
프로그래밍이라는 것은 단순히 보면 **상태를 어떻게 조절하는가?**가 코딩이라고 보면 된다. <br />
**상태**라는 것은 단순하게 보면 **메모리의 어떤 상태**이다. **메모리에 어떤 번지에 어떤 값이 들어있는 지**를 '상태'로 보면 된다. <br />
**이 메모리 상태를 어떻게 바꾸는가?**가 프로그램이 하는 일이다. <br />

사람이 어떤 프로그램을 실행 했을 때 게임이 돌아가고, 음악이 나오고, 비디오가 출력되고가 되지만 <br />
컴퓨터(기계) 입장에서는 메모리의 상태를 어떻게 바꾸는 가?가 프로그램이 하는 일이다. <br />

그래서 프로그래밍이라는 것은 상태를 어떻게 바꿀지를 기술한 것이라고 보면 된다. <br />
여기서 '어떻게 바꿀지?'에 대한 것은 '기능'이다. <br />

그래서 아주 단순하게 보면 **상태 + 기능**이라고 보면 된다. <br />
변수 값이나, struct가 가지고 있는 값(상태), function(기능)으로 볼 수 있기 때문에 Variable, Function이 두가지로 단순하게 볼 수 있는데 <br />
이 두가지를 합친게 **Object**라고 보면 된다. <br />

OOP가 있기 전에는 변수는 변수고, 함수는 함수였는데 그니까 상태와 기능이 따로 떨어져 있었는데 이거를 하나로 합친게 Object이다. <br />
이전에 Golang의 Struct를 설명할 때 메소드(Method)에 대해 설명한 적이 있었는데 <br />

``` Go
type Bread struct {
	val string
}
```

일 때 이것의 메소드를 추가할 수 있다고 했었는데 <br />

``` Go
func (b *Bread) AA() {
}
```

이렇게 했을 때 이 function이 Bread라는 struct의 메소드 형태로 들어간다고 말한 적이 있다. <br />

Object에서 상태 + 기능인데 이 기능을 메소드라고 부른다. <br />
이 메소드는 다른게 아니고 Function인데 어떤 Object에 속해 있는 Function을 메소드로 보면 된다. <br />

단순하게 예를 들어보자면 <br />
먼저 method라는 폴더를 추가해서 main.go를 추가해준다. <br />

``` Go
package main

import "fmt"

type Bread struct {
	val string
}

type Jam struct {
}

func (b *Bread) PutJam(jam *Jam) {
	b.val += jam.GetVal()
}

func (j *Jam) GetVal() string {
	return "jam"
}

func main() {
	bread := &Bread{val: "bread"}
	jam := &Jam{}

	bread.PutJam(jam)

	fmt.Println(bread)
}
```
먼저 Bread와 Jam이라는 struct를 추가 해준 뒤에 <br />
PutJam()라는 Bread의 메소드를 추가해주고, GetVal()이라는 Jam의 메소드를 추가해준다. <br />
main()에서 bread를 하나 만들고, jam을 하나 만들어 준 뒤, bread의 메소드를 호출해준 뒤 bread를 출력하도록 만들어준다. <br />

이렇게 코드를 추가해 준 뒤에 실행을 해보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104874054-50786a00-5995-11eb-8bc4-044d465106c8.png" width = 70%> </img></p>

이렇게 출력되는 것을 알 수 있다. <br />

bread의 출력값을 바꿀 수도 있다. <br />

``` Go
func (b *Bread) String() string {
	return b.val
}

func (j *Jam) GetVal() string {
	return " + jam"
}
```

String()이라는 메소드를 추가하여 b의 val을 return하도록 했고, GetVal()의 return 값을 수정했다. <br />
이제 이 것을 출력하면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104874519-7b16f280-5996-11eb-91fe-fc52483f3f15.png" width = 70%> </img></p>
이렇게 출력 되는 것을 알 수 있다. <br />

String 메소드를 bread에 추가 함으로서 fmt.Println()이라는 함수는 인자로 넘어간 인스턴스에 String이라는 메소드가 있을 경우 String메소드의 결과값을 출력하게 된다. <br />
그래서 b의 val을 출력하게 되고, 이것이 `bread + jam`이라고 보면 된다. <br />

지금까지 struct의 객체를 만들었고, 그 객체에 메소드를 선언하고, 그 메소드를 호출하는 예문이 되겠다. <br />

그래서 OOP에서 가장 중요한 'Object'라는 것은 상태와 기능을 갖는 것이고, 기능을 단순하게 보면 Function인데 Object가 가지고 있는 Function을 다른말로 하면 메소드라고 하면 된다. <br />
또한 상태 + 기능은 하나의 독립된 요소로 볼 수 있다. <br />
OOP를 처음에 만든사람이 개념을 잡을 때 세포막을 보고 개념을 잡았었다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104875034-ab12c580-5997-11eb-80d7-7a5e9d8c2d66.png" width = 70%> </img></p>
세포막을 보면 세포가 있을 때 그 외부를 둘러싸고 있는 세포막이 있고, 그 안에 핵이 있는데 이 막이 하는 역할은 어떤 세포가 필요한 물질은 받아드리고, 세포가 필요없는 물질은 내보내는 역할을 하는데 <br />
이 막이 있음으로써 이 세포가 보호를 받게 된다. 어떤 외부에 들어오는 충격으로부터 막아주기도 하고, 그 중에서 필요한 것은 통과시키고, 필요 없는 것은 내보내게 된다. <br />
그래서 세포가 외부와 통신할 수 있는 연결고리를 하는 역할을 한다. <br />

Object도 마찬가지이다. 어떤 객체가 있고, 이 객체의 상태가 있을 것인데 이 객체의 상태를 외부와 통신하는 역할을 기능이 담당한다. <br />

우리가 프로그래밍을 할 때 의미있는 프로그램을 만들 때 프로그램의 의미있는 객체를 선언(정의)하고, 그 객체가 가지고 있는 기능을 같이 정의하는 것을 **Object**라고 보면 된다. <br />

우리가 했었던 딸기잼 샌드위치 프로그램에서 Object라는 것은 딸기잼 샌드위치 프로그램이 가지고 있는 것 중에 의미있는 객체를 뽑아보자면 <br />
잼, 빵, 한 스푼의 잼, 결과물인 샌드위치가 있다. 이런것들 모두가 딸기잼 샌드위치 프로그램의 의미있는 객체들이고, 우리는 이 객체들을 Object형태로 만들 수 있게 된다. <br />
그래서 각각의 잼이 갖는 기능, 빵이 갖는 기능, 한 스푼의 잼이 갖는 기능, 샌드위치가 갖는 기능을 붙여서 Object를 만들고, 이 객체들간의 커뮤니케이션(관계)를 성립하면서 프로그램을 완성시키는 것이다. <br />

절차적 프로그래밍과 OOP의 차이를 보면 <br />

|절차적 프로그래밍 | OOP |
|---|---|
|순서가 중요하다.|각 Object가 갖는 기능이 중요하다.|
|어떤일을 할 것인지에 대한 절차가 중요하다.|각 Object간의 관계가 중요하다.|

절차적 프로그래밍에서는 어떤 순서로 프로그램이 만들어지는가? 어떤 절차를 거쳐 프로그램이 되는가?가 중요했다면 <br />
OOP에서는 그 프로그램에서 의미가 있는 객체는 어떤 것들이 있고, 각 객체가 어떤 기능을 가지고 있고, 각 객체간의 관계는 어떻게 되는가?를 명확히 정의 하는게 프로그램을 접근할 때 가장 중요한 방법이라 보면 된다. <br />

이번에는 절차적 프로그램의 단점에 대해 얘기했고, 그 단점을 해결하기 위해 OOP가 나왔고, OOP에서 Object에 대해서 알아보았다.
다음에는 OOP의 가장 중요한 기능인 **Interface**에 대해 알아보다. <br />
