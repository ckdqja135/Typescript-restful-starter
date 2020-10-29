## 시작
Web에서 할 수 있는 Socket 프로그래밍이라는 뜻인데, HTML5에 들어간 표준에 하나로, 지난번에 다루었던 Event소스라는 것과 더불어서 동적인 웹을 만드는데 사용되는 도구이다. <br />

이것을 사용하여 채팅 서비스 앱을 구현해보자! <br />

우선 EventSource에서 불필요한 부분들을 지운 코드를 가져왔다. <br />

<code>main.go</code>
``` Go

  package main

  import (
    "net/http"

    "github.com/gorilla/pat"
    "github.com/urfave/negroni"
  )

  func main() {
    mux := pat.New()

    n := negroni.Classic()
    n.UseHandler(mux)

    http.ListenAndServe(":3000", n)
  }

```

기본 mux에 기본 file server를 사용하고 있다. <br />
file server에는 public 폴더로 만들었고, 이 안에는 <code>chat.js</code>와 <code>index.html</code>가 있다. <br />

<code>chat.js</code>에 웹 소켓이 작동 되도록 코드를 수정하자!<br />
``` Go

$(function(){
    if (!window.WebSocket) {
        alert("No WebSocket!")
        return
    }
    
    connect = function() { // 1
        ws = new WebSocket("ws://" + window.location.host + "/ws"); // 1
        ws.onopen = function(e) { // 2
            console.log("onopen", arguments);
        };
        ws.onclose = function(e) { // 3
            console.log("onclose", arguments);
        };
        ws.onmessage = function(e) { // 4
            addmessage("onmessage", arguments);
        };
    }
    
    connect(); // 2
    
    var $chatlog = $('#chat-log')
    var $chatmsg = $('#chat-msg')
    
    var isBlank = function(string) {
        return string == null || string.trim() === "";
    };
    
    var username;
    
    while (isBlank(username)) {
        username = prompt("What's your name?");
        if (!isBlank(username)) {
            $('#user-name').html('<b>' + username + '</b>');
        }
    }

    var $chatlog = $('#chat-log')
    var $chatmsg = $('#chat-msg')

    ...
    
```

1 : WebSocket을 접속하는 connect. <br />
1-1 : 여기에 URL을 넣어주어야 하는데 웹소켓 프로토콜(HTTP 프로토콜이 아닌)을 사용하기 때문에 자신이 사용하는 도메인이 바뀔 수 있기 때문에 window.location.host를 사용한다. <br />
      window.location.host는 현재 사용하는 호스트가 나온다. 거기에 접속주소를 /ws로 지정했다. <br />
1-2 : 그리고 ws에 핸들러들을 만들어 주어야 하는데 onopen는 connection이 맺어졌을 때를 의미한다. 인자가 console에 출력 되도록 한다. <br />
1-3 : onclose는 소켓이 닫혔을 때를 의미한다. open과 마찬가지로 인자가 console에 출력되도록 한다. <br />
1-4 : onmessage는 서버로 부터 어떤 메세지를 받았을 때 이다. <br />

2 : connent();로 접속시도. <br />

여기서 저장 후에 서버를 띄워보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95556038-a01dd000-0a4d-11eb-9b4a-65c9aaa98edd.png" width = 70%> </img></p> 
이 상태에선 아무것도 안뜨는데 개발자 도구를 들어가보면 <br />

ws://localhost:3000/ws로 접속했으나 서버가 지원하지 않는 경로기 때문에 fail이 났다는 에러가 났고, 그래서 onclose가 호출되었다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95556178-dbb89a00-0a4d-11eb-8894-a896a667bad1.png" width = 70%> </img></p> 

이제 서버쪽에서 해당경로로 제공되는 웹서버를 받아주도록 하자! <br />

