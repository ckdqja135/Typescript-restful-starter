### 세션 기반 인증 방식 <br />
 - 옛날에 토큰 기반 인증이 없었을 때 서버 세션을 사용해 인증을 했습니다.
> 1. 클라이언트가 로그인
> 2. 성공하면 서버가 유저 세션을 만들고 메모리나 데이터베이스에 저장한다.
> 3. 서버가 클라이언트에게 세션 ID를 보낸다.
> 4. 클라이언트의 브라우저에 세션의 ID만 쿠키에 저장하게 한다.
  
세션 데이터가 서버의 메모리에 저장되므로, 확장 시 모든 서버가 접근할 수 있도록 별도의 중앙 세션 관리 시스템이 필요합니다.

### 세션 기반 인증 방식 단점
> 1. 중앙 세션 관리 시스템이 없으면, 시스템 확장에 어려움이 생깁니다.
> 2. 중앙 세션 관리 시스템이 장애가 일어나면, 시스템 전체가 문제가 생깁니다.
> 3. 만약 메모리에 세션 정보가 들어있다면, 메모리가 많이 사용될 수 있습니다.

규모 확장이 필요없는 소규모 프로그램 작성에서는 세션 기반 인증 방식을 사용해도 상관 없을 것입니다.

### JWT
JWT(Json Web Token)은 토큰 기반 인증 방식으로, 
클라이언트의 세션 상태를 저장하는 게 아니라 필요한 정보를 토큰 body에 저장해 
클라이언트가 가지고 있고 그것을 증명서처럼 사용합니다.

### 기본 구성
|xxxxx.yyyyy.zzzzz|
|-----------------|

3가지로 나눠진다.
> * Header (xxxxx)— JWT인 토큰의 유형이나 HMAC SHA256 또는 RSA와 같이 사용되는 해시 알고리즘이 무엇으로 사용했는지 등 정보가 담긴다.    
>   Base64Url로 인코딩되어 있습니다.
> * Payload (yyyyy)— 클라이언트에 대한 정보나, meta Data같은 내용이 들어있고, Base64Url로 인코딩되어 있습니다.
> * Signature (zzzzz)— header에서 지정한 알고리즘과 secret 키, 서명으로 payload와 header를 담습니다.

