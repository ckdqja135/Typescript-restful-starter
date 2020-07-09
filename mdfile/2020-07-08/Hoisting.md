# Hoisting
<p align = "center"><img src = "https://media.vlpt.us/post-images/marcus/96e03630-2d0a-11e9-8401-8b896dd4fb48/webkul.com.png" width = 60%></img></p>
Javascript에 Hoisting을 알아보자

Hoisting은 어쩌면 우리가 무의식적으로 사용하고있을 수 있다.
Hoisting에 특징을 알아보자

모든 변수 선언은 호이스트된다.
호이스트란, 변수의 정의가 그 범위에 따라 선언과 할당으로 분리되는 것을 의미한다. 
쉽게 말하면 변수가 함수내에서 정의되었을 경우 선언이 함수의 최상위로, 함수 바깥에서 정의되었을 경우는 전역 컨텍스트의 최상위로 변경됩니다.

말로하는것보다 코드로 이해하는게 더 빠르니 코드를 봅시다.

``` javascript
const hoisting = () => {
  console.log("First-Name:", name);
  var name = "Marcus";
  console.log("Last-Name:", name);
}

hoisting();
// First Name : undefined
// Last Name : Marcus
// First Name이 undefined인 이유는 지역변수 name이 호이스트 되었기 때문이다.

```
위 hoisting이라는 함수는 자바스크립트로 이해하면 다음과 같이 표현할 수 있다.
``` javascript
const hoisting = () => {
     var name; // name 변수는 호이스트 되었습니다. 할당은 이후에 발생하기 때문에, 이 시점에 name의 값은 undefined 입니다.
     console.log("First name : " + name); // First Name : undefined
     name = "Marcus"; // name에 값이 할당 되었습니다.
     console.log("Last Name : " + name); // Last Name : Ford
}
```

그럼 여기서 궁금한점이 생길 수 있다
let 과 const에서는 호이스팅이 될까?

먼저 위에서 var로 작성한 hoisting이라는 함수를 let과 const로 바꿔보자.

``` javascript
const hoisting = () => {
  console.log("Name:", name);
  let name = "Marcus";
}

hoisting();
// ReferenceError: name is not defined

```
먼저 let으로 했을 경우 name is not defined라는 에러가 발생한다.
왜일까? 앞서 설명했을땐 ```변수가 함수내에서 정의되었을 경우 선언이 함수의 최상위로, 함수 바깥에서 정의되었을 경우는 전역 컨텍스트의 최상위로 변경된다 ``` 라고 설명했다.

이 이유를 설명하려면 우리는 Temporal Dead Zone(TDZ)라는 개념을 알아야한다.

간단하게 TDZ를 설명하고 넘어가보자.

let/const선언은 기본적으로 실행중인 실행 컨텍스트의 어휘적 환경(Lexical Environment)으로 범위가 지정된 변수를 정의한다.

변수는 그들의 어휘적 환경에 포함될 때 생성되지만, 어휘적 바인딩이 실행되기 전까지는 액세스할 수 없다.
새로운 범위에 진입할 때마다 지정된 범위에 속한 모든 let/const바인딩이 지정된 범위 내부의 코드가 실행되기 전에 실행된다. (즉, let/const선언이 호이스팅된다.)
어휘적 바인딩이 실행되기 전까지 액세스할 수 없는 현상을 TDZ라고 한다.

쉽게 말하면 스코프에 진입할 때 변수가 만들어지고 TDZ(Temporal Dead Zone)가 생성되지만, 코드 실행이 변수가 실제 있는 위치에 도달할 때까지 액세스할 수 없는 것이다.

TDZ를 이해한바로 간단한 테스트 코드를 작성해보면
```
// const TDZ를 실행하기 전에 TDZ에 접근하면, TDZ에 의해 ReferenceError가
발생하게 된다.
// console.log(TDZ);
// output: ReferenceError: tdz is not defined

const TDZ = 'Temporal Dead Zone'
// 위 코드 실행 이후에는 TDZ에 접근할 수 있다.
console.log(TDZ);
// output: Temporal Dead Zone
```

##### 결론 
let/const선언 변수는 호이스팅되지 않는 것이 아니다. 스코프에 진입할 때 변수가 만들어지고 TDZ(Temporal Dead Zone)가 생성되지만, 코드 실행이 변수가 실제 있는 위치에 도달할 때까지 액세스할 수 없는 것이다. let/const변수가 선언된 시점에서 제어흐름은 TDZ를 떠난 상태가 되며, 변수를 사용할 수 있게 된다.

### 참조
[참조](https://github.com/Jogeonsang/Hoisting/blob/master/README.md)
