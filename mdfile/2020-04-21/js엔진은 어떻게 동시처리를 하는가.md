#  js엔진은 어떻게 동시처리를 하는가? 이벤트루프
# [목표]
- nodejs가 싱글쓰레드임에도 불구하고 비동기처리를 한다는데 어떻게해? 의문에 답해보자
- nodejs가 이벤트루프기반 비동기처리를 한다는데, 이벤트루프가 대체 뭔지 알아보자
- 랜더링엔진 구조, 처리방식은 알아봤는데 자바스크립트 엔진은 그냥 지나간 것 같으니 이번 기회에 알아보자

# [우선! 자바스크립트 엔진과 브라우저 랜더링엔진은 다르다]
- 랜더링엔진은 HTML과 CSS파일을 파싱하여 새로운 트리구조를 만들고 브라우저 화면에 문서를 나타내는(painting) 작업을 함
- 자바스크립트 엔진은 js 코드 파일을 해석하고 실행하는 인터프리터(구글의 V8과 같은 엔진)

# [자바스크립트 엔진 구조]
- 대부분의 자바스크립트 엔진은 다음과 같이 세가지 영역으로 나뉨

### 1) Call Stack
- 자바스크립트는 단 하나의 호출 스택(call stack)을 사용
- 이런 특징때문에 "Run to Completion" 이라 함 : 함수가 실행되면 이 함수 실행이 끝날 때까지 다른 어떤 task도 수행 못함을 의미
- 요청이 들어올 때마다 해당 요청을 순차적으로 호출 스택에 담아 처리
- 함수가 실행될 때 call stack에 push 되고, 함수 실행이 끝나면 pop 됨
- 실행컨텍스트 : http://jinbroing.tistory.com/78
- 아래는 호출 스택의 흐름을 알기위한 코드 그리고 자바스크립트 엔진 내부 처리 모습

```javascript

  function foo(b){
     var a = 10
     return a + b
  }

  function bar(x){
       var y = 5;
       return foo(x+y)
  }

  console.log(bar(3))

```

<p align = "center"><img src ="https://t1.daumcdn.net/cfile/tistory/247E875058F973FC2E" width =90%></src></p>

- bar 함수가 호출되고 콜스택에 push됨
- return 키워드에서 foo 함수가 호출됨, foo 함수도 콜스택에 push됨
- foo 함수가 return 키워드를 만나고 종료되면서 콜스택에서 pop됨
- foo 함수가 종료되고 bar함수로 돌아옴, foo 함수로부터 받은 값을 리턴하면서 bar 함수도 콜스택에서 pop됨

### 2) Task Queue(Event queue) 
- 자바스크립트 런타임환경에서 처리해야하는 task들을 임시 저장하는 대기큐
- 자바스크립트 런타임환경이란? js가 실행되고 있는 환경, 웹브라우저(데스크탑, 모바일)나 nodejs 웹서버(V8 엔진)환경
- 큐(queue)는 먼저 들어온 task가 먼저 실행되는 구조
- 자바스크립트에서 비동기로 호출(**이벤트 콜백함수**)되는 함수들은 스택에 쌓이지 않고, **Task Queue 대기열**에 넣음
- 또한 **Web API** 영역(API 호출 이벤트)**에 따로 정의되어있는 함수**들은 비동기로 실행됨
- Task Queue에 들어온 비동기함수들은 콜스택이 비어져있을 때 들어온 순서대로 수행됨
- 스택에 쌓아 처리하는 것과 그렇지 않고 큐 대기열에 넣는 함수를 구분하는 것을 알기

```javascript
  
  function test1(){
     console.log("1")
 
     test2()
  }

  function test2(){
       setTimeout(function(){
            console.log("2")
       })

       test3()
  }

  function test3(){
       console.log("3")
  }

  test1()

```

- 구조상으로 봤을 때 test2 함수 내 setTimeout에 딜레이가 걸려있지않아 1 - 2 - 3 순으로 출력될 것 같지만 아님
- 콜스택에 쌓여있는 함수가 모두 실행되고난 후 콜스택이 비어져있을 때 비동기함수가 대기하고있는 Task Queue 수행
- 실행순서 : 1 - 3 - 2 (크롬 콘솔창 실행해볼 것)
- test2는 콜스택에 들어간다음 바로 빠져나옴, setTimeout(이벤트 핸들러) 콜스택에서 실행X, Task Queue 대기열 추가
- 대기열에 추가된 함수들을 관리하고 큐에 들어가있는 함수를 빼와서 실행하는 역할을 하는 것이 Event Loop

+) **Event Loop**
- Task Queue에 들어가는 task들을 관리함
- 콜스택이 비워지면(스택에 추가된 모든 함수가 실행되고 끝나면) Queue 대기열에 추가된 콜백함수를 빼서 실행함
- 이벤트 호출 시에는 비동기처리를 하지만, Queue에 담겨있는 함수처리가 오래걸릴 경우 서버 처리에 좋지않은 영향을....
- 아래 코드 실행순서는 어떻게될까?

```javascript

  function delay(){
     for(var i=0; i<100000l i++)
  }

  function foo(){
       delay()
       bar()
       console.log("foo")
  }

  function bar(){
       delay()
       console.log("bar")
  }

  function baz(){
       console.log("baz")
  }

  setTimeout(baz, 10)
  foo()

```

- baz가 먼저 호출되어 스택에 들어갈지라도 금방빠져나와 setTimeout은 테스크큐에 추가됨(비동기함수, 이벤트함수)
- foo - bar가 콜스택에 push, pop 이후 이벤트루프가 테스크큐에 대기하고 있는 콜백함수를 빼내 실행함
- 호출 스택이 비어빌 때마다 이벤트루프는 테스크큐에서 빼와서 실행
- **테스크큐 추가 함수** : 웹API영역 함수, 이벤트핸들러(콜백함수)

##3 3) Heap
- 객체는 힙에 할당됨
- 구조화되지않은 더미 같은 메모리영역을 heap이라 함

# [자바스크립트 엔진은 싱글쓰레드 기반 비동기처리]
- 자바스크립트는 싱글쓰레드 기반임
- 싱글쓰레드라는 것은 동시에 하나의 작업만을 처리한다는 것
- V8 같은 자바스크립트 엔진은 단일 호출 스택(Call Stack)을 사용하며, 요청이 들어올 때마다 해당 요청을 순차적으로 호출 스택에 담아 처리함
- "Run to Completion"
- 그러나 자바스크립트는 비동기처리가 됨 : nodejs 동시에 여러개 HTTP 요청 처리, 웹어플리케이션 동시 처리 등
- 싱글쓰레드 기반임에도 불구하고 동시처리(비동기처리 === Non-Blocking IO 지원)가 가능한 것은 이벤트루프 라는 것 때문임

# reference
1) [Toast Meetup!, 자바스크립트와 이벤트루프](http://meetup.toast.com/posts/89)
2) [_Jbee 티스토리, JavaScript의 Event Loop](http://asfirstalways.tistory.com/362)
3) [MDN, Concurrency model and Event Loop](https://developer.mozilla.org/en/docs/Web/JavaScript/EventLoop)
4) [nhnent github, 자바스크립트와 이벤트루프](https://github.com/nhnent/fe.javascript/wiki/June-13-June-17,-2016)
5) [NEXTTREE, Node.js: 비동기프로그래밍이해](http://www.nextree.co.kr/p7292/)
6) [김정출님 티스토리, Node.js(자바스크립트 런타임)](http://jeongchul.tistory.com/301)
