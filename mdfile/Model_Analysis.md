## app/models

### 어플리케이션이 “무엇”을 할 것인지를 정의하는 부분. 내부 비지니스 로직을 처리하기 위한 역할.
  ex)처리되는 알고리즘, DB, 데이터 등등.

# index.ts
### index
```typescript
import { Sample } from "./Sample.model";
export { Sample };
```

# Sample.model.ts
### import
```typescript
import { IsEmail } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
```
### DB모델 정의
```typescript
@Entity("sample")
export class Sample extends BaseEntity {

    @PrimaryGeneratedColumn() // 인덱스 자동 증가.
    public id: number;

    @Column("text")
    public text: string;

    @Column("text")
    @IsEmail()
    public email: string;

```
