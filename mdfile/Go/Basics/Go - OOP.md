## 시작
OOP(Object Oriented Programming)는 한국어로 풀어 쓰면 '객체 지향 프로그래밍'이라고 번역을 하는데 이 번역이 잘 못 되었다 생각한다. <br />
'지향'은 Direct, 그러니까 어떤 방향성을 갖고 있는 것인데 그러니까 그 쪽으로 가겠다.는 얘기인데 <br />
'Oriented'는 어떤 중심의, 기원의, 근간이 되는 이라는 뜻이다. 그러니까 객체 지향은 내가 객체 쪽이 아닌데 객체 쪽으로 나아가겠다.는 뜻인데 이미 프로그래밍은 객체로 넘어갔고, 지금은 객체 중심으로 프로그래밍을 해야 한다. <br />

물론 'OOP'가 처음 나왔을 때는 "우리는 아직 OOP가 아니기 때문에 OOP를 향해 가자!" 라고 말할 수 있지만 2021년 현재는 이미 OOP로 넘어갔고, 넘어간지도 20년이나 지났다. <br />
가령 Java나 C#같은 경우에는 객체가 아니면 프로그래밍을 할 수 없다. 진정한 OOP라고 볼 수 있다. <br />

그래서 '객체 지향 프로그래밍'은 잘못 되었고, '객체 중심 프로그래밍'이 현대에선 맞는 표현이다. <br />
'객체 중심 프로그래밍'이라는 것은 객체로 프로그래밍을 하겠다는 의미이고, 객체가 아닌 것은 프로그래밍이 아니라는 의미이다. <br />
프로그래밍 중심에 객체가 있어야 된다. <br />

OOP라는 것은 어떤 언어가 아니고, 어떤 기술도 아니다 어떻게 보면 OOP라는 것은 개념이다. '이렇게 하겠다, 이런식으로 만들겠다.'라는 방법, 개발법이다. <br />
그래서 OOP는 절대법칙이거나 기술도 아니고, 필수(mandatory)도 아니다. <br />
개발법이고, 방법이기 때문에 따라 갈 뿐이지 이걸 꼭 해야 하거나 이게 절대로 좋거나 어떤 의무사항이 아니라는 것이다. <br />

OOP가 나온지 20년이 넘다 보니 이제는 OOP의 위상이 절대적이 되어버렸다. <br />
그러다 보니 OOP가 절대적으로 믿어서 OOP가 아니면 프로그래밍이 아니다, 프로그래밍이라 할 수 없다, OOP를 할 줄 모르면 좋은 개발자가 아니다, OOP로 코드를 짜지 않으면 좋은 코드를 짤 수 없다.라고 하는 사람이 있는데 OOP는 어떤 하나의 개념이고, 방법이다. <br />

OOP라는 것도 기존에 있었던 문제를 해결하기 위해 나온 개념이자, 방법이다. <br />
그래서 기존 문제를 해결 했지만 이걸 사용함으로써 또 다른 문제가 생길 수 있다는 것이다. 또 그걸 해결하기 위한 방법이 또 나오고 있다.<br />
어떻게 보면 진화이자 기술의 발전으로 볼 수 있고, 우리는 기술 발전의 중간에 있는 셈이다. <br />

기술은 항상 시간이 갈 수록 발전하고 있고, 그 과정에서 OOP라는 것이 나왔고, 그걸 사람들 사이에서 20년 넘게 사랑을 받아왔을 뿐이지 이게 항상 절대적 법칙이진 않는다. <br />
지금은 OOP의 위상이 조금씩 떨어지고 있고, 요즘엔 **ANTI OOP**라 해서 OOP를 오히려 거부하는 움직임도 점점 나타나고 있다. <br />
이 얘기는 기존의 문제를 OOP를 통해서 해결 했는데 새로운 문제가 또 생기게 되었고, 이 문제를 해결하기 위해 우리는 찾아나가야 한다는 것이다. <br />

