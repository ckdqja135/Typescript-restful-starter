import { Request, Response } from "express";
import { Sample } from "../models";
import { SampleService } from "../services";
import { Controller } from "./Controller";

export class SampleController extends Controller {

    private sampleService: SampleService;
    private sample: Sample;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.sample = new Sample();
        this.sampleService = new SampleService();
    }

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

}
