## 시작
들어가기 앞서서 한 가지 소개할 것이 있는데 소프트웨어 공학쪽에 유명한 책이 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/99337366-7a45df80-28c5-11eb-86a8-12578775f454.png" width = 70%> </img></p>

[맨먼스 미신](https://www.amazon.com/Mythical-Man-Month-Software-Engineering-Anniversary/dp/0201835959)이라는 책인데 여기서 나오는 유명한 말이 있다. <br />

``` TEXT

  There is no silver bullet.
  은총알은 없다.
  
```

은총알은 늑대인간을 죽일 때 사용되는 총알이다. 여기서의 은총알은 모든 문제를 한방에 해결하는 솔루션을 의미하는데 <br />
한방에 모든 문제를 해결하는 솔루션은 존재하지 않는다. 라는 의미이다.<br />
즉, 어떤 기술을 가져오더라도 그것이 한방에 해결하는 솔루션이 아니며, 항상 장단점이 생기기 때문에 무조건 다 좋은 것이거나 장점만 가지고 있는 것은 없다. <br />

그렇기 때문에 TDD도 마찬가지이다. <br />
우선 장점부터 보자! <br />
#### 첫번째 장점으로 Test Case가 많아진다. <br />
Test를 먼저 만들고 코딩을 하기 때문에 Test Case가 많을 수 밖에 없다. <br />
unit-test를 할 때는 테스트가 많을 수록 좋은데 물론 테스트의 퀄리티도 좋지만 테스트의 갯수도 중요하다. <br />

TDD가 아니라 기존 개발방식(설계 - 구현 - 테스트)에는 설계 - 구현 사이 또는 구현 - 테스트 사이에 테스트 케이스를 만드는데 <br />
보통 경우엔 QA 테스터들이 설계 - 구현 사이에 설계문서를 보고 Test Case를 만들게 되고, 개발자들은 설계문서를 보고 구현을 하기 시작한다. <br />
그래서 동시에 시작해서 구현이 끝나면 만들어진 Test Case를 토대로 테스트를 진행하게 된다. <br />
여기서 문제는 대부분의 QA하는 사람들이 Test Case를 만들 때 설계문서 기반을 보고 성공 시나리오(기본 유저 스토리)에 따라서 만든다. <br />
여기서 얼마나 촘촘하게 테스트케이스를 만드느냐는 QA하는 사람들의 역량이다. <br /> 
그럼에도 불구하고 설계문서를 토대로 만들기 때문에 빈 곳이 분명히 존재한다. <br />

그런데 TDD를 하게 되면 Test Case를 먼저 만들고, 구현을 하고, 이것을 고치는 과정을 반복하기 때문에 Test Case가 더 촘촘해진다는 장점이 있다. <br />

#### 두번째 장점으로 유지보수가 쉬워진다. <br />
TDD를 하는 대부분의 이유가 여기에 있다. <br />
Test Case를 많이 만든다, 테스트를 한다는 의미는 어떤 제품을 만들었을 때 정상적으로 동작하는지 테스트 하는 것인데 이게 첫번째 이유이고, <br />
두번째는 일정 범위 안에서 벗어나면 안된다는 가이드라인을 만드는 것인데 그 안에 있는 물건이 바뀌더라도 일정 범위안에서 벗어나면 안되는 것을 잡아주는 것이다. <br />

예전에는 소프트웨어가 Package형태의 제품으로 나왔었는데 지금은 Package형태의 제품에서 Service형태로 바뀌었다. <br />
예를 들면 예전의 아래한글은 3.0, 4.0버전이 있었고, 그것을 일일이 구매를 했어야 했는데 지금은 Facebook이 1.0버전, 2.0버전이 아닌 <br />
endless형태로 계속 고쳐나가면서 발전하는 형태로 나아가는 방식으로 바뀌었다. <br />
facebook이 처음 발표 되었을 때와 지금과 비교했을 때 여러가지 기능들이 많아졌을 때 사용자들이 facebook1.0깔았다가 지우고 2.0 깔았다가 지우는 행위를 하는 것이 아니라 <br />
그냥 facebook만 했을 뿐인데 지속적으로 바뀌는 service형태로 바뀌었다. <br />

또 다른 얘기를 해보면 스파게티코드(산탄총코드)가 있는데 여러 패키지들이 종속성이 많이 걸려 복잡도가 높은 코드가 있다고 가정해보자 <br />
아주 작은 부분만 변경 하려고 했을 때 다른 부분이 문제가 터지기 시작한다. 전혀 문제가 될 거 같지 않았던 것들이 사실은 서로 연결 되어져 있는 상태 였던 것이다. <br />
그런데 이 부분은 코드 상에서는 복잡하기 때문에 그 코드를 바꾸려는 개발자가 판단하기가 힘들다. <br />
그래서 한 쪽을 고쳤는데 다른쪽에서 문제가 발생하는 일들이 많이 일어난다. <br />
그런데 더 큰 문제는 바꾸려는 사람이 코드 하나를 수정했을 때 바로 에러가 터지면 그 사람이 잘못했다는 걸 알고 다시하면 되지만 <br />
개발자가 수정했을 때 일반적인 시나리오상에선 문제없이 동작을 하게 되고, 테스터(QA)들이 테스팅을 해도 문제없이 동작해서 안전하다 판단되어 외부로 release해서 공개시켰을 때 <br />
갑자기 일반적이지 않는 경로에서 많은 문제들이 발생하게 되고, 생각보다 빨리 터진다. 이런 상황에선 돌리기도 힘들게 되고, 뭐 하나 건드릴 수 없는 상황이 된다. <br />

그런데 같은 모듈들이 얽히고, 복잡한 코드라고해도 테스트 코드가 촘촘하게 박혀있어서 가이드라인이 확실하게 구분되어 있고, 가이드 라인이 바로바로 확인할 수 있는 구조라면 <br />
한 쪽 코드를 수정했을 때 바로 다른쪽 테스트 케이스가 문제가 발생하기 때문에 어떤 코드가 어떤 영향을 주는지 내부적으로 파악할 수 있고, <br />
개발자쪽에서 파악하지 못하더라도 자동화된 QA쪽에서 파악을 할 수 있기 때문에 테스트코드가 촘촘하면 유지보수가 쉬워지는 것이고, 코드를 바꾸기가 쉬워진다. <br />
그래서 코드를 수정하는데 있어서 내쪽에서 나오지 않아도 QA쪽에서 파악 된다라는 믿음이 있기 때문에 겁을 낼 필요가 없고, 자신감이 생긴다. <br />

#### 세번째 장점으로 코딩이 재밌어진다. <br />
유지보수 때 말했던 것처럼 자신감이 생겨서 코딩이 재밌어 지는 것도 있고, <br />
TDD 코딩 방식 자체가 실패에서 성공으로 나아가는 것이다. <br />
처음에 구현도 되지 않은 상태에서 테스트를 하니까 먼저 실패하고, 구현을 하고, 리팩토링을 하고, 다시 테스트 케이스를 만들어서 실패하는 과정이 반복되는데 <br />
이것은 돌 다리도 두들겨보고 지나가듯이 한발짝 한발짝씩 두드려보며 건너는 방식이라 생각하면 된다. 그래서 리듬감도 있고, 재밌어진다.<br />
바로 이룰 수 있는 단순한 목적을 만들고, 그것을 이루고, 강화하는 과정들을 빠르게 반복하게 된다. <br />

그리고 코딩패러다임의 변화를 볼 수 있는데
``` Text

  눈 앞에 보이는 것을 먼저 해결한다. 

```
라는 패러다임 쉬프트가 가능하다. <br />

기존에 설계 - 구현 - 테스트 할 때는 설계에서 이미 제품이 다 끝난 상황이 나와야 한다. <br />
설계가 완벽해야 구현도 잘 나오기 때문에 설계가 완벽해야 하는데 실제로는 설계가 완벽할 수 없기 때문에 구현도 완벽할 수 없다. <br />
그리고 테스트도 설계 기반으로 하기 때문에 테스트도 완벽 할 수 없다. 그래서 문제가 생기는데<br />
TDD는 눈앞에 있는 문제를 정의하고, 그것을 해결하고, 다시 눈앞에 보이는 문제를 정의한다. <br />
그렇기 때문에 요즘 나오는 Agile방식과 맞다. <br />

예전에는 설계도 잘하고 구현도 잘하자! 였다면 <br />
요즘에는 설계도 완벽하지 못하고, 구현도 완벽하지 못하기 때문에 테스트도 완벽할 수 없어서 우선 돌아가게는 만들자, 우선 서비스부터 하자, <br />
launch부터 하고, 그 다음을 생각해보자인데 이렇게 했을 때 문제는 <br />
이렇게 빠르게 서비스하려면 유지보수가 좋아야 한다는 조건이 있다. <br />
그러니까 로켓을 띄우는데 완성된 로켓을 띄우는게 아니라 완성이 안된 로켓을 사람들이 만들면서 날라가고 있는 거라고 생각하면 된다. <br />
그래서 이게 가능하려면 날아가고 있는 와중에도 로켓을 부셨다가 만들었다를 할 수 있어야 가능한 일이다. <br />

결국엔 코드가 변화하는 환경에 적응하기 좋아야한다는 것이고, 이것이 유지보수가 좋다는 의미이다. <br />
그래서 망했으면 새로 접고 다른걸 만드는 것이고, 잘 됐으면 고쳐나가면서 올라가는 것이다. 이 점에서 TDD가 탁월하다. <br />

하지만 아까도 말했듯이 은총알은 없기 때문에 단점도 존재한다. <br />

#### 첫 번째 단점은 유저스토리에 대응하기 힘들다.
유저스토리는 어떤 유저가 우리의 서비스를 이용하는데 유저가 서비스에 접속해서 하는 행동(가상 시나리오)을 의미한다. <br />

예를들어 내가 facebook에 접속을 했을 때 제일 먼저 타임라인이 나오고, 그 타임라인에 맘에드는 게시물에 좋아요나 댓글을 다는 행위를 하는데 이것이 하나의 유저스토리이다. <br />
그랬을 때 Test Case는 다음과 같이 만들 수 있다. <br />

``` Text

1. 접속
2. 스크롤바 내리기
3. 좋아요
...

```
이런식으로 일련의 행동들을 할 수 있는데 이것을 잘 되는지 Test Case로 만드는 것이 유저 기반의 Test Case라고 한다. <br />

그런데 TDD는 이것을 하기가 어렵다. <br />
TDD는 기본적으로 unit test이다. unit test가 무엇이냐면 <br />
기본적으로 input과 output이 있을 때 이것들이 잘 되는지 테스트 하는 것이지 어떤 모듈간의 상관관계를 테스트 하는 것이 아니다. <br />
그러니까 타임라인 모듈, 좋아요 모듈, 댓글 모듈이 있다 가정할 때 이것들의 상관관계를 테스트 하는 것이 아니라 <br />
각각 타임라인 따로, 좋아요 따로, 댓글 따로 테스트 할 수 있지만 그것의 연관관계를 테스트 하기는 어렵다. <Br />

그런데 이 단점은 test의 성격이 다르다는 것을 알아야한다. <br />
test는 크게 블랙 박스 test와 화이트 박스 test가 있는데, TDD와 unit는 화이트박스 테스트이다. <br />
그렇다는 것은 내가 코드에 접근하고 코드에 테스트를 거는 것이다. <br />
내가 어떤 모듈을 접근해서 그 모듈 안에 그 기능들이 정확하게 되는지 테스트하는 것이다. <br />
반면에 블랙박스 테스트는 그냥 코드에 접근하지 않고, 통으로 보고 블랙박스에 들어가는 입력과 출력이 잘 나오는지를 확인하는 것이기 때문에 성격이 다르다.<br />

그래서 , 유저 스토리 테스트는 말하자면 블랙박스 테스트이다. <br />
facebook이라는 서비스가 있을 때 거기에 유저의 시나리오가 입력이 되고, 거기에 원하는 결과가 나오는지 바깥에서만 본다. <br />

반대로 화이트 박스 테스트는 각 모듈의 코드에 직접 접근해서 각 함수, 각 클래스가 잘 동작하는지를 확인하는게 화이트 박스 테스트이다. <br />
그래서 TDD의 접근 방식은 모듈들이 잘 동작하는 모듈이면 그것들이 모였을 때 잘 잇기만 하면 동작은 완벽해야한다는 것이다. <Br/>
그렇기 때문에 성격이 다른 테스트여서 TDD만 가지고는 전체 테스트를 다 감당 할 수 있는 도구는 아니다. <br />

그래서 이것도 있지만 매크로를 통한 블랙박스 테스트(smoke 테스트 같은)도 있어야한다. <br />

#### 두번째 단점은 유지 하기가 힘들다. 
이것이 가장 큰 단점인데 이것의 취지에 대해서 팀원들 전체가 공감되어 있어야 하고, 어떻게 해야 잘할 수 있는지 교육을 해야하고, 관리가 필요하다. <br />
그러니까 이게 잘 되고 있는지 아닌지 검토하는 사람, 지켜보는 사람이 있어야 한다. TDD는 처음에는 해보자!! 했다가 흐지부지 되기 쉽다. <br />
그렇기 때문에 리드되는 사람이 TDD에 대한 공감이 있어야 하고, 강력하게 Drive해야한다. <br />
더 중요한건 유지, 관리가 되어야 한다. <br /> 
이 사람들이 TDD를 잘 쓰고 있는지 확인해야한다. 이것이 코드리뷰와 같다. <Br />
그런데 이 코드리뷰도 조금 지나면 흐지부지 해버리기 때문에 관리해주는 사람이 꼭 있어야 한다. <br />
이것은 Agile도 마찬가지다. 문화라는 것은 하루아침에 바뀌지 않기 때문이다. <br />

#### 멀티 쓰레딩 환경에서 테스팅이 어렵다.
안되는 것은 아니지만 쓰레드가 다른 환경에서 테스트를 못 만드는것은 아니지만 어렵다. <br />
그래서 가령 로그인 시나리오로 예를 들면 내 쪽에서 로그인을 요청하면 인증서버로 가야하고, 거기서 로그인을 거쳐서 돌아와야 한다. <br />
근데 내가 이런 테스트를 하려고 할 때 인증서버를 거쳐야 하는데 이렇게 외부 모듈이나 외부 쓰레드를 거쳐야 되는 상황. <br />
이런 상황에서는 Test Case를 만들기가 참 애매해진다. <br />
그리고 인증서버는 테스트 용도로 들어오는 것이랑 실제 서버랑 구분하면 안된다. 그러면 인증이 제대로 안되기 때문이다. 이런 경우 상당히 애매해지는데 <br />
이럴 때는 내가 테스트를 하는 주체를 명확하게 해야한다. 인증 서버를 테스트 할 것인지, 인증서버에 요청과 응답을 테스트 할 것인지 명확하게 해야 한다. <br />
만약에 인증서버를 테스트 하려고 한다면 인증서버 안에서 Test Case를 만들고 테스트를 하면 되고, <br />
그렇지 않고 요청이 잘 오는지, 응답이 오는지 테스트 하고 싶다면 인증서버를 Test하는 것이 아니기 때문에 인증서버를 Mock Up(임시)으로 만든다.
이 Mock Up은 무조건 성공을 날려도 상관없기 때문에 기능이 단순하다. <br />
이렇게 테스트하면 되는데 문제는 이 Mock Up을 만들어야 한다는 것이다. 일이 생긴다는 것이다. <br  />
그래서 TDD를 주장하는 사람들은 이걸 큰 일이 아니라고 보는 사람들이 그렇다. <br />

결론적으로 TDD는 잘 되면 참 좋은데 지금까지 (강의자가) 실무에서 일하면서 잘 된 케이스를 본 적이 없다. <br />
물론 실무에서 잘 된 케이스들이 많은데 그 예가 Open Source Project이다. 이것은 불특정 다수가 들어와서 코드를 헤집어 놓는데 <br />
이럴 때 TDD를 하면 좋다. Open Source Project중에 TDD를 적용해서 Test Coverage라고 해서 Test가 Cover하고 있는 코드가 몇 %인가가 Test Coverage라고 하는데 <br />
Test Coverage 90%이상 100%가까이 되는 Open Source Project들이 많다. <br />
