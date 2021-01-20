## 시작
이번에는 Interface에 대해 알아보겠다. <br />
여기서'Inter'라는 것은 왔다 갔다 하는 것을 의미한다. <br />
Inter가 쓰인 말 중에 Inter change가 있고, Interaction이 있는데 Interaction은 상호작용을 말하는 것이고, Inter change는 고속도로에서 도로가 바뀌는 것을 의미한다. <br />
'face'라는 것은 얼굴이라는 뜻도 있지만 면, 접촉면, 표면을 의미한다. 그래서 Interface라고 하면 서로 상호작용을 하는 접촉 면을 의미한다. <br />

보통 UI(User Interface)를 보통 얘기하는데 어떤 게임을 할 때 UI가 좋다, 나쁘다. 이런 얘기를 하는데 UI라는 것은 게임을 할 때 키보드와 마우스의 입력과 화면상의 게임 캐릭터의 상호작용,
그러니까 게임과 유저간의 상호작용, 서로의 관계를 지칭한다. <br />

프로그래밍 언어에서 Interface는 객체간의 상호 관계를 나타내는 것, 따로 정의 한 것을 의미한다. <br />
그래서 A라는 객체와 B라는 객체가 있을 때 이 두 객체간에 어떤 관계를 가지고 있는가? 어떤 상호작용을 하는가?를 따로 정의 해놓은 것이 Interface라고 한다. <br />

지난 시간에 객체를 얘기 했을 때 상태와 기능을 더한거라고 했었다. 이 때 기능은 크게 외부로 공개되는 기능과 내부 기능이 있게 된다. <br />
내부 기능은 A라는 객체가 있을 때 A객체의 외부에서 호출하는 메소드는 외부 메소드, A객체의 내부에서만 호출되는 메소드는 내부 메소드로 볼 수 있는데 <br />
외부에서 호출된다는 얘기는 밖에서 어떤걸 부른다는 얘기이다. 그 말은 A라는 객체는 외부와 관계를 맺는다는 의미이다. <br />
그러니까 외부에서 호출되는 메소드는 **관계**를 나타내고 있다 보면 된다. **이 관계를 따로 정의한 것이 Interface이다.** <br />

그래서 객체는 상태와 기능을 갖는다고 했는데, 이 기능을 Decoupling한 것, 기능 부분만 따로 정의한 것을 Interface라고 보면 된다. <br />
그래서 어떻게 보면 상태와 기능이 있는데 기능을 별도로 외부로 빼냈다고 봐도 된다. 여기서 빼냈다는 의미는 기존 절차적 프로그래밍에서는 상태와 기능이 아예 떨어져 있었고 <br />
그거를 하나로 합친 것이 객체(Object)였는데 여기서 떨어져 있다는 것은 상태와 기능이 분리가 되었다는 의미가 아니고, 기능이 Decoupling된 것이다. <br />
이 말을 한국어로 말하기는 애매하지만 **종속성을 떼낸다, 의존 관계, 의존성을 떼냈다.** 는 의미로 보면 된다. <br />

이걸 코드로 보게 되면 A라는 struct가 있다고 가정해보자. <br />

``` GO
type A struct {
  상태..
}
func (a *A) MethodA() {
}

B.InteralA()
A.ExternalB()
```

그러면 이 struct의 상태가 있을 것이고, struct의 메소드가 있을 것이다. <br />
그러면 B라는 객체 내부 기능에서 B라는 객체의 메소드인 B.InteralA()라는 메소드 안에서 A라는 메소드 안에서 A라는 객체의 내부 메소드인 A.ExternalB()를 호출했다 가정하면 <br />
B라는 객체는 A라는 객체와 관계를 맺게 되고, 이 관계를 ExternalB()라는 기능을 통해서 관계를 맺게 되는데 그렇게 되었을 때 ExternalB() 기능의 정의만 필요하면 A가 특정 A struct일 필요가 없다. <br />

