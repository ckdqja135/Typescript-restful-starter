# HTTP 그리고 REST API 다가가기

# [HTTP란]
- **H**yper**T**ext **T**ransper **P**rotocol의 준말, 하이퍼텍스트 트랜스퍼란 링크 기반으로 데이터를 요청하고 받겠다는 것
- 클라이언트와 서버가 요청을 하고 응답을 하기위해 따르는 프로토콜
- HTML 문서를 주고 받을 수 있음, 뿐만 아니라 이미지, 동영상, 오디오, 텍스트 문서 등을 주고 받을 수 있음

<p ailgn = "center"><img src = "https://t1.daumcdn.net/cfile/tistory/2621D54158F823B72B" width = 90%> </img></p>

- 클라이언트 : 웹어플리케이션의 경우 크롬, 파폭, IE 등 브라우저를 통햇허 서버에 요청을 함(프로토콜 + 도메인 + URI)
- 서버 : 클라이언트로부터 받은 요청을 내부적으로 처리하여 그에 대한 결과를 응답해줌

# [HTTP 특징 및 기능]
### 1) connectless + stateless
- 1번 요청-응답 후 연결을 끊어버림
- 클라이언트의 이전 상태를 알 수 없음 : 그래서 **쿠키와 세션**(클라이언트와 서버의 이전 상태정보 저장)이 필요함
- 수십만명이 웹서비스를 사용(요청)하더라도 최소 유지를 할 수 있기 때문에, 많은 유저의 요청을 처리할 수 있음

### 2) keep-alive : HTTP 1.1부터 지원하는 기능
- 1번 항목에서 언급했듯이 HTTP는 1번의 요청에 대해 1번의 응답 하는 것을 기준으로 설계됨
- 요즘 웹사이트들을 보면 하나의 페이지에 수십개 이미지, css 파일, js 파일이 있는 것을 볼 수 있음
- 1 요청 1응답 기준이라면 여러번 연결을 끊었다 붙였다 해야함 굉장히 비효율적
- keep-alive 지원으로 지정된 시간동안 연결을 끊지않고 연결된 상태를 유지할 수 있음
- keep-alive time out 내 클라이언트가 재요청하면 새로운 연결이 아닌 연결된 것을 이용함
1) 웹서버 연결
2) HTML 문서 다운로드
3) 필요한 img, css, js 등 다운로드
4) 연결 끊음

- 모든 웹서버, 브라우저가 HTTP 1.1 지원
- 아래는 네이버 페이지에 대한 요청 헤더임 
<p align = "center"> <img src = "https://t1.daumcdn.net/cfile/tistory/2323993F58F823DB4D" width = 90%> </img></p>

# [HTTP Request 구조]
- 사용자(클라이언트 프로그램을 이용한)가 서버에 요청을 보낼 때 HTTP Request 구조를 알아본 것

<p align = "center"> <img src = "https://t1.daumcdn.net/cfile/tistory/252D2D3E58F8254C14" width = 90%> </img></p>

1) 메소드(Header) : 사용자가 서버에 요청하는 메소드, HTTP 버젼을 확인할 수 있음
2) 요청헤더(Header) : 서버에 전달되는 사용자 정보(클라이언트 브라우저 정보 : 문자코드, 언어, 파일 종류)
3) 공백 : HTTP Request Header(헤더)와 본문 부분을 구분하기위한 공백
4) 본문(message) : HTTP Request **요청 메세지를 담고 있는 부분**, GET 메소드의 경우 요청정보가 주소에 담겨져 있어 본문은 빈 상태

- 아래는 해당 페이지 HTTP Request의 header 부분의 이미지 : 요청 본문 아님
<p align = "center"> <img src = "https://t1.daumcdn.net/cfile/tistory/2303A24458F823EE0A" width = 90%> </img></p>

# [HTTP Response 구조]
- 서버가 사용자 요청에 대한 응답을 할 때 HTTP Response 구조를 알아본 것
<p align = "center"> <img src = "https://t1.daumcdn.net/cfile/tistory/2104444458F823EF19" width = 90%> </img></p>

1) 상태코드(Header) : 사용자의 요청에 대한 서버 처리결과를 나타냄(200, 404, 500 등 여러 상태코드가 있음)
2) 응답헤더(Header) : 사용자에게 전달한 데이터 정보를 나타냄
3) 공백 : HTTP Response Header(헤더)와 본문 부분을 구분하기위한 공백
4) 본문(message) : 사용자에게 전달한 데이터 내용을 담고 있음(요청에 대한 데이터 응답)

- 아래는 해당 페이지 HTTP Request의 header 부분의 이미지 : 응답 본문 아님
<p align = "center"> <img src = "https://t1.daumcdn.net/cfile/tistory/2555644358F8248A12" width = 90%> </img></p>

# [HTTP method 그리고 REST API]
- **메소드란**? 요청의 종류를 서버에 알리기위해 사용하는 것, 게시판 기능(CRUD, REST API)을 만들 때 사용
- 메소드 종류
1) GET : 정보를 요청하기위해 사용(Read)
2) POST : 정보를 입력하기위해 사용(Create)
3) PUT : 정보를 업데이트하기위해 사용(Update)
4) DELETE : 정보를 삭제하기위해 사용(Delete)

- **REST API**란? HTTP 프로토콜 장점을 살릴 수 있는 네트워크 기반 아키텍처
1) REST API를 구현하기위해 HTTP method + 모든 개체 리소스화 + URL 디자인(라우팅) 필요
- 라우팅이란? 클라이언트의 요청에 대한 결과(응답)를 어떻게 이어줄 것인가를 처리하는 것
- URI를 이용한 접근 : 모든 개체를 리소스로 보고, 리소스에 고유번호를 부여
- URL 디자인 원칙 : 자원에 대한 처리를 주소에 나타내지않는다(HTTP method는 내부적으로 처리하도록), 어떤 자원인지 주소에 명확하게 나타냄

<p align = "center"> <img src = "https://t1.daumcdn.net/cfile/tistory/24459E4458F823EF0E" width = 90%> </img></p>

- 레일즈로 REST URL 디자인한 것
- book 이라는 자원(db 테이블 구현)에 대한 처리를 설계함
- 실제 주소는 http://도메인/books 혹은 뒤에 book 자원 중 하나에 대한 처리(:id), book 자원 새로 만들기 new 만 있음
- update, delete, read(show)를 주소 상에서 보여주지 않음

- REST API를 구현하기위해 HTTP 프로토콜에 대한 이해, method 종류, 라우팅에 대한 이해가 있어야함
- HTTP method를 클라이언트가 요청할 때 서버에 넘길 수 있도록(처리 각각에 맞는)


# reference
1) [위키피디아 HTTP](https://ko.wikipedia.org/wiki/HTTP)
2) [joinc.com HTTP](https://www.joinc.co.kr/w/Site/Network_Programing/AdvancedComm/HTTP)
3) [exoluse 블로그](http://exoluse.egloos.com/v/4572381)
4) [Wooeong's lab](http://wooeong.tistory.com/entry/HTTP%EB%9E%80)






