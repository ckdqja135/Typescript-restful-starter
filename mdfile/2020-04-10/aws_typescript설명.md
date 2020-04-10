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
  
  4. <code>npm</code>을(를) 설치하려면 먼저 다음 명령을 실행하여 노드 버전 관리자(<code>nvm</code>)를 다운로드하십시오.
     (<code>nvm</code>)는 노드.js 버전을 설치하고 관리하는 데 유용한 간단한 Bash 셸 스크립트입니다. 
     자세한 내용은 GitHub 웹 사이트의 [노드 버전 관리자](https://github.com/nvm-sh/nvm/blob/master/README.md)를 참조하십시오.)