쉽게 설명하면 우리가 딸기잼 샌드위치를 만들었었는데 이 때 딸기잼이라는 객체와 빵이라는 객체가 있는데 이 둘 사이에 딸기잼을 빵에 바른다는 관계를 가지고 있다. <br />
그리고 오렌지잼도 추가 했는데(사실 딸기잼인지 오렌지잼인지 중요하진 않다.) 이 오렌지잼도 '바른다'는 같은 관계를 가지고 있다고 했을 때 <br />
빵 입장에서는 나와 관계를 맺는 이 객체가 딸기잼인지 오렌지잼인지 확인할 필요가 없다. 그냥 '바른다'는 관계가 자기에게 제공되면 굳이 따질 필요가 없다는 말이다. <br />

다시 말하면 객체에서 상태와 기능이 있는데 기능을 Decoupling함으로써 **확장성**이라는 것을 얻게 된다. <br />
딸기잼이라는 게 있고, 오렌지잼이라는 게 있는데 기존 절차적 프로그래밍에서는 새로운 것을 추가했을 때 바뀌어야 할 부분들이 많았었는데 지금의 OOP에서는 기존의 객체와 맺었던 관계를 새로운 객체가 그대로 유지만 시켜 준다면 이 객체에 대한 함수를 따로 만들지 않아도 그 관계를 그대로 가지고 가서 그대로 이용할 수 있게 된다. 손 쉽게 확장이 가능하다는 얘기이다. <br />

이 부분을 여러번 말하는 것보다 코딩을 하는게 더 나은데 그 전에 객체를 정의를 해보자. <br />
빵이라는 객체, 딸기잼이라는 객체가 있고, 이 둘 사이에 관계를 맺는데 빵의 외부기능에서 '잼을 바른다'라는 기능이 있고 이 것의 인자로 딸기잼을 받을 때 <br />
딸기잼의 외부 기능인 '한 스푼 뜬다.'가 있고, 이 뜬다는 기능의 결과로 Spoon이 나왔었다. <br />
그리고 이 Spoon을 빵의 val에 더해주는 것이였다. <br />
이것을 코드로 그대로 써보자! <br />

지난번에 만들었던 딸기잼 샌드위치를 OOP로 만들어보자! 먼저 sandwitch2라는 폴더를 만들어주고, main.go를 만들어준다. <br />

``` Go
package main

type Bread struct {
	val string
}

type StrawberryJam struct {

}

func (b *Bread) PutJam(jam * StrawberryJam) {
	spoon := jam.GetOneSpoon()
	b.val += spoon.String()
}

func main() {

}
```

먼저 빵과 딸기잼 struct를 만들어주고, 빵의 메소드인 PutJam를 만들어주고, 딸기잼을 인자로 받아준다. <br />
그 후 StrawberryJam의 내부 기능으로 한 스푼을 가져와서 string에 값을 더해준다. <br />
이 때 spoon의 외부기능을 String()이라고 하자. <br />

그러면 우선 StrawberryJam의 내부 기능인 GetOneSpoon()를 정의해주어야 한다. <br />

``` Go
type SpoonOfStrawberryJam struct {

}

func (j *StrawberryJam) GetOneSpoon() *SpoonOfStrawberryJam {
	return &SpoonOfStrawberryJam{}
}
```

GetOneSpoon()를 정의해주고 return 값은 지난 시간과 같은 방식으로 해준다. <br />
GetOneSpoon()함수 호출의 결과로 *SpoonOfStrawberryJam이 나오고 type은 SpoonOfStrawberryJam의 포인터형이고, 이 포인터 객체에 외부 메소드인 String()이 호출이 된다. <br />

그래서 마찬가지로 *SpoonOfStrawberryJam의 외부메소드로 정의해준다. <br />

``` Go
func (s *SpoonOfStrawberryJam) String() string {
	return "+ strawberry"
}
```

지금까지 관계, 객체(클래스)를 3개를 만들었다.(Bread, StrawberryJam, SpoonOfStrawberryJam) <br />
Bread의 내부 메소드로 PutJam()가 있고, 이것의 인자로 StrawberryJam을 받고, jam을 받았을 때 PutJam()가 하는 일은 jam의 외부 메소드인 GetOneSpoon()을 호출해서 이것의 결과를 spoon에 넣고 <br />

이 spoon의 외부 메소드인 String()을 호출해서 그 결과를 Bread의 val에 더하는 메소드가 된다. <br />

