> ### 목차
> 1. REST API의 탄생
> 2. REST 구성
> 3. REST 의 특징
> 4. REST API 디자인 가이드
> 5. HTTP 응답 상태 코드

<img src="https://image.toast.com/aaaadh/alpha/2016/techblog/uADF8uB9BC1.png" width="90%"></img>

## 1. REST API의 탄생
REST는 Representational State Transfer라는 용어의 약자로서 2000년도에 로이 필딩 (Roy Fielding)의 박사학위 논문에서 최초로 소개되었습니다. 로이 필딩은 HTTP의 주요 저자 중 한 사람으로 그 당시 웹(HTTP) 설계의 우수성에 비해 제대로 사용되어지지 못하는 모습에 안타까워하며 웹의 장점을 최대한 활용할 수 있는 아키텍처로써 REST를 발표했다고 합니다.

## 2. REST 구성
쉽게 말해 REST API는 다음의 구성으로 이루어져있습니다. 자세한 내용은 밑에서 설명하도록 하겠습니다.

* **자원(RESOURCE)** - URI
* **행위(Verb)** - HTTP METHOD
* **표현(Representations)**

## 3. REST 의 특징
1) **Uniform (유니폼 인터페이스)** <br />
Uniform Interface는 URI로 지정한 리소스에 대한 조작을 통일되고 한정적인 인터페이스로 수행하는 아키텍처 스타일을 말합니다.

2) **Stateless (무상태성)** <br />
REST는 무상태성 성격을 갖습니다. 다시 말해 작업을 위한 상태정보를 따로 저장하고 관리하지 않습니다. 세션 정보나 쿠키정보를 별도로 저장하고 관리하지 않기 때문에 API 서버는 들어오는 요청만을 단순히 처리하면 됩니다. 때문에 서비스의 자유도가 높아지고 서버에서 불필요한 정보를 관리하지 않음으로써 구현이 단순해집니다.

3) **Cacheable (캐시 가능)** <br />
REST의 가장 큰 특징 중 하나는 HTTP라는 기존 웹표준을 그대로 사용하기 때문에, 웹에서 사용하는 기존 인프라를 그대로 활용이 가능합니다. 따라서 HTTP가 가진 캐싱 기능이 적용 가능합니다. HTTP 프로토콜 표준에서 사용하는 Last-Modified태그나 E-Tag를 이용하면 캐싱 구현이 가능합니다.

4) **Self-descriptiveness (자체 표현 구조)** <br />
REST의 또 다른 큰 특징 중 하나는 REST API 메시지만 보고도 이를 쉽게 이해 할 수 있는 자체 표현 구조로 되어 있다는 것입니다.

5) **Client - Server 구조** <br />
REST 서버는 API 제공, 클라이언트는 사용자 인증이나 컨텍스트(세션, 로그인 정보)등을 직접 관리하는 구조로 각각의 역할이 확실히 구분되기 때문에 클라이언트와 서버에서 개발해야 할 내용이 명확해지고 서로간 의존성이 줄어들게 됩니다.

6) **계층형 구조** <br />
REST 서버는 다중 계층으로 구성될 수 있으며 보안, 로드 밸런싱, 암호화 계층을 추가해 구조상의 유연성을 둘 수 있고 PROXY, 게이트웨이 같은 네트워크 기반의 중간매체를 사용할 수 있게 합니다.

## 4. REST API 디자인 가이드
EST API 설계 시 가장 중요한 항목은 다음의 2가지로 요약할 수 있습니다.

**첫 번째**, URI는 정보의 자원을 표현해야 한다. <br />
**두 번째**, 자원에 대한 행위는 HTTP Method(GET, POST, PUT, DELETE)로 표현한다.

다른 것은 다 잊어도 위 내용은 꼭 기억하시길 바랍니다.

## 4-1. REST API 중심 규칙
**1) URI는 정보의 자원을 표현해야 한다. (리소스명은 동사보다는 명사를 사용)** <br />
```text

  GET /members/delete/1
  
```
위와 같은 방식은 REST를 제대로 적용하지 않은 URI입니다. URI는 자원을 표현하는데 중점을 두어야 합니다. delete와 같은 행위에 대한 표현이 들어가서는 안됩니다.

**2) 자원에 대한 행위는 HTTP Method(GET, POST, PUT, DELETE 등)로 표현**  <br />
위의 잘못 된 URI를 HTTP Method를 통해 수정해 보면
``` text

    DELETE /members/1
    
```
으로 수정할 수 있겠습니다.
회원정보를 가져올 때는 GET, 회원 추가 시의 행위를 표현하고자 할 때는 POST METHOD를 사용하여 표현합니다.

**회원정보를 가져오는 URI**
``` text

    GET /members/show/1     (x)
    GET /members/1          (o)
    
```

**회원을 추가할 때**
``` text

    GET /members/insert/2 (x)  - GET 메서드는 리소스 생성에 맞지 않습니다.
    POST /members/2       (o)
    
```

**(참고)HTTP METHOD의 알맞은 역할** <br />
POST, GET, PUT, DELETE 이 4가지의 Method를 가지고 CRUD를 할 수 있습니다.

METHOD | 역할 |
|---|---|
POST | POST를 통해 해당 URI를 요청하면 리소스를 생성합니다. |
GET | GET를 통해 해당 리소스를 조회합니다. 리소스를 조회하고 해당 도큐먼트에 대한 자세한 정보를 가져온다. |
PUT | PUT를 통해 해당 리소스를 수정합니다. |
DELETE | DELETE를 통해 리소스를 삭제합니다. |
