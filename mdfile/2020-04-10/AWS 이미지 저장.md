# node.js에서 aws s3 스토리지에 이미지 저장하기

AWS에서 제공하는 S3 스토리지는 다양한 파일을 bucket에 보관할 수 있다. 자세한 내용은 [생활코딩 강의](https://opentutorials.org/course/608/3006) 참고하면 좋다. 

그럼 우선 aws sdk를 설치하여야 한다.

```typescript

npm i aws-sdk --save

```

그리고 AWS IAM에서 생성한 사용자가 있어야 한다. 사용자는 S3에 대한 권한을 가지고 있어야 한다.
<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile5.uf.tistory.com%2Fimage%2F9978213A5BB796F40340B6" width = 90%></img>
사용자를 생성하고 권한을 부여하는 기능은 어렵지 않기때문에 검색해서 적용하면 된다.

그리고 해당 사용자를 생성하면 csv 파일로 secretkey를 받을 수 있다. 
이를 AWS S3에 접근하여 사용하기 위해서 사용된다.

# 기본 정보가 담긴 config.json 생성
우선 부여 받은 사용자 accessKeyId와 secretAccessKey 그리고 지역정보가 담긴 config.json 파일을 만든다.
## config.json
```typescript
{
  "accessKeyId": "<accessKeyId>",
  "secretAccessKey": "<secretAccessKey>",
  "region": "ap-northeast-2"
}

```
그리고 aws-sdk 라이브러리를 로드하면서 위에 생성한 config.json 파일을 추가해준다. 
그리고 S3 객체의 경우 로드한 aws-sdk에서 new와 함께 s3() 메소드를 실행하여 만들 수 있다.

```typescript
'use strict';
 
const AWS = require('aws-sdk');
const path = require('path');
AWS.config.loadFromPath(path.join(__dirname, 'config.json'));
const S3 = new AWS.S3();

```

그리고 이미지 파일을 업로드 하기위해서 제공하는 메소드인 upload에는 bucket 이름, 파일의 고유 키, 파일이 담긴 Body, Body의 contentType 정보가 필요하다. 
나는 이미지를 올리려고 하기 때문에 contentType은 image/jpg로 하였다.

```typescript

  const params = {};
    params.Key = `image/${md5(url)}.jpg`;
    params.Bucket = bucket;
    params.Body = await request(url);
    params.contentType = 'image/jpg';

```
생성된 최종 코드는 다음과 같다.

```typescript

 'use strict';
 
const AWS = require('aws-sdk');
const path = require('path');
AWS.config.loadFromPath(path.join(__dirname, 'config.json'));
const S3 = new AWS.S3();
const md5 = require('md5');
const request = require('request-promise');
const bucket = 's3-buckets';
 
class AwsS3 {
 
  async upload(url)  {
    const params = {};
    params.Key = `image/${md5(url)}.jpg`;
    params.Bucket = bucket;
    params.Body = await request(url);
    params.contentType = 'image/jpg';
 
    S3.upload(params, function (err, data) {
      console.log(err);
      console.log(data);
    });
  }
 
}
 
module.exports = new AwsS3();

```

그리고 테스트 코드를 작성하여 동작 시켜보면 정상적으로 파일이 올라간것을 확인 할 수 있다.

```typescript

'use strict';
 
const s3 = require('../../lib/s3');
 
describe('s3 test', () => {
  it('upload', async () => {
    await s3.upload('http://ticketimage.interpark.com/Play/image/large/18/18009670_p.gif');
  });
});

```
<src img = "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=http%3A%2F%2Fcfile23.uf.tistory.com%2Fimage%2F994947355BB79755073013" width = 90%></img>

※ 이런 문제가 발생하면 config.json에 기재한 키 정보를 다시한번 확인해봐야한다.

```typescript
{ InvalidAccessKeyId: The AWS Access Key Id you provided does not exist in our records.
    at Request.extractError (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/services/s3.js:580:35)
    at Request.callListeners (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/sequential_executor.js:109:20)
    at Request.emit (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/sequential_executor.js:81:10)
    at Request.emit (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/request.js:683:14)
    at Request.transition (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/request.js:22:10)
    at AcceptorStateMachine.runTo (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at /Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/request.js:685:12)
    at Request.callListeners (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/sequential_executor.js:119:18)
    at Request.emit (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/sequential_executor.js:81:10)
    at Request.emit (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/request.js:683:14)
    at Request.transition (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/request.js:22:10)
    at AcceptorStateMachine.runTo (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at /Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/request.js:685:12)
    at Request.callListeners (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/sequential_executor.js:119:18)
    at callNextListener (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/sequential_executor.js:99:12)
    at IncomingMessage.onEnd (/Users/wedul/Documents/repository/nodejs/node_modules/aws-sdk/lib/event_listeners.js:294:13)
    at emitNone (events.js:111:20)
    at IncomingMessage.emit (events.js:208:7)
    at endReadableNT (_stream_readable.js:1064:12)
    at _combinedTickCallback (internal/process/next_tick.js:139:11)
    at process._tickDomainCallback (internal/process/next_tick.js:219:9)
  message: 'The AWS Access Key Id you provided does not exist in our records.',
  code: 'InvalidAccessKeyId',
  region: null,
  time: 2018-10-01T15:53:23.570Z,
  cfId: undefined,
  statusCode: 403,
  retryable: false,
  retryDelay: 32.0943451721504 }
  
  ```
  

# Reference
[참고자료](https://wedul.site/505)
[참고자료](https://www.npmjs.com/package/aws-sdk)
[참고자료](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html)
[참고자료](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html)
