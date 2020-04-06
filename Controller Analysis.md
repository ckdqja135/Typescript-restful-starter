# ContController.ts
### req, res 설정 부분
```typescript
import * as express from "express";
/* req, res 설정 */
export abstract class Controller {

    public req: express.Request;
    public res: express.Response;

    constructor(req: express.Request, res: express.Response) {
        this.req = req;
        this.res = res;
    }
}
```
