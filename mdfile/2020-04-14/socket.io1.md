# 프로젝트 생성
본 글은 [ts-tutorial v1](https://github.com/haandol/ts-tutorial/tree/v1.0)의 프로젝트 구조를 기반으로 진행하겠다.

```typescript
  $ git clone git@github.com:haandol/ts-tutorial.git
  $ cd ts-tutorial
  $ git checkout v1.0
```

* 프로젝트 구조는 다음과 같다.
``` text
  .
  ├── LICENSE
  ├── README.md
  ├── package.json
  ├── src
  │   └── index.ts
  └── tsconfig.json
  
```

# typescript, socket.io 설치
먼저 typescript 와 socket.io 패키지를 설치해보자. <br />
@types/패키지명 으로 타입정의를 함께 설치하는 것도 잊지 말자. <br />

```typescript
  $ npm install --save typescript socket.io
  $ npm install --save-dev @types/node @types/socket.io
```

socket.io 채팅서비스는 [홈페이지 예제](https://socket.io/get-started/chat/)를 기반으로 하겠다.

* 전체 시나리오는 다음과 같다.

> 1. 서버 실행
> 2. 클라이언트 html 파일을 브라우저에서 실행 (이 때 사용자에게 랜덤한 이름을 부여)
> 3. 사용자가 글을 입력하면 내 이름과 함께 서버로 전송
> 4. 서버는 받은 내용을 모든 사용자에게 전달

# socket.io 서버 만들기
그럼 먼저 socket.io 를 이용한 서버를 만들어보자. <br />

* 서버에서 처리할 내용은 아래와 같다.

> 1. socket.io 로 <code>message</code> 이벤트를 listening
> 2. <code>message</code> 이벤트로 Message 객체가 오면 json string 으로 변환하여 모든 사용자에게 전달
# Message 인터페이스 만들기
<code>message</code> 이벤트 발생시 주고 받을 내용은 다음과 같다.

> 1. 사용자 이름 (username)
> 2. 내용 (content)
따라서 해당 형태의 인터페이스를 만들어서 처리하면 된다.

src/domain/message.ts 를 만들고 아래 내용을 입력해준다.

```linux
  $ mkdir -p src/domain
  $ touch src/domain/message.ts
```
* // src/domain/message.ts
```typescript
  export interface Message {
      username: string;
      content:  string;
  }
```

# 서버 코드 작성

Message 인터페이스를 이용해 메시지를 주고받을 서버 코드를 작성해보자.

* src/index.ts
```typescript
  import * as http from "http";
  import * as socketIO from "socket.io";
  import { Message } from './domain/message';
  function run(port: number = 3000): void {
      let server: http.Server = http.createServer();
      let io: any = socketIO(server);
      server.listen(port, () => {
          console.log('Listening port %s', port);
      });
      io.on('connection', (socket: any) => {
          socket.on('message', (message: Message) => {
              io.emit('message', JSON.stringify(message));
          });
      });
  }
  run(3000);
```
코드를 간단히 설명하면
> 1. 먼저 http 모듈을 이용해 서버객체를 생성한 뒤, socket.io 와 바인딩 한다.
> 2. 서버객체를 이용해 3000번 포트로 서버를 연다.
> 3. socket.io 를 통해 <code>message</code> 이벤트를 listening 한다.
> 4. <code>message</code> 이벤트가 발생하면 전달된 메시지를 모든 사용자에게 전달한다.
# socket.io 클라이언트 페이지 만들기
socket.io 홈페이지의 예제는 express 를 사용해 html 파일을 serving 하고 있다. <br />
본 글의 의도상 express 를 사용하지 않고 싶었다. <br />

사실 socket.io 는 js 라이브러리를 따로 제공하고 있기 때문에 굳이 서버에서 html 을 렌더링 할 이유가 없다. <br />
그래서 본 글에서는 그냥 socket.io cdn 을 이용한 index.html 파일로 클라이언트를 만들었다. <br />

전체 코드는 50줄 미만이며 public/index.html 에 있다. 아래에 body 부분의 완전한 코드를 첨부한다. <br />

* public/index.html body 부분 코드 
```html

<body>
    <ul id="messages"></ul>
    <form action="">
        <input id="m" autocomplete="off" /><button>Send</button>
    </form>

    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.js"></script>
    <script src="https://cdn.rawgit.com/haandol/korean-name-generator/master/build/namer.js"></script>
    <script>
        $(function () {
            var socket = io('http://localhost:3000');
            var username = namer.generate();
            $('form').submit(function(){
                var content = $('#m').val();
                socket.emit('message', {username: username, content: content});
                $('#m').val('');
                return false;
            });
            socket.on('message', function(jsonMessage){
                var msg = JSON.parse(jsonMessage);
                $('#messages').append($('<li>').text('[' + msg.username + ']: ' + msg.content));
            });
        });
    </script>
</body>

```
클라이언트가 하는 일은 아래와 같다.

> 1. socket.io 를 이용해 서버와 연결한다.
> 2. <code>form#m</code> 을 submit 하면 <code>message</code> 이벤트를 socket.io 로 발생시킨다.
> 3. 서버가 발생한 <code>message</code> 이벤트를 통해 json string 메시지를 받으면 <code>ul#messages</code> 에 추가해준다.
> [namer](https://github.com/haandol/korean-name-generator) 모듈은 있는데 한글이름을 랜덤하게 생성하려고 만든 작은 라이브러리다. <br />
> generate() 함수를 실행하면 3글자 한글 이름(이름이라고 부르기 힘든)을 반환한다.
# 실행결과
서버실행은 여느때처럼 <code>npm start</code> 로 하면 된다.

```typescript
  $ npm start
  > ts-tutorial@1.0.0 start /Users/haandol/git/ts-tutorial
  > tsc; node ./build/index.js
  Listening server on port 3000
```

브라우저를 열고 탭을 2개 띄운 뒤, 각각의 탭에서 public/index.html 을 열자. <br />
메시지를 입력하고 화면 최하단의 send 버튼을 눌러보면(enter 를 쳐도 됨),  <br />
한 탭에서 입력한 내용이 모든 탭에서 실시간으로 보이는 것을 확인할 수 있다. <br />

# 실행화면
<img src = "https://user-images.githubusercontent.com/33046341/79184497-426a4b80-7e4f-11ea-858f-c9c85b2705ac.png" width = 90%> </img>