마찬가지로 이번에는 Bread의 외부 메소드로 String()이라는 것을 만들어보자! <br />

``` Go
func (b *Bread) String() string {
	return "bread" + b.val
}
```

이 String은 단순하게 Bread의 val을 return해준다. <br />

그리고 main()에서 bread를 하나 만들고, bread의 PutJam()을 주고, bread를 출력했을 때 어떤 값이 나오는지 확인해보자! <br />

``` Go

func main() {
	bread := &Bread{}
	jam := &StrawberryJam{}
	bread.PutJam(jam)

	fmt.Println(bread)
}
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/105133560-4f2f7480-5b30-11eb-90ee-b4aef5de4912.png" width = 70%> </img></p>

Bread라는 객체와 StrawberryJam이라는 객체가 서로 관계를 맺고 있는데 이 관계가 어떻게 되는지 보자! <br />
Bread객체의 Public메소드로 PutJam()이라는 메소드가 있었고,여기에 인자로 StrawberryJam이 들어가게 되고, 이 jam의 외부 메소드로 GetOneSpoon()을 호출하는데 <br />
Bread객체가 jam의 메소드를 호출해서 사용하게 된다. 그렇다는 얘기는 Bread객체와 StrawberryJam객체가 GetOneSpoon()라는 외부 메소드를 통해 관계를 맺고 있다는 의미이다. <br />

그래서 이 관계만 맺어주면 StrawberryJam이든 OrangeJam이든 상관이 없다. <br />
이 것을 하기 위해 Interface를 사용하면 되는데 지금부터 사용해보자! <br />

Interface도 하나의 타입인데 Jam이라는 Interface를 정의해보자! <br />

``` Go
type Jam interface {
	GetOneSpoon() *SpoonOfStrawberryJam
}
```

이렇게 적어주면 되는데 그 안에 어떤 관계를 가지고 있는지 적어주면 된다. <br />
GetOneSpoon()이라는 관계를 가지고 있는데 이것은 인자가 없는 함수이고, 그 결과는 *SpoonOfStrawberryJam라는 의미이다. <br />
외부로 부터 공개되는 메소드는 관계라고 했기 때문에 위와 같이 정리해준다. <br />

GetOneSpoon()는 사실 StrawberryJam이 가지고 있기 때문에 StrawberryJam은 Jam이라는 관계를 사용할 수 있게 된다. <br />
그리고 Bread의 PutJam이라는 메소드는 Jam이라는 관계를 가지고 있으면 인자가 어떤 잼이든 상관이 없게 되기 때문에 아래와 같이 수정해준다. <br />

``` Go
func (b *Bread) PutJam(jam Jam) {
	spoon := jam.GetOneSpoon()
	b.val += spoon.String()
}
```

이대로 저장 한 뒤에 똑같이 실행해보자 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/105134837-5d7e9000-5b32-11eb-84db-f0d428561093.png" width = 70%> </img></p>

같은 결과가 나오는 것을 알 수 있다. <br />
그런데 잘 보면 PutJam이라는 메소드는 Jam이라는 관계를 인자로 받는데 이것은 그냥 타입이다. 이게 StrawberryJam이 아니다. <br />
그렇지만 이 프로그램이 문제없이 돌아간다. 여기서 jam은 StrawberryJam의 포인터 형인데 포인터 형을 PutJam이라는 메소드의 인자로 넘겨도 상관이 없다. <br />
StrawberryJam라는 struct는 이미 GetOneSpoon()이라는 관계를 가지고 있고, 이 관계는 Jam이라는 interface에 정의되어 있는 관계이기 때문에 그대로 쓸 수 있게 되는 것이다. <br />

이번에는 OrangeJam을 추가해보자! 이 것도 마찬가지로 GetOneSpoon()이라는 관계를 가지고 있다고 해보자!<br />

``` Go
type SpoonOfOrangeJam struct {

}

func (o *OrangeJam) GetOneSpoon() *SpoonOfOrangeJam {
	return &SpoonOfOrangeJam{}
}

