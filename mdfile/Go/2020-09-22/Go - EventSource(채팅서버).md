### 시작

#### EventSource?
[링크](https://developer.mozilla.org/ko/docs/Web/API/EventSource)에 들어가면 자세한 내용을 알 수 있는데, <br />
간단하게 말하자면 'EventSource 인터페이스는 server-sent events에 대한 웹 콘텐츠 인터페이스입니다.'라고 쓰여있다. <br />

EventSource는 서버가 일방적으로 보내기만하는 일방향 통행이 가능하다. <br />
2개 이상의 클라이언트가 하나의 서버에 subscribe해두면 이벤트가 발생할 각 클라이언트에게 알려주는 push알림이나, 이벤트 알림 등을 쓸 수 있는데,  <br />
이것을 이용하여 채팅 서버를 만드려 보려 한다. <br />

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
<code>public/chat.js</code>
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

터미널 log를 보면 POST evnet는 떴지만 POST핸들러를 만들지 않아서 404가 떴음을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93839479-01ad1300-fcc8-11ea-8e6c-8545f8ed1d94.png" width = 70%> </img></p>

<code>main.go</code>에 돌아와 POST핸들러를 만들어주자 ! <br />

``` Go

  package main

  import (
    "log"
    "net/http"

    "github.com/gorilla/pat"
    "github.com/urfave/negroni"
  )

  func postMessageHandler(w http.ResponseWriter, r *http.Request) { 
    msg := r.FormValue("msg") // 2
    name := r.FormValue("name")
    log.Println("postMessageHandler ", msg, name)
  }

  func main() {
    mux := pat.New()
    mux.Post("/messages", postMessageHandler) // 1

    n := negroni.Classic()
    n.UseHandler(mux)

    http.ListenAndServe(":3000", n)
  }
  
```

1 : 'messages' URL이 POST로 올 때 postMessageHandler를 불러준다. <br />
2 : 'messages' URL을 받으면 <code>public/chat.js</code>의 <code>msg: $chatmsg.val(), name: username</code>가 제대로 오는 지 확인한다.
     가져온 뒤 log를 찍어준다. <br />
     
이 상태에서 다시 실행시켜 준다. <br />

이름을 입력 후, 메세지를 써 주면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93839818-18079e80-fcc9-11ea-919e-797c7bf1f0c0.png" width = 70%> </img></p>

이렇게 다시 새로고침 된 상태로 돌아오는데, <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93838876-230cff80-fcc6-11ea-8c8f-c007078d5cd3.png" width = 70%> </img></p>

터미널 창에 log가 떴음을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93839838-2786e780-fcc9-11ea-8bb2-97ea45c69266.png" width = 70%> </img></p>

여기까지 POST 핸들러 처리가 끝났다. <br />

``` Go

  package main

  import (
    "log"
    "net/http"

    "github.com/gorilla/pat"
    "github.com/urfave/negroni"
  )

  func postMessageHandler(w http.ResponseWriter, r *http.Request) { 
    msg := r.FormValue("msg") 
    name := r.FormValue("name")
    sendMessage(msg, name)
  }
  
  func sendMessage(name, msg string) { // 1
	// send message to every clients
  }
  ...
  
```

1 : 모든 클라이언트에 메세지를 보내주는 함수 <br />

이제 <code>public/chat.js</code>에 넘어와서 맨 아래에 코드를 추가해준다.

``` Go
  
  ...
  
  var addMessage = function(data) { // 1
    var text;
    if (isBlank(data.name)) {
        text += '<strong>' + data.name + ':</strong> '
    }
        text += data.msg;
        $chatlog.prepend('<div><span>' + text + '</span></div>');
  }
  
  addMessage({ // 2
    msg: 'hello',
    name: 'aaa'
  })
  
  addMessage({
    msg: 'hello2'
  })

```

1 : 서버가 메세지를 eventsource를 통해 메세지를 알려줄텐데 저 함수가 호출 되도록 한다. <br />

2 : 이렇게 해서 잘 동작하는지 테스트를 해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93841302-1b515900-fcce-11ea-9544-252c269cc1d2.png" width = 70%> </img></p>

addMessage가 정상 동작 하는 것을 확인 할 수 있다. 이제 evnetsource를 열어보자! '// 2'번을 지우고 코드를 이어서 수정한다.<br />


``` Go
  
  ...
  
  var addMessage = function(data) {
    var text;
    if (isBlank(data.name)) {
        text += '<strong>' + data.name + ':</strong> '
    }
        text += data.msg;
        $chatlog.prepend('<div><span>' + text + '</span></div>');
  }
 
  var es = new EventSource('/stream');  // 1
    
  es.onopen = function(e) { // 2
      $.post('users/', {
          name: username
      });
  }
  
```

1 : EventSource를 추가해주고, ()안에 요청하는 경로를 적어준다. <br />

2 : open이 되었을 때 함수가 호출이 되는데, 'users/' URL에 user가 추가 되었다는 것을 POST로 알려주도록 한다. <br />

이제 package를 하나 추가 할 것 인데 [여기](https://github.com/antage/eventsource) antage의 eventsource라는 package인데, <br />
eventsource를 쉽게 쓸 수 있게 하는 package이다. <br />

``` linux
  
  go get github.com/antage/eventsource
  
``` 
로 받아준다.

설치가 끝나면 <code>main.go</code>에 돌아와 코드를 수정해보자! <br />

``` Go

  ...
  
  type Message struct { // 5
    Name string `json:"name"`
    Msg  string `json:"msg"`
  }
  
  var msgCh chan Message // 6
  
 func addUserHandler(w http.ResponseWriter, r *http.Request) { // 4
	username := r.FormValue("name")
	sendMessage("", fmt.Sprintf("add user: %s", username))
}

func processMsgCh(es eventsource.EventSource) {
	for msg := range msgCh {
		data, _ := json.Marshal(msg)
		es.SendEventMessage(string(data), "", strconv.Itoa(time.Now().Nanosecond()))
	}
}

func sendMessage(name, msg string) {
  // send message to every clients
  msgCh <- Message{name, msg} // 8
}
  
 func main() {
  msgCh = make(chan Message) // 7 
	es := eventsource.New(nil, nil) // 1
	defer es.Close() // 2

	go processMsgCh(es) // 10

	mux := pat.New()
	mux.Post("/messages", postMessageHandler)
	mux.Handle("/stream", es) // 3
  mux.Post("/users", addUserHandler)
  
	n := negroni.Classic()
	n.UseHandler(mux)

	http.ListenAndServe(":3000", n)
}

```

그 뒤 <code>main.go</code>에 돌아와 delete mux를 만들어주자. <br />
1 : 이렇게 하면 eventsource가 만들어지는데 이것을 es변수에 넣어준다.  <br />
2 : socket을 열어주었으니 닫아주어야 한다. <br />
3 : mux에서 클라이언트가 '/stream'으로 connection을 요청할 때의 Handler를 추가해준다. <br />
    그래서 es변수를 넣어주면 클라이언트가 '/stream'으로 요청할 때 자동으로 연결이 된다. <br />
    <code>es.SendEventMessage("hello world")</code>를 사용할 때 '/stream'으로 연결된 클라이언트 들에게 메세지를 보낼 수 있다. <br />
4 : addUserHandler함수  <br />
    <code>public/chat.js</code>에서 'users/'에 name값을 POST로 보내서 name값을 읽어온다. <br />
    그리고 이 user가 join했다는 것을 다른 유저에게 알려주기 위해 SendMessage()를 사용하여 출력시켜준다. <br />

5 : 지금 구현한 핸들러들은 멀티쓰레드 환경에서 돌아가고 있기 때문에 핸들해서 바로 보내는 것보다 다른 쓰레드의 큐 형태로 한줄로 보내는게 좋기 때문에 메세지 타입을 만들어 주었다. <br />
6 : SendMessage()가 될 때 이 채널에 집어 넣어서 다른 채널에 pop해서 사용할 수 있도록 메세지를 집어넣는 채널을 만들었다. <br />
7 : 채널 초기화 <br />
8 : 그리고 그 채널을 name과 msg를 넣어준다. <br />
9 : 그 채널을 pop해서 eventsource로 보내는 함수. 인자로 eventsource의 EventSource를 받는다.<br />
    그러면 이것이 메세지 하나씩 pop해 오는데 json으로 되어있으니 메세지를 marshal해서, <br />
    거기서 들어온 data를 string으로 바꾸고, 두번째 인자가 '어떤 이벤트냐'에 대한 것인데 공백으로 넣고, <br />
    세번째가 유니크 아이디를 넣어야 하는데 그것을 만드는 가장 쉬운 방법은 현재 시간을 넣는 것이기 때문에 현재시간을 넣어준다. <br />
    Nanosecond()가 int형이기 때문에 strconv.Itoa로 변환해준다. <br />
    이렇게하면 메세지가 전송이 된다. <br />
    
10 : 그러면 POST될 때 sendMessage가 호출이 되고 sendMessage가 호출이 되면 msgCh에 Message{name, msg}을 집어넣을 것이고, <br />
processMsgCh()에서 pop하게 된다. 그래서 processMsgCh()을 실행시켜주어야 하기 때문에 해당 코드로 실행시켜준다. <br />

그리고 <code>public/chat.js</code>으로 넘어와서 EventSource()에서 open될 때 이벤트만 등록을 했고, EventSource()를 통해 메세지가 올 때 onmessage가 호출이 되는데 그 부분을 추가해주자! <br />

``` Go
  
      var es = new EventSource('/stream');
    es.onopen = function(e) {
        $.post('users/', {
            name: username
        });
    }
    es.onmessage = function(e) {
        var msg = JSON.parse(e.data);
        addMessage(msg);
    };
    
```

이렇게 하고 실행을 해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93845995-b3a30a00-fcdd-11ea-81fd-edcf84c05bd7.png" width = 70%> </img></p>

정상적으로 작동 하는 것을 알 수 있다. <br />

이어서 코드를 작성해보자 <br />
<code>public/chat.js</code>
``` Go
  
      var es = new EventSource('/stream');
    es.onopen = function(e) {
        $.post('users/', {
            name: username
        });
    }
    es.onmessage = function(e) {
        var msg = JSON.parse(e.data);
        addMessage(msg);
    };
    
     window.onbeforeunload = function() { // 1
      $.ajax({
          url:"/users?username=" +username,
          type: "DELETE"
      });
      es.close()
  };
    
    
```

1 : 윈도우가 닫히기 직전에 불리면 delete로 보낸 뒤, 열었던 es를 닫아준다. <br />

그 뒤 <code>main.go</code>에 돌아와 delete mux를 만들어주자. <br />

``` Go

  func leftUserHandler(w http.ResponseWriter, r *http.Request) {
    username := r.FormValue("username")
    sendMessage("", fmt.Sprintf("left user: %s", username))
  }
  
  func main() {
    msgCh = make(chan Message)
    es := eventsource.New(nil, nil)
    defer es.Close()

    go processMsgCh(es)

    mux := pat.New()
    mux.Post("/messages", postMessageHandler)
    mux.Handle("/stream", es)
    mux.Post("/users", addUserHandler)
    mux.Delete("/users", leftUserHandler) // 1

    n := negroni.Classic()
    n.UseHandler(mux)

    http.ListenAndServe(":3000", n)

  }

```

1 : user가 떠났을 때 핸들러 추가. <br />

이렇게 해서 두 개의 창을 띄워서 실행을 하면 제대로 동작 하는 것을 확인 할 수 있다.<br />

user가 들어 왔을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93846462-0d580400-fcdf-11ea-823b-3b09de986045.png" width = 70%> </img></p>

user가 채팅을 친 뒤 나갔을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93846572-61fb7f00-fcdf-11ea-9caf-84257bc58c43.png" width = 70%> </img></p>

### 풀소스
<code>main.go</code>
``` Go 
  
  package main

  import (
    "encoding/json"
    "fmt"
    "net/http"
    "strconv"
    "time"

    "github.com/antage/eventsource"
    "github.com/gorilla/pat"
    "github.com/urfave/negroni"
  )

  func postMessageHandler(w http.ResponseWriter, r *http.Request) {
    msg := r.FormValue("msg")
    name := r.FormValue("name")
    sendMessage(name, msg)
  }

  func addUserHandler(w http.ResponseWriter, r *http.Request) {
    username := r.FormValue("name")
    sendMessage("", fmt.Sprintf("add user: %s", username))
  }

  func leftUserHandler(w http.ResponseWriter, r *http.Request) {
    username := r.FormValue("username")
    sendMessage("", fmt.Sprintf("left user: %s", username))
  }

  type Message struct {
    Name string `json:"name"`
    Msg  string `json:"msg"`
  }

  var msgCh chan Message

  func sendMessage(name, msg string) {
    // send message to every clients
    msgCh <- Message{name, msg}
  }

  func processMsgCh(es eventsource.EventSource) {
    for msg := range msgCh {
      data, _ := json.Marshal(msg)
      es.SendEventMessage(string(data), "", strconv.Itoa(time.Now().Nanosecond()))
    }
  }

  func main() {
    msgCh = make(chan Message)
    es := eventsource.New(nil, nil)
    defer es.Close()

    go processMsgCh(es)

    mux := pat.New()
    mux.Post("/messages", postMessageHandler)
    mux.Handle("/stream", es)
    mux.Post("/users", addUserHandler)
    mux.Delete("/users", leftUserHandler)

    n := negroni.Classic()
    n.UseHandler(mux)

    http.ListenAndServe(":3000", n)

  }

```

<code>public/chat.js</code>
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

      $('#input-form').on('submit', function(e){
          $.post('/messages', {
              msg: $chatmsg.val(),
              name: username
          });
          $chatmsg.val("");
          $chatmsg.focus();
          return true;
      });

      var addMessage = function(data) {
          var text = "";
          if (!isBlank(data.name)) {
              text = '<strong>' + data.name + ':</strong> ';
          }
          text += data.msg;
          $chatlog.prepend('<div><span>' + text + '</span></div>');
      };

      var es = new EventSource('/stream');
      es.onopen = function(e) {
          $.post('users/', {
              name: username
          });
      }
      es.onmessage = function(e) {
          var msg = JSON.parse(e.data);
          addMessage(msg);
      };

      window.onbeforeunload = function() {
          $.ajax({
              url:"/users?username=" +username,
              type: "DELETE"
          });
          es.close()
      };

  })

```

<code>public/index.html</code>
``` Go 
  
  <html>
  <head>
  <title>Simple Chat</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script type="text/javascript" src="chat.js"></script>
  </head>
  <body>
  <div id="chat-log"></div>
  <div id="user-name"></div>
  <form id="input-form">
      <input type="text" id="chat-msg" size="64" autofocus />
      <input type="submit" value="Send" />
  </form>
  </body>
  </html>

```
