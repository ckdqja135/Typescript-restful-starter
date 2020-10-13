### 시작
지난번에 이어서myapp/app_test.go 파일에 테스트 코드를 추가적으로 만들어준다. <br />

``` Go

  func TestFooHandler_WithoutJson(t *testing.T) { // 1
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/foo", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
  }

```
먼저 실패하는 코드를 만들어 본다. <br />

1 : GET으로 /foo에 호출하는데 input없이 진행한다. <br />
    그러면 response가 올텐데 StatusOK가 나와야 한다고 하고, 실제 결과를 넣어준다. <br />
    
그 후 어떻게 될지 goconvey를 실행시켜 확인한다. <br />


실행 시 goconvey가 백그라운드에서 검사를 해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93847450-e5b66b00-fce1-11ea-8ed6-436137d3cc9e.png" width = 50%> </img></p>
기다리다보면 FAIL이 뜨는데 이것을 자세히 보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93847515-10a0bf00-fce2-11ea-855b-7ff9a4c15941.png" width = 50%> </img></p>
원하는건 200을 원했는데 400번이(bad)나왔다. <br />

그 이유는 <code>fooHandler</code>의 
``` Go
  
  func (f *fooHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    user := new(User)
    err := json.NewDecoder(r.Body).Decode(user)
    if err != nil {
      w.WriteHeader(http.StatusBadRequest)
      fmt.Fprint(w, "Bad Request: ", err)
      return
    }
    user.CreatedAt = time.Now()

    data, _ := json.Marshal(user)
    w.Header().Add("content-type", "application/json")
    w.WriteHeader(http.StatusCreated)
    fmt.Fprint(w, string(data))
  }

```
를 보게 되면 Body가 없을 경우에 Decode가 실패하게 되는데 그 때 error가 나고, fmt.Fprint(w, "Bad Request: ", err)를 반환하기 때문이다. <br />

그래서 StatusOK가 아니라 StatusBadRequest가 와야한다. 수정해준다. <br />

``` Go

  func TestFooHandler_WithoutJson(t *testing.T) { // 1
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/foo", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusBadRequest, res.Code)
  }

```

이 때 저장하면 goconvey가 돌게 되고, PASS했음을 알 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93851681-852c2b80-fceb-11ea-93fc-c5b9452d52c7.png" width = 50%> </img></p>

이제 실제 JSON을 넣어서 테스트해보자! <br />

``` Go

  func TestFooHandler_WithoutJson(t *testing.T) { // 1
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/foo", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusBadRequest, res.Code)
  }
  
  func TestFooHandler_WithJson(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/foo", 
    strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`)) // 1

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusCreated, res.Code) // 2
    
    user := new(User) // 3
    err := json.NewDecoder(res.Body).Decode(user) // 4
    assert.Nil(err) // 5
    assert.Equal("changbeom", user.FirstName) // 6
    assert.Equal("song", user.LastName) // 7
  }

```

1 : JSON format인데, strings.NewReader()를 통해서 JSON format으로 작성한 string이 io.Reader로 바뀌어서 request보내 줄 수 있게 된다. <br />
2 : 그렇게 되었을 때 response가 StatusCreated로 와야한다. <br />
3 : 실제적으로 data가 제대로 왔는지 user변수를 만들어 준다. <br />
4 : 그 후 response된 result를 user struct로 decode해준다. <br />
5 : 실패할 경우 error가 나오는데 그 error를 받아서 nil인지 아닌지 확인해주고, <br />
6, 7 : FirstName과 LastName이 맞는지 확인한다. <br />

그 후 저장하여 PASS 인지 확인한다. <br />


<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93852425-f7514000-fcec-11ea-84a4-d642e02d46f6.png" width = 50%> </img></p>

소스는 app_test.go만 수정되었다. <br />

<code>myapp/app_test.go</code>
``` Go
  
  package myapp

  import (
    "encoding/json"
    "io/ioutil"
    "net/http"
    "net/http/httptest"
    "strings"
    "testing"

    "github.com/stretchr/testify/assert"
  )

  func TestIndexPathHandler(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello World", string(data))
  }

  func TestBarPathHandler_WithoutName(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/bar", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello World!", string(data))
  }

  func TestBarPathHandler_WithName(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/bar?name=changbeom", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusOK, res.Code)
    data, _ := ioutil.ReadAll(res.Body)
    assert.Equal("Hello changbeom!", string(data))
  }

  func TestFooHandler_WithoutJson(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/foo", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusBadRequest, res.Code)
  }

  func TestFooHandler_WithJson(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("POST", "/foo",
      strings.NewReader(`{"first_name":"changbeom", "last_name":"song", "email":"changbeom@naver.com"}`))

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusCreated, res.Code)

    user := new(User)
    err := json.NewDecoder(res.Body).Decode(user)
    assert.Nil(err)
    assert.Equal("changbeom", user.FirstName)
    assert.Equal("song", user.LastName)

  }

