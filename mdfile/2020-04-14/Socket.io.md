# TypeScript를 사용한 실시간 앱 : Web Sockets, Node & Angular 및 통합.
  TypeScript를 사용하여 실시간 채팅 앱 작성.
  
얼마 전에 TypeScript 언어 만 사용하여 간단한 채팅 응용 프로그램을 구현했습니다. <br />
주요 목표는 클라이언트 측과 서버에서이 프로그래밍 언어를 사용하는 방법을 설명하는 데모를 작성하는 것이 었습니다. <br />
클라이언트 앱이 최신 Angular 기능을 사용하고 있습니다. <br />
이 글에서는 앱을 처음부터 어떻게 구현했는지 보여 드리겠습니다. <br />

이 'Wikipedia 정의'에 따르면 실시간 응용 프로그램은 정보를 게시하는 즉시 정보를 수신할 수 있도록 하며, <br />
소스가 정기적으로 업데이트되었는지 확인할 필요가 없습니다. <br />
따라서 이러한 종류의 앱은 사용자에게 이벤트와 조치가 즉시 발생한다는 느낌을 주어야 합니다. <br />

이 GitHub 리포지토리에서 전체 프로젝트를 찾으십시오.
[github](github.com/luixaviles/socket-io-typescript-chat)

# 웹 소켓
WebSockets는 양방향 통신 채널을 제공하는 프로토콜입니다. <br />
즉, 브라우저와 웹 서버는 실시간 통신을 유지하면서 연결이 열려있는 동안 메시지를주고받을 수 있습니다. <br />

<img src = "https://miro.medium.com/max/1400/1*9HDEuF54yWrJdnwvLaWIWg.png" width = 90%></img>

# 응용 프로그램 구조
서버 관련 코드와 클라이언트 코드를 분리합니다. <br />
가장 중요한 파일을 설명 할 때 자세한 내용을 살펴 보겠습니다. 현재로서는 다음과 같이 응용 프로그램의 예상 구조입니다. <br />

```text

  server/
  |- src/
  |- package.json
  |- tsconfig.json
  |- gulpfile.js
  client/
  |- src/
  |- package.json
  |- tsconfig.json
  |- .angular-cli.json

```