그렇기 때문에 OOP가 절대적이 아니라는 것을 알아두어야 한다. <br />
하지만 OOP를 통해서 해결하고자 하는 문제가 있었고, 그걸 OOP가 훌륭하게 해결했다는 점, OOP의 패러다임이 프로그래밍 역사에 발전에 굉장히 큰 영향을 끼쳤고, 이바지를 많이 했고, 우리는 지금 그 중간에 서 있기 때문에 우리는 OOP를 알아야 한다. <br />

OOP를 절 대 무시할 순 없지만 그것이 절대적인 법칙은 아니라는 점을 알아두자! <br />

어떤 개념을 이해하는데 있어서 여러가지 방법이 있겠지만 기존 문제점이 무엇이고, 그것을 어떻게 해결했는가?를 알면 새로운 개념을 쉽게 이해 할 수 있다. <br />
그래서 OOP를 이해할 때도 왜 OOP라는 개념이 나오게 되었고, 기존에 있던 문제를 해결하기 위해 나왔다고 했는데 기존에 있던 문제는 무엇이고, OOP가 과연 이것을 어떻게 해결 했는가?를 알면 
이 OOP를 좀 더 잘 이해 할 수 있을 거라고 생각한다. <br />

OOP를 그냥 무작정 이론 외우듯이, 교과서 외우듯이 배우면 OOP에 대한 다른 이미지를 갖게 된다. 추상적으로 이해하게 되는데 기술을 추상적으로 이해하는 건 굉장히 안좋다고 생각한다. <br />

예를 들면 '프로그래밍 언어'라는 것이 있다 할 때 사람들은 이게 프로그래밍 언어이다 보니까 문자 그대로 Language로 이해를 한다. <br />
그래서 마치 우리가 사용하는 언어처럼 배워야한다 식으로 얘기를 하거나 프로그래밍 언어를 기술로 보지 않고, 말과 글 형태로 이해하려는 시도들을 하지만 이건 맞는 대입이 아니다. <br />

'언어'라는 것은 '언어'라는 문자를 차용했을 뿐이지 프로그래밍 언어가 말 그대로의 언어가 아니다. <br />
우리가 사용하는 '주어, 동사, 목적어'등 자기 의사를 나타내기 위해서 대화하는 이런 언어와는 다르다는 것이다. <br />
이건 엄연히 기술(Technic)에 관한 것이지 언어는 아니라는 것이다. <br />

'프로그래밍 언어' 라고 하면 마치 컴퓨터와 대화 하는 줄 아는데 컴퓨터와 대화 하는게 아니라 우리가 컴퓨터에게 명령을 써야 하는데 이걸 사람들이 알아보기 좋게 써보자 해서 나온게 언어라는 기술이다. <br />
언어의 형식을 차용해서 표현하는 기술이다. 이건 기술적 표현인 것이지 말 그대로의 언어는 아니라는 것이다. <br />

그래서 어떤 것도 봤냐면 마치 글쓰기와 코딩을 대입해서 좋은 글쓰기에 간결하고, 문장은 작고, 신선한 문장을 써야하고 하는 것들을 좋은 코딩을 쓰는 법에 대입하여 설명하는데 <br />
이건 옳지 않다 생각한다. 코딩은 코딩이고, 글쓰기는 글쓰기이다. 물론 Insight로 다른것을 보면서 내 쪽에 아이디어를 차용하겠다는 것은 있을 수 있겠지만 이 두개를 마치 같은 것으로 놓고 보는건 옳지 않다고 생각한다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104544520-4e4b9e00-566b-11eb-963f-09c18a2514b0.png" width = 70%> </img></p>
그래서 마찬가지로 OOP도 추상적인 개념을 가져와서 예를 들어 동물이라는게 있으면 이 동물을 소, 닭으로 나눠서 소 중에서도 젖소가 있고, 육우가 있고 <br />
닭도 산란계도 있고, 육계가 있고 이런식으로 어떤 계층을 그리는 게 마치 OOP 인 것처럼 어떤 우리가 만든 개념들이 상속구조나 종속들을 위와 같이 이해를 하면 이상하게 코딩을 하게 된다. <br />

