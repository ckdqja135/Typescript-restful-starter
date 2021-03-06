객체지향개발(Object Oriented Programming)의 특성은 크게 추상화, 캡슐화, 상속성, 다형성이 있다. <br />

## 먼저 객체란 무엇인가?
객체는 실제 세계(real world) 를 모델링 하는 것이다.
OOP 는 실세계르 모델링 하기 위해 추상화(Abstraction)을 사용하는 프로그래밍 패러다임이다.


#### 1) 추상화(Abstraciton)
- **공통의 속성이나 기능을 묶어 이름을 붙이는 것**
- 객체 지향적 관점에서 클래스를 정의하는 것을 바로 추상화라고 정의 내릴 수 있겠다. <br />
- 좀 더 살펴보면 물고기, 사자, 토끼, 뱀이 있을 때 우리는 이것들을 각각의 객체라 하며 이 객체들을 하나로 묶으려 할 때, <br />
  만약 동물 또는 생물이라는 어떤 추상적인 객체로 크게 정의한다고 하자. 이때 동물 또는 생물이라고 묶는 것을 추상화라고 한다. <br />

추상화란 말 그대로 상세한 정보는 무시하고 필요성에 의해 있어야할 정보들만 간추려서 구성하는 것이다. <br />

마우스를 예를 들어 보자면 <br />
지금은 실제 세계에 마우스가 모델링되어 있지만 마우스가 만약 없다면 그것을 모델링 하고 싶다고 가정해보겠다. <br />
컴퓨터를 좀 더 편하게 다루기 위해 클릭을 했으면 하고 스크롤도 있으면 좋겠다란 생각으로 정의를 시작할 수 있다. <br />
좀 더 추상화를 해보자면 왼쪽 클릭영역, 오른쪽 클릭영역, 스크롤영역등... 이런 식으로 설계를 하는 것이 추상화 작업이다. <br />
단순히 있어야할 정보들을 간추려서 구성하는 것이다. <br />

이렇게 마우스의 추상화 작업으로 인해 왼,오른쪽 영역, 스크롤 등을 프로그래밍에서는 속성,프로퍼티라고 부른다. <br />

다른 예로 사람을 추상화 작업한다고 하면 <br />

■ 사람 객체
>
> 1. 심장
> 2. 눈, 코, 입
> 3. 이름
> 4. 성별
> 5. 신장(키)
> 6. 생각한다
> 7. 뛴다
> 8. 잔다.

등등 사람을 객체화하여 추상화를 할 수 있다. 하지만 사람은 날 수 없으므로 '날다' 라고 추상화를 할 수는 없을 것이다! <br />
이렇게 공통적으로 가질 수 있는 정보들을 추상화한다고 하며 프로그래밍의 세계로 접근,접목 시킨 것이 객체지향 프로그래밍에서의 추상화이다. <br />
위의 사람 객체에서 정의한 리스트들을 프로그래밍적으로 프로퍼티(속성)이리고 하며 프로퍼티 중에 '생각하다', '뛴다', '잔다' 라는 동사적인 행위들을 프로그래밍에서는 메서드라고 부르는 것이다.<br />
( method(방법) - 뛰게하는 방법, 생각하게 하는 방법 ) <br />
이렇듯 추상화란 모든 객체에 공통적인 성질들만 담고 있어야 한다!!

#### 2) 캡슐화(Encapsulation)
- **데이터 구조와 데이터를 다루는 방법들을 결합 시켜 묶는 것.** 다시 한번 말하자면 변수와 함수를 하나로 묶는것을 말한다. <br />
- ex)
```java

  public String test() {
          string aa = "aaa";
      }

```

- 하지만 무작정 한대 묶으면 되는 것이 아니라 **객체가 맡은 역할을 수행하기 위한 하나의 목적을 한데 묶는다**고 생각해야한다. <br />
  이것이 많이 들어본 의미로는 **은닉화**라고 한다. <br />
- 또한 데이터를 절대로 **외부에서 직접 접근을 하면 안되고 오로지 함수를 통해서만 접근**해야하는데 이를 가능하게 해주는 것이 바로 캡슐화이다. <br />
- 따라서 캡슐화에 성공하면 당연히 은닉화도 자연스럽게 효력이 나타난다. <br />


#### 3) 상속성, 재사용(Inheritance)
- **상위 개념의 특징을 하위 개념이 물려받는 것**
- 객체지향의 하이라이트 부분이라고 생각한다. 상속이란 개념이 없으면 객체지향이나 절차지향이나 도진개진 <br />
- 간단히 예를 들자면, 자동차라는 부모클래스가 있다. <br />
  기름을 먹거나 달리는 기능을 하는 자동차인데, <br />
  만약 지붕뚜껑이 열리는 특수한 기능을 추가하고 싶다면 기존의 자동차에서 스포차카를 생성한다. <br />
  그러면 스포츠카는 기름도 먹고 달리면서 지붕두껑이 열리는 기능도 갖춘 자동차가 되는 것 <br />

#### 4) 다형성(Polymorphism)
- **부모클레스에서 물려받은 가상 함수를 자식 클래스 내에서 오버라이딩 되어 사용되는 것**
- 간단히 예를 들자면
  군대에서 나는 K2 소총을 잡았고 동기는 K1 소총을 잡았다. 사격 훈련이 있을 때 중대장이 '준비된 사수부터 발사!'라고 외치면 <br />
  나와 내친구는 명령을 받고 앞의 사로를 향해 총을 쏜다. 이때 중대장은 추상적 객체를 상속받은 모든 객체들에게 명령을 내린것이고 <br />
  그 병사가 총이 뭐든간에 그냥 발사를 하라는 명령을 한것이다. <br />
  즉, 다형성이 없다면 K1 소총을 든 병사 발사, K2 소총을 든 병사 발사 라며 명령을 하나하나 내려야 할 것이다 <br />


## 참고자료
[참고1](https://88240.tistory.com/228) <br />
[참고2](https://webclub.tistory.com/137)
