## app/controllers

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
# index.ts
```typescript
import { JWTController } from "./Jwt.controller";
import { SampleController } from "./Sample.controller";

export { JWTController, SampleController };
```

# Jwt.controller.ts
### JWT 설정 부분
```typescript
import { Request, Response } from "express";
import { JwtService } from "../services";
import { Controller } from "./Controller";
/* JWT 설정 */
export class JWTController extends Controller {

    private jwtService: JwtService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.jwtService = new JwtService();
    }

    public async index(): Promise<Response> {
        const { payload } = this.req.body;
        const token = await this.jwtService.signToken(payload);
        return this.res.send(token);
    }

}
```

# Sample.controller.ts
### SampleController 클래스 생성
```typescript
export class SampleController extends Controller {

    private sampleService: SampleService;
    private sample: Sample;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.sample = new Sample();
        this.sampleService = new SampleService();
}
```

### SampleController안에 정의된 컨트롤러들
```typescript
  // 생성된 데이터 리스트 출력
    public async all(): Promise<Response> {
        const sampleList = await this.sampleService.find();
        return this.res.send(sampleList);
    }

    // select -> routes/Sample.route.ts 참조.
    public async find(): Promise<Response> {
        const { id } = this.req.params as unknown as { id: number };
        const sample = await this.sampleService.findOneById(id);
        if (sample) {
            return this.res.status(200).send(sample);
        } else {
            return this.res.status(404).send({ text: "not found" });
        }
    }
    
    // input -> routes/Sample.route.ts 참조. 
    public async create(): Promise<Response> {
        const { text } = this.req.body as { text: string };
        // Sample.schemas.ts에서 따로 email의 입력 받는 틀을 잡아주면 아래의 코드를 사용할 수 있다.
        // const { text, email } = this.req.body as { text: string, email: string };
        this.sample.text = text;
        this.sample.email = "someone@somewhere.com";
        // this.sample.email = email; 
        try {
            const result = await this.sampleService.save(this.sample);
            return this.res.status(200).send(result);
        } catch (ex) {
            return this.res.status(404).send({ text: "ERROR" });
        }
    }

    // update -> routes/Sample.route.ts 참조.
    public async update(): Promise<Response> {
        const { id, text, email } = this.req.body as { id: number, text: string, email: string };
        this.sample.id = id;
        this.sample.text = text;
        this.sample.email = email;
        try {
            const sample = await this.sampleService.save(this.sample);
            if (sample) {
                return this.res.status(200).send();
            } else {
                return this.res.status(404).send({ text: "not found" });
            }
        } catch (ex) {
            return this.res.status(404).send({ text: "error" });
        }
    }

     // update -> routes/Sample.route.ts 참조.
    public async delete(): Promise<Response> {
        const { id } = this.req.body as { id: number };
        try {
            await this.sampleService.removeById(id);
            return this.res.status(204).send();
        } catch (ex) {
            return this.res.status(404).send({ text: "ERROR" });
        }
    }
```
