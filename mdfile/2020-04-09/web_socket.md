# Websocket에 대해

## WebSocket이란
WebSocket은 컴퓨터 네트워크용 통신 규약의 하나이다. ( ws:// )  <br />
인터넷의 표준화 단체인 **W3C(World Wide Web Consortium)** 와 **IETF(Internet Engineering Task Force)** 가 Web server 와 Web browser 간의 통신을 위한 규정을 정의한 **쌍방향통신(Duplex)용** 기술 규약이다. <br />

API는 W3C가 책정을 맡고 있고, WebSocket 프로토콜은 IETF가 책정을 맡고 있다.

## WebSocket의 등장 배경
초기 웹의 탄생 목적은 문서 전달과 하이퍼링크를 통한 문서 연결이었다. <br />
웹을 위한 HTTP 프로토콜은 이러한 목적에 매우 부 합하는 모델이다. <br />
그러나 시대가 변하고 환경이 발전할 수록 웹이 더 이상 문서공유에만 집중할 수 없었다. <br />
갈수록 동적인 표 현과 뛰어난 상호작용이 요구되었고 이로 인해 여러 새로운 기술이 탄생되었다. <br />
플래시(플렉스), 자바애플릿(자바FX), ActiveX , 실버라이트 등을 들 수 있다. <br />
하지만 이들은 웹에서 화려한 동작과 뛰어난 상호작용을 보장하지만 순수 웹 환경이 아니라 별도의 런타임을 플러그 인 형태로 브라우저에 설치해야 사용 가능하다. <br />
HTML5는 그 주요 목적 중 하나인, 플러그 인 없 는 일관되고 표준화된 웹 응용 환경이라는 기치하에 많은 참신한 스펙들이 개발되었다. <br />
그 중 순수 웹 환경에서 실시간 양방향 통신을 위한 스펙이 바로 WebSocek 이다. <br />

## 웹(Web)의 실시간(양방향) 통신을 위한 그동안의 노력.
**DHTML, iframe, Ajax, Comet** 과 기술들이 등장했지만 이 모든 것은 **'폴링(polling)'** 방식이다. <br />
즉 데이터 수신을 위해 서버가 클라이언트에게 전송해 주는 푸시(push)방식이 아니라 **클라이언트가 서버에에게 요청하는 폴링(polling) 방식**이였다. <br />
비교적 최적의 대안이었던 Comet 역시 무의미한 반복 요청을 피하기 위한 연결유지 기법이 적용되었지만 <br />
일정 시간 이후에는 연결을 종료하고 다시 연결해야 한다. 그래서 Comet을 Long-Polling 라 한다.<br />

## 웹(Web)의 진정한 실시간(양방향) 통신, WebSocket의 등장.
WebSocket은 웹 서버와 웹 브라우저가 지속적으로 연결된 TCP 라인을 통해 실시간으로 데이터를 주고 받을 수 있도록 하는 HTML5의 새로운 사양이다. <br />
따라서 WebSocket을 이용하면 일반적인 TCP소켓과 같이 연결지향 양방향 전이중 통신이 가능하다. <br />
이와 같은 특징으로 웹에서도 채팅이나 게임, 실시간 주식 차트와 같은 실시간이 요구되는 응용프로그램의 개발을 한층 효 과적으로 구현할 수 있게 되었다. <br />

## 기존의 존재했던 통신방법과 WebSocket의 결정적 차이는?
지금까지 존재했던 통신방법과 WebSocket의 결정적인 차이는 프로토콜에 있다. <br />
WebSocket 프로토콜은 접속 확립에 HTTP를 사용하지만, 그 후의 통신은 WebSocket 독자의 프로토콜로 이루어진다. <br />
또한, header가 상당히 작아 overhead가 적은 특징 이 있다. 장시간 접속을 전제로 하기 때문에, 접속한 상태라면 클라이언트나 서버로부터 데이터 송신이 가능하다. <br />
더불어 데이터의 송신과 수신에 각각 커넥션을 맺을 필요가 없어, 하나의 커넥션으로 데이터를 송수신 할 수 있다. <br />
통신시에 지정되는 URL은 http://www.sample.com/과 같은 형식이 아니라 ws://www.sample.com/과 같은 형식이 된다.<br />

## WebSocket 소켓이 필요한 다섯가지 경우.
1. **실시간 양방향** 데이터 통신이 필요한 경우.
2. **많은 수의 동시 접속자를 수용**해야 하는 경우.
3. **브라우저에서 TCP 기반의 통신으로 확장**해야 하는 경우.
4. **개발자에게 사용하기 쉬운 API**가 필요할 경우.
5. 클라우드 환경이나 웹을 넘어 **SOA(Service Oriented Architecture)** 로 확장해야 하는 경우

## WebSocket 서버의 종류.

1. pywebsocket(apache).
2. phpwebsocket(php).
3. jWebSocket(java,javascript).
4. web-socket-ruby(ruby).
5. Socket.IO(node.js).

## 그렇다면 Socket.io는 무엇인가?
WebSocket은 다가올 미래의 기술이지 아직 인터넷 기업에서 시범적으로라도 써 볼 수 있는 기술이 아니다. WebSocket이 미래의 기술이라면 Socket.io는 현재 바로 사용할 수 있는 기술이다. Socket.io는 JavaScript를 이용하여 브라우저 종류에 상관없이 실시간 웹을 구현할 수 있도록 한 기술이다.

Guillermo Rauch가 만든 Socket.io는 WebSocket, FlashSocket, AJAX Long Polling, AJAX Multi part Streaming, IFrame, JSONP Polling을 하나의 API로 추상화한 것이다. 즉 브라우저와 웹 서버의 종류와 버전을 파악하여 가장 적합한 기술을 선택하여 사용하는 방식이다. 가령 브라우저에 Flash Plugin v10.0.0 이상(FlashSocket 지원 버전)이 설치되어 있으면 FlashSocket을 사용하고, Flash Plugin이 없으면 AJAX Long Polling 방식을 사용한다.

개발자가 각 기술을 깊이 이해하지 못하거나 구현 방법을 잘 알지 못해도 사용할 수 있다. Web Socket과 달리 Socket.io는 표준 기술이 아니고 Node.js 모듈로서 Guillermo Rauch가 CTO로 있는 LearnBoost(https://www.learnboost.com) 라는 회사의 저작물이며 MIT 라이센스를 가진 오픈소스이다. 현재 Node.js가 아닌 다른 프레임워크에서 Socket.io를 사용할 수 있도록 하는 시도가 있다.

## reference 
> * [웹 소켓과 socket.io](https://d2.naver.com/helloworld/1336)
> * [WebSocket기반 실시간 양방향 통신](https://jusungpark.tistory.com/40)

# 자바스크립트는 어떻게 작동하는가: 웹소켓 및 HTTP/2 SSE

## 소개
오늘날에는 풍부하고 역동적인 UI를 제공하는 복잡한 웹앱이 당연하게 받아 들여지고 있습니다. 
하지만 여기까지 오기까지 인터넷이 시작된 이래로 참 먼 길을 왔습니다.
원래 인터넷은 역동적이고 복잡한 웹 응용 프로그램을 지원하도록 만들어지지 않았습니다. 
사람들은 웹을 정보가 담겨있는 서로 연결된 HTML 페이지 모음 정도로 생각했습니다.
웹의 모든 것은 HTTP라는 요청/응답 패러다임을 중심으로 구축되었습니다. 
HTTP를 사용하여 클라이언트가 페이지를 로드하면 사용자가 클릭하여 다음 페이지로 이동할 때까지는 아무 일도 일어나지 않습니다.
2005년 경에 AJAX가 소개되었고 많은 사람들이 클라이언트와 서버를 양방향으로 연결할 수 있는 가능성을 모색하기 시작했습니다. 
그럼에도 불구하고 모든 HTTP 통신이 시작되기 위해서는 사용자의 상호 작용이나 정기적인 폴링이 필요했습니다.

## HTTP를 “양방향”으로 만들기
서버가 클라이언트에 “사전 대응적으로” 데이터를 전송할 수 있게 해주는 기술은 오랫동안 사용되어 왔습니다. 
“Push”와 “Comet”을 예로 들어보겠습니다.
서버가 클라이언트에 데이터를 전송한다는 착각을 일으키는 가장 일반적인 트릭(?) 중 하나는 롱폴링(long polling)이라고 합니다. 
롱폴링을 사용하면 클라이언트는 서버에 대한 HTTP 연결을 열고 응답을 받을 때까지 이를 계속 열어 둡니다. 
서버는 전송할 새로운 데이터가 생길 때 마다 이를 응답으로 전송합니다.
매우 간단한 롱폴링 예제 코드를 살펴보겠습니다.
```javascript

     (function poll(){
          setTimeout(function(){
             $.ajax({ 
               url: 'https://api.example.com/endpoint', 
               success: function(data) { 
                 // Do something with `data`
                 // ...

                 //Setup the next poll recursively
                 poll();
               }, 
               dataType: 'json'
             });
         }, 10000);
     })();

```
이것은 기본적으로 자가실행되는 함수로서 첫 실행은 자동으로 시작됩니다. 
10초 간격이 설정되어 있고 서버에 대한 각각의 비동기 Ajax 호출 후에 콜백은 다시 Ajax 호출을 합니다.
이외에도 [플래시](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/Socket.html) 혹은 
XHR 멀티파트 요청과 소위 **htmlfile**을 사용하기도 합니다.
이러한 접근 방식에는 모두 동일한 문제가 있는데 바로 HTTP 오버헤드가 존재한다는 점입니다. 
이 때문에 지연 시간이 짧아야 하는 응용 프로그램에는 위 방법들이 적합하지 않습니다. 
브라우저 상에서 구동되는 멀티플레이어 1인칭 슈팅 게임이나 그 밖의 실시간 구성요소가 포함된 온라인 게임을 생각해 보면 쉽습니다.

## WebSocket 소개
[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)의 사양에는 웹 브라우저와 서버 간에 “소켓” 연결을 설정하는 API가 정의되어 있습니다. 
간단히 말하면 클라이언트와 서버 사이에 지속적인 연결이 설정되며 양측은 언제든지 데이터를 보낼 수 있습니다. <br />

<img src = "https://user-images.githubusercontent.com/33046341/78872274-ff415e80-7a83-11ea-9a58-d2c0b011021e.png" width="90%"></img>

클라이언트는 WebSocket 핸드셰이크라는 프로세스를 통해 WebSocket 연결을 설정합니다. 
이 프로세스는 클라이언트가 서버에 일반 HTTP 요청을 보내는 것으로 시작합니다. 
클라이언트가 WebSocket 연결을 설정하고자한다는 것을 서버에 알려주는 <code>Upgrade</code> 헤더가 이 요청에 포함됩니다.

WebSocket 연결을 클라이언트 측에서 어떻게 여는지 보겠습니다.

```javascript

  // Create a new WebSocket with an encrypted connection.
  var socket = new WebSocket('ws://websocket.example.com');
  
```

> WebSocket URL은 <code>ws</code> 스키마를 사용합니다. 
> HTTPS와 동일한 보안 WebSocket 연결에 사용되는 <code>wss</code>도 있습니다.

이 코드는 websocket.example.com을 향해 WebSocket 연결을 여는 프로세스를 시작합니다.
다음은 최초 요청 헤더의 간단한 예입니다.

```javascript

  GET ws://websocket.example.com/ HTTP/1.1
  Origin: http://example.com
  Connection: Upgrade
  Host: websocket.example.com
  Upgrade: websocket

```
서버가 WebSocket 프로토콜을 지원하면 업그레이드에 동의하며 응답 <code>Upgrade</code> 헤더를 통해 이를 알립니다.
이것이 Node.JS에서 어떻게 구현되는지 보겠습니다.

```javascript

     // We'll be using the https://github.com/theturtle32/WebSocket-Node
     // WebSocket implementation
     var WebSocketServer = require('websocket').server;
     var http = require('http');

     var server = http.createServer(function(request, response) {
       // process HTTP request. 
     });
     server.listen(1337, function() { });

     // create the server
     wsServer = new WebSocketServer({
       httpServer: server
     });

     // WebSocket server
     wsServer.on('request', function(request) {
       var connection = request.accept(null, request.origin);

       // This is the most important callback for us, we'll handle
       // all messages from users here.
       connection.on('message', function(message) {
           // Process WebSocket message
       });

       connection.on('close', function(connection) {
         // Connection closes
       });
     });

```

연결이 설정된 후 서버는 업그레이드를 통해 응답합니다.

```text

  HTTP/1.1 101 Switching Protocols
  Date: Wed, 25 Oct 2017 10:07:34 GMT
  Connection: Upgrade
  Upgrade: WebSocket

```

연결이 설정되면 <code>open</code> 이벤트가 클라이언트 측의 **WebSocket** 인스턴스에서 발생합니다.

```javascript

  var socket = new WebSocket('ws://websocket.example.com');

  // Show a connected message when the WebSocket is opened.
  socket.onopen = function(event) {
    console.log('WebSocket is connected.');
  };
  
```

핸드셰이크가 완료되었으므로 초기 **HTTP** 연결은 동일한 기본 **TCP/IP** 연결을 사용하는 **WebSocket** 연결로 대체됩니다.
이 시점부터 어느 쪽이든 데이터 전송을 시작할 수 있습니다.

**WebSocket**을 사용하면 기존 방식처럼 **HTTP** 요청과 관련된 오버헤드 없이 원하는 만큼의 데이터를 전송할 수 있습니다. 
데이터는 **WebSocket**을 통해 메시지로 전송되며 각 메시지는 전송중인 데이터(페이로드)를 포함하는 하나 이상의 **프레임**으로 구성됩니다. 
**메시지**가 클라이언트에 도달 할 때 올바르게 재구성 될 수 있도록 하기 위해 
각 프레임에는 페이로드에 대한 **4 ~ 12**바이트의 데이터 프리픽스가 붙습니다. 
이 프레임 기반 메시징 시스템을 사용하면 전송되는 비(非) 페이로드 데이터의 양이 줄어 지연 시간을 크게 낮출 수 있습니다.


> **참고 :** 클라이언트는 모든 프레임이 수신되고 원본 메시지 페이로드가 재구성 된 경우에만 
>            새 메시지에 대한 알림을 받게된다는 점에 유의해야합니다.

## WebSocket URL
**WebSocket**에서는 새로운 **URL** 스키마를 사용한다고 간단히 언급했습니다. 
실제로 <code>ws://</code> 및 <code>wss://</code>라는 두 가지 새로운 스키마가 도입되었습니다.

**URL**에는 각 스키마마다 특정한 문법이 있습니다. **WebSocket URL**은 앵커 **(** 예를 들어 <code>#sample_anchor</code> **)** 를 지원하지 않는다는 점이 특이합니다.
**WebSocket** 스타일의 **URL**에도 **HTTP** 스타일 **URL**과 동일한 규칙이 적용됩니다. 
<code>ws</code>는 암호화되지 않은 상태이며 포트 **80**이 기본 포트이고 <code>wss</code>는 **TLS** 암호화가 필요하며 포트 **443**이 기본값으로 사용됩니다.

## 프레이밍 프로토콜
프레이밍 프로토콜에 대해 자세히 살펴 보겠습니다. 아래는 RFC에서 제공하는 내용입니다.

```code

     0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+
```

**RFC**에서 지정한 **WebSocket** 버전의 경우 각 패킷 앞에는 헤더밖에 없습니다. 
그러나 이는 꽤 복잡한 헤더입니다. 각 구성 요소를 설명하자면 이렇습니다.

* <code>fin</code>**(1 비트):** 이 프레임이 메시지를 구성하는 최종 프레임인지 여부를 나타냅니다. <br />
               대부분의 경우는 메시지는 단일 프레임 안에 들어가고 이 비트도 항상 설정됩니다. <br />
               실험을 해보면 Firefox는 32K 이후 두 번째 프레임을 만듭니다. <br />

* <code>rsv1</code>, <code>rsv2</code>, <code>rsv3</code> **(각 1 비트):** 이들은 0이 아닌 값을 정의하는 확장이 협상되는 경우를 제외하
고는 0 이어야 합니다. **0**이 아닌 값이 수신되었을 때 협상 된 확장에서 0이 아닌 값에 대한 정의를 하지 않으면 수신 엔드 포인트는 이 연결을 실
패시켜야 합니다. <br />

* <code>opcode</code> **(4 비트):** 프레임이 나타내는 것을 말합니다. 다음 값이 현재 사용 중입니다.
   * <code>0x00</code>: 이 프레임은 이전의 페이로드를 계속합니다.
   * <code>0x01</code>: 이 프레임은 텍스트 데이터를 포함합니다.
   * <code>0x02</code>: 이 프레임은 바이너리 데이터를 포함한다.
   * <code>0x08</code>: 이 프레임은 연결을 종료합니다.
   * <code>0x09</code>: 이 프레임은 핑 **(ping)** 입니다.
   * <code>0x0a</code>: 이 프레임은 퐁 **(pong)** 입니다.
     **(** 이처럼 사용되지 않는 충분한 값이 존재하며 이들은 나중에 사용하기 위해 예약되어 있습니다. **)**
* <code>mask</code> **(1 비트):** 연결이 마스크되었는지 여부를 나타냅니다. 
지금은 클라이언트에서 서버로 보내는 모든 메시지를 마스크 처리해야하며, 스펙에서는 마스크 해제 된 경우 연결을 종료하도록 되어 있습니다.

* <code>payload_len</code> **(7 비트):** 페이로드의 길이. WebSocket 프레임은 다음과 같은 범위로 표현됩니다.
**0 ~ 125**는 페이로드의 길이를 나타냅니다.
**126**은 다음 **2** 바이트가 길이를 나타내고, **127**은 다음 **8** 바이트가 길이를 나타냄을 의미합니다. 
따라서 페이로드의 길이는 **~ 7** 비트, **16** 비트 및 **64** 비트가 됩니다.

* <code>masking-key</code> **(32 비트) :** 클라이언트에서 서버로 전송 된 모든 프레임은 프레임에 포함 된 **32** 비트 값으로 마스크됩니다.

* <code>payload</code>: 대개는 마스크 처리가 되어 있는 실제 데이터입니다. 길이는 <code>payload_len</code>의 길이입니다.

**WebSockets**은 스트림 기반이 아닌 프레임 기반인 이유는 무엇일까요? 이것은 필자도 모르겠습니다. 여러분과 같이 저도 이 부분에 대해서 더 많은
것을 알고 싶습니다. 그래서 혹시 이 부분에 대해 아시는 것이 있으시다면, 아래의 답변에 코멘트와 링크를 자유롭게 추가 해주시기 바랍니다. 또한
[HackerNews에서 이 주제에 대한 좋은 토론](https://news.ycombinator.com/item?id=3377406)을 할 수 있습니다.

## 프레임의 데이터
위에서 언급했듯이 데이터는 여러 프레임으로 분할 될 수 있습니다. 
데이터를 전송하는 첫 번째 프레임에는 전송중인 데이터의 종류를 나타내는 <code>opcode</code>가 있습니다. 
이것은 **JavaScript**가 스펙을 처음으로 정하기 시작했을 때는 **2**진 데이터에 대한 지원을 거의 하지 않았기 때문입니다. 
<code>0x01</code>은 **utf-8**로 인코딩 된 텍스트 데이터를 나타내며, <code>0x02</code>는 바이너리 데이터입니다. 
대부분의 사람들은 **JSON**을 전송할 것이고, 이 경우에는 텍스트 연산 코드를 선택하기를 원할 것입니다. 
바이너리 데이터를 보내면 브라우저 특정 [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)으로 표시됩니다.

**WebSocket**을 통해 데이터를 보내기위한 API는 매우 간단합니다.

```javascript

     var socket = new WebSocket('ws://websocket.example.com');
     socket.onopen = function(event) {
       socket.send('Some message'); // Sends data to server.
     };

```

**WebSocket**이 **(** 클라이언트 측에서 **)** 데이터를 수신하면 <code>message</code> 이벤트가 시작됩니다. 이 이벤트에는 메시지 내용에 액세스하는 데 사용할 수있는 <code>data</code>라는 속성이 있습니다.

```javascript

     // Handle messages sent by the server.
     socket.onmessage = function(event) {
       var message = event.data;
       console.log(message);
     };

```

**Chrome DevTools**의 네트워크 탭을 사용하여 **WebSocket** 연결의 각 프레임에 있는 데이터를 쉽게 탐색 할 수 있습니다.

<img src ="https://user-images.githubusercontent.com/33046341/78871827-45e28900-7a83-11ea-9ab4-ebbbd19fe667.png" width="90%">

## 파편화
페이로드 데이터는 여러 개별 프레임으로 나눌 수 있습니다. 
수신단은 <code>fin</code> 비트가 설정 될 때까지 수신 버퍼를 버퍼링합니다. 
따라서 **“Hello World”**라는 문자열을 **6** 바이트 **(** 헤더 길이 **)** 의 **11**개 패키지 + 각 **1** 바이트로 전송할 수 있습니다. 
제어 패키지에는 단편화가 허용되지 않습니다. 그러나 사양에서는 [인터리브](https://en.wikipedia.org/wiki/Interleaving_%28data%29) 된 컨트롤 프레임도 처리 할 수 있기를 원합니다. 
TCP 패키지가 임의의 순서로 도착하는 경우에 대비하기 위해서입니다

프레임을 결합하는 논리는 대략 다음과 같습니다.

* 첫 번째 프레임을 받는다.
* <code>opcode</code>를 기억한다.
* <code>fin</code> 비트가 설정 될 때까지 프레임 페이로드를 함께 연결한다.
* 각 패키지에 대한 <code>opcode</code>가 **0**인지 확인한다.

단편화의 주된 목적은 메시지가 시작될 때 알 수 없는 크기의 메시지를 보내도록 허용하는 것입니다. 
단편화로 인해 서버는 적절한 크기의 버퍼를 선택할 수 있으며 버퍼가 가득 차면 조각을 네트워크에 작성**(write)** 합니다. 
단편화의 부차적인 목적은 멀티플렉싱입니다. 
한 논리 채널의 큰 메시지가 전체 출력 채널을 차지하는 것은 바람직하지 않으므로 멀티플렉싱은 출력을 여러 채널에 더 잘 나누기 위해 메시지를 작은 조각으로 자유롭게 분할할 수 있습니다.

## 허트비트란 무엇입니까?
핸드셰이크 후 어느 시점에서든 클라이언트 또는 서버가 상대방에게 핑**(ping)** 을 보낼 수 있습니다. 
핑이 수신되면 수신자는 가능한 한 빨리 퐁**(pong)** 을 보내야합니다. 
이게 바로 허트비트**(heartbeat)** 입니다. 이 도구를 사용하여 클라이언트가 계속 연결되어 있는지 확인할 수 있습니다.
핑 또는 퐁은 일반 프레임이 아닌 **제어 프레임(control frame)** 입니다. 
핑에는 <code>0x9</code>의 <code>opcode</code>가 있고, 퐁에는 <code>0xA</code>의 <code>opcode</code>가 있습니다. 
핑을 받으면 핑으로 받은 것과 똑같은 페이로드 데이터를 퐁으로 되돌려 보내면 됩니다(핑 및 퐁의 최대 페이로드 길이는 **125**입니다). 
핑을 보내지 않았는데도 퐁이 도착하는 경우도 있는데 이런 경우에는 그냥 무시하면 됩니다.

허트비트는 매우 유용 할 수 있습니다. 예를 들어 유휴 연결을 종료시키는 로드 밸런서를 사용중인 경우에 그렇습니다. 
또한 수신 측에서는 원격 측이 종료되었는지 여부를 확인할 수 없고 다음 전송이 이루어졌을 때에만 뭔가 잘못되었다는 것을 알게될 수 있으니 
이럴 때 허트비트가 유용할 수 있습니다.

## 오류 처리
<code>error</code> 이벤트를 청취하여 발생하는 모든 오류를 처리 할 수 ​​있습니다.
예를 들면 다음과 같습니다.

```javascript

     var socket = new WebSocket('ws://websocket.example.com');

     // Handle any error that occurs.
     socket.onerror = function(error) {
       console.log('WebSocket Error: ' + error);
     };

```

## 연결 종료

연결을 닫으려면 클라이언트 또는 서버가 <code>0x8</code>의 <code>opcode</code>가 포함 된 데이터를 제어 프레임으로 보내야합니다. 
그러한 프레임을 수신하면, 반대 쪽 피어는 응답으로 **Close** 프레임을 전송합니다. 
그러면 첫 번째 피어가 연결을 닫습니다. 연결을 닫은 후에 수신 된 추가 데이터는 버려집니다.
다음은 클라이언트에서 **WebSocket** 연결을 닫는 방법입니다.

```javascript

     // Close if the connection is open.
     if (socket.readyState === WebSocket.OPEN) {
         socket.close();
     }

```

또한 닫기가 완료된 후 정리 작업을 수행하기 위해 이벤트 리스너를 close 이벤트에 첨부 할 수 있습니다.


```javascript

     // Do necessary clean up.
     socket.onclose = function(event) {
       console.log('Disconnected from WebSocket.');
     };

```

필요한 경우 <code>close</code> 이벤트를 처리하기 위해 서버는 이 이벤트에 대비해야합니다.

```javascript

     connection.on('close', function(reasonCode, description) {
         // The connection is getting closed.
     });

```

## WebSockets과 HTTP/2는 어떻게 비교됩니까?
**HTTP/2**에는 많은 기능이 있지만 기존의 푸시 / 스트리밍 기술의 필요성을 완전히 없애지는 못합니다.

**HTTP/2**에 대해 알아야 할 첫 번째 중요한 점은 이것이 모든 HTTP대체하는 것이 아니라는 점입니다. 
동사, 상태 코드 및 대부분의 머리글은 현재와 동일하게 유지됩니다.
**HTTP/2**는 데이터가 전송되는 방식의 효율성을 향상시키는 것입니다.

이제 **HTTP/2**를 **WebSocket**과 비교해 보겠습니다. 많은 유사점을 볼 수 있습니다.
<img src ="https://miro.medium.com/max/1400/1*2EduxBOtJ7ENgIna-aU4WA.png" width="90%">

위 표에서 보이듯이 **HTTP/2**는 [Server Push](https://en.wikipedia.org/wiki/Push_technology?oldformat=true)를 도입하여 서버가 클라이언트 캐시에 리소스를 사전에 전송할 수있게 합니다. 
그러나 데이터를 클라이언트 응용 프로그램 자체로 푸시할 수는 없습니다. 
서버 푸시는 브라우저에서만 처리되며 응용 프로그램 코드에서 나타나지 않습니다. 
즉, 응용 프로그램이 해당 이벤트에 대한 알림을 가져올 **API**가 없습니다.

따라서 **SSE(Server-Sent Events**, 서버전송이벤트)가 매우 유용해집니다.
**SSE**는 클라이언트-서버 연결이 설정되면 서버가 클라이언트에 비동기적으로 데이터를 푸시 할 수 있게하는 메커니즘입니다. 
그런 다음 서버는 새로운 데이터 덩어리가 사용 가능할 때마다 데이터를 전송하도록 결정할 수 있습니다. 
이를 단방향 [게시-구독](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) 모델로 간주해도 좋습니다. 
또한 [W3C](https://www.w3.org/TR/eventsource/)에서 **EventSource**라는 표준 **JavaScript** 클라이언트 **API**를 제공하는데 
**HTML5** 표준의 일부로 최신 브라우저에서 구현되어 있습니다. 
[EventSource API](https://caniuse.com/#feat=eventsource)를 지원하지 않는 브라우저에서는 폴리필을 사용하는 것도 쉽습니다.
**SSE**는 **HTTP**를 기반으로하기 때문에 **HTTP/2**와 잘 어올리며 둘을 결합하면 양쪽의 장점만 취하도록할 수 있습니다.
**HTTP/2/** 는 멀티플렉스화된 스트림 상에서 효율적인 전송을 담당하고 **SSE**는 푸시가 가능하도록 애플리케이션까지 **API**를 제공하는 것입니다.

스트림과 멀티플렉싱이 무엇인지 완전히 이해하려면 먼저 **IETF** 정의를 살펴 보겠습니다. 
“스트림”은 **HTTP/2** 연결에서 클라이언트와 서버간에 교환되는 독립적인 양방향 프레임의 흐름입니다.
주요 특징 중 하나는 단일 **HTTP/2** 연결에 여러 개의 동시 스트림이 포함될 수 있으며 
여러 스트림의 끝점 인터리빙**(interleaving)** 프레임이 있는 것입니다.

<img src ="https://miro.medium.com/max/1400/1*pSh7IORJoUXbwCjyJ7fM9A.png" width="90%">

**SSE**는 **HTTP** 기반이라는 것을 기억해야합니다. 
즉, **HTTP/2**를 사용하면 여러 **SSE** 스트림을 단일 **TCP** 연결에서 구현할 수 있을뿐만 아니라 
여러 **SSE** 스트림 **(서버에서 클라이언트 푸시)** 과 여러 클라이언트 요청 **(클라이언트에서 서버로의 조합)** 을 사용하여 구현할 수도 있습니다. 
**HTTP/2** 및 **SSE** 덕분에 애플리케이션 코드를 서버 푸시에 등록 할 수 있는 간단한 **API**로 순수한 **HTTP** 양방향 연결을 사용할 수 있게 되었습니다. 
**SSE**와 **WebSocket**을 비교할 때 양방향 기능이 부족하다는 사실이 종종 큰 결점으로 인식되었습니다. 
하지만 **HTTP/2** 덕분에 더 이상 그렇지 않습니다. 
이렇게 하면 **WebSockets**를 건너 뛰고 대신 **HTTP** 기반 시그널링을 사용할 수있는 기회가 열립니다.

## WebSocket과 HTTP/2 중에서 무엇을 택할까?
**WebSocket**은 **HTTP/2 + SSE**가 지배하는 세상이 와도 확실히 살아남을 것입니다. 
많이 사용되는 기술이기도 하고 특정 상황에서는 **HTTP/2** 보다도 이점이 있기 때문입니다. 예를 들어, 오버 헤드가 적은 양방향 기능을 구축하는 경우에 그렇습니다.

연결의 양쪽 끝에서 방대한 양의 메시지가 필요한 대규모 멀티 플레이어 온라인 게임을 만들고 싶다고합시다. 
이 경우 **WebSocket**은 훨씬 더 나은 성능을 발휘합니다.

일반적으로 클라이언트와 서버 간의 **지연 시간이 정말로 낮아야** 할 때, 실시간에 가까워야 할 때 **WebSocket**을 사용하십시오. 
이를 위해서는 서버 측 응용 프로그램의 구조를 다시 생각할 필요가 있을 뿐만 아니라 
이벤트 대기열과 같은 기술로 초점을 이동해야 할 수도 있습니다.

만약 실시간 시장 뉴스, 시장 데이터, 채팅 응용 프로그램 등을 표시해야하는 경우라면 
**HTTP/2 + SSE**를 사용했을 때 효율적인 양방향 통신 채널을 제공하면서 **HTTP** 세계에 머물러 있는 이점을 누릴 수 있습니다.

 * 웹 소켓은 **HTTP** 연결을 **HTTP**와 전혀 다른 프로토콜로 업그레이드하므로 기존 웹 인프라와의 호환성을 고려할 때 이런 점은 종종 고통의 근원이 될 수 있습니다.

 * 확장 성 및 보안: 웹 구성 요소**(방화벽, 침입 탐지,로드 밸런서)** 는 복원력, 보안 및 확장 성 측면에서 크고 중요한 응용 프로그램이 선호하는 환경 인 **HTTP**를 염두에두고 구축, 유지 관리 및 구성됩니다.
 
또한 브라우저 지원을 고려해야합니다. 아래 **WebSocket**의 경우를 살펴보십시오.

<img src ="https://miro.medium.com/max/1400/1*YFr59cEF2qxzjjleebvbcQ.png" width="90%">

꽤 좋은 상황이라고 할 수 있습니다.
그러나 **HTTP/2**의 상황은 동일하지 않습니다.

<img src ="https://miro.medium.com/max/1400/1*C1VWSKOx89vqdiSiflDRJw.png" width="90%">

 * **TLS** 전용(그렇게 나쁘지는 않습니다.)
 * **IE 11**에서 부분적으로 지원되지만 **Windows 10**에서만 지원됩니다.
 * **Safari**는 **OSX 10.11** 이상에서만 지원됩니다.
 * **ALPN**을 통해 협상 할 수있는 경우에만 **HTTP/2**가 지원됩니다(서버가 명시 적으로 지원해야 함).

하지만 **SSE** 지원은 더 좋습니다.

<img src ="https://miro.medium.com/max/1400/1*9ryMUEZhtbTg7lECHVz0fw.png" width="90%">

**IE/Edge**만 **SSE**를 지원하지 않습니다(오페라 미니는 **SSE**도 웹 소켓도 지원하지 않으므로 논외로 하겠습니다). 
**IE/Edge**에는 **SSE** 지원을 위한 꽤 괜찮은 폴리필이 있습니다.

## SessionStack에서는 무엇을 쓸지 어떻게 결정합니까?

[SessionStack](https://www.sessionstack.com/?utm_source=medium&utm_medium=blog&utm_content=Post-5-websockets-outro)에서는 웹 소켓과 **HTTP**를 모두 사용합니다. 
**SessionStack**을 웹 애플리케이션에 통합하면 모든 **DOM** 변경 사항, 사용자 상호 작용, **JavaScript** 예외, 스택 추적, 실패한 네트워크
요청 및 디버그 메시지가 기록되기 시작하여 웹 앱의 문제를 동영상처럼 재생하고 발생한 모든 사항을 볼 수 있습니다. 
모든 것이 **실시간**으로 이루어지기 때문에 웹 앱의 성능에 아무런 영향을 미치지 않아야 합니다.

즉 이것은 사용자가 브라우저에있는 동안 사용자 세션에 **실시간**으로 참여할 수 있습니다는 뜻입니다. 
이 시나리오에서는 양방향 통신이 없기 때문에 **(서버가 브라우저에 데이터를 “스트리밍”하기 때문에)** **HTTP**를 사용하도록 선택했습니다.
이 경우 **WebSocket**은 실제로 과하며 관리 및 확장이 더 어려울 것입니다.

그러나 웹 애플리케이션에 통합 된 **SessionStack** 라이브러리는 **WebSocket**을 사용합니다(혹시 이것이 불가능하다면 HTTP로 폴백 됩니다). 
일괄 통신이기도 한 데이터를 일괄 처리하고 서버로 보내는 것입니다. 
이 경우 로드맵에있는 제품 기능 중 일부는 양방향 통신이 필요하기 때문에 **WebSocket**을 선택했습니다.

**SessionStack**을 사용하여 웹 앱의 기술 및 UX 문제를 이해하고 재현하려는 경우 바로 시작할 수있는 [무료 계획](https://www.sessionstack.com/?utm_source=medium&utm_medium=blog&utm_content=Post-5-websockets-getStarted)을 제공합니다.

<img src ="https://miro.medium.com/proxy/1*kEQmoMuNBDfZKNSBh0tvRA.png" width="90%">

## reference 
> * [참고자료](https://blog.sessionstack.com/how-javascript-works-deep-dive-into-websockets-and-http-2-with-sse-how-to-pick-the-right-path-584e6b8e3bf7)
> * [참고자료](https://engineering.huiseoul.com/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%9E%91%EB%8F%99%ED%95%98%EB%8A%94%EA%B0%80-%EC%9B%B9%EC%86%8C%EC%BC%93-%EB%B0%8F-http-2-sse-1ccde9f9dc51)
> * [참고자료](https://lucumr.pocoo.org/2012/9/24/websockets-101/)
> * [참고자료](http://blog.teamtreehouse.com/an-introduction-to-websockets)
> * [참고자료](https://tools.ietf.org/html/rfc6455)
> * [웹 소켓 기본 예제 및 설명](https://niceman.tistory.com/109)
> * [웹 소켓과 socket.io](https://d2.naver.com/helloworld/1336)
