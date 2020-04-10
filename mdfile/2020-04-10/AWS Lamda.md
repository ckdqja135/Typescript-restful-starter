# Typescript와 AWS Lambda로 모니터링에 유용한 API 패턴 구성하기

<img src ="https://miro.medium.com/max/2000/1*IpBul-jWnVtTU0LTPhY3yg.png" width="90%"></img>

람다를 크게 세 부분으로 나눕니다.
  * 사용자로부터 받은 데이터를 검증해주는 컨트롤러
  * 비즈니스로직을 구성하는 서비스
  * API나 데이터베이스와 연결되는 레파지토리
  
그럼 상품을 구매하는 Shop 예제를 통해 차근차근 보겠습니다.

# Shop예제
## shop.ts
```typescript
const repo: ShopRepository = new ShopRepository();
const service: ShopService = new ShopService(repo);
const controller: ShopController = new ShopController(service);

export const purchaseItem = controller.purchaseItem
```
위 이미지처럼 컨트롤러는 생성자로 서비스를, 서비스는 생성자로 레파지토리를 가지고있고 handler 메서드를 export하는형태로 구성되어있습니다.

# 컨트롤러에서 검증하기
## ShopController1.ts 
```typescript
export class ShopController {

    /* 생성자로 서비스를 가지고있습니다.*/
    public constructor(private readonly _service: ShopService) {

    }


    public purchaseItem: APIGatewayProxyHandler = async (event, context) => {

        /* QueryString을 검증합니다. */
        if (
            event.queryStringParameters &&
            event.queryStringParameters.userId &&
            event.queryStringParameters.itemId
        ) {

            const {userId, itemid} = event.queryStringParameters

            const apiGatewayResult = await this._service.purchaseItem(userId, itemid).then((user: User) => {
                /* 성공한경우 Proxy에 맞게 데이터를 리턴해줍니다.*/
            }).catch((err: ErrorType) => {
                /* 에러에대한 처리*/
            })

            return apiGatewayResult

        } else {
            return {statusCode: 400, body: JSON.stringify("잘못된 요청입니다.")}

        }
    }

}
```
**Lambda**에서 최상위 **Handler**의 역활을 하는것이 컨트롤러입니다. 
요청받은 **queryString**이나 **JSON**데이터가 올바른 형식인지를 검증하고 문제가 없다면 서비스에 파라미터로 전달합니다.
**PurchaseItem** 메서드로 **event**객체를 통해 **queryStringParamter**를 받습니다. 
이 때 요청한 형식이 올바르게 요청했는지를 검증한 후 그렇지 않다면 400에러를 요청을 제대로 하였다면 
생성자로 가지고있던 **Service**의 **purchaseItem**으로 전달됩니다.

# 서비스로 로직 처리하기
## ShopService.ts 
```typescript
export class ShopService {

    public constructor(private readonly _repo: ShopRepository) {

    }

    public async purchaseItem(userId: string, itemId: string): Promise<User> {
        const user = this._repo.getUser(userId)
        const product = this._repo.getItemDetail(itemId)

        /* 유저정보가 없다면 */
        if (!user) throw ErrorType.NO_USERDATA

        /* 상품정보가 없다면 */
        if (!product) throw ErrorType.NO_PRODUCT_DATA

        /*포인트가 부족하다면 */
        if (user.point < product.price) throw ErrorType.INSUFFICENT_POINT

        /* 유저의 포인트 정보를 업데이트합니다. */
        user.point = (user.point - product.price)
        const isSuccessUser = this._repo.updateUser(user)

        /* 유저정보를 업데이트하는데 실패한다면 */
        if (!isSuccessUser) throw ErrorType.FAIL_UPDATE_USER

        return user

    }

}
```

**Controller**로부터 인자를 받은 서비스에서는 데이터를 레포지토리를 통해 검증합니다. 
예를들어 요청한 사용자가 실제 존재하는 사용자인지 혹은 실제 상품정보가 있는지 그리고 구매할려는 상품과 비교하여 포인트가 충분한지등입니다.

