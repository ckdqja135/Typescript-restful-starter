## app/routes

# index.ts
### index
```typescript
import { JwtRouter } from "./Jwt.route";
import { SampleRouter } from "./Sample.route";
export { JwtRouter, SampleRouter };
```

# Jwt.route.ts
### Jwt 라우터(클래스 생성)
```typescript
export class JwtRouter extends Router {
    constructor() {
        super(JWTController);
        this.router
            .post("/", this.handler(JWTController.prototype.index));
    }
}
```

# Router.ts
### 라우터(클래스 생성)
```typescript
export abstract class Router {

    public router: express.Router;
    private controller: any;

    constructor(controller: any) {
        this.controller = controller;
        this.router = express.Router();
    }

    protected handler(action: () => void): any { // 요청을 처리하는 콜백함수.
        return (req: Request, res: Response) => action.call(new this.controller(req, res));
    }
}
```

# Sample.route.ts
### import 부분
```typescript
import { SampleController } from "../controllers";
import { Validator } from "../middlewares";
import { createSample, deleteSample, updateSample } from "../schemas";
import { Router } from "./Router";
```

### Method 방식에 따른 처리
** .get("/",...) - get방식에서 '/'이후 아무것도 입력하지 않았을 때 'createSample'을 통해 만들어진 데이터들이 리스트로 출력된다.
** .get("/:id", ...) - get방식에서 '/'옆에 id값을 입력 시 해당 id값의 데이터를 출력시켜준다. ex: http://localhost:8080/2
** .post("/", ...) - post방식에서 Sample.schemas.ts의 형식에 맞게 json값을 입력 시 id, text, eamil 값이 DB에 생성된다. (현재는 임의적인    text값만 주면 생성된다.)
** .put("/", ...) - put 방식에서 id값을 json방식으로 입력 시 해당 id값이 삭제된다. (routes/Sample.route.ts에서 )