지금까지 많이 쓰던 Gorilla Web Toolkit에 [websocket](https://github.com/gorilla/websocket)이라는 패키지가 제공되고 있다. <br />

그래서 이것을 사용하기 위해 다음과 같이 터미널에 입력해준다. <br />

``` linux
  
  go get github.com/gorilla/websocket
  
```

설치가 된 다음 <code>main.go</code>에 import 시켜준다. <br />

``` Go

  package main

  import (
    "net/http"

    "github.com/gorilla/pat"
    "github.com/gorilla/websocket"
    "github.com/urfave/negroni"
  )

  func main() {
    mux := pat.New()

    n := negroni.Classic()
    n.UseHandler(mux)

    http.ListenAndServe(":3000", n)
  }

```
그리고 [websocket](https://github.com/gorilla/websocket)에 사용하는 범위가 나오는데, 예제 코드를 보면 (지금은 사라짐...)
``` Go

  var upgrader = websocket.Upgrader{
      ReadBufferSize: 1024,
      WriteBufferSize: 1024,
  }
  
  func handler(w http.ResponseWriter, r *http.Request) {
     conn, err := upgrader.Upgrade(w, r, nil)
     if err != nil {
        log.Println(err)
        return
     }
     ... Use conn to send receive mesages.
  }

```

먼저 웹소켓을 만들기 위해서는 핸들러를 만들어주어야 하고, upgrader라는 것으로 Upgrade해주면 된다. <br />
upgrader라는 것은 웹소켓을 만들 때 소켓을 만들어주는 것인데, 버퍼 사이즈만 정해주면 된다. <br />
``` Go
  
    var upgrader = websocket.Upgrader{
        ReadBufferSize: 1024,
        WriteBufferSize: 1024,
    }
  
```
를 복붙 해준다. <br />

``` Go

  package main

  import (
    "net/http"

    "github.com/gorilla/pat"
    "github.com/gorilla/websocket"
    "github.com/urfave/negroni"
  )
  
  type Message struct {
    Type string      `json:"type"`
    Data interface{} `json:"data"`
  }

  var upgrader = websocket.Upgrader{ // 1
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
  }
  
  func wshandler(w http.ResponseWriter, r *http.Request) { // 2
    _, err := upgrader.Upgrade(w, r, nil) // 1
    if err != nil {
      log.Println(err)
      return
    }
  }
  
  func main() {
    mux := pat.New()
    mux.Get("/ws", wshandler) // 3
    n := negroni.Classic()
    n.UseHandler(mux)

    http.ListenAndServe(":3000", n)
  }

```
1 : 1024byte이므로 1k씩 유지하겠다는 의미이다. <br />
2 : 위의 예제 소스를 복붙하여 사용한다. 이름을 wshandler로 수정했다. <br />
2-1 : 현재 connection은 사용하지 않으면서 에러가 나므로 밑줄로 바꾸어준다. <br />
3 : wshandler를 제공해주어야 하는데 mux에 connection을 맺으려는 주소인 '/ws'의 Get으로 핸들러를 만들어주면 된다. <br />

이렇게 하면 wshandler가 connection을 맺게 된다. <br />

이제 터미널을 열고 서버를 접속해준다. <br />
이름은 아무거나 써주고, 개발자 도구를 들어가보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95557885-64383a00-0a50-11eb-9cdb-4654baf7d10d.png" width = 70%> </img></p> 

onopen이 호출되어 연결이 제대로 맺어진 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95557993-88941680-0a50-11eb-960e-6c0ba2cf9dd1.png" width = 70%> </img></p> 

이제 연결을 맺었으니 메세지를 주고 받도록 할 것인데, 첫번째 만들것은 채팅서버를 만든다기 보다 간단하게 보낸대로 반송해주는 에코서버를 만들것이다. <br />

``` Go

  package main

  import (
    "net/http"

    "github.com/gorilla/pat"
    "github.com/gorilla/websocket"
    "github.com/urfave/negroni"
  )
  
  var upgrader = websocket.Upgrader{ 
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
  }
  
  type Message struct { // 3
    Type string      `json:"type"`
    Data interface{} `json:"data"`
  }

  
  func wshandler(w http.ResponseWriter, r *http.Request) {
    conn , err := upgrader.Upgrade(w, r, nil) // 1
    if err != nil {
      log.Println(err)
      return
    }
    
    for {
		m := &Message{} // 4
		err := conn.ReadJSON(m) // 2
		if err != nil { // 5
			log.Println(err)
			return
		}

		err = conn.WriteJSON(m) // 6
		if err != nil { // 7
			log.Println(err)
			return
		}
	}

  func main() {
    mux := pat.New()
    mux.Get("/ws", wshandler)
    n := negroni.Classic()
    n.UseHandler(mux)

    http.ListenAndServe(":3000", n)
  }

```

1 : 이제 _부분을 conn으로 변경해준다. <br />
2 : conn에서 Read함수가 있다. ReadMessage가 있고, ReadJSON이 있는데, JSON으로 부터 받기위해 ReadJSON()을 사용하여 <br />
    JSON을 읽은다음에 <br />
3 : JSON 메세지를 담을 공간을 만들어준다. <br />
    변수로는 String타입 Type과 모든 타입이 가능한 Data 변수를 만들어준다. <br />
4 : Message struct를 읽어오는 변수. 이것을 ReadJSON()에 넣어주면 ReadJSON형태에 맞추어서 클라이언트가 보낸 메세지를 읽어주는데, 
5 : 이 과정에서 읽는데 실패했을 때 에러를 출력후에 wshandler를 return시켜준다. (무한루프를 빠져 나오는 것이다.) <br />
6 : 성공 시 메세지가 담겨져서 온 상태이므로 WriteJSON으로 바로 보내준다. <br />
7 : 이 때도 보낼 때 에러가 생길 수 있으므로 에러처리를 해준다. <br />

여기까지 서버 작업은 끝이났고, 클라이언트 작업을 해준다. <br />

<code>public/chat.js</code>

``` javascript

 $('#input-form').on('submit', function(e){
   
    $chatmsg.val("");
    $chatmsg.focus();
    return false;
});
    
```
우선 이 부분을 수정해줄 것인데, 

``` javascript

 $('#input-form').on('submit', function(e){
    if (ws.readyState === ws.OPEN) { // 1
        ws.send(JSON.stringify({
            type: "msg",
            data: $chatmsg.val()
        }));
    }
    $chatmsg.val("");
    $chatmsg.focus();
    return false;
});
    
```
1 : 웹소켓의 상태가 열린 상태면 보낸다는 의미인데, JSON.stringify로 JSON포맷을 String형태로 바꿔서 보내준다. <br />
    type은 "msg", data는 채팅메세지 값이므로 $chatmsg.val()를 넣어준다. <br />
    
이 상태에서 저장 후에 터미널을 열고 서버를 실행시켜준다. <br />

가끔 이 상태에서 정상적으로 실행이 되지않고, 바로 return되는 경우가 있는데 이럴 때는 작업관리자를 열고 main.exe를 강제 종료 시켜주면 된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95560457-466cd400-0a54-11eb-83df-63a05dea21ad.png" width = 70%> </img></p> 

아무 거나 이름을 입력해주고, 메세지를 보내주면 화면엔 뜨지않지만 개발자 모드를 열어주면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95557885-64383a00-0a50-11eb-9cdb-4654baf7d10d.png" width = 70%> </img></p> 

type은 "msg"이고, data는 임의적으로 쓴 message가 그대로 온 것을 알 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95560718-9f3c6c80-0a54-11eb-89fa-ff43e126e0ef.png" width = 70%> </img></p> 
에코서버이기 때문에 쓴 대로 반복해서 보내주고 있다. <br /> 

이제 받은 메세지를 뿌려준다. <br />
클라이언트에서 받은 메세지가 onmessage로 오는데 이것을 onmessage로 받았을 때 뿌려주도록 수정해준다. <br />

<code>public/chat.js</code>

``` javascript

  ...
  
    var $chatlog = $('#chat-log')
    var $chatmsg = $('#chat-msg')
  
    addmessage = function(data) { // 1
      $chatlog.prepend("<div><span>"+data+"</span></div>");
    }

    connect = function() {
      ws = new WebSocket("ws://" + window.location.host + "/ws");
      ws.onopen = function(e) {
          console.log("onopen", arguments);
      };
      ws.onclose = function(e) {
          console.log("onclose", arguments);
      };
      ws.onmessage = function(e) {
          addmessage(e.data); // 2
      };
    }

```

1 : data가 들어왔을 때 $chatlog안에 추가해주도록 한다. <br />
2 : onmessage가 왔을 때 addmessage함수를 호출해서 event에 서버가 보낸 data를 출력시켜준다. <br />

저장 후에 서버를 실행시켜준다. (클라이언트가 바뀌었을 때는 서버를 재시작 해주지 않아도 된다.) <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95561461-bd569c80-0a55-11eb-9d47-135baa47334f.png" width = 70%> </img></p> 