# 레파지토리로 데이터 가져오기
## ShopRepositrory.ts
```typescript
export class ShopRepository {
    public getUser(userId: string): User | null {

        /* Database를 통해 유저를 가져오는 코드*/
        return null
    }

    public getItemDetail(itemId: string): ShopItem | null {
        /* Database를 통해 상품정보를 가져오는 로직을 처리*/
        return null
    }


    public updateUser(user: User): boolean {

        /* 유저의 구매정보를 업데이트 하는 로직을 처리*/
        return true
    }
}
```

데이터베이스 혹은 **API**와 통신하는 **Repository**는 되도록 작은 단위로 쪼개는편이 재사용성에 좋습니다. 
예를 들어 유저의 정보를 가져오고 업데이트한다면 유저정보를 가져와 업데이트 하는것보다 
유저정보를 가져오는 부분 업데이트 하는부분을 쪼개어 다른 서비스 메서드 등에서도 사용할 수 있도록하면 좋습니다. 
(물론 트랜잭션처리가 필요하다면 묶어서 작업합니다)

# 컨트롤러 에러처리
## ShopController.ts
```typescript
export class ShopController {

    public constructor(private readonly _service: ShopService) {

    }

    public purchaseItem: APIGatewayProxyHandler = async (event, context) => {
        if (
            event.queryStringParameters &&
            event.queryStringParameters.userId &&
            event.queryStringParameters.itemId
        ) {

            const {userId, itemid} = event.queryStringParameters

            const apiGatewayResult = await this._service.purchaseItem(userId, itemid).then((user: User) => {
                /* 성공한경우 Proxy에 맞게 데이터를 리턴해줍니다.*/
                return {
                    statusCode: 200,
                    body: JSON.stringify("data no")
                }
            }).catch((err: ErrorType) => {
                switch (err) {
                    case ErrorType.FAIL_UPDATE_USER:
                        return {statusCode: 500, body: JSON.stringify("유저정보를 업데이트할 수 없습니다.")}
                    case ErrorType.INSUFFICENT_POINT:
                        return {statusCode: 400, body: JSON.stringify("포인트가 부족합니다.")}
                    case ErrorType.NO_PRODUCT_DATA:
                        return {statusCode: 404, body: JSON.stringify("상품정보를 찾을 수 없습니다.")}
                    case ErrorType.NO_USERDATA:
                        return {statusCode: 404, body: JSON.stringify("유저정보를 찾을 수 없습니다.")}
                    default:
                        /* unhandled 에러에대한 로그를 console.log 혹은 슬랙등을 통해 따로 처리*/
                        return {statusCode: 500, body: JSON.stringify("서버에서 처리할 수 없는 에러입니다. ")}
                }
            })

            return apiGatewayResult

        } else {
            return {statusCode: 400, body: JSON.stringify("잘못된 요청입니다.")}

        }
    }
}
```
조금 전 서비스 코드를보면 데이터에 문제가 있을때 **Throw Error**를통해 컨트롤러의 **Catch**에서 처리하도록 위임합니다. 
이때 받은 에러의 유형을 **Enum**값으로 분류하여 에러의 유형에 맞게 상태코드와 메세지를 리턴합니다. 
만약 핸들링할 수 없는 에러라면 에러로그를 **Console**등으로 기록하여 클라우드와치에서 관리할 수 있어야합니다.

# 에러모니터링
<img src = "https://miro.medium.com/max/1400/1*zxCbxx7pU04OGB5rgXt-1Q.png" width = 90%></img>

상태코드를 잘활용하면 **X-RAY**를 통해서도 모니터링 할 수 있고 **VPC FLows** 와 같은 서비스를 통해서도 문제상황을 알 수 있습니다. 
예를들어 실수로 상품정보나 유저정보 등이 삭제되었지만 배너를 통해서 계속 요청이 들어올 때 
간헐적으로 발생한다면 운영할 때 문제를 알아차리기 쉽지 않지만 **StatusCode**별로 모니터링한다면 
갑작스레 **404**에러나 **500**에러등이 급증하는것을 기반으로 요청에 문제가 생겼다는것을 알 수 있습니다.

<img src = "https://miro.medium.com/max/1400/1*NGFxQ9-xAZN3HhI-y4Ji7g.png" width=90%></img>