```
이제 FileUploadserver를 만들어 볼 것인데, public폴더를 만들어 준 뒤, main.go 파일을 작성한다.

<code>main.go</code>
``` Go
  
  package main
  
  import "net/http"
  
  func main() {
  
    	http.Handle("/", http.FileServer(http.Dir("public")))
	    http.ListenAndServe(":3000", nil)
  }
  
```
가장 고전적인 파일 웹서버를 만드는건데 해당 경로에 파일들을 access할 수 있는 서버들을 열어 주는 것이다. <br />

public폴더에 index.html이라는 파일을 만들어준다. <br />

``` Go
  
  <html>
  <head>
  <title>Go 로 만드는 웹 4</title>
  </head>
  <body>
  <p><h1>파일을 전송해보자.</h1></p>
  <form action="/uploads" method="POST" accept-charset="utf-8" enctype="multipart/form-data">
      <p><input type="file" id="upload_file" name="upload_file"/></p>
      <p><input type="submit" name="upload"/></p>
  </form>
  </body>
  </html>

```

이후 저장 후에 서버를 실행 하면 위와 같은 화면이 뜬다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93853149-464ba500-fcee-11ea-849c-eb5343779878.png" width = 50%> </img></p>

이 때 아무 파일이나 선택 후 submit을 클릭하면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93853218-71ce8f80-fcee-11ea-88ef-2b192033b9dd.png" width = 50%> </img></p>

404Page가 뜨는 것을 확인 할 수 있다. <br />

uploadHandler를 만들지 않아서 생긴 일이기 때문에 만들어주자! <br />

main.go파일을 수정해준다.

``` Go
  
  func uploadsHandler(w http.ResponseWriter, r *http.Request) { // 2
    uploadFile, header, err := r.FormFile("upload_file")
    if err != nil { // 3
      w.WriteHeader(http.StatusBadRequest)
      fmt.Fprint(w, err)
      return
    }
    dirname := "./uploads" // 4
    os.MkdirAll(dirname, 0777) // 5
    filepath := fmt.Sprintf("%s/%s", dirname, header.Filename) // 6
    file, err := os.Create(filepath) // 7
  	defer file.Close() // 8
    
    if err != nil { // 9
      w.WriteHeader(http.StatusInternalServerError)
      fmt.Fprint(w, err)
      return
    }
    
    io.Copy(file, uploadFile) // 10
    w.WriteHeader(http.StatusOK) // 11
    fmt.Fprint(w, filepath) // 12
  }
  
  func main() {
    http.HandleFunc("/uploads", uploadsHandler) // 1
    http.Handle("/", http.FileServer(http.Dir("public")))

    http.ListenAndServe(":3000", nil)
  }
  
```
1 : uploadHander 등록.
2 : uploadHander 함수 생성.
    전송된 파일은 request에 실려서 와서 그것을 읽어야 하는데 r.FormFile()이 inputFormFile형태로 날라온 값을 읽겠다는 의미이다.
    이 함수의 return값이 multipart.File, multipart.FileHeader, error가 나오고 인자값은 key값을 받는데 upload_file로 해준다.
3 : 에러가 있을 경우    
4 : 'upload'된 파일을 저장해줄 폴더를 지정 -> 없으면 폴더를 새로 만들어 주어야 함. <br />
5 : 디렉토리를 만들어주고 그 디렉토리의 권한을 777을 주어서 read, write, excute할 수 있게 한다. <br />
6 : filepath를 적어준다. <br />
7 : 이제 file을 만들어 주어야 하는데 filepath에 해당하는 file을 만들어 준다. <br />
8 : file을 만들면 file의 Handle을 사용하는데 이 Handle이 OS자원이기 때문에 반납을 해주어야 한다. <br />
9 : 만약 file을 만들고, 에러가 생길 때의 처리 <br />
10 : 파일을 제대로 upload했을 때 uploadFile변수에 있는 것을 file변수에 복사 해야하는데 그 때 사용하는 코드임. <br />
11 : 잘 되었기 때문에 OK 코드를 보내고, <br />
12 : 어디에 업로드가 되었는지 filepath를 출력시켜준다. <br />

이 후 실행을 하여 업로드가 잘 되는지 확인해보자. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93854446-bbb87500-fcf0-11ea-924d-0cedd240e553.png" width = 50%> </img></p>
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93854467-c8d56400-fcf0-11ea-9492-5541a98122e6.png" width = 50%> </img></p>
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93854489-d4288f80-fcf0-11ea-9619-a28b660260b7.png" width = 50%> </img></p>

이렇게 해서 File 전송하는 것을 마쳤고, TestCode를 만들어보자! <br />

<code>main_test.go</code>

``` Go 
  
  package main
  
  import (
    "testing"

    "github.com/stretchr/testify/assert"
  )
  
  func TestUploadTest(t *testing.T) {
    	assert := assert.New(t) // 1
      path := "C:/Users/tucker/Downloads/ex_image.png" // 2
      file, _ := os.Open(path)  // 3
      
      defer file.Close() // 4
      buf := &bytes.Buffer{} // 5
      writer := multipart.NewWriter(buf)  // 6
      multi, err := writer.CreateFormFile("upload_file", filepath.Base(path)) // 7
      assert.NoError(err) // 8
      io.Copy(multi, file) // 9
      writer.Close() // 10
      
      res := httptest.NewRecorder()
      req := httptest.NewRequest("POST", "/uploads", buf)
      req.Header.Set("Content-type", writer.FormDataContentType()) // 11
      
      uploadsHandler(res, req)
	    assert.Equal(http.StatusOK, res.Code)
  }