# 서버 코드
WebSockets는 [규격](https://tools.ietf.org/html/rfc6455)이기 때문에, 우리는 그것에 대한 [몇 가지 구현](https://github.com/facundofarias/awesome-websockets)을 찾을 수 있다.  <br />
우리는 TypeScript 또는 다른 프로그래밍 언어를 선택할 수 있다. <br />
  
이 경우 우리는 가장 빠르고 신뢰할 수 있는 실시간 엔진 중 하나인 Socket.io 을 사용할 것이다.

# 서버측 코드에 TypeScript를 사용하는 이유
TypeScript는 정말 멋진 기능들을 가지고 있으며 매우 자주 업데이트된다.  <br />
그것은 약 15%의 버그를 예방할 수 있다.  <br />
더 많은 이유가 필요한가? 😄 <br />

# 서버 응용 프로그램 초기화
[package.json](https://docs.npmjs.com/cli/init)을 만들어 종속성 설치를 진행합니다.

```text
  
  npm install --save express socket.io @types/express @types/socket.io
  
```

<code>devdependencies</code>를 몇 가지 설치하여 <code>gulp</code>와 <code>typescript</code>를 통합할 수 있도록 해야 나중에 이러한 툴로 작업을 쉽게 정의할 수 있을 것입니다. <br />

```text

  npm install --save-dev typescript gulp gulp-typescript
  
```

# TypeScript 컴파일러 구성

다음과 같이tsconfig.json 파일을 생성하십시오.
### tsconfig.json 
```json

  {
  "files": [
    "src/*.ts",
    "src/model/*.ts"
  ],
  "compilerOptions": {
    "target": "es5"
  }
}

```
# 데이터 모델 정의
다음과 같이 작은 데이터 모델을 정의해 보자.
### chat-model.ts 
```typescript

export class User {
    constructor(private name: string) {}
}

export class Message {
    constructor(private from: User, private content: string) {}
}

export class ChatMessage extends Message{
    constructor(from: User, content: string) {
        super(from, content);
    }
}

```

..서버/src 디렉토리에 대한 자세한 내용을 확인하십시오.
```text
  
  server/
  |- src/
     |- model/
        |- message.model.ts
        |- user.model.ts
     |- index.ts
     |- server.ts
  |- package.json
  |- tsconfig.json
  |- gulpfile.js

```
  
# 채팅 서버 구현
<code>server</code> 디렉토리의 주요 파일은 <code>index.ts</code>와 <code>chat-server.ts</code>이다. 첫 번째 앱은 <code>ChatServer app</code>을 만들고 내보낼 수 있고, 마지막 앱에는 <code>express</code>와 <code>socket.IO</code>이 들어 있다.

### index.ts
```typescript
  
  import { ChatServer } from './chat-server';

  let app = new ChatServer().getApp();
  export { app };

```

### chat-server.ts 
```typescript
  
  import { createServer, Server } from 'http';
  import * as express from 'express';
  import * as socketIo from 'socket.io';

  import { Message } from './model';

  export class ChatServer {
      public static readonly PORT:number = 8080;
      private app: express.Application;
      private server: Server;
      private io: SocketIO.Server;
      private port: string | number;

      constructor() {
          this.createApp();
          this.config();
          this.createServer();
          this.sockets();
          this.listen();
      }

      private createApp(): void {
          this.app = express();
      }

      private createServer(): void {
          this.server = createServer(this.app);
      }

      private config(): void {
          this.port = process.env.PORT || ChatServer.PORT;
      }

      private sockets(): void {
          this.io = socketIo(this.server);
      }

      private listen(): void {
          this.server.listen(this.port, () => {
              console.log('Running server on port %s', this.port);
          });

          this.io.on('connect', (socket: any) => {
              console.log('Connected client on port %s.', this.port);
              socket.on('message', (m: Message) => {
                  console.log('[server](message): %s', JSON.stringify(m));
                  this.io.emit('message', m);
              });

              socket.on('disconnect', () => {
                  console.log('Client disconnected');
              });
          });
      }

      public getApp(): express.Application {
          return this.app;
      }
  }

```

# 서버 클래스들
이전 코드는 다음과 같은 클래스 및 관계의 결과를 제공한다.

<img src = "https://miro.medium.com/max/2000/1*-FNkJxTH5kDiBPdJx4tVIg.png" width = 90%></img>

# 서버 빌드 및 실행
Node.js의 V8 엔진에 필요한 JavaScript 파일을 갖기 위해, 우리는 <code>build</code> 작업을 <code>gulpfile.js</code> 파일에 추가할 수 있다.

### gulpfile.js
```typescript

  var gulp = require("gulp");
  var ts = require("gulp-typescript");
  var tsProject = ts.createProject("tsconfig.json");

  gulp.task("build", function () {
      return tsProject.src()
          .pipe(tsProject())
          .js.pipe(gulp.dest("./dist"));
  });

```

보다시피 빌드 프로세스(JavaScript 파일)의 출력은 <code>dist</code> 디렉토리에 위치한다. 이 작업을 수행하려면 다음을 실행하십시오.

```typescript

  gulp build
  
```

이제 <code>node dist/index.js</code> 명령을 실행하여 서버를 실행할 수 있다.

# 클라이언트 코드
최신 [Angular  CLI](https://cli.angular.io/) 버전을 사용하여 <code>client</code> 디렉토리를 생성해 보십시오.

```text

  ng new typescript-chat-client --routing --prefix tcc --skip-install
  
```

그런 다음 <code>npm install</code>을 실행하는 종속성을 설치하십시오(이 단계에서는 [Yarn](https://classic.yarnpkg.com/en/)을 사용함).

```text

  cd typescript-chat-client
  yarn install

```

# Angular 추가
최신 가이드를 참조하여 <code>Angular  CLI</code> 프로젝트 내에 [Angular](https://material.angular.io/guide/getting-started)를 설치하십시오.

[프로젝트 구조](https://angular.io/guide/styleguide#application-structure-and-ngmodules)에서 best practices를 사용하는 과정에서 <code>공유</code> 및 <code>소재</code> 모듈을 만들 수 있다.

```text

  client/
  |- src/
     |- app/
        |- chat/
        |- shared/
           |- material/
              |- material.module.ts
           |- shared.module.ts
        |-app.module.ts
      
```

command line 인터페이스에서 다음을 수행할 수 있다.

```text

  ng generate module shared --module app
  ng generate module shared/material --module shared

```

<code>app.module.ts</code>와 <code>shared.module.ts</code> 내부의 변경 사항을 확인하여 이들 모듈 간에 생성된 관계를 확인하십시오.

# express 와 socket.IO 추가하기

client App에 <code>express</code> 및 <code>socket.io</code> 모듈을 추가하십시오.

```text

  npm install express socket.io --save
  
```

# 채팅 모듈 및 구성 요소
채팅 응용 프로그램의 구성 요소를 만들기 전에 새 모듈을 만들어 봅시다.
```text
  
  ng generate module chat --module app
  
```

이제 구성 요소를 최신 모듈에 추가하십시오.
```text

  ng generate component chat --module chat
  
```

웹 소켓과 사용자 지정 모델을 사용하려면 다른 <code>shared</code> 폴더를 <code>chat</code> 디렉터리 내부에 생성하십시오. 
```text
  
  ng generate service chat/shared/services/socket --module chat
  ng generate class chat/shared/model/user
  ng generate class chat/shared/model/message

```

우리는 다음과 유사한 구조로 마무리할 것입니다.

```text
  
  client/
  |- src/
     |- app/
        |- chat/
           |- shared/
             |- model/
                |- user.ts
                |- message.ts
             |- services/
                |- socket.service.ts
        |- shared/
        |-app.module.ts
      
```

# Observables 과 Web Sockets
우리의 Angular App은 <code>RxJS</code>와 함께 제공되기 때문에, 우리는 <code>Observables</code>를 사용하여 socket.io을 잡을 수 있다.

### socket.service.ts 
```typescript

  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs/Observable';
  import { Observer } from 'rxjs/Observer';
  import { Message } from '../model/message';
  import { Event } from '../model/event';

  import * as socketIo from 'socket.io-client';

  const SERVER_URL = 'http://localhost:8080';

  @Injectable()
  export class SocketService {
      private socket;

      public initSocket(): void {
          this.socket = socketIo(SERVER_URL);
      }

      public send(message: Message): void {
          this.socket.emit('message', message);
      }

      public onMessage(): Observable<Message> {
          return new Observable<Message>(observer => {
              this.socket.on('message', (data: Message) => observer.next(data));
          });
      }

      public onEvent(event: Event): Observable<any> {
          return new Observable<Event>(observer => {
              this.socket.on(event, () => observer.next());
          });
      }
  }

```

앱에서 <code>Actions</code>과 <code>Events</code>를 관리하기 위해 몇 가지 열거형을 정의해야 할 것이다.

### client-enums.ts 
```typescript

  // Actions you can take on the App
  export enum Action {
      JOINED,
      LEFT,
      RENAME
  }

  // Socket.io events
  export enum Event {
      CONNECT = 'connect',
      DISCONNECT = 'disconnect'
  }

```

이제 서버로부터 메시지를 들을 준비가 되셨습니다.

### chat.component.ts

```typescript

  import { Component, OnInit } from '@angular/core';

  import { Action } from './shared/model/action';
  import { Event } from './shared/model/event';
  import { Message } from './shared/model/message';
  import { User } from './shared/model/user';
  import { SocketService } from './shared/services/socket.service';

  @Component({
    selector: 'tcc-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
  })
  export class ChatComponent implements OnInit {
    action = Action;
    user: User;
    messages: Message[] = [];
    messageContent: string;
    ioConnection: any;

    constructor(private socketService: SocketService) { }

    ngOnInit(): void {
      this.initIoConnection();
    }

    private initIoConnection(): void {
      this.socketService.initSocket();

      this.ioConnection = this.socketService.onMessage()
        .subscribe((message: Message) => {
          this.messages.push(message);
        });

      this.socketService.onEvent(Event.CONNECT)
        .subscribe(() => {
          console.log('connected');
        });

      this.socketService.onEvent(Event.DISCONNECT)
        .subscribe(() => {
          console.log('disconnected');
        });
    }

    public sendMessage(message: string): void {
      if (!message) {
        return;
      }

      this.socketService.send({
        from: this.user,
        content: message
      });
      this.messageContent = null;
    }

    public sendNotification(params: any, action: Action): void {
      let message: Message;

      if (action === Action.JOINED) {
        message = {
          from: this.user,
          action: action
        }
      } else if (action === Action.RENAME) {
        message = {
          action: action,
          content: {
            username: this.user.name,
            previousUsername: params.previousUsername
          }
        };
      }

      this.socketService.send(message);
    }
  }

```

<code>ChatComponent</code>가 초기화되면 이 구성 요소는 연결 이벤트 또는 수신 메시지를 받기 시작하기 위해 <code>SocketService</code> observables자료에 가입할 것이다. <br />

<code>sendMessage</code>와 <code>sendNotification</code> 기능은 각각의 콘텐츠를 동일한 서비스를 통해 전송한다. 이때 전송되는 알림은 사용자 이름 변경 및 사용자 가입 알림입니다.

# 실행화면
* Server 실행
```linux
  $ cd server
  $ npm install -g gulp-cli
  $ npm install
  $ gulp build
  $ npm start
```
```text
> client@0.0.0 start C:\Users\ckdqj\Downloads\socket-io-typescript-chat-master\socket-io-typescript-chat-mas-chat-master\client
> ng serve
10% building 0/1 modules 1 active ...script-chat-master\socket-io-typescript-chat-master\client\src10% building 1/2 modules 1 active ...t-chat-master\socket-io-typescript-chat-master\client\src\poly10% building 2/3 modules 1 active ...\client\node_modules\@angular\material\prebuilt-themes\indigo-10% building 3/4 modules 1 active ...ver\client\index.js?http://0.0.0.0:0/sockjs-node&sockPath=/soc10% building 4/5 modules 1 active ...ipt-chat-master\socket-io-typescript-chat-master\client\src\st10% building 5/6 modules 1 active ...\client\node_modules\@angular\material\prebuilt-themes\indigo-10% building 6/7 modules 1 active ...ipt-chat-master\socket-io-typescript-chat-master\client\src\st10% building 6/8 modules 2 active ...\client\node_modules\@angular\material\prebuilt-themes\indigo-10% building 7/8 modules 1 active ...\client\node_modules\@angular\material\prebuilt-themes\indigo-10% building 8/9 modules 1 active ...pt-chat-master\client\node_modules\webpack-dev-server\client\s11% building 9/10 modules 1 active ...-chat-master\client\node_modules\webpack-dev-server\client\ov11% building 10/11 modules 1 active ...at-master\client\node_modules\webpack-dev-server\client\util11% building 11/12 modules 1 active ...r\client\node_modules\webpack-dev-server\client\utils\sendMe11% building 12/13 modules 1 active ...ter\client\node_modules\webpack-dev-server\client\utils\relo11% building 13/14 modules 1 active ...ient\node_modules\webpack-dev-server\client\utils\createSock11% building 14/15 modules 1 active ...master\client\node_modules\webpack\hot sync nonrecursive /^\11% building 14/16 modules 2 active ...t\node_modules\style-loader\dist\runtime\injectStylesIntoSty11% building 15/16 modules 1 active ...master\client\node_modules\webpack\hot sync nonrecursive /^\30% building 15/16 modules 1 active ...master\client\node_modules\webpack\hot sync nonrecursive /^\30% building 16/17 modules 1 active ...lient\node_modules\webpack-dev-server\client\clients\SockJSC30% building 17/18 modules 1 active ...de_modules\webpack-dev-server\client\utils\getCurrentScriptS30% building 18/19 modules 1 active ...ript-chat-master\socket-io-typescript-chat-master\client\src30% building 18/20 modules 2 active ...chat-master\socket-io-typescript-chat-master\client\src\poly30% building 19/20 modules 1 active ...chat-master\socket-io-typescript-chat-master\client\src\poly30% building 20/21 modules 1 active ...ster\socket-io-typescript-chat-master\client\node_modules\ur30% building 21/22 modules 1 active ...-typescript-chat-master\client\node_modules\querystring-es3\30% building 22/23 modules 1 active ...ket-io-typescript-chat-master\client\node_modules\webpack\ho30% building 23/24 modules 1 active ...master\socket-io-typescript-chat-master\client\src\app\app.m30% building 24/25 modules 1 active ...ket-io-typescript-chat-master\client\src\environments\enviro30% building 25/26 modules 1 active ...\client\node_modules\webpack-dev-server\client\clients\BaseC30% building 26/27 modules 1 active ...io-typescript-chat-master\client\node_modules\webpack\hot\em30% building 27/28 modules 1 active ...ocket-io-typescript-chat-master\client\src\app\app-routing.m30% building 28/29 modules 1 active ...ter\socket-io-typescript-chat-master\client\src\app\app.comp30% building 29/30 modules 1 active ...\socket-io-typescript-chat-master\client\src\app\chat\chat.m30% building 30/31 modules 1 active ...ter\socket-io-typescript-chat-master\client\node_modules\url30% building 31/32 modules 1 active ...ent\node_modules\node-libs-browser\node_modules\punycode\pun30% building 32/33 modules 1 active ...typescript-chat-master\client\node_modules\querystring-es3\d30% building 33/34 modules 1 active ...typescript-chat-master\client\node_modules\querystring-es3\e30% building 34/35 modules 1 active ...ket-io-typescript-chat-master\client\src\app\shared\shared.m30% building 35/36 modules 1 active ...et-io-typescript-chat-master\client\node_modules\strip-ansi\30% building 36/37 modules 1 active ...cket-io-typescript-chat-master\client\src\app\chat\chat.comp30% building 37/38 modules 1 active ...chat-master\client\src\app\chat\dialog-user\dialog-user.comp30% building 38/39 modules 1 active ...typescript-chat-master\client\node_modules\webpack\buildin\m30% building 39/40 modules 1 active ...ket-io-typescript-chat-master\client\node_modules\ansi-html\30% building 40/41 modules 1 active ...script-chat-master\client\src\app\shared\material\material.m30% building 41/42 modules 1 active ...pt-chat-master\client\src\app\chat\shared\services\socket.se30% building 42/43 modules 1 active ...ocket-io-typescript-chat-master\client\node_modules\events\e30% building 43/44 modules 1 active ...-typescript-chat-master\client\node_modules\loglevel\lib\log30% building 44/45 modules 1 active ...ript-chat-master\client\src\app\chat\dialog-user\dialog-user30% building 45/46 modules 1 active ...io-typescript-chat-master\client\src\app\chat\shared\model\a30% building 46/47 modules 1 active ...-io-typescript-chat-master\client\src\app\chat\shared\model\30% building 47/48 modules 1 active ...io-typescript-chat-master\client\node_modules\html-entities\30% building 48/49 modules 1 active ...cript-chat-master\client\node_modules\zone.js\dist\zone-ever50% building 49/50 modules 1 active ...ster\client\node_modules\@angular\core\__ivy_ngcc__\fesm201550% building 50/51 modules 1 active ...nt\src\$$_lazy_route_resource lazy groupOptions: {} namespac50% building 51/52 modules 1 active ...\@angular\platform-browser\__ivy_ngcc__\fesm2015\platform-br50% building 52/53 modules 1 active ...odules\@angular\platform-browser\__ivy_ngcc__\fesm2015\anima50% building 53/54 modules 1 active ...pt-chat-master\client\node_modules\html-entities\lib\xml-ent50% building 54/55 modules 1 active ...-chat-master\client\node_modules\html-entities\lib\html4-ent50% building 55/56 modules 1 active ...-chat-master\client\node_modules\html-entities\lib\html5-ent50% building 56/57 modules 1 active ...escript-chat-master\client\node_modules\sockjs-client\dist\s50% building 57/58 modules 1 active ...er\client\node_modules\@angular\common\__ivy_ngcc__\fesm201550% building 58/59 modules 1 active ...\client\node_modules\@angular\common\__ivy_ngcc__\fesm2015\c50% building 59/60 modules 1 active ...ules\@ngx-translate\core\__ivy_ngcc__\fesm2015\ngx-translate50% building 60/61 modules 1 active ...slate\http-loader\__ivy_ngcc__\fesm2015\ngx-translate-http-l50% building 61/62 modules 1 active ...\client\node_modules\@angular\material\__ivy_ngcc__\fesm201550% building 62/63 modules 1 active ...ient\node_modules\@angular\material\__ivy_ngcc__\fesm2015\si50% building 63/64 modules 1 active ...\client\node_modules\@angular\material\__ivy_ngcc__\fesm201550% building 64/65 modules 1 active ...\client\node_modules\@angular\material\__ivy_ngcc__\fesm201550% building 65/66 modules 1 active ...\client\node_modules\@angular\material\__ivy_ngcc__\fesm201550% building 66/67 modules 1 active ...ient\node_modules\@angular\material\__ivy_ngcc__\fesm2015\to50% building 67/68 modules 1 active ...lient\node_modules\@angular\material\__ivy_ngcc__\fesm2015\b50% building 68/69 modules 1 active ...\client\node_modules\@angular\router\__ivy_ngcc__\fesm2015\r50% building 69/70 modules 1 active ...er\client\node_modules\@angular\forms\__ivy_ngcc__\fesm2015\50% building 70/71 modules 1 active ...lient\node_modules\@angular\material\__ivy_ngcc__\fesm2015\d50% building 71/72 modules 1 active ...\client\node_modules\@angular\material\__ivy_ngcc__\fesm201550% building 72/73 modules 1 active ...t\node_modules\@angular\material\__ivy_ngcc__\fesm2015\form-50% building 73/74 modules 1 active ...client\node_modules\@angular\material\__ivy_ngcc__\fesm2015\50% building 74/75 modules 1 active ...io-typescript-chat-master\client\node_modules\rxjs\_esm2015\50% building 75/76 modules 1 active ...script-chat-master\client\node_modules\socket.io-client\lib\50% building 76/77 modules 1 active ...et-io-typescript-chat-master\client\node_modules\ansi-regex\50% building 77/78 modules 1 active ...node_modules\@angular\animations\__ivy_ngcc__\fesm2015\anima50% building 78/79 modules 1 active ...chat-master\client\node_modules\rxjs\_esm2015\internal\Obser50% building 79/80 modules 1 active ...pt-chat-master\client\node_modules\rxjs\_esm2015\internal\Su50% building 80/81 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\BehaviorSu50% building 81/82 modules 1 active ...t-master\client\node_modules\rxjs\_esm2015\internal\ReplaySu50% building 82/83 modules 1 active ...at-master\client\node_modules\rxjs\_esm2015\internal\AsyncSu50% building 83/84 modules 1 active ...-chat-master\client\node_modules\rxjs\_esm2015\internal\Sche50% building 84/85 modules 1 active ...at-master\client\node_modules\rxjs\_esm2015\internal\Subscri50% building 85/86 modules 1 active ...chat-master\client\node_modules\rxjs\_esm2015\internal\Subsc50% building 86/87 modules 1 active ...at-master\client\node_modules\rxjs\_esm2015\internal\Notific50% building 87/88 modules 1 active ...ipt-chat-master\client\node_modules\rxjs\_esm2015\internal\c50% building 88/89 modules 1 active ...e_modules\rxjs\_esm2015\internal\observable\ConnectableObser50% building 89/90 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\observable\bindCal50% building 90/91 modules 1 active ...t\node_modules\rxjs\_esm2015\internal\observable\bindNodeCal50% building 91/92 modules 1 active ...-master\client\node_modules\rxjs\_esm2015\internal\observabl50% building 92/93 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\observable\50% building 93/94 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\observable\50% building 94/95 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\observable\throw50% building 95/96 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\observable\50% building 96/97 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\observable50% building 97/98 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\observable\part50% building 98/99 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\observable\50% building 99/100 modules 1 active ...node_modules\rxjs\_esm2015\internal\observable\onErrorResum50% building 100/101 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\observab50% building 101/102 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\observable\50% building 102/103 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\symbol\obser50% building 103/104 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\gr50% building 104/105 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\scheduler50% building 105/106 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\scheduler\50% building 106/107 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\scheduler\50% building 107/108 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\scheduler\animation50% building 108/109 modules 1 active ...e_modules\rxjs\_esm2015\internal\scheduler\VirtualTimeSche50% building 109/110 modules 1 active ...hat-master\client\node_modules\rxjs\_esm2015\internal\util50% building 110/111 modules 1 active ...hat-master\client\node_modules\rxjs\_esm2015\internal\util50% building 111/112 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\util\ide50% building 112/113 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\util\isObser50% building 113/114 modules 1 active ...ode_modules\rxjs\_esm2015\internal\util\ArgumentOutOfRange50% building 114/115 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\util\Empty50% building 115/116 modules 1 active ...ode_modules\rxjs\_esm2015\internal\util\ObjectUnsubscribed50% building 116/117 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\util\Unsubscription50% building 117/118 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\util\Timeout50% building 118/119 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\scheduled\sche50% building 119/120 modules 1 active ...cript-chat-master\client\node_modules\@angular\cdk\fesm20150% building 120/121 modules 1 active ...-chat-master\client\node_modules\@angular\cdk\fesm2015\coe50% building 121/122 modules 1 active ...\node_modules\@angular\animations\__ivy_ngcc__\fesm2015\br50% building 122/123 modules 1 active ...client\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\pla50% building 123/124 modules 1 active ...lient\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\scro50% building 124/125 modules 1 active ...ent\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\collec50% building 125/126 modules 1 active ...t-chat-master\client\node_modules\rxjs\_esm2015\operators\50% building 126/127 modules 1 active ...lient\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\obse50% building 127/128 modules 1 active ...script-chat-master\client\node_modules\socket.io-client\li50% building 128/129 modules 1 active ...ipt-chat-master\client\node_modules\socket.io-client\lib\s50% building 129/130 modules 1 active ...nt\node_modules\@angular\material\__ivy_ngcc__\fesm2015\di50% building 130/131 modules 1 active ...ter\client\node_modules\@angular\cdk\__ivy_ngcc__\fesm201550% building 131/132 modules 1 active ...client\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\key50% building 132/133 modules 1 active ...r\client\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\p50% building 133/134 modules 1 active ...ter\client\node_modules\@angular\cdk\__ivy_ngcc__\fesm201550% building 134/135 modules 1 active ...\client\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\ov50% building 135/136 modules 1 active ...pt-chat-master\client\node_modules\socket.io-client\lib\ma50% building 136/137 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\observable\50% building 137/138 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\observable\int50% building 138/139 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\util\canReport50% building 139/140 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\symbol\rxSubsc50% building 140/141 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\SubjectSubscri50% building 141/142 modules 1 active ...-master\client\node_modules\rxjs\_esm2015\internal\util\is50% building 142/143 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\util\isFun50% building 143/144 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\observable\50% building 144/145 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\ref50% building 145/146 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\util\isSche50% building 146/147 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\observable\from50% building 147/148 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\util\isNu50% building 148/149 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\observable50% building 149/150 modules 1 active ...chat-master\client\node_modules\rxjs\_esm2015\internal\uti50% building 150/151 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\f50% building 151/152 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\scheduled\schedule50% building 152/153 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\scheduler\AsapA50% building 153/154 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\scheduler\AsyncA50% building 154/155 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\scheduler\AsyncSche50% building 155/156 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\scheduler\QueueA50% building 156/157 modules 1 active ...e_modules\rxjs\_esm2015\internal\scheduler\AnimationFrameA50% building 157/158 modules 1 active ...odules\rxjs\_esm2015\internal\scheduler\AnimationFrameSche50% building 158/159 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\scheduler\QueueSche50% building 159/160 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\scheduler\AsapSche50% building 160/161 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\util\subscr50% building 161/162 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\util\subscribeToR50% building 162/163 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\OuterSubsc50% building 163/164 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\symbol\ite50% building 164/165 modules 1 active ...ode_modules\rxjs\_esm2015\internal\scheduled\scheduleObser50% building 165/166 modules 1 active ...ient\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\text-50% building 166/167 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\util\isIte50% building 167/168 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\util\isArra50% building 168/169 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\util\isPr50% building 169/170 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\util\isInteropObser50% building 170/171 modules 1 active ...\node_modules\rxjs\_esm2015\internal\scheduled\scheduleIte50% building 171/172 modules 1 active ...t\node_modules\rxjs\_esm2015\internal\scheduled\schedulePr50% building 172/173 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\operator50% building 173/174 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 174/175 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\z50% building 175/176 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\operator50% building 176/177 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\operators\withLates50% building 177/178 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\windo50% building 178/179 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\windowT50% building 179/180 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\windo50% building 180/181 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\window50% building 181/182 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\w50% building 182/183 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\to50% building 183/184 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\time50% building 184/185 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\timeou50% building 185/186 modules 1 active ...escript-chat-master\client\node_modules\socket.io-client\l50% building 186/187 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\mer50% building 187/188 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\util\subscribeTo50% building 188/189 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\ti50% building 189/190 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\timeInt50% building 190/191 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\throwIf50% building 191/192 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\throttl50% building 192/193 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\thr50% building 193/194 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\operator50% building 194/195 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\take50% building 195/196 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\take50% building 196/197 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\util\Imme50% building 197/198 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\scheduler\A50% building 198/199 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\tak50% building 199/200 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 200/201 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\switch50% building 201/202 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\swit50% building 202/203 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\swit50% building 203/204 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\subscr50% building 204/205 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\star50% building 205/206 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\skip50% building 206/207 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\InnerSubsc50% building 207/208 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\util\isO50% building 208/209 modules 1 active ...\node_modules\rxjs\_esm2015\internal\util\subscribeToObser50% building 209/210 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\util\subscribeToIte50% building 210/211 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\util\subscribeToPr50% building 211/212 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\skip50% building 212/213 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\ski50% building 213/214 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 214/215 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\s50% building 215/216 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\shareR50% building 216/217 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 217/218 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\operators\sequence50% building 218/219 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 219/220 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\sampl50% building 220/221 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\s50% building 221/222 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\retr50% building 222/223 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 223/224 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\repea50% building 224/225 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\r50% building 225/226 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\r50% building 226/227 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 227/228 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\operators\publishR50% building 228/229 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\publis50% building 229/230 modules 1 active ...t\node_modules\rxjs\_esm2015\internal\operators\publishBeh50% building 230/231 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\pu50% building 231/232 modules 1 active ...t-master\client\node_modules\rxjs\_esm2015\internal\util\i50% building 232/233 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 233/234 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\part50% building 234/235 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\pai50% building 235/236 modules 1 active ...node_modules\rxjs\_esm2015\internal\operators\onErrorResum50% building 236/237 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\obse50% building 237/238 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\mult50% building 238/239 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\operator50% building 239/240 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\merg50% building 240/241 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\merge50% building 241/242 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\mer50% building 242/243 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 243/244 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\operator50% building 244/245 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\materi50% building 245/246 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 246/247 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 247/248 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\is50% building 248/249 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\operators\ignoreEle50% building 249/250 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 250/251 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\find50% building 251/252 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 252/253 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\fin50% building 253/254 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\e50% building 254/255 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\exhau50% building 255/256 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\ex50% building 256/257 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 257/258 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\en50% building 258/259 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\elem50% building 259/260 modules 1 active ...odules\rxjs\_esm2015\internal\operators\distinctUntilKeyCh50% building 260/261 modules 1 active ...e_modules\rxjs\_esm2015\internal\operators\distinctUntilCh50% building 261/262 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\dis50% building 262/263 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\operators\demateri50% building 263/264 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\dela50% building 264/265 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 265/266 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\operators\defaultIf50% building 266/267 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\debounc50% building 267/268 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\deb50% building 268/269 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 269/270 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\observable\50% building 270/271 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\concat50% building 271/272 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\conc50% building 272/273 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\conc50% building 273/274 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\c50% building 274/275 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\operators\combineL50% building 275/276 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\combi50% building 276/277 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\catch50% building 277/278 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\buffe50% building 278/279 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\bufferT50% building 279/280 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\buffe50% building 280/281 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\buffer50% building 281/282 modules 1 active ...modules\rxjs\_esm2015\internal\observable\SubscribeOnObser50% building 282/283 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\observable\c50% building 283/284 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\b50% building 284/285 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\audi50% building 285/286 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\util\hostReport50% building 286/287 modules 1 active ...chat-master\client\node_modules\rxjs\_esm2015\internal\Obs50% building 287/288 modules 1 active ...nt\node_modules\socket.io-client\node_modules\debug\src\br50% building 288/289 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\util\toSubsc50% building 289/290 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\observabl50% building 290/291 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\observable\gen50% building 291/292 modules 1 active ...node_modules\rxjs\_esm2015\internal\observable\fromEventPa50% building 292/293 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\observable\from50% building 293/294 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\observable\for50% building 294/295 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\observable\combineL50% building 295/296 modules 1 active ...pescript-chat-master\client\node_modules\socket.io-parser\50% building 296/297 modules 1 active ...escript-chat-master\client\node_modules\component-emitter\50% building 297/298 modules 1 active ...ript-chat-master\client\node_modules\engine.io-client\lib\50% building 298/299 modules 1 active ...et-io-typescript-chat-master\client\node_modules\parseuri\50% building 299/300 modules 1 active ...ient\node_modules\socket.io-client\node_modules\debug\src\50% building 300/301 modules 1 active ...io-typescript-chat-master\client\node_modules\has-binary2\50% building 301/302 modules 1 active ...ket-io-typescript-chat-master\client\node_modules\parseqs\50% building 302/303 modules 1 active ...typescript-chat-master\client\node_modules\component-bind\50% building 303/304 modules 1 active ...et-io-typescript-chat-master\client\node_modules\to-array\50% building 304/305 modules 1 active ...escript-chat-master\client\node_modules\socket.io-parser\b50% building 305/306 modules 1 active ...ript-chat-master\client\node_modules\socket.io-parser\is-b50% building 306/307 modules 1 active ...cket-io-typescript-chat-master\client\node_modules\backo2\50% building 307/308 modules 1 active ...ket-io-typescript-chat-master\client\node_modules\indexof\50% building 308/309 modules 1 active ...ipt-chat-master\client\node_modules\engine.io-client\lib\s50% building 309/310 modules 1 active ...nt\node_modules\socket.io-parser\node_modules\debug\src\br50% building 310/311 modules 1 active ...-chat-master\client\node_modules\engine.io-client\lib\tran50% building 311/312 modules 1 active ...aster\client\node_modules\engine.io-client\lib\transports\50% building 312/313 modules 1 active ...client\node_modules\socket.io-parser\node_modules\isarray\50% building 313/314 modules 1 active ...-master\client\node_modules\engine.io-client\lib\xmlhttpre50% building 314/315 modules 1 active ...ster\client\node_modules\has-binary2\node_modules\isarray\50% building 315/316 modules 1 active ...ient\node_modules\socket.io-parser\node_modules\debug\src\50% building 316/317 modules 1 active ...pt-chat-master\client\node_modules\engine.io-parser\lib\br50% building 317/318 modules 1 active ...client\node_modules\engine.io-client\lib\transports\pollin50% building 318/319 modules 1 active ...ient\node_modules\engine.io-client\lib\transports\polling-50% building 319/320 modules 1 active ...r\client\node_modules\engine.io-client\lib\transports\webs50% building 320/321 modules 1 active ...chat-master\client\node_modules\engine.io-client\lib\trans50% building 321/322 modules 1 active ...nt\node_modules\engine.io-client\node_modules\debug\src\br50% building 322/323 modules 1 active ...r\socket-io-typescript-chat-master\client\node_modules\ms\50% building 323/324 modules 1 active ...cript-chat-master\client\node_modules\engine.io-parser\lib50% building 324/325 modules 1 active ...cript-chat-master\client\node_modules\engine.io-parser\lib50% building 325/326 modules 1 active ...ter\client\node_modules\engine.io-client\lib\transports\po50% building 326/327 modules 1 active ...ient\node_modules\engine.io-client\node_modules\debug\src\50% building 327/328 modules 1 active ...et-io-typescript-chat-master\client\node_modules\has-cors\50% building 328/329 modules 1 active ...ocket-io-typescript-chat-master\client\node_modules\yeast\50% building 329/330 modules 1 active ...escript-chat-master\client\node_modules\arraybuffer.slice\50% building 330/331 modules 1 active ...ocket-io-typescript-chat-master\client\node_modules\after\50% building 331/332 modules 1 active ...socket-io-typescript-chat-master\client\node_modules\blob\50% building 332/333 modules 1 active ...escript-chat-master\client\node_modules\component-inherit\50% building 333/334 modules 1 active ...r\client\node_modules\base64-arraybuffer\lib\base64-arrayb
chunk {main} main.js, main.js.map (main) 87.2 kB [initial] [rendered]
chunk {polyfills} polyfills.js, polyfills.js.map (polyfills) 140 kB [initial] [rendered]
chunk {runtime} runtime.js, runtime.js.map (runtime) 6.15 kB [entry] [rendered]
chunk {styles} styles.js, styles.js.map (styles) 179 kB [initial] [rendered]
chunk {vendor} vendor.js, vendor.js.map (vendor) 5.24 MB [initial] [rendered]
Date: 2020-04-14T04:19:34.052Z - Hash: c1b7429915d9ae9388b5 - Time: 8166ms
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
: Compiled successfully.
```

socket.io 서버가 포트 8080에서 실행됩니다.

# Angular Client 실행
```linux
  $ cd client
  $ npm install
  $ ng serve
```

```text
> client@0.0.0 start C:\Users\ckdqj\Downloads\socket-io-typescript-chat-master\socket-io-typescript-chat-mas-chat-master\client
> ng serve
10% building 0/1 modules 1 active ...script-chat-master\socket-io-typescript-chat-master\client\src10% building 1/2 modules 1 active ...t-chat-master\socket-io-typescript-chat-master\client\src\poly10% building 2/3 modules 1 active ...\client\node_modules\@angular\material\prebuilt-themes\indigo-10% building 3/4 modules 1 active ...ver\client\index.js?http://0.0.0.0:0/sockjs-node&sockPath=/soc10% building 4/5 modules 1 active ...ipt-chat-master\socket-io-typescript-chat-master\client\src\st10% building 5/6 modules 1 active ...\client\node_modules\@angular\material\prebuilt-themes\indigo-10% building 6/7 modules 1 active ...ipt-chat-master\socket-io-typescript-chat-master\client\src\st10% building 6/8 modules 2 active ...\client\node_modules\@angular\material\prebuilt-themes\indigo-10% building 7/8 modules 1 active ...\client\node_modules\@angular\material\prebuilt-themes\indigo-10% building 8/9 modules 1 active ...pt-chat-master\client\node_modules\webpack-dev-server\client\s11% building 9/10 modules 1 active ...-chat-master\client\node_modules\webpack-dev-server\client\ov11% building 10/11 modules 1 active ...at-master\client\node_modules\webpack-dev-server\client\util11% building 11/12 modules 1 active ...r\client\node_modules\webpack-dev-server\client\utils\sendMe11% building 12/13 modules 1 active ...ter\client\node_modules\webpack-dev-server\client\utils\relo11% building 13/14 modules 1 active ...ient\node_modules\webpack-dev-server\client\utils\createSock11% building 14/15 modules 1 active ...master\client\node_modules\webpack\hot sync nonrecursive /^\11% building 14/16 modules 2 active ...t\node_modules\style-loader\dist\runtime\injectStylesIntoSty11% building 15/16 modules 1 active ...master\client\node_modules\webpack\hot sync nonrecursive /^\30% building 15/16 modules 1 active ...master\client\node_modules\webpack\hot sync nonrecursive /^\30% building 16/17 modules 1 active ...lient\node_modules\webpack-dev-server\client\clients\SockJSC30% building 17/18 modules 1 active ...de_modules\webpack-dev-server\client\utils\getCurrentScriptS30% building 18/19 modules 1 active ...ript-chat-master\socket-io-typescript-chat-master\client\src30% building 18/20 modules 2 active ...chat-master\socket-io-typescript-chat-master\client\src\poly30% building 19/20 modules 1 active ...chat-master\socket-io-typescript-chat-master\client\src\poly30% building 20/21 modules 1 active ...ster\socket-io-typescript-chat-master\client\node_modules\ur30% building 21/22 modules 1 active ...-typescript-chat-master\client\node_modules\querystring-es3\30% building 22/23 modules 1 active ...ket-io-typescript-chat-master\client\node_modules\webpack\ho30% building 23/24 modules 1 active ...master\socket-io-typescript-chat-master\client\src\app\app.m30% building 24/25 modules 1 active ...ket-io-typescript-chat-master\client\src\environments\enviro30% building 25/26 modules 1 active ...\client\node_modules\webpack-dev-server\client\clients\BaseC30% building 26/27 modules 1 active ...io-typescript-chat-master\client\node_modules\webpack\hot\em30% building 27/28 modules 1 active ...ocket-io-typescript-chat-master\client\src\app\app-routing.m30% building 28/29 modules 1 active ...ter\socket-io-typescript-chat-master\client\src\app\app.comp30% building 29/30 modules 1 active ...\socket-io-typescript-chat-master\client\src\app\chat\chat.m30% building 30/31 modules 1 active ...ter\socket-io-typescript-chat-master\client\node_modules\url30% building 31/32 modules 1 active ...ent\node_modules\node-libs-browser\node_modules\punycode\pun30% building 32/33 modules 1 active ...typescript-chat-master\client\node_modules\querystring-es3\d30% building 33/34 modules 1 active ...typescript-chat-master\client\node_modules\querystring-es3\e30% building 34/35 modules 1 active ...ket-io-typescript-chat-master\client\src\app\shared\shared.m30% building 35/36 modules 1 active ...et-io-typescript-chat-master\client\node_modules\strip-ansi\30% building 36/37 modules 1 active ...cket-io-typescript-chat-master\client\src\app\chat\chat.comp30% building 37/38 modules 1 active ...chat-master\client\src\app\chat\dialog-user\dialog-user.comp30% building 38/39 modules 1 active ...typescript-chat-master\client\node_modules\webpack\buildin\m30% building 39/40 modules 1 active ...ket-io-typescript-chat-master\client\node_modules\ansi-html\30% building 40/41 modules 1 active ...script-chat-master\client\src\app\shared\material\material.m30% building 41/42 modules 1 active ...pt-chat-master\client\src\app\chat\shared\services\socket.se30% building 42/43 modules 1 active ...ocket-io-typescript-chat-master\client\node_modules\events\e30% building 43/44 modules 1 active ...-typescript-chat-master\client\node_modules\loglevel\lib\log30% building 44/45 modules 1 active ...ript-chat-master\client\src\app\chat\dialog-user\dialog-user30% building 45/46 modules 1 active ...io-typescript-chat-master\client\src\app\chat\shared\model\a30% building 46/47 modules 1 active ...-io-typescript-chat-master\client\src\app\chat\shared\model\30% building 47/48 modules 1 active ...io-typescript-chat-master\client\node_modules\html-entities\30% building 48/49 modules 1 active ...cript-chat-master\client\node_modules\zone.js\dist\zone-ever50% building 49/50 modules 1 active ...ster\client\node_modules\@angular\core\__ivy_ngcc__\fesm201550% building 50/51 modules 1 active ...nt\src\$$_lazy_route_resource lazy groupOptions: {} namespac50% building 51/52 modules 1 active ...\@angular\platform-browser\__ivy_ngcc__\fesm2015\platform-br50% building 52/53 modules 1 active ...odules\@angular\platform-browser\__ivy_ngcc__\fesm2015\anima50% building 53/54 modules 1 active ...pt-chat-master\client\node_modules\html-entities\lib\xml-ent50% building 54/55 modules 1 active ...-chat-master\client\node_modules\html-entities\lib\html4-ent50% building 55/56 modules 1 active ...-chat-master\client\node_modules\html-entities\lib\html5-ent50% building 56/57 modules 1 active ...escript-chat-master\client\node_modules\sockjs-client\dist\s50% building 57/58 modules 1 active ...er\client\node_modules\@angular\common\__ivy_ngcc__\fesm201550% building 58/59 modules 1 active ...\client\node_modules\@angular\common\__ivy_ngcc__\fesm2015\c50% building 59/60 modules 1 active ...ules\@ngx-translate\core\__ivy_ngcc__\fesm2015\ngx-translate50% building 60/61 modules 1 active ...slate\http-loader\__ivy_ngcc__\fesm2015\ngx-translate-http-l50% building 61/62 modules 1 active ...\client\node_modules\@angular\material\__ivy_ngcc__\fesm201550% building 62/63 modules 1 active ...ient\node_modules\@angular\material\__ivy_ngcc__\fesm2015\si50% building 63/64 modules 1 active ...\client\node_modules\@angular\material\__ivy_ngcc__\fesm201550% building 64/65 modules 1 active ...\client\node_modules\@angular\material\__ivy_ngcc__\fesm201550% building 65/66 modules 1 active ...\client\node_modules\@angular\material\__ivy_ngcc__\fesm201550% building 66/67 modules 1 active ...ient\node_modules\@angular\material\__ivy_ngcc__\fesm2015\to50% building 67/68 modules 1 active ...lient\node_modules\@angular\material\__ivy_ngcc__\fesm2015\b50% building 68/69 modules 1 active ...\client\node_modules\@angular\router\__ivy_ngcc__\fesm2015\r50% building 69/70 modules 1 active ...er\client\node_modules\@angular\forms\__ivy_ngcc__\fesm2015\50% building 70/71 modules 1 active ...lient\node_modules\@angular\material\__ivy_ngcc__\fesm2015\d50% building 71/72 modules 1 active ...\client\node_modules\@angular\material\__ivy_ngcc__\fesm201550% building 72/73 modules 1 active ...t\node_modules\@angular\material\__ivy_ngcc__\fesm2015\form-50% building 73/74 modules 1 active ...client\node_modules\@angular\material\__ivy_ngcc__\fesm2015\50% building 74/75 modules 1 active ...io-typescript-chat-master\client\node_modules\rxjs\_esm2015\50% building 75/76 modules 1 active ...script-chat-master\client\node_modules\socket.io-client\lib\50% building 76/77 modules 1 active ...et-io-typescript-chat-master\client\node_modules\ansi-regex\50% building 77/78 modules 1 active ...node_modules\@angular\animations\__ivy_ngcc__\fesm2015\anima50% building 78/79 modules 1 active ...chat-master\client\node_modules\rxjs\_esm2015\internal\Obser50% building 79/80 modules 1 active ...pt-chat-master\client\node_modules\rxjs\_esm2015\internal\Su50% building 80/81 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\BehaviorSu50% building 81/82 modules 1 active ...t-master\client\node_modules\rxjs\_esm2015\internal\ReplaySu50% building 82/83 modules 1 active ...at-master\client\node_modules\rxjs\_esm2015\internal\AsyncSu50% building 83/84 modules 1 active ...-chat-master\client\node_modules\rxjs\_esm2015\internal\Sche50% building 84/85 modules 1 active ...at-master\client\node_modules\rxjs\_esm2015\internal\Subscri50% building 85/86 modules 1 active ...chat-master\client\node_modules\rxjs\_esm2015\internal\Subsc50% building 86/87 modules 1 active ...at-master\client\node_modules\rxjs\_esm2015\internal\Notific50% building 87/88 modules 1 active ...ipt-chat-master\client\node_modules\rxjs\_esm2015\internal\c50% building 88/89 modules 1 active ...e_modules\rxjs\_esm2015\internal\observable\ConnectableObser50% building 89/90 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\observable\bindCal50% building 90/91 modules 1 active ...t\node_modules\rxjs\_esm2015\internal\observable\bindNodeCal50% building 91/92 modules 1 active ...-master\client\node_modules\rxjs\_esm2015\internal\observabl50% building 92/93 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\observable\50% building 93/94 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\observable\50% building 94/95 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\observable\throw50% building 95/96 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\observable\50% building 96/97 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\observable50% building 97/98 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\observable\part50% building 98/99 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\observable\50% building 99/100 modules 1 active ...node_modules\rxjs\_esm2015\internal\observable\onErrorResum50% building 100/101 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\observab50% building 101/102 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\observable\50% building 102/103 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\symbol\obser50% building 103/104 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\gr50% building 104/105 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\scheduler50% building 105/106 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\scheduler\50% building 106/107 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\scheduler\50% building 107/108 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\scheduler\animation50% building 108/109 modules 1 active ...e_modules\rxjs\_esm2015\internal\scheduler\VirtualTimeSche50% building 109/110 modules 1 active ...hat-master\client\node_modules\rxjs\_esm2015\internal\util50% building 110/111 modules 1 active ...hat-master\client\node_modules\rxjs\_esm2015\internal\util50% building 111/112 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\util\ide50% building 112/113 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\util\isObser50% building 113/114 modules 1 active ...ode_modules\rxjs\_esm2015\internal\util\ArgumentOutOfRange50% building 114/115 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\util\Empty50% building 115/116 modules 1 active ...ode_modules\rxjs\_esm2015\internal\util\ObjectUnsubscribed50% building 116/117 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\util\Unsubscription50% building 117/118 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\util\Timeout50% building 118/119 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\scheduled\sche50% building 119/120 modules 1 active ...cript-chat-master\client\node_modules\@angular\cdk\fesm20150% building 120/121 modules 1 active ...-chat-master\client\node_modules\@angular\cdk\fesm2015\coe50% building 121/122 modules 1 active ...\node_modules\@angular\animations\__ivy_ngcc__\fesm2015\br50% building 122/123 modules 1 active ...client\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\pla50% building 123/124 modules 1 active ...lient\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\scro50% building 124/125 modules 1 active ...ent\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\collec50% building 125/126 modules 1 active ...t-chat-master\client\node_modules\rxjs\_esm2015\operators\50% building 126/127 modules 1 active ...lient\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\obse50% building 127/128 modules 1 active ...script-chat-master\client\node_modules\socket.io-client\li50% building 128/129 modules 1 active ...ipt-chat-master\client\node_modules\socket.io-client\lib\s50% building 129/130 modules 1 active ...nt\node_modules\@angular\material\__ivy_ngcc__\fesm2015\di50% building 130/131 modules 1 active ...ter\client\node_modules\@angular\cdk\__ivy_ngcc__\fesm201550% building 131/132 modules 1 active ...client\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\key50% building 132/133 modules 1 active ...r\client\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\p50% building 133/134 modules 1 active ...ter\client\node_modules\@angular\cdk\__ivy_ngcc__\fesm201550% building 134/135 modules 1 active ...\client\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\ov50% building 135/136 modules 1 active ...pt-chat-master\client\node_modules\socket.io-client\lib\ma50% building 136/137 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\observable\50% building 137/138 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\observable\int50% building 138/139 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\util\canReport50% building 139/140 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\symbol\rxSubsc50% building 140/141 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\SubjectSubscri50% building 141/142 modules 1 active ...-master\client\node_modules\rxjs\_esm2015\internal\util\is50% building 142/143 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\util\isFun50% building 143/144 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\observable\50% building 144/145 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\ref50% building 145/146 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\util\isSche50% building 146/147 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\observable\from50% building 147/148 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\util\isNu50% building 148/149 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\observable50% building 149/150 modules 1 active ...chat-master\client\node_modules\rxjs\_esm2015\internal\uti50% building 150/151 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\f50% building 151/152 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\scheduled\schedule50% building 152/153 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\scheduler\AsapA50% building 153/154 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\scheduler\AsyncA50% building 154/155 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\scheduler\AsyncSche50% building 155/156 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\scheduler\QueueA50% building 156/157 modules 1 active ...e_modules\rxjs\_esm2015\internal\scheduler\AnimationFrameA50% building 157/158 modules 1 active ...odules\rxjs\_esm2015\internal\scheduler\AnimationFrameSche50% building 158/159 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\scheduler\QueueSche50% building 159/160 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\scheduler\AsapSche50% building 160/161 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\util\subscr50% building 161/162 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\util\subscribeToR50% building 162/163 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\OuterSubsc50% building 163/164 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\symbol\ite50% building 164/165 modules 1 active ...ode_modules\rxjs\_esm2015\internal\scheduled\scheduleObser50% building 165/166 modules 1 active ...ient\node_modules\@angular\cdk\__ivy_ngcc__\fesm2015\text-50% building 166/167 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\util\isIte50% building 167/168 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\util\isArra50% building 168/169 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\util\isPr50% building 169/170 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\util\isInteropObser50% building 170/171 modules 1 active ...\node_modules\rxjs\_esm2015\internal\scheduled\scheduleIte50% building 171/172 modules 1 active ...t\node_modules\rxjs\_esm2015\internal\scheduled\schedulePr50% building 172/173 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\operator50% building 173/174 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 174/175 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\z50% building 175/176 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\operator50% building 176/177 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\operators\withLates50% building 177/178 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\windo50% building 178/179 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\windowT50% building 179/180 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\windo50% building 180/181 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\window50% building 181/182 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\w50% building 182/183 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\to50% building 183/184 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\time50% building 184/185 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\timeou50% building 185/186 modules 1 active ...escript-chat-master\client\node_modules\socket.io-client\l50% building 186/187 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\mer50% building 187/188 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\util\subscribeTo50% building 188/189 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\ti50% building 189/190 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\timeInt50% building 190/191 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\throwIf50% building 191/192 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\throttl50% building 192/193 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\thr50% building 193/194 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\operator50% building 194/195 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\take50% building 195/196 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\take50% building 196/197 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\util\Imme50% building 197/198 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\scheduler\A50% building 198/199 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\tak50% building 199/200 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 200/201 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\switch50% building 201/202 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\swit50% building 202/203 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\swit50% building 203/204 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\subscr50% building 204/205 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\star50% building 205/206 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\skip50% building 206/207 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\InnerSubsc50% building 207/208 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\util\isO50% building 208/209 modules 1 active ...\node_modules\rxjs\_esm2015\internal\util\subscribeToObser50% building 209/210 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\util\subscribeToIte50% building 210/211 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\util\subscribeToPr50% building 211/212 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\skip50% building 212/213 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\ski50% building 213/214 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 214/215 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\s50% building 215/216 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\shareR50% building 216/217 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 217/218 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\operators\sequence50% building 218/219 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 219/220 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\sampl50% building 220/221 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\s50% building 221/222 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\retr50% building 222/223 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 223/224 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\repea50% building 224/225 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\r50% building 225/226 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\r50% building 226/227 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 227/228 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\operators\publishR50% building 228/229 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\publis50% building 229/230 modules 1 active ...t\node_modules\rxjs\_esm2015\internal\operators\publishBeh50% building 230/231 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\pu50% building 231/232 modules 1 active ...t-master\client\node_modules\rxjs\_esm2015\internal\util\i50% building 232/233 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 233/234 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\part50% building 234/235 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\pai50% building 235/236 modules 1 active ...node_modules\rxjs\_esm2015\internal\operators\onErrorResum50% building 236/237 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\obse50% building 237/238 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\mult50% building 238/239 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\operator50% building 239/240 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\merg50% building 240/241 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\merge50% building 241/242 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\mer50% building 242/243 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 243/244 modules 1 active ...master\client\node_modules\rxjs\_esm2015\internal\operator50% building 244/245 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\materi50% building 245/246 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 246/247 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 247/248 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\is50% building 248/249 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\operators\ignoreEle50% building 249/250 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 250/251 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\find50% building 251/252 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\operators50% building 252/253 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\fin50% building 253/254 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\e50% building 254/255 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\exhau50% building 255/256 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\ex50% building 256/257 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 257/258 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\operators\en50% building 258/259 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\elem50% building 259/260 modules 1 active ...odules\rxjs\_esm2015\internal\operators\distinctUntilKeyCh50% building 260/261 modules 1 active ...e_modules\rxjs\_esm2015\internal\operators\distinctUntilCh50% building 261/262 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\dis50% building 262/263 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\operators\demateri50% building 263/264 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\dela50% building 264/265 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 265/266 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\operators\defaultIf50% building 266/267 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\debounc50% building 267/268 modules 1 active ...r\client\node_modules\rxjs\_esm2015\internal\operators\deb50% building 268/269 modules 1 active ...ster\client\node_modules\rxjs\_esm2015\internal\operators\50% building 269/270 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\observable\50% building 270/271 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\concat50% building 271/272 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\conc50% building 272/273 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\conc50% building 273/274 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\c50% building 274/275 modules 1 active ...ent\node_modules\rxjs\_esm2015\internal\operators\combineL50% building 275/276 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\combi50% building 276/277 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\catch50% building 277/278 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\buffe50% building 278/279 modules 1 active ...ient\node_modules\rxjs\_esm2015\internal\operators\bufferT50% building 279/280 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\operators\buffe50% building 280/281 modules 1 active ...lient\node_modules\rxjs\_esm2015\internal\operators\buffer50% building 281/282 modules 1 active ...modules\rxjs\_esm2015\internal\observable\SubscribeOnObser50% building 282/283 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\observable\c50% building 283/284 modules 1 active ...ter\client\node_modules\rxjs\_esm2015\internal\operators\b50% building 284/285 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\operators\audi50% building 285/286 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\util\hostReport50% building 286/287 modules 1 active ...chat-master\client\node_modules\rxjs\_esm2015\internal\Obs50% building 287/288 modules 1 active ...nt\node_modules\socket.io-client\node_modules\debug\src\br50% building 288/289 modules 1 active ...er\client\node_modules\rxjs\_esm2015\internal\util\toSubsc50% building 289/290 modules 1 active ...aster\client\node_modules\rxjs\_esm2015\internal\observabl50% building 290/291 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\observable\gen50% building 291/292 modules 1 active ...node_modules\rxjs\_esm2015\internal\observable\fromEventPa50% building 292/293 modules 1 active ...client\node_modules\rxjs\_esm2015\internal\observable\from50% building 293/294 modules 1 active ...\client\node_modules\rxjs\_esm2015\internal\observable\for50% building 294/295 modules 1 active ...nt\node_modules\rxjs\_esm2015\internal\observable\combineL50% building 295/296 modules 1 active ...pescript-chat-master\client\node_modules\socket.io-parser\50% building 296/297 modules 1 active ...escript-chat-master\client\node_modules\component-emitter\50% building 297/298 modules 1 active ...ript-chat-master\client\node_modules\engine.io-client\lib\50% building 298/299 modules 1 active ...et-io-typescript-chat-master\client\node_modules\parseuri\50% building 299/300 modules 1 active ...ient\node_modules\socket.io-client\node_modules\debug\src\50% building 300/301 modules 1 active ...io-typescript-chat-master\client\node_modules\has-binary2\50% building 301/302 modules 1 active ...ket-io-typescript-chat-master\client\node_modules\parseqs\50% building 302/303 modules 1 active ...typescript-chat-master\client\node_modules\component-bind\50% building 303/304 modules 1 active ...et-io-typescript-chat-master\client\node_modules\to-array\50% building 304/305 modules 1 active ...escript-chat-master\client\node_modules\socket.io-parser\b50% building 305/306 modules 1 active ...ript-chat-master\client\node_modules\socket.io-parser\is-b50% building 306/307 modules 1 active ...cket-io-typescript-chat-master\client\node_modules\backo2\50% building 307/308 modules 1 active ...ket-io-typescript-chat-master\client\node_modules\indexof\50% building 308/309 modules 1 active ...ipt-chat-master\client\node_modules\engine.io-client\lib\s50% building 309/310 modules 1 active ...nt\node_modules\socket.io-parser\node_modules\debug\src\br50% building 310/311 modules 1 active ...-chat-master\client\node_modules\engine.io-client\lib\tran50% building 311/312 modules 1 active ...aster\client\node_modules\engine.io-client\lib\transports\50% building 312/313 modules 1 active ...client\node_modules\socket.io-parser\node_modules\isarray\50% building 313/314 modules 1 active ...-master\client\node_modules\engine.io-client\lib\xmlhttpre50% building 314/315 modules 1 active ...ster\client\node_modules\has-binary2\node_modules\isarray\50% building 315/316 modules 1 active ...ient\node_modules\socket.io-parser\node_modules\debug\src\50% building 316/317 modules 1 active ...pt-chat-master\client\node_modules\engine.io-parser\lib\br50% building 317/318 modules 1 active ...client\node_modules\engine.io-client\lib\transports\pollin50% building 318/319 modules 1 active ...ient\node_modules\engine.io-client\lib\transports\polling-50% building 319/320 modules 1 active ...r\client\node_modules\engine.io-client\lib\transports\webs50% building 320/321 modules 1 active ...chat-master\client\node_modules\engine.io-client\lib\trans50% building 321/322 modules 1 active ...nt\node_modules\engine.io-client\node_modules\debug\src\br50% building 322/323 modules 1 active ...r\socket-io-typescript-chat-master\client\node_modules\ms\50% building 323/324 modules 1 active ...cript-chat-master\client\node_modules\engine.io-parser\lib50% building 324/325 modules 1 active ...cript-chat-master\client\node_modules\engine.io-parser\lib50% building 325/326 modules 1 active ...ter\client\node_modules\engine.io-client\lib\transports\po50% building 326/327 modules 1 active ...ient\node_modules\engine.io-client\node_modules\debug\src\50% building 327/328 modules 1 active ...et-io-typescript-chat-master\client\node_modules\has-cors\50% building 328/329 modules 1 active ...ocket-io-typescript-chat-master\client\node_modules\yeast\50% building 329/330 modules 1 active ...escript-chat-master\client\node_modules\arraybuffer.slice\50% building 330/331 modules 1 active ...ocket-io-typescript-chat-master\client\node_modules\after\50% building 331/332 modules 1 active ...socket-io-typescript-chat-master\client\node_modules\blob\50% building 332/333 modules 1 active ...escript-chat-master\client\node_modules\component-inherit\50% building 333/334 modules 1 active ...r\client\node_modules\base64-arraybuffer\lib\base64-arrayb
chunk {main} main.js, main.js.map (main) 87.2 kB [initial] [rendered]
chunk {polyfills} polyfills.js, polyfills.js.map (polyfills) 140 kB [initial] [rendered]
chunk {runtime} runtime.js, runtime.js.map (runtime) 6.15 kB [entry] [rendered]
chunk {styles} styles.js, styles.js.map (styles) 179 kB [initial] [rendered]
chunk {vendor} vendor.js, vendor.js.map (vendor) 5.24 MB [initial] [rendered]
Date: 2020-04-14T04:19:34.052Z - Hash: c1b7429915d9ae9388b5 - Time: 8166ms
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
: Compiled successfully.
Running server on port 8080
Connected client on port 8080.
```
* 첫 화면 <br />
<img src = "https://user-images.githubusercontent.com/33046341/79189200-17d2bf80-7e5c-11ea-82ac-74ab186cf380.png" width = 90%> </img>

* 입장 시 <br />
<img src = "https://user-images.githubusercontent.com/33046341/79189243-35a02480-7e5c-11ea-96d3-98405c9f581c.png" width = 90%></img>

* 채팅 입력 <br />
<img src = "https://user-images.githubusercontent.com/33046341/79189283-510b2f80-7e5c-11ea-8864-9420509f105a.png" width = 90%></img>

* 터미널 창 <br />
<img src = "https://user-images.githubusercontent.com/33046341/79189333-7009c180-7e5c-11ea-8e5d-0fe5722cb861.png" width = 90%></img>

# reference
> * [참고 사이트](https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1)
> * [참고 사이트](https://luixaviles.com/2017/09/releasing-socket-io-typescript-chat-project)
