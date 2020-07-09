<p align = "center"><img src = "https://media.vlpt.us/post-images/marcus/020c1130-2d11-11e9-8401-8b896dd4fb48/10hfm3TfurQboq6KlJrG56g.jpeg" width = 60%></img></p>

## var-let-const
##### javascript var - let - const 의 차이 
Javascript에 변수 선언 방식인 var let const에 각각 차이점을 알아보자 <br />
먼저 이들의 차이점을 이해하기 위해서는 Hoisting과 Scope의 개념이 필요하다. <br />
(해당 링크에 각각의 개념을 정리했으니 참고 부탁드립니다.) <br />
> * [Hoisting에 대한 정리](https://github.com/ckdqja135/Typescript-restful-starter/blob/master/mdfile/2020-07-08/Hoisting.md) <br />
> * [Scope에 대한 정리](https://github.com/ckdqja135/Typescript-restful-starter/blob/master/mdfile/2020-07-08/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%EC%8A%A4%EC%BD%94%ED%94%84.md)
<br />

var let const를 비교할 때 몇가지 키워드로 정리해서 알아보자 <br />

1. 변수 값의 변환
2. 변수의 유효범위
3. 호이스팅

##### 먼저 변수 값의 변환을 알아보자
기존의 Javascript를 사용하면서 가장 문제가 있다고 느낀점은 변수 선언의 방식이였다. <br />

var를 사용하면 변수 선언의 경우 할당되는 값이 유동적으로 변경될 수 있는 단점을 가지고있다. <br />

아래 코드를 보자 <br />

```javascript
  
  var name = "Marcus";
  console.log(name);

  var name = "Jogeonsang";
  console.log(name);

  output: Marcus
  output: Jogeonsang
  
```

다음과 같이 name이라는 변수를 2번 선언했는데도 에러가 나오지않고 각기 다른 값이 출력되는걸 볼 수 있다. <br />

하지만 ES6 업데이트 이후로 추가된 변수 선언 방식인 let과 const는 var와 같은 선언 방식을 막고있다. <br />

```javascript
  
  let name = "Marcus";
  console.log(name); 

  let name = "Jogeonsang";
  console.log(name);
  output: Identifier 'name' has already been declared

```

위와 같이 let을 사용했을 경우에는 name이 이미 선언되었다는 에러 메시지가 나오는걸 볼 수 있다. <br /> 
위에 코드에는 let만 케이스로 집어넣었지만 const도 마찬가지로 변수 재할당이 안된다는 특징을 가지고있다. <br />

그럼 let과 const는 어떤 차이가 있을까? <br />
<code>let</code>과 <code>const</code>의 차이점은 변수의 <code>immutable</code>여부이다. <br />
<code>let</code>은 변수에 재할당이 가능하지만, <code>const</code>는 변수 재선언, 재할당 모두 불가능하다. <br />

아래 코드를 보자. <br />
##### <code>let</code>

```javascript
  
  // let
  let testCase = 'let' // output: let
  let testCase = 'let2' // output: Uncaught SyntaxError: Identifier 'testCase' has already been declared
  testCase = 'let3' // output: let3

```

##### <code>const</code>

```javascript
  
  const testCase = 'const' // output: const
  const testCase = 'const2' // output: Uncaught SyntaxError: Identifier 'testCase' has already been declared
  testCase = 'const3' // output: Uncaught TypeError:Assignment to constant variable.

```

위와같이 <code>var let const</code> 각각의 차이는 명확하다. <br />

##### 변수의 유효범위
먼저 var는 기본적으로 function scope를 가지게되고 let, const는 block scope를 가지게된다. <br />

##### <code>var</code>

```javscript
  
  var foo = "This is String.";
  if(typeof foo === 'string'){
    var result = true;
  } else {
    var result = false;
  }

  console.log(result);    // result : true

```

##### <code>let과 const</code>

```javascript

  var foo = "This is String.";
  if(typeof foo === 'string'){
    const result = true;
  } else {
    const result = false;
  }

  console.log(result);    // result : result is not defined

```

## 참조
[참조](https://velog.io/@marcus/2019-02-10-1702-%EC%9E%91%EC%84%B1%EB%90%A8)




