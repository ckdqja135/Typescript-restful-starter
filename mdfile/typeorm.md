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
### 1-2 CreateConnections 다중연결 예제
```typescript
    import {createConnections, Connection} from "typeorm";

         const connections = await createConnections([{
             name: "default",
             type: "mysql",
             host: "localhost",
             port: 3306,
             username: "test",
             password: "test",
             database: "test"
         }, {
             name: "test2-connection",
             type: "mysql",
             host: "localhost",
             port: 3306,
             username: "test",
             password: "test",
             database: "test2"
         }]);
```

이 두 함수는 <code>Connection</code>전달하고 <code>connect</code>메서드를 호출하는 연결 옵션을 기반으로 만듭니다. 
프로젝트의 루트에 <code>ormconfig.json</code> 파일을 작성할 수 있으며 이러한 옵션을 사용하여 
연결 옵션을 자동으로 이 파일에서 읽을 수 있습니다.

### 1-3. 연결성공시 getConnection함수를 사용하여 앱에서 어디에서나 연결할 수 있습니다.
```typescript
import {getConnection} from "typeorm";

const connection = getConnection();
const secondConnection = getConnection("test2-connection");
```

### 2. Entity
<code>Entity</code>는 데이터베이스 테이블 (또는 MongoDB를 사용할 때 컬렉션)에 매핑되는 클래스입니다. 
새로운 클래스를 정의하여 <code>Entity</code>를 생성하고이를 다음과 <code>@Entity()</code>같이 표시 할 수 있습니다.

### Sample.model.ts
```typescript
import { IsEmail } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sample")
export class Sample extends BaseEntity {

    @PrimaryGeneratedColumn() // 인덱스 자동 증가.
    public id: number;

    @Column("text")
    public text: string;

    @Column("text")
    @IsEmail()
    public email: string;
}
```
위와같은 코드를 입력 할 경우 다음과 같은 데이터베이스 테이블이 생성됩니다.
<img src="https://user-images.githubusercontent.com/33046341/78640725-2c0e3e00-78eb-11ea-98be-80267b0ffe27.png" width="50%"></img>

기본 엔티티는 열과 관계로 구성됩니다. 
각 엔티티는 반드시 (MongoDB를 사용중인 경우 또는 ObjectId가 열) 주 열을 갖습니다. 
각 개체는 연결 옵션에 등록해야합니다.

### 2-1. 연결옵션 설정
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
또는 모든 <code>Entity</code>가 포함 된 디렉토리 전체를 지정할 수 있으며 모든 <code>Entity</code>가로드됩니다.
```typescript
import {createConnection, Connection} from "typeorm";
const connection: Connection = await createConnection({
     type: "mysql",
     host: "localhost",
     port: 3306,
     username: "test",
     password: "test",
     database: "test",
     entities: ["entity/*.js"]
 });
```
> @ Entity
> 선언된 부분의 아래 부분부터 model 부분이 된다는 의미로 쓰입니다.

> @ BaseEntity
> save 를 쉽게 사용하기 위함입니다. 다른 용도도 있겠지만 우선은 그렇습니다.

> @ PrimaryGeneratedColumn 
> primary key 를 적용시킨 컬럼 이라고 보시면 되겠습니다. 그리고 추가적으로 auto increase도 자동으로 설정이 됩니다.

> @ Column
> 말그대로 컬럼 다른말로 필드라고 합니다. name 에 맞게 데이터가 들어가는 곳이죠.

2-2. 기본열
각 <code>Entity</code>에는 최소한 하나의 기본 열이 있어야합니다. 기본 열의 몇 가지 유형이 있습니다.
```typescript
import { IsEmail } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("sample")
export class Sample extends BaseEntity {

    @PrimaryColumn()
    public id: number;

    @Column("text")
    public text: string;

    @Column("text")
    @IsEmail()
    public email: string;
}
```
<code>@PrimaryColumn()</code>모든 유형의 값을 취하는 기본 열을 만듭니다. 
열 유형을 지정할 수 있습니다. 
열 유형을 지정하지 않으면 특성 유형에서 유추됩니다.
아래 예제는 <code>int</code>저장하기 전에 수동으로 지정해야하는 유형으로 <code>ID</code>를 만듭니다.
```typescript
import { IsEmail } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sample")
export class Sample extends BaseEntity {

    @PrimaryGeneratedColumn() // 인덱스 자동 증가.
    public id: number;

    @Column("text")
    public text: string;

    @Column("text")
    @IsEmail()
    public email: string;

}
```
<code>@PrimaryGeneratedColumn(“uuid”)</code>값이 자동으로 생성되는 기본 열을 만듭니다. 
<code>uuid.Uuid</code>는 고유 한 문자열 ID입니다. 
저장하기 전에 값을 수동으로 지정할 필요가 없습니다. 
값이 자동으로 생성됩니다.

```typescript
import { IsEmail } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("sample")
export class Sample extends BaseEntity {

    @PrimaryColumn()
    public id: number;

    @Column("text")
    public text: string;

    @Column("text")
    @IsEmail()
    public email: string;
}
```
<code>Entity</code>를 사용하여 <code>Entity</code>를 저장 save하면 항상 주어진 <code>Entity</code> ID (또는 ID)로 엔티티를 데이터베이스에서 찾습니다. id / id가 발견되면 데이터베이스에서이 행을 갱신합니다. id / ids 행이없는 경우 새 행이 삽입된다.

### 3. 기타설정

대부분의 경우 연결 옵션을 편리하고 관리하기 용이하게, 별도의 구성 파일에 저장하려고 합니다. 
TypeORM은 여러 구성 소스를 지원하며, <code>ormconfig.[format]</code> 파일을 만들고 
<code> createConnection()</code> 구성을 전달하지 않고 응용 프로그램 호출에 구성을 저장하기만 하면 됩니다.
