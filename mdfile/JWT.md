### 세션 기반 인증 방식 <br />
 - 옛날에 토큰 기반 인증이 없었을 때 서버 세션을 사용해 인증을 했다.
> 1. 클라이언트가 로그인
> 2. 성공하면 서버가 유저 세션을 만들고 메모리나 데이터베이스에 저장한다.
> 3. 서버가 클라이언트에게 세션 ID를 보낸다.
> 4. 클라이언트의 브라우저에 세션의 ID만 쿠키에 저장하게 한다.
  
세션 데이터가 서버의 메모리에 저장되므로, 확장 시 모든 서버가 접근할 수 있도록 별도의 중앙 세션 관리 시스템이 필요하다.

### 세션 기반 인증 방식 단점
> 1. 중앙 세션 관리 시스템이 없으면, 시스템 확장에 어려움이 생긴다.
> 2. 중앙 세션 관리 시스템이 장애가 일어나면, 시스템 전체가 문제가 생긴다.
> 3. 만약 메모리에 세션 정보가 들어있다면, 메모리가 많이 사용될 수 있다.

규모 확장이 필요없는 소규모 프로그램 작성에서는 세션 기반 인증 방식을 사용해도 상관 없을 것이다.

### JWT
JWT(Json Web Token)은 토큰 기반 인증 방식으로, 
클라이언트의 세션 상태를 저장하는 게 아니라 필요한 정보를 토큰 body에 저장해 
클라이언트가 가지고 있고 그것을 증명서처럼 사용한다.

### 기본 구성
|xxxxx.yyyyy.zzzzz|
|-----------------|

3가지로 나눠진다.
> * Header (xxxxx)— JWT인 토큰의 유형이나 HMAC SHA256 또는 RSA와 같이 사용되는 해시 알고리즘이 무엇으로 사용했는지 등 정보가 담긴다.    
>   Base64Url로 인코딩되어있다.
> * Payload (yyyyy)— 클라이언트에 대한 정보나, meta Data같은 내용이 들어있고, Base64Url로 인코딩되어있다.
> * Signature (zzzzz)— header에서 지정한 알고리즘과 secret 키, 서명으로 payload와 header를 담는다.

### payload 내용
JWT는 내용을 해독해 볼 수 있으므로 중요한 데이터를 포함해선 안된다. <br />
[이곳](https://jwt.io/)에서 jwt를 해독할 수 있다.

### JWT 보안 위험
JWT는 자체 내에 정보를 가지고 있기 때문에 클라이언트가 해독해 정보를 볼 수 있다. 
하지만 받는 자가 secret 키를 알고 있어야만 수정이 가능하다.

* 작동 원리
> 1. A가 B에게 JWT를 보내려한다.
> 2. A, B 둘다 암호화한 secret 키를 알고 있다.
> 3. C는 secret 키를 알지 못하지만 A, B 사이의 JWT를 몰래 변경하려한다.
> 4. A는 이를 방지하기 위해 signature 부분에 (payload+secret key)를 특정 알고리즘으로 해시화해 추가했다.
> 5. C가 이 JWT를 변경하려해도 secret key를 몰라 멋대로 변경할 수 없다.
> 6. B는 C가 변경한 JWT를 받으면 서명이 다르기 때문에 받지 않는다.

### 수명
JWT의 수명을 짧게 하고 정기적으로 재발급을 요구하면 원치 않는 클라이언트를 빨리 막을 수 있다.

### 기본 인증 과정
* 간단한 JWT 인증 처리 과정이다.
> 1. 클라이언트가 로그인을 하면, 서버로부터 access 토큰을 부여받는다.
> 2. 이후 클라이언트가 모든 api 요청을 할 때 access 토큰을 포함시킨다.
> 3. 서버는 access 토큰을 해독해 확인하고 검증되면 해당 api 기능을 수행한다.
> 4. 기한이 만료되었으면 access 토큰을 지워주고 재로그인을 하게 한다.

### 문제점
 * 클라이언트가 계속 시스템을 이용하다가 access 토큰 기한이 만료된다면 사용중에 갑자기 로그인을 하라고 할 것이다.
 * 수명이 짧다면 만료될때마다 로그인 해주어야 한다.
 * 수명이 길면 해커에게 해독되어 사용될 가능성이 높아진다.

### Refresh Token
access 토큰이 만료되었을 때, Refresh 토큰으로 서벙새로운 access 토큰을 발급받을 수 있다.

### 필요성
 * 서버 데이터베이스에 Refresh Token이 저장되어 있을때 클라이언트가 블랙리스트에 포함되어 있다면, <br>
   access 토큰을 발급해주는 것을 막을 수 있다.
 * Refresh Token으로 access 토큰이 만료되면 알아서 갱신한다.

### 토큰 처리 flow
<img src="https://cdn-images-1.medium.com/max/800/1*IlZ9mxtgE6HsAHik_0GC-g.png" width="70%"></img>
<img src="https://cdn-images-1.medium.com/max/800/1*QCm08rvLhxfTg4oK9dbG5A.png" width="70%"></img>

### 웹과 모바일에서의 JWT 저장
React-Native로 개발한 모바일 앱에서는 KeyChain이나 KeyStore에서 암호화되게 JWT를 저장할 수 있는 라이브러리가 있다.

하지만 웹에서는 2가지의 선택이 있다.
 * Cookies
 * local/session storage.
 
### local/session storage
동일한 도메인의 JavaScript를 통해 접근할 수 있으므로 XSS(크로스 사이트 스크립팅)공격에 취약하다.

### Cookies
쿠키는 <code>http-only</code> 플래그를 사용해 암호화된 쿠키가 https로만 통신하도록 설정해 XSS의 문제를 완화시킬 수 있다.
하지만 <code>CSRF</code> 공격의 위험이 있다.
<code>CSRF</code>는 최근에 인증된 사용자가 웹 프로그램에서 원치 않는 행위를 하도록 한다.
<code>CSURF</code> 같은 라이브러리를 사용하면 예방할 수 있다.
그래서 보안을 위해 보통 Cookie 사용을 권장한다.

> ### 참조
> [Our Considerations on Token Design & Session Management](https://blog.gds-gov.tech/our-considerations-on-token-design-session-management-c2fa96198e6d) <br />
> [Where to Store your JWTs – Cookies vs HTML5 Web Storage](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage)