OOP는 말 그대로 OOP이다. 기술적인 것이기 때문에 기술적으로 접근해야지 개념, 추상적으로 접근하면 문제가 생긴다. <br />
코딩을 잘 하기 위한 방법론으로 알아둬야지 마치 우리 사회를 묘사하고, 어떤 글 쓰듯이 만드는 것이고 이런건 아니라는 것이다. <br />

'Object'가 물체, 객체 그런 뜻인데 우리가 말하는 모든 게 다 'Object'가 아니다. <br />
언어 상으로 봤을 땐 지구 상에 있는 모든 게 다 'Object'지만 코딩 상에서는 그렇지 않다. <br />
내가 관심 있는 것, 내가 기술적으로 꼭 나타내야 하는 것만 'Object'이지 모든 걸 다 'Object'로 만들 필요가 없다. <br />

그래서 상상의 나래를 펴서 추상적인 개념으로 이해하면 오히려 OOP를 이해하는데 걸림돌이 될 수 있다. <br />

## 그럼 이제 본격적으로 기존 문제가 뭐였는지 살펴보자. 
이것을 살펴보기 전에 기존 방법은 무엇이였는지(OOP 이전의 방법은 무엇이였는지)를 알아야 하는데 <br />
그 전에 절차적 프로그래밍(Procedure)이라는게 있었다. 이거는 순서가 중요시 되었던 프로그래밍이다.<br />
예전에 '순서도'라는 게 있었다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104546015-a46e1080-566e-11eb-9c0d-2367bbfe5af4.png" width = 70%> </img></p>

이렇게 어떤 절차, 순서에 따라 코딩 하는 것을 절차적 방법인데 이 절차적 방법을 코딩을 해보자! <br />
이게 가장 이해하기 쉽고, 눈에 잘 들어오는 방법이기도 하고, 컴퓨터가 이해하는데도 좋다. <br />
컴퓨터라는 것은 명령어를 한줄씩 한줄씩 실행하기 때문에 항상 순서가 있기 때문에 컴퓨터도 좋고, 우리에게도 좋다. <br />

코딩이라는 것을 기계어로 부터 시작을 했는데 기계어는 한 줄로 된 명령어 다발 이였기 때문에 순서대로 프로그래밍 하는 게 자연스러운 상황이였다. <br />
이 때는 이게 절차적 프로그래밍이라는 것이라 생각하지 못했고, 그냥 프로그램은 이렇게 하는 거라고 생각을 했었다. OOP가 나온 후로 이러한 방법을 절차적 프로그래밍이라고 표현하기 시작했다. <br />

이 절차적 프로그래밍을 이용해서 딸기잼 샌드위치 만드는 프로그램을 만들어보자! 순서는 아래와 같다.<br />

> 1. 빵 두개를 꺼낸다. <br />
> 2. 딸기잼 뚜껑을 연다. <br />
> 3. 딸기잼을 한 스푼 퍼서 빵위에 올린다. <br />
> 4. 딸기잼을 잘 바른다. <br />
> 5. 빵을 덮는다. <br />
> 6. 완성. <br />

먼저 sandwitch라는 폴더를 만들어 main.go파일을 생성해주자 <br />

``` Go
package main

func main() {
	// 1. 빵 두개를 꺼낸다.
	// 2. 딸기잼 뚜껑을 연다.
	// 3. 딸기잼을 한 스푼 퍼서 빵위에 올린다. 
	// 4. 딸기잼을 잘 바른다.
	// 5. 빵을 덮는다. 
	// 6. 완성. 
}
```
만드는 방법은 주석 그대로 만들어 주면 된다. <br />

대략적인 틀을 잡자면 아래와 같다. <br />

``` Go
package main

func main() {
	// 1. 빵 두개를 꺼낸다.
	breads := GetBreads(2)
	
	// 2. 딸기잼 뚜껑을 연다.
	OpenStrawberryJam(jam)
	
	// 3. 딸기잼을 한 스푼 퍼서 빵위에 올린다.
	spoon := GetOneSpoon(jam)
	
	// 4. 딸기잼을 잘 바른다.
	PutJamOnBread(breads[0], spoon)

	// 5. 빵을 덮는다.
	sandwitch := MakeSandwitch(breads)
	// 6. 완성.
	fmt.Println(sandwitch)
}
```

