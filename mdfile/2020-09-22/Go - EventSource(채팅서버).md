### 시작

#### EventSource?
[링크](https://developer.mozilla.org/ko/docs/Web/API/EventSource)에 들어가면 자세한 내용을 알 수 있는데, <br />
간단하게 말하자면 'EventSource 인터페이스는 server-sent events에 대한 웹 콘텐츠 인터페이스입니다.'라고 쓰여있다. <br />

EventSource는 서버가 일방적으로 보내기만하는 일방향 통행이 가능하다. <br />
2개 이상의 클라이언트가 하나의 서버에 subscribe해두면 이벤트가 발생할 각 클라이언트에게 알려주는 push알림이나, 이벤트 알림 등을 쓸 수 있는데,  <br />
이것을 이용하여 채팅 서버를 만드려 보려 한다다. <br />

우선 큰 틀을 만들어 보자! <br />

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

이렇게 하면 큰 틀은 끝이났다. negroni가 기본적으로 public파일 서버를 제공하기 때문에 public폴더 생성 후 index파일을 만들어 주자! <br />

<code>public/index.html</code>

``` HTML
  <html>
  <head>
  <title>EventSource Chatting program</title>
  </head>
  <body>
  <div id="chat-log"></div> <!-- 1 -->
  <div id="user-name"></div> <!-- 2 -->
  <form id="input-form">
      <input type="text" id="chat-msg" size="64" autofocus />
      <input type="submit" value="Send" />
  </form>
  </body>
  </html>
  
```

1 : 채팅 log를 출력하는 부분
2 : 유저 이름을 출력하는 부분

이렇게 하면 기본적인 HTML구조는 끝이 났다. 이 상태에서 웹서버를 실행하면 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93838209-d6c0c000-fcc3-11ea-97b5-7492d85832c3.png" width = 70%> </img></p>

위와 같은 화면이 뜨는 것을 확인 할 수 있다. <br />
이제 클라이언트 쪽 코드를 작성할 것인데 Javascript와 jquery를 사용하여 만들 것인데, 이 두개의 자세한 설명은 하지 않도록 하고, 우선 index.html에 소스를 추가해준다. <br />

<code>public/index.html</code>

``` HTML
  <html>
  <head>
  <title>EventSource Chatting program</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="chat.js"></script>
  </head>
  <body>
  <div id="chat-log"></div> <!-- 1 -->
  <div id="user-name"></div> <!-- 2 -->
  <form id="input-form">
      <input type="text" id="chat-msg" size="64" autofocus />
      <input type="submit" value="Send" />
  </form>
  </body>
  </html>
  
```
chat.js가 우리가 만들 파일인데, public 폴더에 생성해준다.
<code>public/chat.js</code>
``` javascript
  
  $(function(){
    if (!window.EventSource) { // 1
        alert("No EventSource!")
        return
    }
    
    var $chatlog = $('#chat-log')
    var $chatmsg = $('#chat-msg')
    
    var isBlank = function(string) { // 2
      return string == null || string.trim() === "";
    };
    
    var username; // 3
    
    while (isBlank(username)) { // 4
        username = prompt("What's your name?");
        if (!isBlank(username)) {
            $('#user-name').html('<b>' + username + '</b>');
        }
    }

```
1 : 윈도우가 이벤트 소스를 지원하는지 여부 확인 <br />
2 : string이 null이거나 string의 빈공간을 지웠는데 빈 값이면 true를 반환해주는 함수 <br />
3 : username을 입력받을 변수 <br />
4 : username이 비어있다면 입력을 받고, 비어있지 않다면 사용자 이름을 표시한다. <br />

여기까지 하고 실행을 하면 이름을 입력하라는 창이 뜨고, 입력 시 정상적으로 출력 되었음을 확인 할 수 있다.
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93838876-230cff80-fcc6-11ea-8c8f-c007078d5cd3.png" width = 70%> </img></p>

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93838894-2acca400-fcc6-11ea-9871-72eb3c3d773c.png" width = 70%> </img></p>

이어서 form에서 message를 보낼 때 sumbit을 할 수 있는 기능을 추가해보자! <br />

``` javascript
  
  $(function(){
    if (!window.EventSource) {
        alert("No EventSource!")
        return
    }
    
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
    
       $('#input-form').on('submit', function(e){ // 1
        $.post('/messages', {
            msg: $chatmsg.val(),
            name: username
        });
        $chatmsg.val(""); // 2
        $chatmsg.focus(); // 3 
    });
    
```

1 : submit이 발생 했을 때 서버에 '/messages'라는 URL에 사용자의 이름과 보낸 메세지를 POST메세지를 날려준다. <br />
2 : 메세지를 보냈기 때문에 메세지 창을 비워주고, <br />
3 : 다시 입력 받을 수 있게 focus를 맞춰준다. <br />

이제 실행하여 확인해보자! 다시 이름을 입력 후, 메세지를 써 주면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93839267-61ef8500-fcc7-11ea-8242-af49ec1ff19b.png" width = 70%> </img></p>

이렇게 다시 새로고침 된 상태로 돌아오는데, <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93838876-230cff80-fcc6-11ea-8c8f-c007078d5cd3.png" width = 70%> </img></p>

터미널 log를 보면 POST evnet는 떴지만 POST핸들러를 만들지 않아서 404가 떴음을 확인할 수 있다.
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93839479-01ad1300-fcc8-11ea-8e6c-8545f8ed1d94.png" width = 70%> </img></p>
