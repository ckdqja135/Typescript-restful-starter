# TypeScript를 사용한 실시간 앱 : Web Sockets, Node & Angular 및 통합.
``` TypeScript를 사용하여 실시간 채팅 앱 작성.```
  
얼마 전에 TypeScript 언어 만 사용하여 간단한 채팅 응용 프로그램을 구현했습니다. <br />
주요 목표는 클라이언트 측과 서버에서이 프로그래밍 언어를 사용하는 방법을 설명하는 데모를 작성하는 것이 었습니다. <br />
클라이언트 앱이 최신 Angular 기능을 사용하고 있습니다. <br />
이 글에서는 앱을 처음부터 어떻게 구현했는지 보여 드리겠습니다. <br />

# 실시간 응용 프로그램이란 무엇입니까?

이 [Wikipedia 정의](https://en.wikipedia.org/wiki/Real-time_web)에 따르면 실시간 응용 프로그램은 정보를 게시하는 즉시 정보를 수신할 수 있도록 하며, <br />
소스가 정기적으로 업데이트되었는지 확인할 필요가 없습니다. <br />
따라서 이러한 종류의 앱은 사용자에게 이벤트와 조치가 즉시 발생한다는 느낌을 주어야 합니다. <br />

# 웹 소켓
WebSockets는 양방향 통신 채널을 제공하는 프로토콜입니다. <br />
즉, 브라우저와 웹 서버는 실시간 통신을 유지하면서 연결이 열려있는 동안 메시지를주고받을 수 있습니다. <br />

<img src = "https://miro.medium.com/max/1400/1*9HDEuF54yWrJdnwvLaWIWg.png" width = 90%> </img>

# 응용 프로그램 구조
서버 관련 코드와 클라이언트 코드를 분리합니다. <br />
가장 중요한 파일을 설명 할 때 자세한 내용을 살펴 보겠습니다. <br />
현재로서는 다음과 같이 응용 프로그램의 예상 구조입니다. <br />

``` text

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
WebSockets는 [사양](https://tools.ietf.org/html/rfc6455) 이므로 몇 가지 구현을 찾을 수 있습니다. <br />
TypeScript 또는 기타 프로그래밍 언어를 선택할 수 있습니다. <br />
이 경우 가장 빠르고 안정적인 실시간 엔진 중 하나 인 [Socket.IO](https://socket.io/)를 사용 합니다. <br />

# 서버 측 코드에서 TypeScript를 사용하는 이유는 무엇입니까?
TypeScript에는 정말 멋진 [기능이 포함](https://www.typescriptlang.org/) 되어 있으며 매우 자주 업데이트됩니다. <br />
이 [버그의 약 15%](http://ttendency.cs.ucl.ac.uk/projects/type_study/documents/type_study.pdf)를 방지 할 수 있습니다. 더 많은 이유가 필요하십니까? 😄

# 서버 응용 프로그램 초기화
[package.json파일 생성](https://docs.npmjs.com/cli/init)하고 다음 종속성을 설치합니다.
``` linux

  npm install --save express socket.io @types/express @types/socket.io
  
```

<code>devDependencies</code>통합을 허용 <code>gulp</code>하고 <code>typescript</code>나중에 다음 도구를 사용하여 빌드 작업을 쉽게 정의 할 수 있도록 일부를 설치해야합니다.
```linux
  
  npm install --save-dev typescript gulp gulp-typescript
  
```

# TypeScript 컴파일러 구성
<code>tsconfig.json</code>다음 내용 으로 파일을 작성하십시오.

* tsconfig.json
``` typescript

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
정적 타이핑을 활용하여 다음과 같이 작은 데이터 모델을 정의하겠습니다.
* chat-model.ts 
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

<code>.. server/src</code>디렉토리에 대한 자세한 내용을 보겠습니다. <br />

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
<code>server</code>디렉토리 의 기본 파일 은 <code>index.ts</code>및 <code>chat-server.ts</code>입니다. <br />
첫 번째는 우리가 <code>ChatServer</code>앱 을 생성하고 내보낼 수 있도록 하는 반면, 마지막은 [express](https://expressjs.com/) 및 [socket.IO](https://socket.io/) 구성을 포함 합니다.

* index.ts
```typescript

import { ChatServer } from './chat-server';

let app = new ChatServer().getApp();
export { app };

```

* chat-server.ts
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

# 서버 클래스
이전 코드는 다음과 같은 클래스 및 관계의 결과를 제공합니다.

* 서버 클래스 다이어그램
<img src = "https://miro.medium.com/max/2000/1*-FNkJxTH5kDiBPdJx4tVIg.png" width = 90%></img>

# 서버 구축 및 실행
Node.js의 V8 엔진에 필요한 JavaScript 파일을 갖기 위해 파일에 <code>build</code>태스크를 추가 할 수 있습니다<code>gulpfile.js</code>.

* gulpfile.js 
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

보시다시피 빌드 프로세스의 출력 (자바 스크립트 파일)은 <code>dist</code>디렉토리에 있습니다. <br />
이 작업을 수행하려면 다음을 실행해야합니다. <br />

``` linux

  gulp build

```
이제 <code>node dist/index.js</code>명령을 실행하여 서버를 실행할 수 있습니다.

# 고객 코드
이제 <code>node dist/index.js</code> 명령을 실행하여 서버를 실행할 수 있습니다.

```linux

  ng new typescript-chat-client --routing --prefix tcc --skip-install
  
```

그런 다음 <code>npm install</code>을 실행하는 종속성을 설치합니다(이 단계에서는 [Yarn](https://classic.yarnpkg.com/en/)을 사용하는 것이 좋습니다). <br />

``` linux

  ng new typescript-chat-client --routing --prefix tcc --skip-install
  
```

[프로젝트 구조](https://angular.io/guide/styleguide#application-structure-and-ngmodules)에서 모범 사례를 사용하는 과정에서 다음을 생성 <code>shared</code>하고 <code>material</code>모듈 할 수 있습니다 .
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

명령 행 인터페이스에서이를 수행 할 수 있습니다.

``` text

  ng generate module shared --module app
  ng generate module shared/material --module shared

```

내부의 변화를 확인 <code>app.module.ts</code>하고 <code>shared.module.ts</code>이러한 모듈 사이에 관계를 볼 수 있습니다.

# express 및 socket.IO 추가
클라이언트 앱에 <code>express</code> 및 <code>socket.io</code> 모듈을 추가해야 합니다

``` linux

  npm install express socket.io --save
  
```

# 채팅 모듈 및 구성 요소
채팅 응용 프로그램의 구성 요소를 만들기 전에 새 모듈을 만들어 보겠습니다.

``` linux

  npm install express socket.io --save
  
```

# 채팅 모듈 및 구성 요소
채팅 응용 프로그램의 구성 요소를 만들기 전에 새 모듈을 만들어 보겠습니다.

``` linux

  ng generate module chat --module app

```

이제 최신 모듈에 컴포넌트를 추가하십시오.

``` linux

  ng generate component chat --module chat

```

웹 소켓 및 사용자 지정 모델을 사용하려면 다른 <code>공유</code> 폴더를 만들겠습니다. <br />
이번에는 <code>chat</code> 디렉토리에 있습니다. <br />

``` linux

  ng generate service chat/shared/services/socket --module chat
  ng generate class chat/shared/model/user
  ng generate class chat/shared/model/message

```

우리는 다음과 비슷한 구조로 끝날 것입니다.

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

# 관찰 가능 요소 및 웹 소켓
저희 Angular app 은 <code>RxJS</code>와 함께 제공되기 때문에 <code>Observables</code>를 사용하여 Socket.IO을 잡을 수 있습니다. <br /> 
이벤트는 다음과 같습니다.

* socket.service.ts

``` typescript

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

* 앱에서 작업 및 이벤트를 관리하려면 다음 열거형을 정의해야 합니다.
* client-enums.ts 
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

* 이제 서버의 메시지를 청취할 준비가 되었습니다.
* chat.component.ts
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
<code>ChatComponent</code>가 초기화되면 구성 요소가 연결 이벤트 또는 수신 메시지를 수신하기 위해 <code>SocketService</code> 관찰 자료에 가입합니다.
<Code>sendMessage</code> 및 <code>sendNotification</code> 기능은 동일한 서비스를 통해 각 콘텐츠를 전송합니다. 현재 전송되는 알림은 사용자 이름 변경 및 사용자 가입입니다.

# 채팅 애플리케이션 기능
> * Angular CLI
> * Angular 5
> * Angular Material
> * Validation Forms

# 소스 코드
이 GitHub 리포지토리에서 전체 프로젝트를 찾으십시오.
[github](github.com/luixaviles/socket-io-typescript-chat)

# reference
[참고 사이트](https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1)
















