# Typescript와 Express로 재밌는 무언가를 만들어보자!
<p align = "center"><img src = "https://media.vlpt.us/post-images/k7120792/4bbe13c0-b21b-11e9-96da-c15ea9685bb4/ts-express.png" width = 90%></img></p>

# 서론
안녕하세요! Medium에서 글을 쓰다가 코드는 안예뻐쁘고, github gist를 쓰기엔 귀찮아서 velog로 찾아온 사람입니다. <br />

이상한 소리는 집어치우고, 서론이지만 본론으로 들어가봅시다. 저는 원래 Typescript(I love TS)와 React를 좋아하는 프론트엔드 개발자였습니다.
하지만 모든 개발자들이 그러하듯이 풀스택!!!의 꿈을 가지고 Node.js를 시작하게 되었습니다. <br />

하지만 프론트엔드 개발만 해왔던 저로서는 이것저것 새로운 개념이 배우기가 너무 어려웠습니다. <br />
그래서 제가 겪었던 의문들과 삽질들을 다른 분들께서는 하지 않고 꽃길만 걷길 바라는 마음에서 이번 포스트를 작성하게 되었습니다. <br />
그래서 포스트는 백엔드, Typescript, Express가 낯선 사람들을 위해서 상세하게 작성할 예정입니다. <br />

본론으로 돌아와서 이번 포스트에서는 Express와 ES6를 가지고 프로젝트를 하려고 했지만 프론트엔드 개발에서 경험했던 Typescript가 너무 좋아서 Express + Typescript라는 기술 스택을 이번 포스트에서 다루게 되었습니다. <br />

# What would we do?
그래서 어떤 프로젝트를 할 예정이냐? 바로 제가 예전부터 하고 싶었던 크롤러를 만들 것입니다. <br />
대한민국의 1등 포털사이트 네이버의 실시간 검색어를 크롤링할 계획입니다. <br />
크롤링에서 그치지 않고, mongoDB에 저장하고, 로깅을 통해서 우리의 서버가 어떻게 살아가고 있는지 알아봅시다. <br />
그리고 유닛 테스트까지 경험해봅시다! <br />