```

1 : assert사용 <br />
2 : file 경로 작성 <br />
3 : 해당 file을 열어주는데 현재 파일 위치를 확인했기 때문에 error는 무시한다. <br />
4 : 마찬가지로 닫아준다. <br />
5 : NewWriter에 io.writer로 넣어주기 위한 buf <br />
6 : 웹으로 파일을 전송할 때 MIME 포맷을 사용하는데, 이것을 하기위해 multipart.NewWriter()를 사용한다. <br />
    이 때 나오는 인스턴스가 wirter이다. <br />
7 : 그리고 이 writer에 CreateFormFile()을 사용하여 File을 만들어주는데, <br />
    fieldname을 upload_file, filename을 ex_image.png가 되는데 filepath.Base를 하게 되면 경로에서 filename만 잘라내준다. <br />
    이 함수에는 io.writer, error가 return된다.
8 : error가 있는지 확인하고, <br />
9 : file을 읽었고, form파일을 만들었으니 데이터를 집어넣어주어야 한다. 아까 했던것처럼 카피해준다. <br />
10 : 그리고 writer를 닫아준다. <br />
11 : 테스트 코드들을 만들고, 이 data가 어떤 data인지 알려주어야 server가 읽을 수 있기 때문에 conetent타입이 formdata임을 알려준다. <br />

그 후 테스트를 실행하면 PASS 됐음을 알 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93856223-a6911580-fcf3-11ea-9782-5be3608aa0c4.png" width = 50%> </img></p>

그런데 좀 전에 받은 파일과 지금 받은 파일이 다른지 확인해보기 위해 지워 보자! <br />
    
<code>main_test.go</code>코드를 수정해보자!
``` Go 
  
  package main
  
  import (
    "testing"

    "github.com/stretchr/testify/assert"
  )
  
  func TestUploadTest(t *testing.T) {
    	assert := assert.New(t)
      path := "C:/Users/tucker/Downloads/ex_image.png"
      file, _ := os.Open(path) 
      
      defer file.Close()

      os.RemoveAll("./uploads") // 추가

      buf := &bytes.Buffer{} 
      writer := multipart.NewWriter(buf) 
      multi, err := writer.CreateFormFile("upload_file", filepath.Base(path))
      assert.NoError(err) 
      io.Copy(multi, file)
      writer.Close()
      
      res := httptest.NewRecorder()
      req := httptest.NewRequest("POST", "/uploads", buf)
      req.Header.Set("Content-type", writer.FormDataContentType())
      
      uploadsHandler(res, req)
	    assert.Equal(http.StatusOK, res.Code)
  }

