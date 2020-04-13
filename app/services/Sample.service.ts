import { getCustomRepository } from "typeorm";
import { Sample } from "../models";
import { SampleRepository } from "../repository";

export class SampleService {

    public findByText(text: string): Promise<Sample[]> {
        return getCustomRepository(SampleRepository).findByText(text);
    }

    public findByEmail(email: string): Promise<Sample[]> {
        return getCustomRepository(SampleRepository).findByEmail(email);
    }

    public findByName(name: string): Promise<Sample[]> {
        return getCustomRepository(SampleRepository).findByName(name);
    }

    public findByAge(age: number): Promise<Sample[]> {
        return getCustomRepository(SampleRepository).findByAge(age);
    }

    public findByPhone(phone: string): Promise<Sample[]> {
        return getCustomRepository(SampleRepository).findByPhone(phone);
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

    public removeByToken(token2: string): Promise<Sample> {
        return getCustomRepository(SampleRepository).removeByToken(token2);
    }

    public save(sample: Sample): Promise<Sample> {
        return getCustomRepository(SampleRepository).save(sample);
    }

}