사용할 모듈
> 1. [express](http://expressjs.com/) - Node.js 서버 어플리케이션을 쉽게 만들기위한 프레임워크 <br />
> 2. [cheerio](https://cheerio.js.org/) - 웹 페이지에서 정보를 가져오기 위한 HTML, XML문서 파싱 라이브러리 <br />
>                                         네이버에서 실시간 검색어 데이터를 가져오는 것을 도와준다. <br />
> 3. [winston](https://github.com/winstonjs/winston) - 서버의 동작을 기록하기 위한 로깅 라이브러리 <br />
> 4. [typescript](https://www.typescriptlang.org/) - 자바스크립트와 다른 아름다운 존재. <br />
> 5. [tslint](https://palantir.github.io/tslint/) - 타입스크립트를 위한 린터(문법, 스타일을 검사해주는 도구) <br />
>                                                   Typescipt의 문법뿐만 아니라 코드 스타일(띄어쓰기, 탭 크기 등)까지 검사해주는 편리한 도구. 
> 6. [dotenv](https://github.com/motdotla/dotenv#readme) - Node.js 어플리케이션에서 환경변수를 사용하기 위한 모듈 <br />
>             .env 파일에서 환경변수를 가져와 process.env의 프로퍼티로 사용할 수 있게 만들어준다. 서버에서 민감한 정보(포트번호, DB주소 등)를 한 곳에서 관리할 수 있게 만들어준다. <br />
> 7. [jest](https://jestjs.io/) - 자바스크립트 테스팅 프레임워크 <br />
>                                 테스트를 하기 위해 필요하다.
> 8. @types/~ - Typescript를 사용할 때 기존 자바스크립트 라이브러리를 효과적으로 사용하기 위해서 필요한 타입 정의를 해둔 모듈 <br />

# It's time to play!
먼저 프로젝트를 시작하기 이전에 프로젝트를 진행할 디렉토리에서 커맨드 창을 열어서 npm 패키지들을 사용할 준비를 해봅시다!
```typescript

  C://projects/my-first-ts-express-croller
  > npm init -y // npm init을 했을 때 모든 옵션이 y로 체크되는 옵션

```
<code>npm init</code>을 했을 때 새로운 폴더가 생기는 게 아니라 기존의 폴더에 <code>package.json</code>파일이 생기기 때문에 정확히 프로젝트를 담을 폴더를 새로 생성해주시고 그 폴더 내에서 명령어를 입력해주셔야 합니다. 
이제 npm 패키지들을 설치할 준비가 끝났으니 설치할 시간입니다! 위에서 우리가 쓰기로 한 패키지들을 하나씩 설치해봅시다.

```typescript

  C://projects/my-first-ts-express-croller
  > npm install cheerio express mongoose winston dotenv

```

왜 이번에 위에서 사용하기로 언급한 모듈들을 모두 설치하지 않았을까요? <br />
바로 모듈에는 dependency와 devDependency 이렇게 두 가지 종류가 있기 때문입니다. <br />
dependency로 설치된 모듈들은 실제 배포 단계에서 포함되지만 devDependency로 설치된 모듈들은 빠지게 됩니다. <br />
따라서 배포하게 되었을 때 빌드된 파일의 크기에 큰 영향을 주게 됩니다. <br />
<br />
그렇다면 devDependency로 설치하게 되는 모듈들은 어떤 모듈들일까요? 바로 테스트에 필요하거나, 로컬 개발 환경에서만 필요한 모듈들이죠. <br />
가장 흔한 예시가 바로 테스트에 필요한 jest, mocha, jasmine 같은 모듈들부터 우리가 개발할 Typescript도 마찬가지죠. <br />
개발하는 과정에서는 Typescript이지만 실제로 구동되는 것은 컴파일된 결과인 js 파일이니까요. <br />
따라서 @types/~ 모듈들도 마찬가지겠죠? 그리고 마지막으로 코드의 형식을 검사해주는 린터까지! <br />
이렇게 개발단계에서만 필요한 모듈들을 devDependency로 설치하게 됩니다. <br />
말이 길었네요! 빨리 설치하러 가봅시다! :) <br />

```typescript

  C://projects/my-first-ts-express-croller
  > npm install -D typescript tslint tslint-config-airbnb jest
  > npm install -D @types/cheerio @types/dotenv @types/express @types/jest @types/mongoose

```

devDependency 모듈 설치는 dependency 모듈 설치와 다르게 -D 옵션을 붙혀서 설치를 해야합니다. <br />
(위에서 @types/~ 모듈들과 다른 모듈들을 따로 쓴 이유는 없습니다. <br />
그냥 같이 써서 설치하시면 됩니다.) 그러면 이제 package.json을 보면 아래와 같이 보여질 것 입니다. <br />

```json

  {
  "name": "project_name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
    "dependencies": {
    "cheerio": "^1.0.0-rc.3",
    "dotenv": "^8.0.0",
    "express": "^4.17.1",
    "mongoose": "^5.6.6",
    "winston": "^3.2.1",
  },
  "devDependencies": {
    "@types/cheerio": "^0.22.12",
    "@types/dotenv": "^6.1.1",
    "@types/express": "^4.17.0",
    "@types/jest": "^24.0.15",
    "@types/mongoose": "^5.5.9",
    "jest": "^24.8.0",
    "tslint": "^5.18.0",
    "typescript": "^3.5.3"
  }
}

```

# tsconfig 세팅
Typescript를 해보신 분들도 계시겠지만, 이전 포스트에서도 말했다시피 저는 초보자들의 관점에서 포스트를 작성하기 때문에 모르시는 분들을 위해 Typescript에 대해서 설명을 잠시 해드리도록 하겠습니다.<br/ >

Typescript는 간단하게 설명하면 동적 타입언어인 자바스크립트에서 변수에 타입을 지정할 수 있는 형태라고 이해하시면 될 것 같습니다. <br />
Typescript가 작동하는 방식을 자세하게 설명하자면 다음과 같습니다. <br />
<br />
Typescript는 Typescript 자체로 실행되지 않고, 자바스크립트 파일로 트랜스파일(컴파일)되어서 자바스크립트의 형태로 동작하게 됩니다. <br />
그렇다면 우리가 Typescript를 개발할 때에는 Typescript를 자바스크립트로 변환해줄 트랜스파일러(컴파일러)가 필요하겠죠? <br />
그게 바로 typescript 모듈입니다. <br />
<br />
그래서 typescript 모듈을 통해서 Typescript를 자바스크립트로 트랜스파일을 하는데 다음과 같은 명령어로 트랜스파일이 진행됩니다.

```typescript

  > tsc a.ts

```

간단하죠? 그런데 저희가 만들 Typescript 파일들이 많아지면 저 트랜스파일 명령어를 어느 세월에 다 쓰고 있나요? <br />
그래서 필요한 게 바로 tsconfig.json입니다. <br />
<br />
그러면 프로젝트 내에서 tsconfig를 만들어봅시다! 프로젝트 내에서 tsconfig.json 파일을 직접 만들 수도 있지만 <br /> 
typescript 모듈에서 간단한 명령어를 통해서 잘 세팅된 tsconfig.json 파일을 만들 수 있습니다. <br />

```typescript

  C://projects/my-first-ts-express-croller
  > npx tsc --init
  message TS6071: Successfully created a tsconfig.json file.

```

npx에 대한 설명은 [이 글](https://geonlee.tistory.com/32)에서 정말 잘 되어 있으니 생략하도록 하겠습니다. <br />
참고로 npx는 npm 버전이 5.2.0 이상이어야 사용할 수 있으니 참고해주세요. <br />
<br />
아무튼 저렇게 명령어를 입력해주면 위의 메시지처럼 tsconfig.json 파일이 생겼다고 메시지가 뜰 겁니다.  <br />
이제 그 파일을 코드 에디터로 열어보면 다음과 같은 형태를 가지게 될 것입니다. <br />

```typescript
  
  // C://projects/my-first-ts-express-croller/tsconfig.json
{
  "compilerOptions": {
    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true                   /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
  }
}

```

옵션이 정말 많은데요. 여기서 제가 사용할 옵션은 다음과 같습니다.

```typescript

  // C://projects/my-first-ts-express-croller/tsconfig.json
    
{
    "compilerOptions": {
        "module": "commonjs",
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "target": "es6",
        "noImplicitAny": true,
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist",
        "baseUrl": ".",
        "paths": {
            "*": [
                "node_modules/*",
                "src/types/*"
            ]
        }
    },
    "include": [
        "src/**/*"
    ]
}

```

tsconfig.json에 대한 자세한 설명은 [docs](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)를 읽어보시면 되십니다. <br />
사실 이렇게 할 작성할 거라면 굳이 tsc --init을 할 필요가 없었지만 자세한 설명이 적혀있으니까 여러분이 원하는 옵션을 더 잘 선택할 수 있겠죠? <br />

# tslint 세팅
이제 tslint를 설정할 시간입니다! 자바스크립트로 개발을 하셨던 분들은 eslint에 대해서 들어본 적이 있으실 겁니다. <br />
tslint는 Typescript의 린터입니다. 하지만 2019년 2월에 tslint 개발 팀에서 2019년 안에 개발을 중단할 것이라는 발표를 하게 되었습니다. <br />
eslint와 합쳐져서 eslint에서 Typescript와 자바스크립트 모두를 지원할 수 있는 표준 린터로 만들 계획이라고 하네요. <br />
하지만 아직! 개발 중단이 되지 않았으니 마음껏 tslint를 즐겨봅시다!<br />
<br />
tslint는 eslint처럼 다양한 스타일들이 존재합니다. <br />
airbnb, prettier, google 등 다양한 스타일들이 있는데 저는 airbnb 스타일을 선호하기 때문에 airbnb 스타일을 상속해서 사용하겠습니다. <br />
그러면 tslint-config-airbnb 모듈을 설치해봅시다. 꼭 devDependency로 설치해주시구요.<br />

```typescript

  // C://projects/my-first-ts-express-croller
  > npm install -D tslint-config-airbnb

```

이제 tslint.json file을 만들어서 다음과 같이 내용을 작성하면 우리는 airbnb와 같은 코드 스타일로 코딩하게 되는거죠!

```typescript
  
  // C://projects/my-first-ts-express-croller/tslint.json
  {
    "extends": "tslint-config-airbnb"
  }

```

만약에 자신이 airbnb의 코드 스타일과 자신의 스타일 안맞는다고 느껴지는 규칙이 있다면 다음과 같이 작성해주시면 됩니다.
```typescript

  {
    "extends": "tslint-config-airbnb",
    "rules": {
      "ter-arrow-parens": false
    }
  }

```

자세한 tslint 규칙은 [이 링크](https://palantir.github.io/tslint/rules/)를 참고해주세요.

# jest 설정
제 우리가 마지막으로 해야할 설정입니다. jest가 무엇인지 모르시는 분들은 [이 링크](https://jestjs.io/)를 참고해주세요. <br />
jest는 지난 번에 우리가 사용할 모듈들에 대해서 잠깐 설명할 때 간단하게 테스트 프레임워크라고 말씀드렸습니다. <br />
사실 테스트를 한 번도 안해보신 분들은 테스트가 정확히 어떤 개념인지 알기 힘들거에요. 직접 경험해보시면 좀 더 어떤 개념인지 와닿으실 겁니다. <br />
따라서 지금 단계에서는 <code>우리가 만드는 어플리케이션이 조금 더 안정적이고 확실한 검증이 되어있음을 증명하기 위해서 하는 것이다.</code>라고 이해하시면 될 것 같습니다. <br />
<br />
그래서 다시 본론으로 돌아와서 jest를 세팅해보기 이전에! jest는 자바스크립트 테스트 프레임워크이기 때문에 우리가 작성할 Typescript 파일들을 직접 실행할 수 없습니다. <br />
하지만 그렇다고 자바스크립트로 트랜스파일된 결과를 가지고 테스트하기엔 디버깅이 어렵죠. 그래서 필요한 게 바로 <code>ts-jest</code>모듈 입니다. <br />
이 모듈은 우리가 작성한 Typescript 파일들을 먼저 컴파일하고 나온 자바스크립트 코드를 jest에서 테스트를 실행한 이후에 발생한 에러들이 Typescript 파일의 어떤 곳에서 발생하는 것인지 알려주는(sourceMap) 모듈입니다. <br />
더 자세히 아시고 싶다면 [이 링크](https://github.com/kulshekhar/ts-jest)를 참고해보세요. 그럼 설치해봅시다. 꼭 **devDependency**로 설치해주세요. <br />


```typescript

  // C://projects/my-first-ts-express-croller/
  > npm install -D ts-jest

```

이제 <code>jest.config.js</code> 파일만 작성하면 오늘의 세팅은 모두 끝이 납니다! 파일은 다음과 같이 작성해주세요.

```typescript

  module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/test/**/*.test.(ts|js)"],
  testEnvironment: "node"
};

```

여기 위에서 보이는 <code>"**/test/**/*.test.(ts|js)"</code> 이런 문자열들을 개발하면서 많이 보게 되실텐데요. <br />
바로 <code>glob file pattern</code>이라고 하는데요. 이에 대해서는 따로 포스트로 작성해서 공유해드리겠습니다. <br />
이제 모든 준비는 끝이 났습니다! 이제 어서 크롤러를 만들어서 재밌는 일들을 해보자구요! <br />

# 1. 크롤러의 작동원리
크롤러의 작동원리는 사실 정말 별 것도 없습니다. <br />
우리가 일반적으로 웹 서핑을 할 때 보는 웹 페이지들은 다들 알고 계시는 것처럼 HTML과 CSS, 자바스크립트로 동작하게 됩니다. <br />
즉, 다시 말해서 우리가 크롬이나 파이어폭스같은 브라우저로 네이버에 접속하게 되면 브라우저가 네이버 서버로 네이버 페이지를 내놓으라고 HTTP GET 메서드로 요청을 하게 됩니다. <br />
이 때, 네이버 서버는 네이버 웹 페이지를 구성하고 있는 HTML, CSS, 자바스크립트 파일을 보내면 브라우저가 그 파일들을 한 번에 읽어서 우리에게 웹 페이지로 보여주는 거죠. <br />

<p align = "center"><img src = "https://media.vlpt.us/post-images/k7120792/fc505910-b9a4-11e9-8fa2-0d83b1c7c679/%ED%81%AC%EB%A1%A4%EB%9F%AC.png" width = 90%> </img></p>

결국, 크롤러는 우리가 몰랐던 엄청 대단한 기술이 아니라 그저 우리가 평소에 웹사이트에 접속해서 웹사이트를 둘러보는 일이 바로 크롤러가 하는 일입니다. <br />

# 2. 크롤러 개발
이제 크롤러를 개발해봅시다! 이번에 만들 크롤러는 <code>/crawl</code> 라우터로 GET 요청을 보내게 되면 현재 실시간 검색어를 응답하도록 만들어 보겠습니다.

# express 서버 만들기

```typescript

  // C://projects/my-first-ts-express-croller/src/index.ts
  import express from 'express';

  const app = express();

  // 클라이언트가 crawl 라우터로 GET 요청을 보냈을 때, 'hello'라는 값을 보내는 코드 
  app.get('/crawl', (req, res) => res.send('hello'));
  app.listen(8080, () => {
    console.log('server started!');
  });

```

```typescript

  // C://projects/my-first-ts-express-croller/src/package.json
  {
    // scripts 이외 생략
    "scripts": {
      "start": "tsc && node dist"
    },
  }

```

<code>package.json</code>의 scripts를 위와 같이 바꾸게 되면 이제 우리는 실행할 수 있는 Express 서버를 가지게 된 것입니다. <br />
이제 <code>npm start</code>를 커맨드 라인에서 입력하게 되면 콘솔엔 <code>server started!</code>라고 출력될 것입니다. <br />
그리고 브라우저로 <code>localhost:8080/</code>으로 접속하게 되면 브라우저에 <code>hello</code>라고 출력됩니다. <br />
그럼 크롤러를 실행시킬 환경이 구축되었으니 크롤링을 해봅시다. <br />

# 크롤링하기
앞서 말했던 것 처럼 크롤링은 우리가 몰랐던 새로운 개념이 아니라 그저 우리가 정보를 얻어가고 싶은 서버에 GET 요청으로 정보를 가져와서 우리가 그 정보를 가공해서 사용하는 것을 말합니다. <br />
그래서 서버에 요청을 보낼 수 있게 <code>request</code> 모듈을 설치해야 합니다. <br />
하지만 현재 우리가 <code>typescript</code>로 개발을 진행 중이기 때문에 <code>@types/request</code>모듈도 함께 설치해야합니다.<br />

```typescript

  // C://projects/my-first-ts-express-croller
  npm i request
  npm i -D @types/request

```

그러면 <code>crawl.ts</code>를 만들어서 요청에 대한 응답이 잘 오는지 살펴봅시다.

```typescript

  // C://projects/my-first-ts-express-croller/src/crawl.ts
  import request from 'request';
  export const crawl = () => {
    request.get('https://naver.com', (err, res) => {
      if (err) console.log(err);
      console.log(res.body);
    });
  };

```

이제 <code>index.ts</code>에서 <code>crawl.ts</code>의 동작을 확인해봅시다.

```typescript

  // C://projects/my-first-ts-express-croller/src/index.ts
  import express from 'express';
  import { crawl } from './crawl';
  crawl();
  const app = express();
  app.get('/', (req, res) => res.send('hello'));

  app.listen(8080, () => {
    console.log('server started!');
  });

```

이제 이렇게 네이버에서 받아온 데이터를 더 쉽게 다룰 수 있는 형태로 만들어봅시다.

# 비동기처리하기
비동기처리에 대한 포스트는 추후에 작성하도록 하겠습니다. 먼저 비동기 프로그래밍을 잘 설명해둔 포스트들의 링크를 달아두겠습니다.

> 1. [자바스크립트는-어떻게-작동하는가-이벤트-루프와-비동기-프로그래밍의-부상-async-await을-이용한-코딩-팁-다섯-가지](https://engineering.huiseoul.com/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%9E%91%EB%8F%99%ED%95%98%EB%8A%94%EA%B0%80-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%A3%A8%ED%94%84%EC%99%80-%EB%B9%84%EB%8F%99%EA%B8%B0-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%EC%9D%98-%EB%B6%80%EC%83%81-async-await%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%BD%94%EB%94%A9-%ED%8C%81-%EB%8B%A4%EC%84%AF-%EA%B0%80%EC%A7%80-df65ffb4e7e)<br />
> 2. [동기식 처리 모델 vs 비동기식 처리 모델](https://poiemaweb.com/js-async)<br />

# Callback
먼저, 비동기처리를 위한 가장 기초적인 방법인 콜백을 말씀드리겠습니다. <br />
일반적으로 콜백함수는 이름 그대로 함수가 끝난 후에 호출될 함수를 말합니다. <br />
자바스크립트에서는 함수가 일급 객체 즉, 매개변수로 사용될 수 있기 때문에 다음과 같이 매개변수에 끝나고 호출되길 원하는 함수를 전달해서 콜백함수를 사용합니다. <br />

```typescript
  
  //예시
  const myCallback = (a) => { console.log(a); };
  const useCallback = (callback) => {
    //비동기로 동작할 예시코드 result = 10;
    const result = asyncFunc();
    callback(result);
  }
  useCallback(myCallback); // 10 출력

```
위 코드는 실제로 동작하진 않지만 콜백함수가 어떤 원리로 동작하는지는 이해할 수 있을 것입니다. <br />
이제 콜백함수를 가지고 위에서 다뤘던 코드를 바꿔봅시다. <br />
이번에는 <code>/crawl</code> 라우터로 접속하면 네이버 실시간 검색어를 보여주도록 바꿔보겠습니다. <br />

```typescript
  
  // C://projects/my-first-ts-express-croller/src/crawl.ts
  import request from 'request';
  //express의 get 메서드의 타입정의
  import { Send } from 'express';
  export const crawl = (callback: Send) => {
    request.get('https://naver.com', (err, res) => {
      if (err) callback('');
      callback(res.body);
  });

```

```typescript

  // C://projects/my-first-ts-express-croller/src/index.ts
  import express from 'express';
  import { crawl } from './crawl';

  const app = express();
  app.get('/crawl', (req, res) => {
    // crawl 내부에서 호출될 때 res.send 메서드의 this 값이 변경되는 것을 막기 위함
    crawl(res.send.bind(res));
  });

  app.listen(8080, () => {
    console.log('server started!');
  });

```

브라우저에서 <code>localhost:8080/crawl</code>로 접속하면 다음과 같이 네이버 메인화면을 확인할 수 있습니다.
<p align = "center"><img src="https://media.vlpt.us/post-images/k7120792/879efbc0-b9a0-11e9-8fa2-0d83b1c7c679/image.png" width = 90%></img></p>

# Promise
위 코드에서 다들 느끼셨을테지만 콜백은 depth(이어서 실행할 함수의 개수)가 조금만 깊어져도 코드를 작성하는 게 불편해지고, 가독성이 매우 떨어집니다. 여기서 나온 대비책이 바로 프로미스입니다. <br />
프로미스는 비동기처리를 위해서 만들어진 객체라고 생각하시면 됩니다. 프로미스의 사용법은 아래와 같습니다. <br />
```typescript
  
  // 예시
  function getData() {
    return new Promise(function (resolve, reject) {
      const result = fetchData(function (response) {
        // 성공 시 resolve 호출
        resolve(response);
      });
      // 실패 시 reject 호출
      if(result.status === 'fail') reject('failed');
    });
  }

  getData()
    .then(res => {console.log(res)})
    .catch(err => {console.log(err)});
  
```

이제 이전에 콜백으로 작성한 코드를 프로미스를 사용한 코드로 바꿔봅시다.

```typescript

  // C://projects/my-first-ts-express-croller/src/crawl.ts
  import request from 'request';
  export const crawl = () =>
    // Promise 옆에 꺾쇠로 string을 감싸서 표현한 문법을 제네릭이라고 합니다.
    // 자세한 설명은 아래 링크를 참고해보세요.
    // https://ahnheejong.gitbook.io/ts-for-jsdev/03-basic-grammar/generics
    new Promise<string>((resolve, reject) => {
      request.get('https://naver.com', (err, res) => {
        if (err) reject(err);
        resolve(res.body);
      });
    });
  
  ```

```typescript

   // C://projects/my-first-ts-express-croller/src/index.ts
  import express from 'express';
  import { crawl } from './crawl';

  const app = express();
  app.get('/crawl', (req, res) => {
    crawl().then(result => res.send(result));
  });

  app.listen(8080, () => {
    console.log('server started!');
  });
  
  ```

오히려 더 복잡해진 것 같긴 하지만, depth가 깊어졌을 때 가독성은 개선되었습니다. 하지만 더 개선해봅시다.

# async, await

sync, await은 ES2017에서 새로 나온 자바스크립트 문법입니다. <br />
기존의 프로미스 코드를 실제로 실행할 때에는 then(), catch() 메서드를 통해서 실행해야 했지만, async, await 키워드만 붙이면 비동기 코드를 동기적으로 작성할 수 있게 됩니다. <br />

위에서 작성한 예시 프로미스 코드를 async await코드로 바꿔보겠습니다. <br />

```typescript

  // 예시
  async function fetchData () {
    console.log(await getData1());
    console.log(await getData2());
    console.log(await getData3());
    console.log(await getData4());
  }

```

위 코드를 보면 아시겠지만 async, await은 프로미스를 완전히 대체하는 개념이 아닙니다. 프로미스를 좀 더 효과적으로 사용할 수 있도록 도와주는 개념이라고 생각하시면 좋을 것 같습니다. <br />
하지만 async 키워드를 사용하기 위해서 함수를 한 차례 감싸야한다는 조건이 필요합니다. <br />

이제 실제 코드를 변환해봅시다. 위에서 말했듯이 async, await은 프로미스를 완전히 대체하는 것이 아니라 더 효율적으로 사용하기 위한 것이기 때문에 <code>index.ts</code>에서 프로미스를 사용하는 부분만 변경하면 됩니다. <br />

```typescript

  // C://projects/my-first-ts-express-croller/src/index.ts
  import express from 'express';

  const app = express();
  app.get('/crawl', async (req, res) => {
    const result = await crawl();
    res.send(result);
  });

  app.listen(8080, () => {
    console.log('server started!');
  });

```

async, await으로 리팩토링한 코드 정말 짧고 간결하죠? 동기적으로 코드가 작성되어서 이해하기도 훨씬 쉽습니다. <br />
<br />
지금까지 작성했던 코드는 모두 네이버 서버에서 받아온 데이터를 그대로 전달해오게 되는 코드였습니다. 이제는 이 HTML 데이터에서 실시간 검색어 목록을 추출해서 클라이언트에 전달해봅시다. <br />


# 실시간 검색어 추출하기
우리가 크롤링에서 HTML 데이터에서 데이터를 추출할 때 사용할 라이브러리는 바로 <code>cheerio</code>입니다. 
<code>cheerio</code>는 <code>jquery</code> 문법과 css 선택자를 이용해서 HTML 내에서 자신이 필요한 정보를 가져올 수 있습니다.

```typescript

  // C://projects/my-first-ts-express-croller/src/extract.ts
  import { load } from 'cheerio';

   export const extract = (html: string) => {
    if (html === '') return [];
    const $ = load(html);
    const crawledRealtimeKeywords = $(
      '.ah_roll_area.PM_CL_realtimeKeyword_rolling ul > li span.ah_k',
    );
    const keywords: string[] = $(crawledRealtimeKeywords)
      .map(
        (i, ele): string => {
          return $(ele).text();
        },
      )
      .get();
    return keywords;
  };

```

위 코드가 네이버 페이지에서 실시간 검색어를 추출하는 코드입니다. <br />
문자열 배열의 형태로 값을 리턴하게 됩니다. 이제 HTML 데이터에서 실시간 검색어만 추출해서 클라이언트에게 리턴해봅시다. <br />

```typescript

  // C://projects/my-first-ts-express-croller/src/index.ts
  import express from 'express';
  import { crawl } from './crawl';
  import { extract } from './extract';

  const app = express();
  app.get('/crawl', async (req, res) => {
    const result = await crawl();
    res.send(extract(result).join(', '));
  });

  app.listen(8080, () => {
    console.log('server started!');
  });

```

이제 브라우저에서 <code>/crawl</code>로 접속하면 실시간 검색어가 보일 것 입니다. 

# reference
> * [참고자료](https://velog.io/@k7120792/ts-express-1)
> * [참고자료](https://velog.io/@k7120792/Typescript%EC%99%80-Express%EB%A1%9C-%EC%9E%AC%EB%B0%8C%EB%8A%94-%EB%AC%B4%EC%96%B8%EA%B0%80%EB%A5%BC-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%902)
> * [참고자료](https://velog.io/@k7120792/Typescript%EC%99%80-Express%EB%A1%9C-%EC%9E%AC%EB%B0%8C%EB%8A%94-%EB%AC%B4%EC%96%B8%EA%B0%80%EB%A5%BC-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%903)
