import { Request, Response } from "express";
import { Sample } from "../models";
import { SampleService } from "../services";
import { Controller } from "./Controller";
const crypto = require('crypto');
const timestamp = new Date().getTime();
const cid = 'softwiz';

export class SampleController extends Controller {
    
    private sampleService: SampleService;
    private sample: Sample;
    
    constructor(req: Request, res: Response) {
        super(req, res);
        this.sample = new Sample();
        this.sampleService = new SampleService();
    }

    // 생성된 데이터 리스트 출력
    public async all(): Promise<Response> {
        const sampleList = await this.sampleService.find();
        return this.res.send(sampleList);
    }

    // select -> routes/Sample.route.ts 참조.
    public async find(): Promise<Response> {
        const { text } = this.req.params as unknown as { text: string };
        const sample = await this.sampleService.findByText(text);
        if (sample) {
            return this.res.status(200).send(sample);
        } else {
            return this.res.status(404).send({ text: "not found" });
        }
    }

    // select -> routes/Sample.route.ts 참조.
    public async find2(): Promise<Response> {
        const { id } = this.req.params as unknown as { id: number };
        const sample = await this.sampleService.findOneById(id);
        if (sample) {
            return this.res.status(200).send(sample);
        } else {
            return this.res.status(404).send({ text: "not found" });
        }
    }

    // select -> routes/Sample.route.ts 참조.
    public async find3(): Promise<Response> {
        const { email } = this.req.params as unknown as { email: string };
        const sample = await this.sampleService.findByEmail(email);
        if (sample) {
            return this.res.status(200).send(sample);
        } else {
            return this.res.status(404).send({ text: "not found" });
        }
    }

    // select -> routes/Sample.route.ts 참조.
    public async find4(): Promise<Response> {
        const { name } = this.req.params as unknown as { name: string };
        const sample = await this.sampleService.findByName(name);
        if (sample) {
            return this.res.status(200).send(sample);
        } else {
            return this.res.status(404).send({ text: "not found" });
        }
    }

    // select -> routes/Sample.route.ts 참조.
    public async find5(): Promise<Response> {
        const { age } = this.req.params as unknown as { age: number };
        const sample = await this.sampleService.findByAge(age);
        if (sample) {
            return this.res.status(200).send(sample);
        } else {
            return this.res.status(404).send({ text: "not found" });
        }
    }

    // select -> routes/Sample.route.ts 참조.
    public async find6(): Promise<Response> {
        const { phone } = this.req.params as unknown as { phone: string };
        const sample = await this.sampleService.findByPhone(phone);
        if (sample) {
            return this.res.status(200).send(sample);
        } else {
            return this.res.status(404).send({ text: "not found" });
        }
    }

    // input -> routes/Sample.route.ts 참조. 
    public async create(): Promise<Response> {
        // const { text } = this.req.body as { text: string };
        // Sample.schemas.ts에서 따로 email의 입력 받는 틀을 잡아주면 아래의 코드를 사용할 수 있다.
        const { text, email,name, age, phone } = this.req.body as { text: string, email: string, name: string, age: number, phone: string};
        this.sample.text = text;
        this.sample.email = email; 
        this.sample.name = name;
        this.sample.age = age;
        this.sample.phone = phone;
        this.sample.token2 = crypto.createHash('sha256').update(timestamp+cid+phone).digest('base64');
        // 헤더(header) + 내용(payload) + 서명(signature) 부분을 timestamp + cid + phone 으로 함.
        try {
            const result = await this.sampleService.save(this.sample);
            return this.res.status(200).send(result);
        } catch (ex) {
            return this.res.status(404).send({ text: "ERROR" });
        }
    }

    // update -> routes/Sample.route.ts 참조.
    public async update(): Promise<Response> {
        const { id, text, email, name, age, phone  } = this.req.body as { id: number, text: string, email: string, name: string, age: number, phone: string };
        this.sample.id = id;
        this.sample.text = text;
        this.sample.email = email;
        this.sample.name = name;
        this.sample.age = age;
        this.sample.phone = phone;
        try {
            const sample = await this.sampleService.save(this.sample);
            if (sample) {
                // console.log(timestamp);
                return this.res.status(200).send();
            } else {
                return this.res.status(404).send({ text: "not found" });
            }
        } catch (ex) {
            return this.res.status(404).send({ text: "error" });
        }
    }

     // delete -> routes/Sample.route.ts 참조.
    public async delete(): Promise<Response> {
        const { id } = this.req.body as { id: number };
        try {
            await this.sampleService.removeById(id);
            return this.res.status(204).send();
        } catch (ex) {
            return this.res.status(404).send({ text: "ERROR" });
        }
    }

    // Tokendelete -> routes/Sample.route.ts 참조.
    public async Tokendelete(): Promise<Response> {
        const { token2 } = this.req.body as { token2: string };
        try {
            await this.sampleService.removeByToken(token2);
            return this.res.status(204).send();
        } catch (ex) {
            return this.res.status(404).send({ text: "ERROR" });
        }
    }

}