func (o *SpoonOfOrangeJam) String() string {
	return "+ Orange"
}
```

OrangeJam의 GetOneSpoon()의 return값은 SpoonOfStrawberryJam이 아니기 때문에 SpoonOfOrangeJam이라는 struct를 만들어주고, SpoonOfOrangeJam을 return할 수 있도록 해주고 <br />
SpoonOfOrangeJam의 메소드로 String()를 추가해서 Orange를 반환 하도록 해준다. <br />

그 후 StrawberryJam을 넘기는게 아니라 OrangeJam을 넘기도록 main()을 변경해준다. <br />

``` Go
func main() {
	bread := &Bread{}
	jam := &OrangeJam{}
	bread.PutJam(jam)

	fmt.Println(bread)
}
```

이렇게 써 주면 에러가 발생하게 되는데 에러 문구를 보면 <br />

``` Text
OrangeJam does not implement Jam (wrong type for GetOneSpoon method)
```

이렇게 나타나는데 이 말은 PutJam의 인자로 jam을 넘겼는데 OrangeJam은 Jam을 구현하고 있지 않다고 나온다. <br />
왜냐하면 Jam interface의 관계는 GetOneSpoon()이라는 메소드를 가지고 있어야 하는데 이것의 return타입은 SpoonOfStrawberryJam이기 때문인데 <br />
OrangeJam의 GetOneSpoon()은 이름은 같지만 return타입이 다르기 때문에 같은 관계를 포함하고 있지 않기 때문에 문제가 발생한 것이다. <br />
그래서 여기에서는 *SpoonOfStrawberryJam과 같은 어떤 특정 값을 반환하는게 아니라 *SpoonOfJam이라는 어떤 interface를 반환하도록 변경해주면 된다. <br />

``` Go
type SpoonOfJam interface{
	String() string
}
```

이렇게 바꾸어주면 이 관계를 가지고 있는 모든 객체는 다 SpoonOfJam으로 표현 될 수 있다. <br />
이 관계가 바뀌었기 때문에 코드를 수정해보자! <br />

``` Go
type Jam interface {
	GetOneSpoon() SpoonOfJam
}

func (o *OrangeJam) GetOneSpoon() SpoonOfJam {
	return &SpoonOfOrangeJam{}
}

func (j *StrawberryJam) GetOneSpoon() SpoonOfJam {
	return &SpoonOfStrawberryJam{}
}
```

해당 부분을 수정해 준 뒤 실행을 해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/105136482-0f1ec080-5b35-11eb-9d08-0f2d24290139.png" width = 70%> </img></p>

이번에는 새로운 잼을 추가해보자! <br />

``` Go
type AppleJam struct {

}

type SpoonOfAppleJam struct {
}

func (a *AppleJam) GetOneSpoon() SpoonOfJam {
	return &SpoonOfAppleJam{}
}

func (a *AppleJam) String() string {
	return "+ Apple"
}
```

이렇게 만들어주면 바로 쓸 수 있다. <br />
``` Go
func main() {
	bread := &Bread{}
	jam := &AppleJam{}
	bread.PutJam(jam)

	fmt.Println(bread)
}
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/105137446-a8020b80-5b36-11eb-8f9e-72a7fdcf5a5d.png" width = 70%> </img></p>

절차적 프로그래밍과 비교해보면 새로운 형태의 변경사항에서 굉장히 손쉽게 작은 코드 변경으로 적용할 수 있는 것을 알 수 있다. <br />
관계를 interface를 통해 정의만 해놓으면 그 관계만 포함하고 있는 어떤 객체든지 손쉽게 추가할 수 있다. <br />

Interface를 다시 정리 해보면 관계를 따로 정의한 Type이다. <br />
그래서 빵이라는 객체와 잼이라는 객체를 사용하는데 빵의 입장에서는 GetOneSpoon()이라는 관계만 가지고 있으면 딸기잼이든 사과잼이든 오렌지잼이든 아무 상관이 없게 된다. <br />
이 둘 사이를 갈라 놓은, Decoupling, 종속성을 떼 줄수 있다. <br />
종속성이 떨어졌을 경우 확장이 가능해진다. 그래서 새로운 잼을 추가했을 때 손쉽게 추가할 수 있게 된다. <br />

이 부분에 대해서는 OOP에서 굉장히 중요한 부분이기 때문에 계속해서 얘기해보자!
