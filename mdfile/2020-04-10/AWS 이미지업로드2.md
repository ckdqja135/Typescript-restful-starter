# Nestjs 및 TypeScript를 사용하여 AWS S3에 이미지 업로드

최근 프로젝트에서 백엔드에 있는 Nestjs와 Typescript를 사용하여 AWS S3에 이미지를 업로드해야 했습니다. 
Typescript와 Nestjs를 사용하여 이 작업을 수행하는 간단한 단계를 공유합니다.
이 코드는 Nestjs 및 typescript용 코드이지만 Express를 사용하여 Nodej에 대한 이미지 업로드에 대해서도 참조하고 그에 따라 변경할 수 있습니다.

먼저 이미지 업로드를 위해 AWS S3 버킷을 설정해야 합니다. 
만약 당신이 그것을 어떻게 하는지 모른다면 [여기](https://medium.com/@shamnad.p.s/how-to-create-an-s3-bucket-and-aws-access-key-id-and-secret-access-key-for-accessing-it-5653b6e54337)를 참고하시기 바랍니다.

이제 typescript를 사용하여 이미지 업로드에 대한 백엔드 코드를 설정해야 합니다. 
이미지 업로드를 S3으로 설정하려면 다음과 같은 종속성이 필요합니다.
```typescript

npm install aws-sdk multer multer-s3 --save


```

이제 필요한 모든 종속성이 구축되었으며 이미지 업로드를 위한 생성자 경로를 설정할 수 있습니다.

## imageupload.controller.ts 
```typescript
import { Controller, Post, Req, Res } from '@nestjs/common';
import { ImageUploadService } from './image_upload.service';

@Controller('fileupload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}
  @Post()
  async create(@Req() request, @Res() response) {
    try {
      await this.imageUploadService.fileupload(request, response);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
```

이제 아래와 같은 서비스 클래스를 가져야 합니다.

## imageupload.service.ts
```typescript
import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class ImageUploadService {
  constructor() {}

  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function(error) {
        if (error) {
          console.log(error);
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json(req.files[0].location);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: function(request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);
}
```

환경 변수를 적절한 값으로 교체해야 합니다.
```typescript
AWS_S3_BUCKET_NAME
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

# 서비스 클래스를 설명
서비스 클래스는 이미지 업로드를 처리하고 있으며, 보시다시피 업로드 방법이 있으며, <code>multer</code>와 <code>multer-3</code>를 사용하여 파일을 업로드합니다. 파일을 보낼 필드의 이름은 <code>upload</code>입니다.
파일을 보낼 필드의 이름은 업로드로 지정되고 파일 수는 다음 매개 변수로 지정됩니다. 
파일이 한 개밖에 없기 때문에 <code>array('upload',1)</code>로 값을 제공합니다. 
컨트롤러에 업로드 요청을 하는 동안 동일한 이름을 사용해야 합니다.

업로드된 파일 URL은 <code>req.files[0].location</code>로 검색할 수 있습니다. 
이 경우에는 파일이 한 개뿐이므로 index <code>0</code>을 사용하면 됩니다.

이제 동일한 모듈 파일을 만들어야 합니다.

## imageupload.module.ts 
```typescript
import { Module } from '@nestjs/common';
import { ImageUploadController } from './image_upload.controller';
import { ImageUploadService } from './image_upload.service';

@Module({
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
  exports: [ImageUploadService],
})
export class ImageUploadModule {}
```

이제 이 모듈을 앱 모듈 가져오기에 연결해야 합니다.

## app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageUploadModule } from 'image_upload/image_upload.module';

@Module({
  imports: [ImageUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

이제 npm start를 사용하여 typescript 애플리케이션을 실행할 수 있습니다. 
응용 프로그램이 실행되고 나면 postman을 사용하여 이미지 업로드를 테스트할 수 있습니다.

# postman을 사용한 테스팅
양식 데이터를 선택하고 업로드로 키를 입력한 다음 파일을 선택하여 서버로 요청을 전송해야 합니다. 
AWS 자격 증명 및 버킷 이름을 올바르게 지정한 경우 이미지가 S3에 업로드되고 이미지 URL이 응답으로 표시됩니다.
<img src = "https://miro.medium.com/max/1400/1*dZevsdJEaLS41Xg5tUhSew.png" width = 90%></img>

# Reference
[참고자료](https://medium.com/@shamnad.p.s/image-upload-to-aws-s3-using-nestjs-and-typescript-b32c079963e1)
[참고자료](https://github.com/shamnadps/Image_upload_typescript)
