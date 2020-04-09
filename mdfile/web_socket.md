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
<img src = "https://user-images.githubusercontent.com/33046341/78872274-ff415e80-7a83-11ea-9a58-d2c0b011021e.png width="90%"></img>

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

<img src ="https://user-images.githubusercontent.com/33046341/78871827-45e28900-7a83-11ea-9ab4-ebbbd19fe667.png width="90%"></img>

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

* reference 
> [참고자료](https://blog.sessionstack.com/how-javascript-works-deep-dive-into-websockets-and-http-2-with-sse-how-to-pick-the-right-path-584e6b8e3bf7?gi=4edd32a09780)