### payload 내용
JWT는 내용을 해독해 볼 수 있으므로 중요한 데이터를 포함해선 안됩니다. <br />
[이곳](https://jwt.io/)에서 jwt를 해독할 수 있습니다.

### JWT 보안 위험
JWT는 자체 내에 정보를 가지고 있기 때문에 클라이언트가 해독해 정보를 볼 수 있다. 
하지만 받는 자가 secret 키를 알고 있어야만 수정이 가능합니다.

* 작동 원리
> 1. A가 B에게 JWT를 보내려한다.
> 2. A, B 둘다 암호화한 secret 키를 알고 있다.
> 3. C는 secret 키를 알지 못하지만 A, B 사이의 JWT를 몰래 변경하려한다.
> 4. A는 이를 방지하기 위해 signature 부분에 (payload+secret key)를 특정 알고리즘으로 해시화해 추가했다.
> 5. C가 이 JWT를 변경하려해도 secret key를 몰라 멋대로 변경할 수 없다.
> 6. B는 C가 변경한 JWT를 받으면 서명이 다르기 때문에 받지 않는다.

### 수명
JWT의 수명을 짧게 하고 정기적으로 재발급을 요구하면 원치 않는 클라이언트를 빨리 막을 수 있습니다.

### 기본 인증 과정
* 간단한 JWT 인증 처리 과정입니다.
> 1. 클라이언트가 로그인을 하면, 서버로부터 access 토큰을 부여받는다.
> 2. 이후 클라이언트가 모든 api 요청을 할 때 access 토큰을 포함시킨다.
> 3. 서버는 access 토큰을 해독해 확인하고 검증되면 해당 api 기능을 수행한다.
> 4. 기한이 만료되었으면 access 토큰을 지워주고 재로그인을 하게 한다.

### 장점
 * JWT는 발급한 후 토큰 검증만 하면 되기 때문에 추가 저장소가 필요 없습니다.
 * 서버를 확장하거나 유지, 보수하는데 유리합니다.
 * 토큰 기반으로 하는 다른 인증 시스템에 접근이 가능합니다.
   * 예를 들어 Facebook 로그인, Google 로그인 등은 모두 토큰을 기반으로 인증합니다. <br />
     선택적으로 이름이나 이메일 등을 받을 수 있습니다.

### 문제점
 * 클라이언트가 계속 시스템을 이용하다가 access 토큰 기한이 만료된다면 사용중에 갑자기 로그인을 하라고 할 것입니다.
 * 수명이 짧다면 만료될때마다 로그인 해주어야 합니다.
 * 수명이 길면 해커에게 해독되어 사용될 가능성이 높아집니다.
 * payload 정보가 제한적 payload는 따로 암호화되지 않기 때문에 디코딩하면 누구나 정보를 확인할 수 있어서 담는 데이터가 제한적입니다.
 * 세션/쿠키 방식에 비해 JWT길이가 기므로 인증이 필요한 요청이 많아질수록 서버의 자원낭비가 발생한다.

### Refresh Token
Access Token(JWT)를 통한 인증 방식의 문제는 만일 제 3자에게 탈취당할 경우 보안에 취약하다는 점입니다.
유효기간이 짧은 Token의 경우 그만큼 사용자는 로그인을 자주 해서 새롭게 Token을 발급받아야 하므로 불편합니다. 
그러나 유효기간을 늘리자면, 토큰을 탈취당했을 때 보안에 더 취약해지게 됩니다. 

이때 “그러면 유효기간을 짧게 하면서  좋은 방법이 있지는 않을까?”라는 질문의 답이 바로 "Refresh Token"입니다. 
Refresh Token은 Access Token과 똑같은 형태의 JWT입니다. 
처음에 로그인을 완료했을 때 Access Token과 동시에 발급되는 Refresh Token은 
긴 유효기간을 가지면서, Access Token이 만료됐을 때 새로 발급해주는 열쇠가 됩니다.
(여기서 만료라는 개념은 그냥 유효기간을 지났다는 의미입니다.) 

사용 예를 간단히 들어보겠습니다.
Refresh Token의 유효기간은 2주, Access Token의 유효기간은 1시간이라 하겠습니다. 
사용자는 API 요청을 신나게 하다가 1시간이 지나게 되면, 가지고 있는 Access Token은 만료됩니다. 
그러면 Refresh Token의 유효기간 전까지는 Access Token을 새롭게 발급받을 수 있습니다. 

* Access Token은 탈취당하면 정보가 유출되는건 동일합니다. 다만 짧은 유효기간 안에만 사용이 가능하기에 더 안전하다는 의미입니다.
* Refresh Token의 유효기간이 만료됐다면, 사용자는 새로 로그인해야 합니다. Refresh Token도 탈취될 가능성이 있기 때문에 적절한 유효기간 설정이 필요해보입니다(보통 2주로 많이 잡더군요)

### 필요성
 * 서버 데이터베이스에 Refresh Token이 저장되어 있을때 클라이언트가 블랙리스트에 포함되어 있다면, <br>
   access 토큰을 발급해주는 것을 막을 수 있다.
 * Refresh Token으로 access 토큰이 만료되면 알아서 갱신한다.

### 토큰 처리 flow
<img src="https://t1.daumcdn.net/cfile/tistory/99DB8C475B5CA1C936" width="70%"></img>
> 1. 사용자가 ID , PW를 통해 로그인합니다.
> 2. 서버에서는 회원 DB에서 값을 비교합니다(보통 PW는 일반적으로 암호화해서 들어갑니다)
> 3~4. 로그인이 완료되면 Access Token, Refresh Token을 발급합니다. 이때 일반적으로 회원DB에 Refresh Token을 저장해둡니다.
> 5. 사용자는 Refresh Token은 안전한 저장소에 저장 후, Access Token을 헤더에 실어 요청을 보냅니다.
> 6~7. Access Token을 검증하여 이에 맞는 데이터를 보냅니다.
> 8. 시간이 지나 Access Token이 만료됐다고 보겠습니다.
> 9. 사용자는 이전과 동일하게 Access Token을 헤더에 실어 요청을 보냅니다.
> 10~11. 서버는 Access Token이 만료됨을 확인하고 권한없음을 신호로 보냅니다.
> 
>  * Access Token 만료가 될 때마다 계속 과정 9~11을 거칠 필요는 없습니다.
>     사용자(프론트엔드)에서 Access Token의 Payload를 통해 유효기간을 알 수 있습니다. 
>     따라서 프론트엔드 단에서 API 요청 전에 토큰이 만료됐다면 바로 재발급 요청을 할 수도 있습니다.
> 
> 12. 사용자는 Refresh Token과 Access Token을 함께 서버로 보냅니다.
> 13. 서버는 받은 Access Token이 조작되지 않았는지 확인한후, Refresh Token과 사용자의 DB에 저장되어 있던 Refresh Token을 비교합니다.
>     Token이 동일하고 유효기간도 지나지 않았다면 새로운 Access Token을 발급해줍니다.
> 14. 서버는 새로운 Access Token을 헤더에 실어 다시 API 요청을 진행합니다. 

Refresh Token이 들어가면서 과정이 좀 복잡해졌습니다. 
하지만 Access Token의 약점을 보완해주기 때문에 보안이 중요한 프로젝트에서는 사용하기를 권장합니다. 

### Refresh Token 장점
* 기존의 Access Token만 있을 때보다 안전합니다.

### Refresh Token 단점
* 구현이 복잡합니다. 검증 프로세스가 길기 때문에 자연스레 구현하기 힘들어졌습니다(프론트엔드, 서버 모두)
* Access Token이 만료될 때마다 새롭게 발급하는 과정에서 생기는 HTTP 요청 횟수가 많습니다. 이는 서버의 자원 낭비로 귀결됩니다. 

처음에 구현하기가 좀 힘들 수 있으나 충분히 가치가 있다고 봅니다. 

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
> [JWT 서버 인증](https://brownbears.tistory.com/440)
> [쉽게 알아보는 서버 인증](https://tansfil.tistory.com/59?category=255594)
