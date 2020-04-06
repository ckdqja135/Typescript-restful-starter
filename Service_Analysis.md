## app/services

# index.ts
### index
```typescript
import { JwtService } from "./Jwt.service";
import { SampleService } from "./Sample.service";

export { JwtService, SampleService };

```

# Jwt.service.ts
### import
```typescript
import * as JWT from "jsonwebtoken";
import { config } from "../../config";
```

### Jwtservice 클래스 생성
```typescript
export class JwtService {

    public signToken(params: { name: string, role: string }, options?: any): string {
        return JWT.sign(params, config.SECRET, options || undefined);
    }

}
```

# Sample.service.ts
### import
```typescript
import { getCustomRepository } from "typeorm";
import { Sample } from "../models";
import { SampleRepository } from "../repository";
```

### SampleService 클래스 생성 -> 서비스 생성.
```typescript
export class SampleService {

    public findByText(text: string): Promise<Sample[]> {
        return getCustomRepository(SampleRepository).findByText(text);
    }

    public bulkCreate(Samples: Sample[]): Promise<Sample[]> {
        return getCustomRepository(SampleRepository).bulkCreate(Samples);
    }

    public findOneById(id: number): Promise<Sample> {
        return getCustomRepository(SampleRepository).findOneById(id);
    }

    public find(): Promise<Sample[]> {
        return getCustomRepository(SampleRepository).find();
    }

    public remove(sample: Sample): Promise<Sample> {
        return getCustomRepository(SampleRepository).remove(sample);
    }

    public removeById(id: number): Promise<Sample> {
        return getCustomRepository(SampleRepository).removeById(id);
    }

    public save(sample: Sample): Promise<Sample> {
        return getCustomRepository(SampleRepository).save(sample);
    }
}
```
