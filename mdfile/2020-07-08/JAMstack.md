# JAM Stack 개념 정리하기
SSR 도입위해 NextJS 를 검토하던중 JAM Stack 개념을 알게되어 이를 정리 해보고자 한다. <br />

[JAMstack WTF](https://jamstack.wtf/)

**JAM stack** 은 **Javascript, Api, Markup Stack** 의 약자이다. <br />
약자에서 알수 있듯 <code>Javascript</code> 와 <code>API</code> 그리고 <code>Markup(HTML)</code> 만으로 이루어진 웹의 구성을 이야기하는 것인데, 우리가 알고 있는 SPA 과는 비슷하지만 다르다. <br />

## SPA (Single Page Application) 와 CSR (Client Side Rendering)

웹은 보통 완성된 <code>Static HTML</code> 와 <code>CSS</code> 를 네트워크로 전달 받아서, 화면을 보여준다. <br />

서버가 **동적**으로 **HTML**을 생성할 수 있게 되면서 **Server Side Rendering(SSR)** 개념이 등장하였고, **사용자의 요청** 에 따라 **HTML** 을 만들어서 전달하고, 화면을 보여줄 수 있게 되었다. <br />

**SSR** 만으로는 더 많은 **HTML** 의 조작이 힘들어 지면서, 보조역할만 하던 **Javascript** 가 **jQuery**의 만남과 함께, 중요한 역할을 차지하게 되었다.

**Javascript** 로 화면을 조작할 일이 많이 생겼고, <code>Javascript 와 브라우저 성능이 더욱 발전하여</code> <br />
<code>Angular.js, Angular, React, Vue</code> 와 같은 **DOM** 을 조작하기 쉽게 도와주는 라이브러리와 웹 프레임워크가 등장하면서, <code>Client Side Rendering(CSR)</code> 개념이 등장하게 되었다. <br />

시대가 발전하고 사용자의 환경이 더욱 발전하면서, 서버 상에서 **HTML** 을 만들어서 전달하는 것보다 **(SSR)**, <br />
클라이언트 상에서 **HTML** 을 만드는 것이 **(CSR)**, **서버 비용과 렌더링 속도**에서 훨씬 유리한 환경이 되게 되었다. <br />

페이지를 이동할 때마다 **HTML** 을 새로 받아서 그리는것보다, 필요한 데이터만 을 받아서 **Javascript** 로 화면을 그리는 것이 유리해지면서, <br />
<code>극단적으로 거의 정보가 없는 HTML</code> 과 <code>매우 큰 Javascript</code> 그리고, <code>분리된 환경의 API</code> 만으로 이루어진 Single Page Application (SPA) 환경이 이루어지게 된다. <br />
