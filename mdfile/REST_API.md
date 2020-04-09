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
