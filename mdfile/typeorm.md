## TypeOrm (object Relational Mapping)
```text
TypeORM 에서 ORM 기본, NativeScript, 박람회 및 전자 플랫폼 반응, 
NodeJS, 브라우저, 코르도바, 폰갭, 이온 성에서 실행할 수 있으며, 
타이프 라이터와 자바 스크립트 (ES5, ES6, ES7, ES8)와 함께 사용할 수 있습니다.
이 솔루션의 목표는 항상 최신 JavaScript 기능을 지원하고 
몇 가지 테이블이있는 소규모 응용 프로그램부터 
여러 데이터베이스가있는 대규모 엔터프라이즈 응용 프로그램에 이르기까지 
데이터베이스를 사용하는 모든 종류의 응용 프로그램을 개발하는 데 
도움이되는 추가 기능을 제공하는 것입니다.
```

## ORM 이란?
* Object Relational Mapping, 객체-관계 매핑
```text
객체와 테이블 시스템(RDBMSs)을 변형 및 연결해주는 작업이라 말 할 수 있다. 
ORM을 이용한 개발은 객체와 데이터베이스의 변형에 유연하게 대처할 수 있도록 해준다. 
ORM을 객체 지향 프로그래밍 관점에서 생각해보면, 관계형 데이터베이스에 제약을 최대한 받지 않으면서, 
객체를 클래스로 표현하는 것과 같이 관계형 데이터베이스를 객체처럼 쉽게 표현 또는 사용하자는 것이다.
```

## ORM의 장단점
장점 | 단점 |
---- | ---- |  
선언, 할당, 종료 같은 부수적인 코드가 없거나 급격히 줄어든다. | 완벽하게 ORM 서비스구현이 어려울수있다. |
각종 객체에 대한 코드를 별도로 작성하기 떄문에 코드의 가독성을 올려준다. | 사용하기에 편리함은 있지만 설계가 복잡하다. |
SQL 의 절차 , 순차적인 접근 방식이 아닌 객체 접근 방식이다. | 프로젝트 복잡성과난이도레따라 퍼포먼스의 큰차이가 있다.

## TypeOrm 환경설정 및 사용법
### 1. Connection
데이터베이스와의 상호 작용은 일단 연결을 설정 한 후에만 가능합니다.<br />
TypeORM <code>Connection</code>은 데이터베이스 연결을 설정하지 않고 연결 풀을 설정합니다.

### 1-1 CreateConnection
연결을 생성하는 방법에는 여러 가지가 있습니다. 
가장 간단하고 일반적인 방법은 사용하는 것입니다. 
<code>createConnection</code>및 <code>createConnections</code>기능을합니다.

### createConnection 단일연결 예제
```typescript
import { createConnection } from "typeorm";
import { Sample } from "../app/models";
import { config, DIALECT } from "../config";

export const Connection = createConnection({
    database: config.DATABASE.DB,
    entities: [
        Sample,
    ],
    host: config.DATABASE.SERVER,
    logging: false,
    password: config.DATABASE.PASSWORD,
    port: config.DATABASE.PORT_DB,
    synchronize: true,
    type: DIALECT,
    username: config.DATABASE.USER_DB,
});
```