이제 할 일은 저기 있는 함수들을 만들어 주기만 하면 된다. <br />

먼저 1번을 만들어주자! <br />

``` Go
type Bread struct {
	val string
}

func GetBreads() []Bread {
	breads := make([]Bread, 2)
	breads[0].val = "bread"
	breads[1].val = "bread"
	return breads
}
```

빵이 필요하기 때문에 빵을 struct로 만들어주고, GetBreads()에서 2개 만들어서 넘겨주면 되기 때문에 위와 같이 작성했다. <br />

그 다음 2번을 만들어주자! <br />

``` Go

type StrawbrreyJam struct {
	opened bool 
}

func OpenStrawberryJam(jam *StrawbrreyJam) {
	jam.opened = true
}

```
뚜껑을 열었는지만 판단하면 되기 때문에 StrawbrreyJam struct에 bool형을 넣어 주었고, OpenStrawberryJam()에서는 true를 넣어주었다. <br />
추가적으로 GetBreads()도 포인터로 수정했다. <br />

``` Go
func GetBreads() []Bread {
	breads := make([]*Bread, 2)
	breads[0] = &Bread{val : "bread"}
	breads[1] = &Bread{val : "bread"}
	return breads
}
```

그 후 3번을 작성하자! <br />

``` Go
type SpoonOfStrawberry struct {
}

func GetOneSpoon(_ *StrawbrreyJam) *SpoonOfStrawberry {
	return &SpoonOfStrawberry{}
}

```

한 스푼의 잼이 있다고 가정하고 GetOneSpoon()으로 한 스푼을 뜨기 때문에 SpoonOfStrawberry을 반환시켜준다. <br />

그 다음 4번을 작성하자! <br />

``` Go
func PutJamOnBread(bread *Bread, jam *SpoonOfStrawberry) {
	bread.val += " + Strawberry Jam"
}
```

그 다음 5번을 작성하자! <br />

``` Go
type Sandwitch struct {
	val string
}

func MakeSandwitch(breads []*Bread) *Sandwitch {
	sandwitch := &Sandwitch{}
	for i := 0; i < len(breads); i++ {
		sandwitch.val += breads[0].val + " + "
	}
	return sandwitch
}

func main() {
	// 1. 빵 두개를 꺼낸다.
	breads := GetBreads(2)

	// 2. 딸기잼 뚜껑을 연다.
	OpenStrawberryJam(jam)

	// 3. 딸기잼을 한 스푼 퍼서 빵위에 올린다.
	spoon := GetOneSpoon(jam)

	// 4. 딸기잼을 잘 바른다.
	PutJamOnBread(breads[0], spoon)

	// 5. 빵을 덮는다.
	sandwitch := MakeSandwitch(breads)
	// 6. 완성.
	fmt.Println(sandwitch.val)
}
```

이렇게 작성 후 저장을 하고, 오류가 있는 지 체크를 해보자! <br />

``` Go
func GetBreads() []Bread {
	breads := make([]*Bread, 2)
	breads[0] = &Bread{val : "bread"}
	breads[1] = &Bread{val : "bread"}
	return breads
}
```
여기서 에러가 날텐데 retrun type이 포인터 이므로 수정해주고, num를 받을 수 있도록 수정해보자! <br />

``` Go
func GetBreads(num int) []*Bread {
	breads := make([]*Bread, num)
	for i := 0; i < num; i++ {
		breads[i] = &Bread{val: "bread"}
	}

	return breads
}
```

그 후 아래와 같이 undefined: jam이라는 에러를 수정해주자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104549416-31689800-5676-11eb-84d4-f7175bd73d89.png" width = 70%> </img></p>