```

저장하면 goconvey에서 PASS가 뜨게 되고, 수동으로 'upload'폴더에 있는 ex_image.png를 삭제 후 goconvey로 테스트를 해보면 <br />
PASS가 뜨고 다시 생성 되었음을 확인할 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93856223-a6911580-fcf3-11ea-9782-5be3608aa0c4.png" width = 50%> </img></p>
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93857035-eb697c00-fcf4-11ea-9be7-2ff9e31b08d6.png" width = 50%> </img></p>
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93857066-fa502e80-fcf4-11ea-9516-8183c27ea5aa.png" width = 50%> </img></p>

이제 업로드 되는 것은 확인했는데 실제로 이 파일이 같은지 확인해보자! <br />

<code>main_test.go</code>
``` Go 
  
  package main
  
  import (
    "testing"

    "github.com/stretchr/testify/assert"
  )
  
  func TestUploadTest(t *testing.T) {
    	assert := assert.New(t)
      path := "C:/Users/tucker/Downloads/ex_image.png"
      file, _ := os.Open(path) 
      
      defer file.Close()

      os.RemoveAll("./uploads")

      buf := &bytes.Buffer{} 
      writer := multipart.NewWriter(buf) 
      multi, err := writer.CreateFormFile("upload_file", filepath.Base(path))
      assert.NoError(err) 
      io.Copy(multi, file)
      writer.Close()
      
      res := httptest.NewRecorder()
      req := httptest.NewRequest("POST", "/uploads", buf)
      req.Header.Set("Content-type", writer.FormDataContentType())
      
      uploadsHandler(res, req)
      assert.Equal(http.StatusOK, res.Code)
      
      uploadFilePath := "./uploads/" + filepath.Base(path) // 1
      _, err = os.Stat(uploadFilePath) // 2
      assert.NoError(err) // 3

      uploadFile, _ := os.Open(uploadFilePath) // 4
      originFile, _ := os.Open(path) // 5
      defer uploadFile.Close() // 6
      defer originFile.Close() // 7
      
      uploadData := []byte{} // 8
      originData := []byte{} // 9
      uploadFile.Read(uploadData) // 10 
      originFile.Read(originData) // 11 
      
      assert.Equal(originData, uploadData) // 12

  }

```
1 : 업로드 되는 경로를 넣어준다. <br />
2 : 그 안에 파일이 잘 들어있는지 확인해준다. <br />
    os.Stat를 사용하면 그 file의 info를 가져다 준다. <br />
3 : 마찬가지로 에러가 없어야 하고, <br />
4, 5 : 통과했으면 파일이 있다는 의미이므로, 업로드된 파일과 기존 파일과 확인해보아야 한다. <br />
6, 7 : 두 파일을 닫아준다. <br />
8, 9 : Read함수에 사용 될 byte array <Br />
10, 11 : 위의 byte array를 사용하여 두 데이터를 읽어온다. <br />
12 : 그 후 이 두개의 데이터가 같은지 확인한다. <br />

저장 후 기다리면 PASS 된 것을 확인 할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93859272-62544400-fcf8-11ea-8705-2692c96d50ad.png" width = 50%> </img></p>

<code>main.go</code>

``` Go

package main

import (
	"fmt"
	"net/http"
	"os"
	"io"
)

func uploadsHandler(w http.ResponseWriter, r *http.Request) {
	uploadFile, header, err := r.FormFile("upload_file")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err)
		return
	}
	defer uploadFile.Close()

	dirname := "./uploads"
	os.MkdirAll(dirname, 0777)
	filepath := fmt.Sprintf("%s/%s", dirname, header.Filename)
	file, err := os.Create(filepath)
	defer file.Close()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}
	io.Copy(file, uploadFile)
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, filepath)
}

func main() {
	http.HandleFunc("/uploads", uploadsHandler)
	http.Handle("/", http.FileServer(http.Dir("public")))

	http.ListenAndServe(":3000", nil)
}

```

<code>main_test.go</code>
``` Go
package main

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUploadTest(t *testing.T) {
	assert := assert.New(t)
	path := "C:/Users/ckdqj/Downloads/ex_image.png"
	file, _ := os.Open(path)
	defer file.Close()

	os.RemoveAll("./uploads")

	buf := &bytes.Buffer{}
	writer := multipart.NewWriter(buf)
	multi, err := writer.CreateFormFile("upload_file", filepath.Base(path))
	assert.NoError(err)
	io.Copy(multi, file)
	writer.Close()

	res := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/uploads", buf)
	req.Header.Set("Content-type", writer.FormDataContentType())

	uploadsHandler(res, req)
	assert.Equal(http.StatusOK, res.Code)

	uploadFilePath := "./uploads/" + filepath.Base(path)
	_, err = os.Stat(uploadFilePath)
	assert.NoError(err)

	uploadFile, _ := os.Open(uploadFilePath)
	originFile, _ := os.Open(path)
	defer uploadFile.Close()
	defer originFile.Close()

	uploadData := []byte{}
	originData := []byte{}
	uploadFile.Read(uploadData)
	originFile.Read(originData)

	assert.Equal(originData, uploadData)

}

```

<code>public/index.html</code>
``` HTML
	
<html>
<head>
<title>Go 로 만드는 웹 4</title>
</head>
<body>
<p><h1>파일을 전송해보자.</h1></p>
<form action="/uploads" method="POST" accept-charset="utf-8" enctype="multipart/form-data">
    <p><input type="file" id="upload_file" name="upload_file"/></p>
    <p><input type="submit" name="upload"/></p>
</form>
</body>
</html>

```
