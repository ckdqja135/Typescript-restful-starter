### 시작
우선 기존에 만들었었던 todos 파일을 사용자 계정 폴더에 빼내어 준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311049-14c70200-08c8-11eb-8ff8-82905756c76e.png" width = 70%> </img></p> 

여기에 Go 모듈을 만들어준다. <br />
명령 프롬프트 창을 키고 방금 옮겼던 폴더로 이동한다. <br /> 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311288-5f487e80-08c8-11eb-92c9-2b66f747243a.png" width = 70%> </img></p> 

그 다음 go mod init changbeomWeb/todos를 입력해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311490-a767a100-08c8-11eb-830f-6ff44d736482.png" width = 70%> </img></p> 

go mod init하면 mod가 initialize하게 되는데 그 때 뒷부분에 만들려는 모듈의 이름을 적어준다. 되도록 겹치지 않게 해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311701-f1e91d80-08c8-11eb-87f2-b8ce5259f09d.png" width = 70%> </img></p> 

이렇게 하면 MOD파일이 생성된 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311818-180ebd80-08c9-11eb-83ba-84486e4a8ddd.png" width = 70%> </img></p> 

그 후 git init를 사용하여 git을 initialize하게 해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95311949-47252f00-08c9-11eb-9601-388a52db39c4.png" width = 70%> </img></p> 

그러면 준비는 끝났다. <br />

그 다음 go build -o ./bin/todos.exe -v . 를 사용하여 빌드를 시켜준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95313952-abe18900-08cb-11eb-926a-917fcecff6dd.png" width = 70%> </img></p> 
.은 현재 폴더를 빌드하겠다는 의미이고, v는 메세지가 나오게 하겠다는 의미이다. <br />
이 프로젝트에서 사용되는 모듈들을 찾아서 go mod파일에 정의하는 것을 알 수 있다. <br />

그리고 빌드는 끝이났고, bin폴더가 생성 되는 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95314282-109ce380-08cc-11eb-9466-ecff7d7e3cca.png" width = 70%> </img></p> 

그 후 bin\todos.exe를 사용하여 서버를 실행시켜보자! <br />