``` Go
func main() {
	// 1. 빵 두개를 꺼낸다.
	breads := GetBreads(2)

	jam := &StrawbrreyJam{}
	// 2. 딸기잼 뚜껑을 연다.
	OpenStrawberryJam(jam)

	// 3. 딸기잼을 한 스푼 퍼서 빵위에 올린다.
	spoon := GetOneSpoon(jam)

	// 4. 딸기잼을 잘 바른다.
	PutJamOnBread(breads[0], spoon)

	// 5. 빵을 덮는다.
	sandwitch := MakeSandwitch(breads)
	// 6. 완성.
	fmt.Println(sandwitch.val)
}
```
이렇게 수정하면 기본적인 에러는 없는 상태가 된다. <br />
실행시켜보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104549538-71c81600-5676-11eb-9086-c90719aca2ed.png" width = 70%> </img></p>
결과를 보면 Strawberry Jam이 한 번만 나와야 하는데 2번이 나왔다. 그 이유는 

``` Go
func MakeSandwitch(breads []*Bread) *Sandwitch {
	sandwitch := &Sandwitch{}
	for i := 0; i < len(breads); i++ {
		sandwitch.val += breads[0].val + " + "
	}
	return sandwitch
}
```
여기에서 `breads[i]`인데 `breads[0]`로 했기 때문이다. <br />

``` Go
func MakeSandwitch(breads []*Bread) *Sandwitch {
	sandwitch := &Sandwitch{}
	for i := 0; i < len(breads); i++ {
		sandwitch.val += breads[i].val + " + "
	}
	return sandwitch
}
```

위와 같이 수정해준다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104549745-ca97ae80-5676-11eb-8834-6071a1afa911.png" width = 70%> </img></p>
그래서 샌드위치가 완성이 되었다! <br />

이렇게 정해진 순서대로 프로그래밍 하는게 절차적 프로그래밍이다. <br />
사실 절차적 프로그래밍이 문제점만 있는 것이 아니다. 순서가 눈에 보인다는 장점이 있고, 함수 부분들은 복잡하지만 순서 부분은 심플하기 때문에 그 부분만 보면 프로그램의 구조, 흐름이 한 눈에 보이는 장점이 있다.<br />

하지만 분명한 건 이 절차적 프로그래밍은 치명적인 단점이 있고, 그렇기 때문에 OOP가 나온 것인데 이 치명적인 단점은 다음 시간에 알아보도록 하겠다! <br />

## 풀소스
``` Go 
package main

import "fmt"

type Bread struct {
	val string
}

type StrawbrreyJam struct {
	opened bool
}

type SpoonOfStrawberry struct {
}

type Sandwitch struct {
	val string
}

func GetBreads(num int) []*Bread {
	breads := make([]*Bread, num)
	for i := 0; i < num; i++ {
		breads[i] = &Bread{val: "bread"}
	}

	return breads
}

func OpenStrawberryJam(jam *StrawbrreyJam) {
	jam.opened = true
}

func GetOneSpoon(_ *StrawbrreyJam) *SpoonOfStrawberry {
	return &SpoonOfStrawberry{}
}

func PutJamOnBread(bread *Bread, jam *SpoonOfStrawberry) {
	bread.val += " + Strawberry Jam"
}

func MakeSandwitch(breads []*Bread) *Sandwitch {
	sandwitch := &Sandwitch{}
	for i := 0; i < len(breads); i++ {
		sandwitch.val += breads[i].val + " + "
	}
	return sandwitch
}

func main() {
	// 1. 빵 두개를 꺼낸다.
	breads := GetBreads(2)

	jam := &StrawbrreyJam{}
	// 2. 딸기잼 뚜껑을 연다.
	OpenStrawberryJam(jam)

	// 3. 딸기잼을 한 스푼 퍼서 빵위에 올린다.
	spoon := GetOneSpoon(jam)

	// 4. 딸기잼을 잘 바른다.
	PutJamOnBread(breads[0], spoon)

	// 5. 빵을 덮는다.
	sandwitch := MakeSandwitch(breads)
	// 6. 완성.
	fmt.Println(sandwitch.val)
}
```
