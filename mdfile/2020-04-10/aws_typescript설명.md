# AWS Cloud9 용 TypeScript 샘플

이 샘플은 **AWS Cloud9** 개발 환경에서 **TypeScript**를 사용하는 방법을 보여줍니다.

이 샘플을 생성하면 AWS 계정에 요금이 부과 될 수 있습니다. 여기에는 Amazon EC2 및 Amazon S3와 같은 서비스에 대한 가능한 요금이 포함됩니다. 
자세한 내용은 [Amazon EC2 요금](https://aws.amazon.com/ko/ec2/pricing/)을 참조하십시오. 및 [Amazon S3 요금](https://aws.amazon.com/ko/s3/pricing/).

## 목차
> * 전제 조건
> * 1 단계 : 필요한 도구 설치
> * 2 단계 : 코드 추가
> * 3 단계 : 코드 실행
> * 4 단계 : Node.js에서 AWS SDK for JavaScript 설치 및 구성
> * 5 단계 : AWS SDK 코드 추가
> * 6 단계 : AWS SDK 코드 실행
> * 7 단계 : 정리

# 전제 조건
이 샘플을 사용하기 전에 다음 요구 사항을 충족해야합니다.

* **기존 AWS Cloud9 EC2 개발 환경이 있어야합니다.** <br />
이 샘플에서는 Amazon Linux 또는 Ubuntu Server를 실행하는 Amazon EC2 인스턴스에 연결된 EC2 환경이 이미 있다고 가정합니다. 
다른 유형의 환경 또는 운영 체제가있는 경우 관련 도구를 설정하기 위해이 샘플의 지시 사항을 조정해야합니다.
자세한 내용 은 [AWS Cloud9에서 환경 생성](https://docs.aws.amazon.com/cloud9/latest/user-guide/create-environment.html) 을 참조하십시오.

* **기존 환경에 대한 AWS Cloud9 IDE가 이미 열려 있습니다.** <br />
환경을 열면 AWS Cloud9가 웹 브라우저에서 해당 환경에 대한 IDE를 엽니다. 
자세한 내용은 [AWS Cloud9에서 환경 열기](https://docs.aws.amazon.com/cloud9/latest/user-guide/open-environment.html) 를 참조하십시오.

# 1 단계 : 필요한 도구 설치

이 단계에서는 Node Package Manager (<code>npm</code>)를 사용하여 TypeScript를 설치 합니다. 
code>npm</code>을 설치하려면 Node Version Manager (<code>nvm</code>)를 사용하십시오. 
<code>nvm</code>이없는 경우 먼저이 단계에서 설치하십시오.

  1. AWS Cloud9 IDE의 터미널 세션에서 <code>--version</code>옵션 과 함께 명령 줄 TypeScript 컴파일러를 실행하여 TypeScript가 이미 설치되어 있는지 확인하십시오 . <br />
  새 터미널 세션을 시작하려면 메뉴 표시 줄에서 Window , New Terminal을 선택하십시오 . 성공하면 출력에 TypeScript 버전 번호가 포함됩니다. TypeScript가 설치된 경우 [2 단계 : 코드 추가](https://docs.aws.amazon.com/cloud9/latest/user-guide/sample-typescript.html#sample-typescript-code)로 건너 뜁니다 . 

  ```typescript

    tsc --version

  ```

  2. <code>--version </code>옵션으로 실행하여 <code>npm</code>이 이미 설치되어 있는지 확인 하십시오. 
  성공하면 출력에 <code>npm</code>버전 번호가 포함됩니다. 
  <code>npm</code>가 설치되어 있으면 이 절차의 10단계로 건너뛰어 <code>npm</code>을 사용하여 TypeScript를 설치하십시오.

  ```typescript

    npm --version

  ```
  
  3. (Amazon Linux)에 대한 <code>yum update</code> 또는 (Ubuntu Server) 명령에 대한 <code>apt update</code>를 실행하여 최신 보안 업데이트 및 버그 수정을 설치하십시오.

*  Amazon Linux의 경우 :
  ```typescript

    sudo yum -y update

  ```
*  우분투 서버의 경우 :
  ```typescript

    sudo apt update

  ```
  
  4. <code>npm</code>을(를) 설치하려면 먼저 다음 명령을 실행하여 노드 버전 관리자(<code>nvm</code>)를 다운로드하십시오. <br />
     (<code>nvm</code>)는 노드.js 버전을 설치하고 관리하는 데 유용한 간단한 Bash 셸 스크립트입니다. <br />
     자세한 내용은 GitHub 웹 사이트의 [노드 버전 관리자](https://github.com/nvm-sh/nvm/blob/master/README.md)를 참조하십시오.)
  ```typescript

   curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash

  ```

  5. <code>nvm</code> 사용을 시작하려면 터미널 세션을 닫고 다시 시작하거나,<code>nvm</code>을 로드하는 명령이 포함된 <code>~/.bashrc</code> 파일을 소스화하십시오.
  ```typescript

    . ~/.bashrc

  ```

  6. <code>--version</code> 옵션을 사용하여 <code>nvm</code>을 실행하여 <code>nvm</code>이(가) 설치되었는지 확인하십시오.
  ```typescript

     nvm --version

   ```
  
  7. <code>nvm</code>을 실행하여 최신 버전의 Node.js를 설치하십시오(<code>npm</code>은 Node.js에 포함됨).
  ```typescriptz

     nvm install node

   ```
  
  8. <code>--version</code> 옵션을 사용하여 Node.js의 명령줄 버전을 실행하여 Node.js가 설치되었는지 확인하십시오.
  
   ```typescript

     node --version

   ```
  
  9. <code>--version</code> 옵션을 사용하여 <code>npm</code>을 실행하여 <code>npm</code>이(가) 설치되었는지 확인하십시오.
  
   ```typescript

     npm --version

   ```
     
  10. <code>-g</code> 옵션으로 <code>npm</code> 을 실행하여 TypeScript를 설치하십시오. 
  이것은 환경에 TypeScript를 글로벌 패키지로 설치합니다.
   ```typescript

     npm install -g typescript

   ```
    
  11. 명령줄 TypeScript 컴파일러를 <code>-version</code> 옵션으로 실행하여 TypeScript가 설치되었는지 확인하십시오.
    
  ```typescript

    tsc --version

  ```  
  
# 2 단계 : 코드 추가

  1. AWS Cloud9 IDE에서라는 파일을 생성하십시오 <code>hello.ts</code>. <br />
  (파일을 만들려면 메뉴 막대에서 **파일** , **새 파일**을 선택 하십시오 . 파일을 저장하려면 **파일 , 저장**을 선택 하십시오 .)
  
  2. IDE의 터미널에서 <code>hello.ts</code> 파일과 동일한 디렉토리에서 <code>npm</code>을 실행하여 <code>@types/node</code> 라이브러리를 설치하십시오.
```typescript

    npm install @types/node

```  

  이로써 <code>hello.ts</code> 파일과 동일한 디렉토리에 <code>node_modules/@types/node</code> 폴더가 추가됩니다.
  이 새 폴더에는 나중에 <code>hello.ts</code> 파일에 추가할 <code>console.log</code> 및 <code>process.argv</code> 속성에 대해 TypeScript에 필요한 Node.js 유형 정의가 포함되어 있습다.
  
  3. <code>hello.ts</code> 파일에 다음 코드를 추가하십시오.
  ```typescript

    console.log('Hello, World!');

    console.log('The sum of 2 and 3 is 5.');

    const sum: number = parseInt(process.argv[2], 10) + parseInt(process.argv[3], 10);

    console.log('The sum of ' + process.argv[2] + ' and ' +
      process.argv[3] + ' is ' + sum + '.');
      
  ```  
  
# 3 단계 : 코드 실행

  1. 터미널에서 <code>hello.ts</code> 파일과 동일한 디렉토리에서 TypeScript 컴파일러를 실행합니다. 
  포함할 <code>hello.ts</code> 파일과 추가 라이브러리를 지정합니다.
      
  ```typescript

    tsc hello.ts --lib es6

  ```  
  TypeScript는 <code>hello.ts</code> 파일과 일련의 ECMAScript 6(ES6) 라이브러리 파일을 사용하여 <code>hello.ts</code> 파일의 TypeScript 코드를 <code>hello.ks</code>라는 파일에 해당하는 JavaScript 코드로 변환합니다.
  
  2. **환경** 창에서 <code>hello.js</code> 파일을 엽니다.
  
  3. 메뉴 모음에서 **실행**, **실행 구성**, **새 실행** **구성**을 선택합니다.
  
  4. [New] - Idle탭에서 Runner:자동을 선택한 다음 Node.js를 선택합니다.
  
  5. 명령에 <code>hello.js</code> 5 9를 입력합니다. 
  코드에서 <code>5</code>는 <code>process.argv[2]</code>를 나타내고 <code>9</code>는 <code>process.argv[3]</code>을 나타냅니다. 
  (<code>process.argv[0]</code>은 런타임(<code>노드</code>)의 이름을 나타내고 <code>process.argv[1]</code>은 파일 이름(<code>hello.js</code>)을 나타냅니다.
  
  6. **실행**을 선택하고 출력을 비교합니다. 완료되면 **중지**를 선택합니다.
  
  ```text
  
  Hello, World!
  The sum of 2 and 3 is 5.
  The sum of 5 and 9 is 14.

  ```
  
  <img src= "https://docs.aws.amazon.com/cloud9/latest/user-guide/images/ide-nodejs-simple.png" width = 90%></img>
  
   * IDE에서 새 실행 구성을 생성하는 대신 터미널에서 <code>hello.js</code> 5 9 명령 노드를 실행하여 이 코드를 실행할 수도 있습니다.
  
  
# 4 단계 : Node.js에서 AWS SDK for JavaScript 설치 및 구성

Node.js에서 AWS SDK for JavaScript를 사용하여 Amazon S3 버킷을 생성하고 사용 가능한 버킷을 나열한 다음 방금 생성 한 버킷을 삭제하도록이 샘플을 향상시킬 수 있습니다.

이 단계에서는 Node.js에서 AWS SDK for JavaScript를 설치하고 구성합니다. 
SDK는 JavaScript 코드에서 Amazon S3와 같은 AWS 서비스와 편리하게 상호 작용할 수있는 방법을 제공합니다. 
Node.js에 JavaScript 용 AWS SDK를 설치 한 후 환경에서 자격 증명 관리를 설정해야합니다. 
SDK는 AWS 서비스와 상호 작용하려면 이러한 자격 증명이 필요합니다.
  
# Node.js에서 AWS SDK for JavaScript를 설치하려면

AWS Cloud9 IDE의 터미널 세션에서 [3단계: 코드 실행](https://docs.aws.amazon.com/cloud9/latest/user-guide/sample-typescript.html#sample-typescript-run)의 <code>hello.js</code> 파일과 동일한 디렉토리에서 npm을 실행하여 Node.js에 JavaScript용 AWS SDK를 설치합니다.  
  
```typescript

npm install aws-sdk

```

이 명령은 [3단계: 코드 실행](https://docs.aws.amazon.com/cloud9/latest/user-guide/sample-typescript.html#sample-typescript-run)의 <code>node_modules</code> 폴더에 여러 폴더를 추가합니다. 
이러한 폴더에는 Node.js의 JavaScript용 AWS SDK에 대한 소스 코드 및 종속성이 포함되어 있습니다. 자세한 내용은 AWS SDK for JavaScript 개발자 가이드에서 [SDK for JavaScript 설치](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/installing-jssdk.html)를 참조하시기 바랍니다. 
  
# 환경에서 자격 증명 관리를 설정하려면
Node.js에서 AWS SDK for JavaScript를 사용하여 AWS 서비스를 호출 할 때마다 호출과 함께 자격 증명 세트를 제공해야합니다. 
이 자격 증명은 Node.js의 AWS SDK for JavaScript가 해당 호출을 수행 할 수있는 적절한 권한을 가지고 있는지 여부를 결정합니다. 
자격 증명에 적절한 권한이 없으면 통화가 실패합니다.

이 단계에서는 환경 내에 자격 증명을 저장합니다. 
이렇게하려면 [AWS Cloud9 환경에서 AWS 서비스 호출](https://docs.aws.amazon.com/cloud9/latest/user-guide/credentials.html)의 지침을 따른 다음이 주제로 돌아갑니다.

자세한 내용 은 AWS SDK for JavaScript 개발자 안내서의 [Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html)에서 [자격 증명 설정](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html)을 참조하십시오 .  

# 5 단계 : AWS SDK 코드 추가
이 단계에서는 코드를 추가합니다. 
이번에는 Amazon S3와 상호 작용하여 버킷을 생성하고 사용 가능한 버킷을 나열한 다음 방금 생성 한 버킷을 삭제합니다. 
나중에이 코드를 실행합니다.
  
  1. AWS Cloud9 IDE는 이전 단계의 <code>hello.js</code> 파일과 동일한 디렉토리에 <code>s3.ts</code>라는 파일을 생성합니다.
  
  2. AWS Cloud9 IDE의 터미널에서 <code>s3.ts</code> 파일과 동일한 디렉토리에 있는 코드가 <code>npm</code>을 두 번 실행하여 TypeScript용 비동기 라이브러리와 JavaScript용 비동기 라이브러리를 설치하여 Amazon S3 작업을 비동기식으로 호출하도록 설정합니다.
  
  ```typescript
  
  npm install @types/async # For TypeScript.
  npm install async        # For JavaScript.
  
  ```
  
  3. <code>s3.ts</code> 파일에 다음 코드를 추가합니다.
   ```typescript
  
  import * as async from 'async';
  import * as AWS from 'aws-sdk';

  if (process.argv.length < 4) {
    console.log('Usage: node s3.js <the bucket name> <the AWS Region to use>\n' +
      'Example: node s3.js my-test-bucket us-east-2');
    process.exit(1);
  }

  const AWS = require('aws-sdk'); // To set the AWS credentials and AWS Region.
  const async = require('async'); // To call AWS operations asynchronously.

  const s3: AWS.S3 = new AWS.S3({apiVersion: '2006-03-01'});
  const bucket_name: string = process.argv[2];
  const region: string = process.argv[3];

  AWS.config.update({
    region: region
  });

  const create_bucket_params: any = {
    Bucket: bucket_name,
    CreateBucketConfiguration: {
      LocationConstraint: region
    }
  };

  const delete_bucket_params: any = {
    Bucket: bucket_name
  };

  // List all of your available buckets in this AWS Region.
  function listMyBuckets(callback): void {
    s3.listBuckets(function(err, data) {
      if (err) {

      } else {
        console.log("My buckets now are:\n");

        for (let i: number = 0; i < data.Buckets.length; i++) {
          console.log(data.Buckets[i].Name);
        }
      }

      callback(err);
    });
  }

  // Create a bucket in this AWS Region.
  function createMyBucket(callback): void {
    console.log("\nCreating a bucket named '" + bucket_name + "'...\n");

    s3.createBucket(create_bucket_params, function(err, data) {
      if (err) {
        console.log(err.code + ": " + err.message);
      }

      callback(err);
    });
  }

  // Delete the bucket you just created.
  function deleteMyBucket(callback): void {
    console.log("\nDeleting the bucket named '" + bucket_name + "'...\n");

    s3.deleteBucket(delete_bucket_params, function(err, data) {
      if (err) {
        console.log(err.code + ": " + err.message);
      }

      callback(err);
    });
  }

  // Call the AWS operations in the following order.
  async.series([
    listMyBuckets,
    createMyBucket,
    listMyBuckets,
    deleteMyBucket,
    listMyBuckets
  ]);
  
  ```

# 6 단계 : AWS SDK 코드 실행
  1. 터미널에서 <code>s3.ts</code> 파일과 동일한 디렉토리에서 TypeScript 컴파일러를 실행합니다. 
     포함할 <code>s3.ts</code> 파일과 추가 라이브러리를 지정합니다.
     
  ```typescript
  
  tsc s3.ts --lib es6
  
  ```
  
  TypeScript는 <code>s3.ts</code> 파일, Node.js의 AWS SDK for JavaScript, 비동기 라이브러리 및 일련의 ECMAScript 6(ES6) 라이브러리 파일을 사용하여 <code>s3.ts</code> 파일의 TypeScript 코드를 <code>s3.js</code>라는 파일의 동등한 JavaScript 코드로 변환합니다.
  
  2. 환경 창에서 <code>s3.js</code> 파일을 엽니다.
  
  3. 메뉴 모음에서 **실행**, **실행 구성**, **새 실행 구성**을 선택합니다.
  
  4. **[New]** - **Idle** 탭에서 **Runner:자동**을 선택한 다음 **Node.js**를 선택합니다.
  
  5. **명령**에 <code>s3.js YOUR_BUKET_NAME THE_AWS_REGION</code>을 입력합니다. 
  여기서 <code>YOUR_BUKet_NAME</code>은 생성 후 삭제하려는 버킷의 이름이고, <code>THE_AWS_REGION</code>은 버킷을 생성할 AWS 영역의 ID입니다. 
  예를 들어, 미국 동부(오하이오) 지역의 경우 <code>us-east-2</code>를 사용합니다. 
  자세한 ID는 Amazon Web Services General Reference에서 [Amazon Simple Storage Service(Amazon S3)](https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region) 참조하시기 바랍니다.
  * Note
  Amazon S3 버킷 이름은 AWS 계정뿐만 아니라 AWS 전체에서 고유해야 합니다.
  
  6. Choose **Run**, and compare your output. When you're done, choose **Stop**.
  
  ```text
  
  My buckets now are:

  Creating a new bucket named 'my-test-bucket'...

  My buckets now are:

  my-test-bucket

  Deleting the bucket named 'my-test-bucket'...

  My buckets now are:

  ```

# 7 단계 : 정리
이 샘플을 사용한 후 **AWS**계정에 계속 청구되는 것을 방지하려면 환경을 삭제해야합니다. 
지침은 [AWS Cloud9에서 환경 삭제](https://docs.aws.amazon.com/cloud9/latest/user-guide/delete-environment.html)를 참조하십시오.

# Refrence
[참고자료](https://docs.aws.amazon.com/cloud9/latest/user-guide/sample-typescript.html)
