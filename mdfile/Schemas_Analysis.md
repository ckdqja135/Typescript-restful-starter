### 입력받을 data들의 구조 정의하는 부분

# index.ts
### index
```typescript
import { createSample, deleteSample, updateSample } from "./Sample.schemas";
export { createSample, deleteSample, updateSample };
```

# Sample.schemas.ts
### import
```typescript
import { number, object, string } from "joi";
```

### 구조 정의 
```typescript
export const createSample = object().keys({
    text: string().required(),
    // email: string().required(),
});

export const updateSample = object().keys({
    id: number().required(),
    text: string().required(),
});

export const deleteSample = object().keys({
    id: number().required(),
});
```
