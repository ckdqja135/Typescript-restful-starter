## services에 있는 코드와 repository에 있는 코드의 차이점에 대해.

### Sample.repository.ts
```typescript
import { EntityRepository, Repository } from "typeorm";
import { Sample } from "../models";

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
```
}

### Sample.service.ts
``` typescript
import { getCustomRepository } from "typeorm";
import { Sample } from "../models";
import { SampleRepository } from "../repository";

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
* A
```text
제가 이해하고 있는 바는 service layer 에는 비지니스 로직이 들어가고 
repository layer 에는 ORM을 활용한 Query문이 들어간다는 것입니다.
예를 들어 영화 예매시스템을 만든다고 했을때 단순히 한 repository 에 해당 Query가 실행 되는 것이 아니라
잔액 확인, 포인트 차감, 좌석 확인, 회원 확인등 다수의 repository + 다양한 비지니스 로직이 필요합니다.
이럴 경우 service layer = repository layer 일 경우는 비지니스 로직과 ORM 로직이 섞이고 
다른 비지니스 로직에서 ORM 을 재사용하기 어렵기 때문에
이러한 비지니스 로직은 service layer에 작성하고, 
세세한 ORM query는 repository layer 에 추가 되는 걸로 알고 있습니다.
```

* A
```text
repository는 기술적인 영역을 추상화하는데 사용합니다.
위에서는 manager를 통해 sql을 실행하는 역할을 하고 있네요. 
만약에 sql을 실행하는 모듈이 바뀌거나 sql이 아니라 네트워크로 바뀌더라도
repository 구현만 변경하는 식으로 결합도를 낮출 수 있습니다.
여기서 서비스는 사실상 dao나 다름없는 역할을 하고 있는 것으로 보여지네요.
특별한 기능이 없어서 그런 것일수도 있구요.
```
