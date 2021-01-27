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
**단일 책임 원칙**은 **하나의 객체는 하나의 책임을 가져야 한다.** 는 의미이다. <br />

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





