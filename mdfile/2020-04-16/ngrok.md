# ngrok으로 로컬 네트워크의 터널 열기

웹사이트나 API 서버 등을 개발할 때 보통은 로컬에 개발환경이 구축되어 있으므로 외부에서 접근하려면 외부에서 접속할 수 있는 서버에 올리거나 해야 한다.< br /> 
이는 일반적인 개발 단계이기는 하지만 배포단계가 아닌 개발단계에서 외부에 열어주어야 하는 경우에는 상당히 귀찮은 일이다. <br />
예를 들어 만들고 있는 웹사이트를 기획자나 디자이너한테 공유해서 보여주고 의견을 들어야 한다거나 폰이나 태블릿에서 접속해서 테스트를 해보아야 하는데 <br />
같은 네트워크에 접속되어 있지 않다면 수정하고 배포하는 단계가 아주 귀찮아지기 마련이다. <br />

나 같은 경우는 [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)로 페이지 최적화를 하려고 하는데 PageSpeed Insights가 로컬에서 돌려볼 수 없고  <br />
PageSpeed Insights가 웹사이트에 접속해서 테스트하는 방식이라서 웹사이트가 퍼블릭으로 열려있어야 한다.  <br />
(전에는 개발자도구에 설치가능한 확장도 있었던 것 같은데 언젠가부터 찾을 수가 없어졌다.)  <br />
배포하기 전에 잘못된 부분을 모두 수정한 다음에 배포하고 싶었는데 개발은 로컬에서 하고 있으므로 가능한 방법을 찾기 시작했다.  <br />
그 외에도 소셜 로그인을 테스트하는 등 외부 서비스가 로컬에서 개발중인 웹 애플리케이션을 호출해야 하는 경우에도 이러한 요구사항이 필요하다.  <br />

# ngrok
[ngrok](https://ngrok.com/) 사이트에는 Secure tunnels to localhost라고 나와 있는데 새로운 개념이라기보다는 방화벽 넘어서 외부에서 로컬에 접속 가능하게 하는 터널 프로그램이라고 할 수 있다. 
이런 프로그램이 ngrok뿐인 것은 아니지만, 위에서 설명한 상황에서 유용하게 쓸 수 있게 최적화되어 있어서 아주 쉽게 사용할 수 있다.

<p align = "center"><img src = "https://blog.outsider.ne.kr/attach/1/x9152679422.jpg.pagespeed.ic.Oy308VWBBP.webp" width = 90%></img>

ngrok 사이트에서 Mac, Linux, Windows 프로그램을 제공하고 있다. <br />
Mac이나 Linux 같은 경우는 쉘 스크립트를 받아서 자신의 <code>PATH</code>아래 넣으면 다음과 같이 커맨드라인 명령어를 사용할 수 있다.

``` bash
  ngrok
NAME:
   ngrok - tunnel local ports to public URLs and inspect traffic

DESCRIPTION:
    ngrok exposes local networked services behinds NATs and firewalls to the
    public internet over a secure tunnel. Share local websites, build/test
    webhook consumers and self-host personal services.
    Detailed help for each command is available with 'ngrok help <command>'.
    Open http://localhost:4040 for ngrok's web interface to inspect traffic.

EXAMPLES:
    ngrok http 80                    # secure public URL for port 80 web server
    ngrok http -subdomain=baz 8080   # port 8080 available at baz.ngrok.io
    ngrok http foo.dev:80            # tunnel to host:port instead of localhost
    ngrok tcp 22                     # tunnel arbitrary TCP traffic to port 22
    ngrok tls -hostname=foo.com 443  # TLS traffic for foo.com to port 443
    ngrok start foo bar baz          # start tunnels from the configuration file

VERSION:
   2.0.19

AUTHOR:
  inconshreveable - <alan@ngrok.com>

COMMANDS:
   authtoken  save authtoken to configuration file
   credits  prints author and licensing information
   http   start an HTTP tunnel
   start  start tunnels by name from the configuration file
   tcp    start a TCP tunnel
   test   test ngrok service end-to-end
   tls    start a TLS tunnel
   update update to the latest version
   version  print the version string
   help   Shows a list of commands or help for one command

```

# ngrok 사용방법
위 도움말에서 나오듯이 가장 많이 사용할 HTTP 서버를 외부에 열고자 하면 <code>ngrok http 3000</code>과 같이 실행하면 로컬의 3000 포트 즉, <code>127.0.0.1:3000</code>을 ngrok 도메인과 연결해서 터널을 열어준다.

``` linux

  ngrok by @inconshreveable                                                                                              (Ctrl+C to quit)

  Tunnel Status      online
  Version            2.0.19/2.0.19
  Web Interface      http://127.0.0.1:4040
  Forwarding         http://7eb69b3e.ngrok.io -> localhost:3000
  Forwarding         https://7eb69b3e.ngrok.io -> localhost:3000

  Connections        ttl     opn     rt1     rt5     p50     p90
                     0       0       0.00    0.00    0.00    0.00
                   
```

터미널 창 전체가 ngrok의 접속 상태를 알 수 있는 대시보드처럼 나온다. <br />
앞에서 <code>3000</code?포트를 지정했으므로 <code>http://7eb69b3e.ngrok.io</code>나 <code>https://7eb69b3e.ngrok.io</code>로 접속하면 <br />
로컬의 <code>http://127.0.0.1:3000</code>로 접속을 연결해 준다. 로컬에서 간단히 웹 어플리케이션을 띄어놓고 ngrok로 연결한 뒤 <br />
바로 ngrok 주소를 공유하면 같은 네트워크가 아니더라도 어디서나 접근할 수 있다. <br />

<p align = "center"><img src = "https://blog.outsider.ne.kr/attach/1/x5451170611.gif.pagespeed.ic.SXk5853Zyd.webp" width = 90%></img>




