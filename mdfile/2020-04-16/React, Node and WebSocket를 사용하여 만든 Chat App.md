# React, Node and WebSocket를 사용하여 만든 Chat App
리액션, 노드 및 WebSocket을 사용하여 채팅 룸을 시작하고 실행하는데 필요한 최소 코드를 보여 드리겠습니다. <br />

[Bitlab Studio](https://bitlabstudio.com/en/) 프로젝트에서 배운 내용을 간략하게 요약한 것입니다.
거기서 여러분은 놀면서, 자신만의 아이디어와 기능을 탐구하고 추가할 수 있습니다. <br />

당신은 다음과 같은 모양의 앱을 갖게 될 것입니다.

<p  align="center"><img src= "https://miro.medium.com/max/1200/1*u-qal413IzAMkIZMhWqYHg.gif" width = 70% ></img></p>

# reference
* [github](https://github.com/bitlabstudio/blogpost-react-websocket-chat)
두 개의 브라우저 창에서 실행 중인 React 앱이 백그라운드에서 노드 앱에 메시지를 게시하고, 모든 메시지를 연결된 모든 앱으로 다시 브로드캐스트합니다. <br />
자, 어떻게 이것이 이루어졌는지 보겠습니다!

# Step 1: Backend를 준비합니다.
모든 수신 메시지를 연결된 모든 사용자에게 브로드캐스트하는 간단한 WebSocket 서버를 만듭니다. <br />
따라서 프로젝트의 루트 디렉터리에서 다음 명령을 실행하여 별도의 백엔드 디렉터리를 만들고 <code>ws</code>를 설치합니다.

```text

  mkdir backend
  cd backend
  yarn add ws

```

<code>actualserver.js</code> 파일도 필요합니다.
```javascript

  const WebSocket = require('ws');

  const wss = new WebSocket.Server({ port: 3030 });

  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });
  });

```

수신하는 각 메시지에 대해 연결된 모든 클라이언트로 다시 보냅니다.

# Step 2: Frontend를 추가하기
선택 사항 - 아직 다음을 수행하지 않은 경우 다음을 수행합니다. CRA <code>yarn global add create-react-app</code>을 설치합니다. <br />

그런 다음 프로젝트 루트에 새 react앱을 만들려고 합니다.

```text

  create-react-app frontend
  cd frontend
  yarn add prop-types

```

당신은 이제 frontend/와 backend/디렉토리가 있습니다.

새 <code>frontend/</code> 디렉토리에 <code>ChatMessage.js</code> 구성 요소를 만듭니다. 각 대화 메시지의 모양은 다음과 같습니다.

```javascript
  
  import React from 'react'

export default ({ name, message }) =>
  <p>
    <strong>{name}</strong> <em>{message}</em>
  </p>

```
사용자 이름을 굵게 출력한 다음 메시지를 출력합니다. <br />

<code>ChatInput.js</code> 구성 요소를 만듭니다. 새 메시지를 입력하기 위해 채팅 위에 표시합니다.


```javascript

  import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ChatInput extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  }
  state = {
    message: '',
  }

  render() {
    return (
      <form
        action="."
        onSubmit={e => {
          e.preventDefault()
          this.props.onSubmitMessage(this.state.message)
          this.setState({ message: '' })
        }}
      >
        <input
          type="text"
          placeholder={'Enter message...'}
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
        <input type="submit" value={'Send'} />
      </form>
    )
  }
}

export default ChatInput

```
이 구성 요소는 만들려는 <code>Chat</code> 구성 요소에서 <code>onSubmitMessage</code>라는 하나의 프로펠러를 수신하며, 양식을 제출할 때 이를 호출합니다. <br />
또한 양식을 제출하면 메시지 입력이 다시 삭제됩니다. <br />

이제 채팅 로직의 중심이 될 <code>Chat.js</code> 구성 요소를 만듭니다. <br />
그것의 상태를 유지하고, 연결을 관리하며, 또한 메시지를 주고 받습니다. <br />

```javascript

  import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const URL = 'ws://localhost:3030'

class Chat extends Component {
  state = {
    name: 'Bob',
    messages: [],
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      this.addMessage(message)
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addMessage = message =>
    this.setState(state => ({ messages: [message, ...state.messages] }))

  submitMessage = messageString => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = { name: this.state.name, message: messageString }
    this.ws.send(JSON.stringify(message))
    this.addMessage(message)
  }

  render() {
    return (
      <div>
        <label htmlFor="name">
          Name:&nbsp;
          <input
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </label>
        <ChatInput
          ws={this.ws}
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
        {this.state.messages.map((message, index) =>
          <ChatMessage
            key={index}
            message={message.message}
            name={message.name}
          />,
        )}
      </div>
    )
  }
}

export default Chat

```
<code>Chat</code> 구성 요소를 자세히 살펴봅니다. <br />
새 WebSocket 인스턴스를 만들고 메시지 처리기와 연결 열기 및 닫기를 추가합니다. <br />
이것은 <code>OnSubmitMessage</code> 소품을 당사의 <code>ChatInput</code>으로 전달하며, 이 소포는 실제로 노드 백엔드로 메시지를 전송합니다. <br />
또한 사용자 식별을 위해 백엔드로 보내는 이름 입력을 표시합니다. <br />

<code>Chat</code> 구성 요소를 포함하도록 <code>App.js</code>를 업데이트하여 실제로 화면에 렌더링됩니다.

``` javascript

  import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Chat from './Chat'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Chat />
      </div>
    )
  }
}

export default App

```













































# reference
> * [markdawn](https://devsoyoung.github.io/posts/markdown-image-tag/)
> * [참고자료](https://blog.bitlabstudio.com/a-simple-chat-app-with-react-node-and-websocket-35d3c9835807)
> * [github](https://github.com/bitlabstudio/blogpost-react-websocket-chat)






















