### 서비스에서 인자로 전달받은 EntityManager를 통해 쿼리를 수행한다.

# Controller.ts
### index
```typescript
import { SampleRepository } from "./Sample.repository";
export { SampleRepository };
```

# Sample.repository.ts
### 실행되는 쿼리들 
```typescript
@EntityRepository(Sample)
export class SampleRepository extends Repository<Sample> {

    public bulkCreate(Samples: Sample[]): Promise<any> {
        return this.manager.createQueryBuilder().insert().into(Sample).values(Samples).execute();
    }

    public async removeById(id: number): Promise<Sample> {
        const itemToRemove: Sample = await this.findOne({id});
        return this.manager.remove(itemToRemove);
    }

    public findByText(text: string): Promise<Sample[]> {
        return this.manager.find(Sample, {where: {text}});
    }

    public findOneById(id: number): Promise<Sample> {
        return this.manager.findOne(Sample, {where: {id}});
    }

}
```
