## 시작
OOD(Object-oriented design)는 Object 중심의 설계 방법이다. <br />

실제 코딩하는 것보다 설계가 중요한 이유는 설계된 밑바탕이 잘 되어 있어야 그걸 기반으로 개발자들이 코딩을 할 때 잘 할 수 있는데 예전(Unix, OS2) 한 사람이 주도적으로 코딩을 했지만 <br />
현재에 와서는 혼자서 하기엔 규모가 커졌기 때문에 수 백명의 개발자들이 하나의 프로그램을 만든다. 그렇기 때문에 각자 자기가 맡은 부분에서 코딩을 잘 할 수 있도록 잘 나눠주고, 모듈을 잘 조율 시켜주는 사람이 **아키텍쳐**이다. <br />

OOD는 그 설계를 할 때 Object중심으로 설계를 해야 좋은 코드를 짤 수 있다는 것을 말한다. <br />

OOD에서 5가지 법칙이 있는데 그것을 **SOLID**라고 한다. 각자 앞글자를 따서 만든 것이다. <br />
> S - [단일 책임 원칙 Single responsibility principle](https://ko.wikipedia.org/wiki/%EB%8B%A8%EC%9D%BC_%EC%B1%85%EC%9E%84_%EC%9B%90%EC%B9%99) <br />
> O - [개방-폐쇄 원칙 (Open/closed principle)](https://ko.wikipedia.org/wiki/%EA%B0%9C%EB%B0%A9-%ED%8F%90%EC%87%84_%EC%9B%90%EC%B9%99) <br />
> L - [리스코프 치환 원칙 (Liskov substitution principle)](https://ko.wikipedia.org/wiki/%EB%A6%AC%EC%8A%A4%EC%BD%94%ED%94%84_%EC%B9%98%ED%99%98_%EC%9B%90%EC%B9%99) <br />
> I - [인터페이스 분리 원칙 (Interface segregation principle)](https://ko.wikipedia.org/wiki/%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4_%EB%B6%84%EB%A6%AC_%EC%9B%90%EC%B9%99) <br />
> D - [의존관계 역전 원칙 (Dependency inversion principle)](https://ko.wikipedia.org/wiki/%EC%9D%98%EC%A1%B4%EA%B4%80%EA%B3%84_%EC%97%AD%EC%A0%84_%EC%9B%90%EC%B9%99) <br />

각자 설명하기 앞서서 이걸 얘기하는 이유는 S.O.L.I.D가 가장 중요하기 때문인데, 코딩 강좌, 강의를 보면 이런 얘기를 하는 경우가 드물다. <br />
기초 단계에서는 이 얘기를 하더라도 잘 와닿지 않기 때문이고, 어렵고, 이해가 안되기 때문인데 현업에서 개발을 하다보면 이 얘기가 많이 와닿을 것이다. <br />
S.O.L.I.D는 내가 OOP로 프로그래밍을 한다고 했을 때 내가 지향해야 될 목표이다. <br />
이 5가지만 내가 지향하겠다 하면 지금 보다 점점 훌륭한 코드를 만들 수 있을 것이고, 이 5가지는 이상향에 가깝기 때문에 이것을 달성하겠다는 목표가 아니라(우리가 달성할 수 없기 때문에) 지향하겠다고 잡아야하고, 이걸 달성한다 하더라도 그게 좋은 코드도 아니다. <br />

어느 정도 수준에서 타협을 하고 할지가 정해질 뿐이지 이걸 달성한다는 건 없다. <br />

항상 실무에서는 어디까지 타협할 것인지 타협점이 필요하다. Trade off가 있어야 하지만 실무에서 현실적으로 할 수 없기 때문에 타협을 하는 것일 뿐이지 이걸 내팽겨치고 무시해선 안된다는 것을 알아야 한다. <br />

이제 하나 하나 말해보자면 먼저 **Single responsibility principle(단일 책임 원칙)**은 가장 단순하면서 가장 중요한 원칙이라고 생각하면 된다. 이해하기 쉽고, 단순하지만 지키기가 쉽지 않고, <br />
다 지켰다고 해서 좋은 코드가 아니지만 이렇게 가도록 노력을 할 필요가 있다. <br />
**단일 책임 원칙**은 **하나의 객체는 하나의 책임을 가져야 한다.** 는 의미이다. 줄임말로 SRP라고 한다.<br />

예를 들어 보면 예금 잔고 라는 객체가 있는데 이 객체의 기능중에 입금과 출금이라는 기능이 있다 가정해보자. <br />
이 때 이 객체는 입금과 출금이라는 2개의 책임을 갖는지, 입,출금 이라는 1개의 책임을 갖는지 의견이 생길 수 있다. <br />
단일 책임의 원칙에 위배 되는 것인가? 아니면 입금과 출금을 따로 두어야 하는 것인가? 아니면 입,출금으로 하나로 볼 수 있을 것인가? 생각해 보아야 하지만 이건 어떤 것이 맞다, 틀리다를 얘기 할 수 있는 것이 아니다. <br />

답은 2개다 맞다. 입금 객체와 출금 객체를 따로 나누어도 되고, 입,출금을 하나의 책임으로 봐서 하나로 묶어도 된다. <br />

그래서 단일 책임 원칙 이라는 것은 어떤 정해진 규칙이 있는게 아니라 각 프로그램의 성격마다 어디까지를 이 객체의 책임으로 볼 것 인지를 고민 해야 한다. <br />

그런데 만약에 어떤 객체가 있는데 이 객체가 하는 일이 두 개의 책임을 갖고 있다 했을 때 이 것은 단일 책임 원칙에 위배 되기 때문에 각각 나누어야 한다. <br />

코드로 예를 들어보자면 <br />

``` Go
package main

type FinanceReport struct {
	
}
```

이렇게 FinanceReport라는 struct가 있다고 가정해보자. <br />

``` Go
func (r *FinanceReport) MakeReport() *Report {
	// ...
}

func (r *FinanceReport) SendReport(email string)  {
	
}
```

FinanceReport의 메소드에 Report를 만들어주는 MakeReport()와 email을 받아 Report를 전송하는 SendReport()가 있다고 해보자. <br />
이 때 FinanceReport라는 객체는 2가지 일을 하게 되는 것이다. <br />

만약에 이 객체가 SendReport를 email로 하는데 나중에 프로그램이 확장 되면서 Send하는게 email이 아니고, 어떤 Http홈페이지 형태로 만든다거나, Network의 패킷 형태로 보낸다던지, File형태로 나온다 했을 경우 <br />

SendReportHttp(Http), SendReportNetwork(Network), SendReportFile(File) 이런식으로 추가가 되어야 하는데 이걸 생각해보면 애시당초 객체 자체의 설계를 잘 못 했기 때문에 <br />
이걸 계속 추가해야 하는 상황이 생기게 된다. <br />

그래서 이 객체는 단일 책임 원칙에 위배되는 상황이기 때문에 MakeReport()와 SendReport()는 분리 되어야 한다. <br />

그래서 <br />

``` Go
type ReportSender struct {

}
```

ReportSender라는 객체가 있고, 또는 이것을 interface로 만들어 줄 수 있다. <br />

``` Go
type ReportSender interface {
	SendReport(*Report)
}
```

여기서 SendReport라는 관계가 있고, 입력을 Report로 받는 interface가 있다고 가정해보자. <br />

그리고 <br />

``` Go
type EmailReportSender struct {

}

func (s *EmailReportSender) SendReport(r *Report) {
	// ... Send Eamil
}
```

EmailReportSender라는 객체가 있고, 이것의 메소드를 SendReport라고 하고, Report를 받아서 이메일을 발송하도록 한다 가정해보자. <br />

이렇게 하면 책임을 분리 시켰기 때문에 FinanceReport는 더 이상 Send하는 역할이 없다. <br />

그러다가 File로 Send하는 것이 필요하다고 한다면 또 만들면 된다. <br />

``` Go
type FileReportSender struct {

}

func (s *FileReportSender) SendReport(r *Report) {
	// ... make file
}
```

그래서 어떤 확장이 생길 때 마다 객체만 추가해주면 된다. <br />

그 전에는 FinanceReport가 두가지의 책임이 있었기 때문에 Sned방식이 바뀔 때마다 SendReport()라는 함수 자체를 바꿔주어야 했었다. <br />
그 전 같았으면 <br />

``` Go
func (s *FinanceReport) SendReport(method int) {
	switch method {
	case 1:
		// send Email
	case 2:
		// make file
	case 3:
		// http
	case 4:
		// network
	}
}
```

이런식으로 어떤 방법이 추가될 때 마다 이 함수를 변경 해주어야 했을 것이다. 이거는 애시당초 설계가 잘못 되었기 때문에 Send기능을 분리하고 interface를 만듦으로써 <br />
기존 코드를 건드리지 않고, 기존 함수를 고치지 않고 손쉬운 확장이 된다. <br />

이렇게 단일 객체가 단일 책임을 가짐으로써 손쉽게 확장이 가능하게 만드는 구조가 된다.  <br />

두번째는 개방-폐쇄 원칙 (Open/closed principle)인데 확장에는 열려있고, 변경에는 닫혀있다는 의미이다. 줄여서 OCP라고 하는데 <br />

OCP예제는 단일 책임 원칙예제와 동일하다. 예를 들어 <br />

``` Go
package main

type FinanceReport struct {
}

func (r *FinanceReport) MakeReport() *Report {
	// ...
}

func (s *FinanceReport) SendReport(method int) {
	switch method {
	case 1:
		// send Email
	case 2:
		// make file
	case 3:
		// http
	case 4:
		// network
	}
}
```

FinanceReport가 두가지의 책임을 가지고 있다고 했었는데 SendReport라는 struct가 있고, MakeReport()는 없다고 쳐보자. <br />

``` Go
package main

type SendReport struct {
}

func (s *FinanceReport) Send(r *Report, method int) {
	switch method {
	case 1:
		// send Email
	case 2:
		// make file
	case 3:
		// http
	case 4:
		// network
	}
}
```

이렇게 하나의 책임만 가지고 있다 가정하면 Send라는 함수를 보게되면 확장에는 열려있고, 변경에는 닫혀있지 않다. <br />
그래서 어떤 새로운 기능이 방법이 추가 되면 Send라는 함수를 변경해야 한다. <br />

변경이 닫혀있다는 말은 어떤 객체가 만들어지게 되면 그 객체의 기능이 확장되더라도 그 코드를 건드릴 필요가 없어야 변경이 닫혀있다고 말을 할 수 있는데 <br />

``` Go
func (s *FinanceReport) Send(r *Report, method int) {
	switch method {
	case 1:
		// send Email
	case 2:
		// make file
	case 3:
		// http
	case 4:
		// network
	}
}
```

이 프로그램 자체가 새로운 Send방식이 추가 될 때마다 기존의 코드들을 고쳐주어야 하기 때문에 이건 변경이 닫혀있지 않는데 <br />

``` Go
type ReportSender interface {
	SendReport(*Report)
}

type EmailReportSender struct {
}

func (s *EmailReportSender) SendReport(r *Report) {
	// ... Send Eamil
}


type FileReportSender struct {
}
```

이렇게 인터페이스를 만든다음에 Email까지 만들어서 Email과 File 두 가지 방식으로 나간다고 치고, HTTP로 보낼 필요가 있을 때 마찬가지로 type만 추가하면된다. <br />

``` Go
type HttpReportSender struct {
}

func (s *HttpReportSender)SendReport() {

}
```

이렇게 type 추가하고, 새로운 기능만 넣어주면 된다. <br /
그렇게 되면 확장에는 열려있는 상태가 되고, 변경이 닫혀 있는 상태가 되는데 기존 코드를 건드릴 필요가 없기 때문인데 이렇게 되면 OCP의 법칙에 부합한다 볼 수 있다. <br />

지금까지 SRP와 OCP에 대해 알아 보았는데 이 두 가지가 아주 중요하다. <br />
이 두 가지만 잘 지켜도 엄청 좋은 코드를 만들 수 있다. <br />
프로그램이 변경될 때 마다 여러 군데를 바꾸어야 하는 상황이 생기지 않는다. <br />

그 다음은 L인 리스코프 치환 원칙 (Liskov substitution principle)이다. <br />
리스코프는 컴퓨터 과학쪽에 유명한 사람 이름이고, 그 사람이 말한 얘기이다. <br />
그리고 이 원칙은 OOD의 5가지 원칙중에 가장 어렵고, 이해하기 힘들다는 원칙중에 하나이다. <br />

정의를 보자면 <br />
O(x)라는 함수가 있고, 이 때 x는 T라는 객체의 인스턴스이고 <br />
O(y)는 S라는 타입의 인스턴스이고, 이 S는 T의 확장타입이다. (S <- T) <br />
그렇다고 했을 때 O(x)와 O(y)는 똑같이 동작해야 한다는 의미이다. <br />

그러니까 객체에 어떤 함수가 있을 때 이 함수의 인자는 베이스타입을 받는데, 이 베이스타입을 확장 타입의 인자로 넘기더라도 동작 방식이 똑같아야 한다는 것이다. <br />

단순하게 보면 Base Type의 기존 함수를(또는 동작을) 바꾸지 말라는 의미이다. <br />
그러니까 확장한 타입(Eexpanded type)이 기존 타입의 동작을 바꾸지 말라는 것인데 <br />
상속의 기본 동작중에 하나가 기존 함수를 오버라이드해서 바꾸는 방법이 있는데 그렇게 하지 말라는 것이다. <br />
그렇게 했을 때 컨트롤 하기 힘든 문제가 생기기 때문이다. <br />

상속을 좋아하는 분들은 이 이야기가 와닿을 수 있다. 그 문제를 겪어보면 왜 이게 중요한지 알 수 있게 된다.<br />

그렇지만 한가지 중요한 점은 Golang에서는 적어도 리스코프 치환을 걱정할 필요가 없다. Golang에서는 상속을 지원하지 않기 때문이다. <br />
그렇기 때문에 Base Type 함수의 동작을 바꿀 이유도, 바꿀 수 도 없다. <br />
Golang에서는 오직 Interface지원한다 그 이유는 Golang에서는 상속이 갖는 리스코프 치환이론을 위배하는 문제들을 굉장히 많이 봐왔기 때문에 Golang을 만든 분들은 상속을 없애 버렸다. <br />

그래서 어떤 사람들은 Golang은 OOP Language가 아니다. 라고 한다. 그 이유는 상속을 지원하지 않기 때문인데 상속이 없는 프로그램은 OOP가 아니다라고 말하는데 <br />
OOP와 상속은 상관이 없는 이야기이다. OOP의 정의에 상속을 해야한다는 내용은 어디에도 나와있지 않는다. <br />
상속을 해야 OOP는 잘못된 생각이라고 생각한다. <br />

오히려 상속 자체가 OOP를 위배하는 경우가 생긴다. OOP의 디자인 법칙인 LSP을 상속이 위배하는 경우가 있기 때문에 잘 써야 하는 것이고, 그렇지 못한 경우엔 아예 안쓰는게 맞다. <br />

Golang이 깔끔한 언어 자체를 추구 하기 때문에 상속을 없애는 결정은 환영하는 입장이다. <br />
물론 상속이 없기 때문에 코딩하다보면 '이건 상속이 있으면 금방 해결될 거 같은데..' 하는 경우들이 생기지만 쉬운길을 택하다 코드를 망치는 것보다 <br />
어렵더라도 깔끔한 코드를 짜는게 좋기 때문에 Golang의 방식이 찬성한다. <Br />

그 다음인 I, 인터페이스 분리 원칙 (Interface segregation principle)이다. <br />
여러개의 관계(인터페이스는 관계를 정의하는 것임)를 모아놓은 인터페이스보다 각자 관계를 하나씩 정의하는게 더 좋다.는 의미이다. <br />

이번에는 게임에서 예를 들어볼 것인데 <br />

``` Go
package main

type Actor interface {
	Move()
	Attack()
	Talk()
}

func (a *Actor) Move() {

}

func (a *Actor) Attack() {
	
}

func (a *Actor) Talk() {
	
}
```

Actor라는 interface가 있는데 어떤 동작을 하는 모든 것들을 말한다. ex) 플레이어 캐릭터나, NPC, 몬스터 <br />
Actor가 하는 일은 움직인다거나, 공격을 한다거나, 대화를 하는 등의 기능을 가질 수 있는데 이거를 위와같이 하나로 관계를 모은 것보다 <br />

``` Go
type Talkable interface {
	Talk()
}

type Attackable interface {
	Attack()
}

type Moveable interface {
	Move()
}
```

이런식으로 하나의 인터페이스에서 각자 관계를 정의 해놓은 것이 낫다는 의미이다. <br />

이게 왜 더 낫냐면 의존성을 떨어뜨리기 때문인데 <br />

``` Go
type Actor interface {
	Move()
	Attack()
	Talk()
}
```

이렇게 묶여 있으면 언제나 의존성을 발생시키기 때문인데 어떤 함수가 있을 때 <br />
예를 들면 MoveTo()라는 함수가 있다고 가정해보자. <br />

``` Go
func MoveTo(a Actor) {
	a.Move()
	a.Attack()	
}
```

인자로 Actor를 받아서 MoveTo라는 함수는 해당 Actor를 어디에서 어디로 움직이도록 할 수 있겠지만 Attack()을 호출해도 상관이 없게 된다. <br />
Actor라는 인터페이스는 두 기능 다 포함하고 있기 때문인데 이 함수에서 Move()와 Attack() 두 개를 한꺼번에 하는 것은 SRP에 어긋나는 행위이다. <br />
SRP는 함수에도 적용이 되기 때문에 이 함수는 단일 책임만 져야 한다. <br />

만약에 아래의 코드 같이<br />

``` Go
func MoveTo(a Moveable) {
	a.Move()
}
```

Moveable을 받았다면 이 인터페이스는 Move()만 관계로 가지고 있기 때문에 Move만 할 수 있을 것이다. <br />
그래서 SRP를 벗어나지 않도록 해준다. <br />

그리고 마지막인 D, 의존관계 역전 원칙 (Dependency inversion principle)인데 어떤 관계는 인터페이스에 의존해야지 객체에 의존하면 안된다는 것이다. <br />
어떤 객체가 다른 객체와 관계를 맺을 때 이 관계는 인터페이스에 의존해야지 객체에 의존하면 안된다는 것이다. <br />

물론 안된다고 강하게 말을 했지만 사실 '의존하는게 더 좋다.'라고 볼 수 있다. 이건 강제적인 것은 아니다. <br />
이렇게 가는게 더 좋지 현실적인 문제 때문에 이렇게 못하더라도 이렇게 하는게 더 좋다는 것이다. <br />

역시 마찬가지로 게임에대해 예를 들어보면 <br />

``` Go
type Player struct {
}

type Monster struct {
}

func (p *Player) Attack(m *Monster) {
}
```

Player라는 객체와 Monster객체가 있고, Player의 메소드로 Attack이 있고, 이 때의 타겟은 Monster라고 해보자. <br />
이랬을 때 Attack은 Player가 Monster를 때리게 된다. <br />

그런데 Player가 Player를 때리지 못할까? 때릴 수 있다. <br />
반대로 Monster가 Player를 때릴 수 도 있고, Monster가 Monster를 때릴 수 있을 것이다. <br />

그랬을 때 이걸 메소드로 각각 정의해보면 <br />

``` Go
type Monster struct {
}

func (p *Player) Attack(m *Monster) {
}

func (p *Player) Attack(p *Player) {
}

func (m *Monster) Attack(p *Player) {
}

func (m *Monster) Attack(m *Monster) {
}
```
이렇게 되는데 이렇게 관계를 각각 따로 따로 정의해주어야 한다. <br />
또 이외에도 Player가 때릴 수 있는 Object가 있다 가정해보자. 그래서 상자가 있는데 Player가 상자를 때리면 부술 수 있도록 한다고 해보자. <br />

``` Go
type Monster struct {
}

type Chest struct {
}
....

```

그렇게 되면 상자가 Player를 때릴 수도 있는 것이고, Monster를 때릴 수도 있는 것이고, Monster가 상자를 때릴 수도 있기 때문에 각 관계에 대해서 함수를 다 추가를 해주어야 한다.  <br />
이것도 OCP에 어긋나게 된다. 확장에는 열려있고, 변경에는 닫혀있어야 하는데 하나 추가하면 다 바꾸어주어야 하기 때문에 변경에는 닫혀있지 않게 된다. <br />

그런데 이걸 이렇게 하지 않고, 인터페이스에 의존하게 되면 <br />

``` Go
type Attackable interface {
	Attack()
	BeAttacked()
}
```

위와 같이 Attackable라는 인터페이스가 있다고 가정해보자. <br />
이 부분은 SRP에 벗어나지 않는다. 공격을 할 수도 있고, 공격할 대상에게 공격 당할 수 도 있게 되기 때문인데 <br />

물론 프로그램에 따라서 저것들을 분리시킬 수도 있다. <br />

``` Go
type Attackable interface {
	Attack()
}

type BeAttackable interface {
	BeAttacked()
}
```

이건 프로그램의 성격과 그 프로그램에서 이 객체가 어떻냐에 따라 틀린데 위와 같이 했을 경우, 어떤 객체는 공격만 가능하지 맞진 않는다, 막기만 가능하지 공격하진 않는다. 이런 부분들이 있을 경우 분리 하는게 맞고 <br />

공격할 수 있으면 무조건 맞는다는 규칙이 있다면 <br />

``` Go
type Attackable interface {
	Attack()
	BeAttacked()
}
```

이렇게 갈 수 있다는 것이다. <br />

``` Go
type Attackable interface {
	Attack(BeAttackable)
}

type BeAttackable interface {
	BeAttacked()
}

func Attack(attacker *Attackable, defender *BeAttacked) {
	attacker.Attack(defender)
}
```

이렇게 Attack이라는 함수에서 저렇게 인자를 받고, `attacker.Attack(defender)`이렇게 써 주면 Player나 Monster struct에 Attack(), BeAttacked()만 정의 해주면 각 조건에 맞게 관계별로 자동으로 풀리게 된다. 기존코드 수정없이 확장될 때 확장 코드만 써주면 된다. <br />

이렇게 만들었을 때 <br />

``` Go
type Player struct {
}

func (p *Player) Attack(target *BeAttackable) {
	// ...
}

type Monster struct {
}

func (m *Monster) Attack(target *BeAttackable) {
	// ...
}
```

Player, Monster가 공격할 수 있는 메소드를 만들 수 있게 된다. 상자도 마찬가지이다.<br />
이렇게 하면 OCP도 만족하고, SRP도 만족하고, DIP도 만족하고, 인터페이스를 분리시켰기 때문에 ISP도 만족하게 된다. <Br />

SOLID의 법칙이 하나로 연결 되어 있다는 것을 알 수 있다. <br />
따로 떨어져서 보면 틀리지만 모두 다 좋은 프로그래밍을 지원하는 것이다. <br />
그리고 이 다섯 가지 규칙 모두 **O**인 **OCP**를 위한 것이다. <br />

이거를 하기 위해서 S, L, I, D가 필요한 것이고, 각각 다르지만 모두 다 협력해서 좋은 프로그램을 향해 나아가는 것이고, 그 좋은 프로그램이 뭐냐고 했을 때 <br /.
의존성을 낮추고, 응집성을 높이는게 좋은 프로그램이고, 이게 다 SOLID라는 것이다. <br />
그리고 패턴이라는 것도 SOLID를 하기 위해서 패턴이 나온것이고 SOLID는 결국 의존성을 낮추고, 응집성을 올리는 것이다. <br />
