import { SampleController } from "../controllers";
import { Validator } from "../middlewares";
import { createSample, deleteSample, updateSample } from "../schemas";
import { Router } from "./Router";

/*  Method 방식에 따른 처리 
    .get("/",...) - get방식에서 '/'이후 아무것도 입력하지 않았을 때 'createSample'을 통해 만들어진 데이터들이 리스트로 출력된다.
    .get("/find/text/:text", this.handler(SampleController.prototype.find)) - get방식에서 '/'옆에 find/text/text값을 입력 시 해당 text값을 가진 데이터를 출력시켜준다. ex: http://localhost:8080/find/text/hi
    .get("/find/id/:id", this.handler(SampleController.prototype.find2))  - get방식에서 '/'옆에 find/id/id값을 입력 시 해당 id값을 가진 데이터를 출력시켜준다. ex: http://localhost:8080/find/id/2
    .get("/find/email/:email", this.handler(SampleController.prototype.find3) - get방식에서 '/'옆에 find/email/email값을 입력 시 해당 email값을 가진 데이터를 출력시켜준다. ex: http://localhost:8080/find/email/example@eample.com
    .post("/", ...) - post방식에서 Sample.schemas.ts의 형식에 맞게 json값을 입력 시 id, text, eamil 값이 DB에 생성된다. (현재는 임의적인 text값만 주면 생성된다.)
    .put("/", ...) - put 방식에서 id값을 json방식으로 입력 시 해당 id값이 삭제된다. (routes/Sample.route.ts에서 )
*/
export class SampleRouter extends Router {
    constructor() {
        super(SampleController);
        this.router
            .get("/", this.handler(SampleController.prototype.all))
            .get("/find/text/:text", this.handler(SampleController.prototype.find))
            .get("/find/id/:id", this.handler(SampleController.prototype.find2))
            .get("/find/email/:email", this.handler(SampleController.prototype.find3))
            .post("/", [ Validator(createSample) ], this.handler(SampleController.prototype.create))
            .put("/", [ Validator(updateSample) ],  this.handler(SampleController.prototype.update))
            .delete("/", [ Validator(deleteSample) ], this.handler(SampleController.prototype.delete));
    }
}