# 서비스 테스트코드 작성
## shop.service.spec.ts
```typescript

describe('ShopService', () => {

    const shopRepoMock = mock(ShopRepository)
    const shopRepoMockInstance = instance(shopRepoMock)

    let service:ShopService
    beforeEach(() => {
        /* 테스트 전 주입해주기*/
        reset(shopRepoMockInstance)
        service = new ShopService(shopRepoMockInstance)

    })

    it("ShopService", async () => {

    })
})

```

서비스에서는 [ts-mockito](https://www.npmjs.com/package/ts-mockito)라는 테스트라이브러리를 사용하였습니다.

아무래도 자바테스트코드를 짜다보면 **mochito**라는 테스트라이브러를 많이사용해서 선택하게되었는데 컨트롤러를 테스트할때는 몇가지 문제가 있습니다. 
이 부분은 차후 설명하겠습니다. 레파지토리 클래스를 **Mocking**한 후 인스턴스를 만들어 서비스에 주입해줍니다. 
서비스를 테스트할때 **Repository**에 대한 의존성 없이 하기 위함인데
만약 **Repository**에서 리턴해야하는 데이터가 필요하다면 아래와같은 형태로 미리 정의해줍니다.

```typescript

when(repository.getUser).thenReturn(리턴할데이터);

```

반대로 **repository**로 전달한 인자에대한 데이터를 검증하고싶다면 **capture**를 사용합니다.

```typescript

capture(repository.getUser).last()

```
위 코드는 **Service**에서 **Repository**의 **getUser**로 전달한 파라미터의 마지막 값을 가져옵니다.

# 컨트롤러 테스트코드 작성

**ts-mochito**는 **interface**를 **mocking**할 수 없는데 콜백등을 활용하여 비슷하게 구현하거나 혹은 **Lambda-mock**등과 같은 라이브러를 사용해볼 수 있지만
필자는 **TypeMoq**이라는 라이브러리를 이용하였습니다.

## ShopController.spec.ts
```typescript
describe('ShopController Test', () => {


    const shopServiceMock = mock(ShopService)
    const shopServiceMockInstance = instance(shopServiceMock)
    let controller: ShopController

    /* 매 테스트마다 새로운 Controller가 생성되도록 합니다.*/
    beforeEach(() => {
        reset(shopServiceMockInstance)
    })

    /* 필요한 event값을 주지않아 404 에러가 나도록 합니다. */
    it("it should return 400 Error Code", async () => {

        /* ProxyEvent를 Mocking합니다.*/
        const proxyEvent = TypeMoq.Mock.ofType<APIGatewayProxyEvent>()
        
        /* queryStringParamters의 값을 지정해줍니다. */
        proxyEvent.object.queryStringParameters = {"userId": "harry"}
        
        /* Context를 Mocking합니다. */
        const contextMock = TypeMoq.Mock.ofType<Context>()
        
        
        controller.purchaseItem(proxyEvent.object, TypeMoq.Mock.ofType<Context>().object, (status, result) => {
            /* 데이터검증*/    
        })

    })
})
```
[typemoq](https://github.com/florinn/typemoq)는 **interface**를 사용하여 **Mocking**할 수 있는 오브젝트를 생성해줍니다. 
또한 미리 원하는값으로 오버라이딩할 수 있습니다.

# 마치며
**Lambda**의 **ProxyHander**혹은 **DynamoDB Stream Handler**를 **Mocking**하는 방법에 대해서는 되도록 위처럼 여러가지의 라이브러리를 혼용하는 방법은 유지보수면에서 좋지 않을 것 같습니다. 
타입스크립트에대한 내공이 많이 부족하여 조금 더 매끄럽게 테스트코드를 처리할 수 있는 방법에대한 공부가 필요할것같습니다.

위와 같이 되도록 **StatusCode**로 에러를 분기하고 **StatusCode**로 모니터링하는 방법은 문제가 생기고있지만 에러가 나지않아 모니터링되지않는 문제점들을 찾는데 유용합니다.










# Reference 
[참고자료](https://medium.com/harrythegreat/typescript%EC%99%80-aws-lambda%EB%A1%9C-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81%EC%97%90-%EC%9C%A0%EC%9A%A9%ED%95%9C-api-%ED%8C%A8%ED%84%B4-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0-98a7f0232cb6)
