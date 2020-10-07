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

그 후 해당 폴더를 열어서 import 부분들을 mod init했던 부분과 맞추어 수정해준다. <br />
<code>app/app_test.go</code>

``` Go
import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strconv"
	"testing"

	"changbeomWeb/todos/model" // 여기

	"github.com/stretchr/testify/assert"
)

```

<code>app/app.go</code>

``` Go

import (
	"net/http"
	"strconv"
	"strings"

	"changbeomWeb/todos/model" // 여기

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/unrolled/render"
	"github.com/urfave/negroni"
)

```

<code>main.go</code>
``` Go

  import (
    "log"
    "net/http"

    "changbeomWeb/todos/app" // 여기
  )

```
그 다음 go build -o ./bin/todos.exe -v . 를 사용하여 빌드를 시켜준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95313952-abe18900-08cb-11eb-926a-917fcecff6dd.png" width = 70%> </img></p> 
.은 현재 폴더를 빌드하겠다는 의미이고, v는 메세지가 나오게 하겠다는 의미이다. <br />
이 프로젝트에서 사용되는 모듈들을 찾아서 go mod파일에 정의하는 것을 알 수 있다. <br />

그리고 빌드는 끝이났고, bin폴더가 생성 되는 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95314282-109ce380-08cc-11eb-9466-ecff7d7e3cca.png" width = 70%> </img></p> 

그 후 bin\todos.exe를 사용하여 서버를 실행시켜보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95316250-873ae080-08ce-11eb-9066-9a67278b27b5.png" width = 70%> </img></p> 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95315957-1f849580-08ce-11eb-8995-3eb4622164ff.png" width = 70%> </img></p> 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95315973-24494980-08ce-11eb-9ae2-a58eefa118aa.png" width = 70%> </img></p> 

그 후 heroku에 배포하기 위해 heroku에 로그인을 시켜준다. <br />
``` linux

  heroku login

```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95316510-dda81f00-08ce-11eb-89d5-b1e69f1a843a.png" width = 70%> </img></p> 


그 다음 로그인이 완료된 상태에서 다음 명령어를 입력한다. <br />
``` linux
  
  heroku create

```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95316526-e26cd300-08ce-11eb-8588-ebe2e2cdfd5a.png" width = 70%> </img></p> 

그 후 커밋을 위해 기존 파일에 있던 test.db파일과 bin폴더에 있는 todos.exe 파일들을 지워준다. <br />

그 후 add 시켜준다. <br />

``` linux
  
  git add .
  
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95316960-76d73580-08cf-11eb-9bcd-2cbc3d2e3873.png" width = 70%> </img></p> 

그 다음 커밋을 시켜준다. <br />

``` linux

  git commit -m "first commit of todos"

```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95317282-ec430600-08cf-11eb-8c4d-f46d228a7585.png" width = 70%> </img></p> 

이제 커밋이 되었는데, 이 상태에서 heroku server로 push 시켜준다. <br />

``` linux
  
  git push heroku master
  
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95317411-1e546800-08d0-11eb-9a34-b8db8e37d381.png" width = 70%> </img></p> 

그 다음 현재 돌아가고 있는 프로세스 정보를 확인 해보자! <br />

``` linux
  
  heroku ps
  
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95318035-f0235800-08d0-11eb-8c06-fb3132cf4a64.png" width = 70%> </img></p> 

그리고 log를 확인하여 제대로 돌아가고 있는지 확인해보자! <br />

``` linux

  heroku logs --tail

```

그 다음 접속을 해보자! <br />

``` Go 

  heroku open
  
```

