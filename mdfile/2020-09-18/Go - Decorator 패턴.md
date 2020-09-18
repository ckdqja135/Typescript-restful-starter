###  시작

##### Decorator?
기본 기능에 추가할 수 있는 많은 종류의 부가 기능에서 파생되는 다양한 조합을 동적으로 구현할 수 있는 패턴이다. <br />

실제 예로 들면 Data를 어떤 사람에게 보낼려 할 때 '압축'을 해서 보낸다던지, '암호화'를 해서 보낸다던지, 나중에 추적할 수 있도록'log'를 단다던지, <br />
마케팅 서버가 있다면 그 곳에 보낸 다 던지, 등의 기능들이 추가 되는 것이 Decorator이다.

그렇다면 왜 Decorator를 사용할까? 앞서 설명했던 '압축', '암호화', 'log', '마케팅요소'등을 하나로 뭉쳐서 만들 수도 있지만 이 부가기능들은 대체로 잘 바뀌는 특성이 있다. <br />
그래서 Data(오리지날 기능)는 바뀌지 않는데, 부가기능들이 바뀔 때 마다 다 바꾸어주어야 하기 때문이며, 이는 SOLID원칙에 어긋나기 때문이다. <br />

그런데 이것을 따로 따로 만들면 바뀌는 기능 하나만 바꾸면 된다. <br />

그러면 '어떻게 구현 할 것인가?' 에 대한것이 '디자인 패턴화' 했다고 표현한다.

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93545726-1b82e900-f99c-11ea-849b-ced2a5cb1fa3.png" width = 70%> </img></p>

맨 위 Componenet(컴포넌트)라는 것은 interface이고, operation()이라는 function을 가지고 있다. <br />
그리고 이 것을 구현한 게 두 개가 있는데 첫번째가 ConcreteComponent인데 실제로 Componenet interface를 구현했고, operation()을 가지고 있다. <br />
ConcreteComponent는 기본 기능을 만들었다고 생각하면 된다. 볼펜으로 따지면 글쓰는 기능이 된다. <br />
Decorator는 component interface를 맴버 변수로 가지고 있다. Componenet를 구현하고 동시에 맴버 변수로 다른 Componenet interface를 들고 있는 것이다. <br />
그래서 이것이 operation()하면 Decorator가 가지고 있는 component안에도 operation()를 호출하고 호출이 끝나면 자기 것을 하는데 <br />
이 Decorator가 상속해서 있는 것이 ConcreteDecorator가 있는데 '부가기능'을 의미한다. 예를들어 '압축'을 한다거나, '암호화'를 한다거나 등의 기능을 담당한다. <br />
ConcreteDecorator의 operation()이 호출이 되면 자기가 가지고 있는 맴버 변수의 컴포넌트(Decorator 의 컴포넌트)를 먼저 호출하고, 그 다음에 자기 것을 호출하는 형태이다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93547333-cba62100-f99f-11ea-97bd-e0e4ebe0f52a.png" width = 70%> </img></p>
이거는 또 다른 예제인데, UI에서 윈도우를 그린것이라고 생각하면 된다. <br />
Window라는 interface가 있는데 darw(), getDescription()이 있다고 치면 얘네를 구현한 SimpleWindow라는 것이 있는데 <br />
SimpleWindow에게 종, 횡 스크롤바를 부가기능을 넣는다 할 때 draw, getDescription이 있기 때문에 이 Window 자체 기능이 아니다. <br />
그래서 SimpleWindow는 Window 자체 기능을 담당 하는 것이고, Window를 상속 받아서 WindowDecorator라는 것이 있는데 이것은 Window를 맴버 변수로 가지고 있다.
이것을 구현한 맴버 구조체가 두가지가 있는데 HorizontalScrollBarDecorator(횡스크롤 바)와 VerticalScrollBarDecorator(종 스크롤바) 가 있다.
기본 기능은 SimpleWindow가 있는데 여기에 저 둘을 붙이는 것이다. <br />
그래서 VerticalScrollBarDecorator가 있고, VerticalScrollBarDecorator이 다시 HorizontalScrollBarDecorator를 맴버 변수로 가지고 있고, <br />
HorizontalScrollBarDecorator이 SimpleWinodw를 맴버 변수로 가지고 있는 상태이다. <br />
그래서 맨 앞에 있는 VerticalScrollBarDecorator을 호출하게 되면 HorizontalScrollBarDecorator의 draw()을 호출하게 되고, HorizontalScrollBarDecorator의 draw()을 호출하게 되면, <br />
SimpleWindow의 draw()가 호출하게 된다. 그 다음 SimpleWindow의 draw()가 호출이 끝나면 return되서 횡 스크롤 바가 본인의 스크롤을 그리게 되고, 또 return되서 종 스크롤바가 본인의 스크롤을 그리게 된다. <br /> 
그래서 SimpleWindow가 먼저 그려지게 되고, 횡 스크롤 붙이고, 종 스크롤 붙여서 하나의 과정이 되는 것을 그린 것이다. <br />















