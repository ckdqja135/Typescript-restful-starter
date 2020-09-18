###  시작

#### Decorator?
기본 기능에 추가할 수 있는 많은 종류의 부가 기능에서 파생되는 다양한 조합을 동적으로 구현할 수 있는 패턴이다. <br />

실제 예로 들면 Data를 어떤 사람에게 보낼려 할 때 '압축'을 해서 보낸다던지, '암호화'를 해서 보낸다던지, 나중에 추적할 수 있도록'log'를 단다던지, <br />
마케팅 서버가 있다면 그 곳에 보낸 다 던지, 등의 기능들이 추가 되는 것이 Decorator이다.

그렇다면 왜 Decorator를 사용할까? 앞서 설명했던 '압축', '암호화', 'log', '마케팅요소'등을 하나로 뭉쳐서 만들 수도 있지만 이 부가기능들은 대체로 잘 바뀌는 특성이 있다. <br />
그래서 Data(오리지날 기능)는 바뀌지 않는데, 부가기능들이 바뀔 때 마다 다 바꾸어주어야 하기 때문이며, 이는 SOLID원칙에 어긋나기 때문이다. <br />

그런데 이것을 따로 따로 만들면 바뀌는 기능 하나만 바꾸면 된다. <br />

그러면 '어떻게 구현 할 것인가?' 에 대한것이 '디자인 패턴화' 했다고 표현한다.

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93545726-1b82e900-f99c-11ea-849b-ced2a5cb1fa3.png" width = 70%> </img></p>

맨 위 Componenet(컴포넌트)라는 것은 interface이고, operation()이라는 function을 가지고 있다. <br />
그리고 이 것을 구현한 게 두 개가 있는데 첫번째가 ConcreteComponent인데 실제로 Componenet interface를 구현했고, operation()을 가지고 있다. <br />
ConcreteComponent는 기본 기능을 만들었다고 생각하면 된다. 볼펜으로 따지면 글쓰는 기능이 된다. <br />
Decorator는 component interface를 맴버 변수로 가지고 있다. Componenet를 구현하고 동시에 맴버 변수로 다른 Componenet interface를 들고 있는 것이다. <br />
그래서 이것이 operation()하면 Decorator가 가지고 있는 component안에도 operation()를 호출하고 호출이 끝나면 자기 것을 하는데 <br />
이 Decorator가 상속해서 있는 것이 ConcreteDecorator가 있는데 '부가기능'을 의미한다. 예를들어 '압축'을 한다거나, '암호화'를 한다거나 등의 기능을 담당한다. <br />
ConcreteDecorator의 operation()이 호출이 되면 자기가 가지고 있는 맴버 변수의 컴포넌트(Decorator 의 컴포넌트)를 먼저 호출하고, 그 다음에 자기 것을 호출하는 형태이다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93547333-cba62100-f99f-11ea-97bd-e0e4ebe0f52a.png" width = 70%> </img></p>
이거는 또 다른 예제인데, UI에서 윈도우를 그린것이라고 생각하면 된다. <br />
Window라는 interface가 있는데 darw(), getDescription()이 있다고 치면 얘네를 구현한 SimpleWindow라는 것이 있는데 <br />
SimpleWindow에게 종, 횡 스크롤바를 부가기능을 넣는다 할 때 draw, getDescription이 있기 때문에 이 Window 자체 기능이 아니다. <br />
그래서 SimpleWindow는 Window 자체 기능을 담당 하는 것이고, Window를 상속 받아서 WindowDecorator라는 것이 있는데 이것은 Window를 맴버 변수로 가지고 있다.
이것을 구현한 맴버 구조체가 두가지가 있는데 HorizontalScrollBarDecorator(횡스크롤 바)와 VerticalScrollBarDecorator(종 스크롤바) 가 있다.
기본 기능은 SimpleWindow가 있는데 여기에 저 둘을 붙이는 것이다. <br />
그래서 VerticalScrollBarDecorator가 있고, VerticalScrollBarDecorator이 다시 HorizontalScrollBarDecorator를 맴버 변수로 가지고 있고, <br />
HorizontalScrollBarDecorator이 SimpleWinodw를 맴버 변수로 가지고 있는 상태이다. <br />
그래서 맨 앞에 있는 VerticalScrollBarDecorator을 호출하게 되면 HorizontalScrollBarDecorator의 draw()을 호출하게 되고, HorizontalScrollBarDecorator의 draw()을 호출하게 되면, <br />
SimpleWindow의 draw()가 호출하게 된다. 그 다음 SimpleWindow의 draw()가 호출이 끝나면 return되서 횡 스크롤 바가 본인의 스크롤을 그리게 되고, 또 return되서 종 스크롤바가 본인의 스크롤을 그리게 된다. <br /> 
그래서 SimpleWindow가 먼저 그려지게 되고, 횡 스크롤 붙이고, 종 스크롤 붙여서 하나의 과정이 되는 것을 그린 것이다. <br />


이제 이것을 구현해보자! <br />

Data를 전송할 때 -> 암호화 -> 압축 -> 전송 <br />
Data를 받을 때 -> unzip -> Decrypt -> Data <br />

<code>main.go</code>

``` Go
  package main

  type Component interface { // 1
    Operator(string)
  }

  var sentData string
  var recvData string

  type SendComponent struct {}

  func (self *SendComponent) Operator(data string) { // 2
    // Send data
    sentData = data
  }
  
  type ZipComponent struct { // 3
	  com Component
  }
  
  func (self *ZipComponent) Operator(data string) { // 4
    zipData, err := lzw.Write([]byte(data)) // 4
    if err != nil {
      panic(err)
    }
    self.com.Operator(string(zipData)) // 4
  }

  type EncryptComponent struct { // 5
    key string
    com Component
  }

  func (self *EncryptComponent) Operator(data string) { 
    encryptData, err := cipher.Encrypt([]byte(data), self.key) // 6
    if err != nil {
      panic(err)
    }
    self.com.Operator(string(encryptData))
  }
  
  func main() { // 7
    semder := &EncryptComponent{key:"abcde",
     com: &ZipComponent{
        com: &SendComponent{}
        }
      }  
      sender.Operator("Hello World")
      fmt.Println(sentData)
  }


```

 1 : 컴포넌트 인터페이스 정의 <br />
 2 : SendComponent의 Operator 함수 호출 <br />
     -> 실질적으로 data가 전송되는 기본 기능(실적으로 네트워크를 통해서든 보내야 하는데 테스트기 때문에 저렇게 작성함) <br />
 3 : 압축하는 컴포넌트 <br />
 4 : ZipComponent의 Operator 함수 호출<Br />
     byteAarry와 error가 배출 되는데 각각 zipData, err변수에 담는다.<br />
     ZipComponent데코레어터가 데코레이트 하고 있는 실제 컴포넌트의 self.com.Operator를 압축한 data를 호출<br />
 5 : Encrypt데코레이터 생성. 데코레이터기 때문에 다른 컴포넌트를 가지고 있다. <br />
 6 : Encrypt라는 func이 있는데 byte[]와 key를 받으면 결과로 byte[]가 나오고 error가 나오기 때문에 key값과 data를 넣어준다. <br />
 7 : 암호화하고, 압축하고 전송하는 것을 테스트 하기위해 main함수 선언. <br />
     그래서 Encrypt를 먼저 만들고 이 안에 컴포넌트를 압축하는 컴포넌트로 만들고 또 그 안에 컴포넌트를 전송하는 컴포넌트로 만들어준다. <br />
     이렇게되면 암호화하는 컴포넌트가 ZipComponent를 가지고 있고 ZipComponent가 SendComponent하는 컴포넌트를 가지게 된다. <br />
     그래서 이것을 sender라는 변수를 선언해서 sender에 operator함수를 호출해서 보내고 싶은 데이터를 보내게 한다. <br />
     그렇게 처리된 데이터가 sentData에 나오게 된다.
     
이제 실행을 해보자!
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93575315-746e7380-f9d4-11ea-9ec8-89b4c8111382.png" width = 70%> </img></p>

알 수 없는 글씨가 나왔는데 이것이 HelloWorld를 먼저 암호화 한 다음에 압축한 결과를 나타내준 것이다. <br />
이것을 제대로 보려면 압축을 풀고, 암호화를 해제하는 컴포넌트를 만들면 된다. <Br />

main 함수 바로 위에 암호화를 해제하는 컴포넌트와 압축을 푸는 컴포넌트를 만들어보자! <br />

``` Go
  var recvData string // 7
  
  type DecryptComponent struct { // 1
    key string
    com Component
  }

  func (self *DecryptComponent) Operator(data string) {  // 2
    decryptData, err := cipher.Decrypt([]byte(data), self.key)
    if err != nil {
      panic(err)
    }
    self.com.Operator(string(decryptData))
  }

  type UnzipComponent struct { // 3
    com Component
  }

  func (self *UnzipComponent) Operator(data string) { // 4
    unzipData, err := lzw.Read([]byte(data))
    if err != nil {
      panic(err)
    }
    self.com.Operator(string(unzipData))
  }
  
  type ReadComponent struct {}  // 6
  
  func (self *ReadComponent) Operator(data string) {
    recvData = data
  }
  
   func main() {
	sender := &EncryptComponent{
		key: "abcde",
		com: &ZipComponent{
			com: &SendComponent{},
		},
	}

	sender.Operator("Hello World")

	fmt.Println(sentData)

	receiver := &UnzipComponent{
		com: &DecryptComponent{
			key: "abcde",
			com: &ReadComponent{},
		},
	}

	receiver.Operator(sentData) // 8
	fmt.Println(recvData) // 8
}



```

 1 : Decrypt 컴포넌트 <br />
     -> 데코레이터이기 때문에 컴포넌트를 가지고 있고, 암호를 풀어야 하기 때문에 key를 가지고 있다. <br />
 2 : 컴포넌트 인터페이스를 implements하기 때문에 Operator func을 구현하고 있어야 한다. 
     -> 데이터와 키를 넘기면 압축이 풀리는 데이터를 전해주는 역할을 한다. <br />

 3 : Unzip 컴포넌트 생성 <br />
 4 : 마찬가지로 컴포넌트 인터페이스를 implements하기 때문에 Operator func을 구현하고 있어야 한다.  <br />
     -> Read()함수가 하는 일은 데이터를 넘기면 압축을 풀어준다. <br />
     
 5 : 데이터를 넘겨주면 압축을 풀고, 암호를 풀고 데이터를 나타내주는 변수. <br />
 
 6 : 데이터를 나타내는 컴포넌트 <br />
 7 : sentData를 세팅한 것 처럼 recvData데이터 셋팅 <br /> 
 8 : receiver를 실행해야 하는데 실행하는 데이터의 인자는 sentData로, 실행이 된 다음에는 recvData로 호출하게 한다. <br />
 
이제 실행을 해보자!
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93577993-b220cb80-f9d7-11ea-959e-be29c6b711b4.png" width = 70%> </img></p>
send된 데이터는 이상하게 보이지만, Unzip하고 암호화 해제한 데이터는 Hello World인 것을 할 수 있다. <br />

Decorator 패턴은 &EncryptComponent, &UnzipComponent, &ZipComponent, &DecryptComponent등의 데코레이터 들이 변경되더라도 SendComponent나 ReadComponent하는 부분은 변경 되지 않아도 된다.<br />

가령 예를들어 암호화를 하지않고 주고 받는 것을 한다고 한다면
``` Go
   func main() {
	sender := &ZipComponent{
			com: &SendComponent{},
		},
	}

	sender.Operator("Hello World")

	fmt.Println(sentData)

	receiver := &UnzipComponent{
			com: &ReadComponent{},
		},
	}

	receiver.Operator(sentData) 
	fmt.Println(recvData)
}

```

이런식의 코드가 나오며
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/93578404-3ffcb680-f9d8-11ea-8658-596158b4591b.png" width = 70%> </img></p>
그대로 동작 하고 있음을 알 수 있다.

### 풀 소스
<code>cipher/cipher.go</code>
``` Go
  package cipher

  import (
    "crypto/aes"
    "crypto/cipher"
    "crypto/md5"
    "crypto/rand"
    "encoding/hex"
    "io"
  )

  func createHash(key string) string {
    hasher := md5.New()
    hasher.Write([]byte(key))
    return hex.EncodeToString(hasher.Sum(nil))
  }

  // Encrypt encrypt data using aes
  func Encrypt(data []byte, passphrase string) ([]byte, error) {
    block, err := aes.NewCipher([]byte(createHash(passphrase)))
    if err != nil {
      return nil, err
    }
    gcm, err := cipher.NewGCM(block)
    if err != nil {
      return nil, err
    }
    nonce := make([]byte, gcm.NonceSize())
    if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
      return nil, err
    }
    ciphertext := gcm.Seal(nonce, nonce, data, nil)
    return ciphertext, nil
  }

  // Decrypt decrypt data using aes
  func Decrypt(data []byte, passphrase string) ([]byte, error) {
    key := []byte(createHash(passphrase))
    block, err := aes.NewCipher(key)
    if err != nil {
      return nil, err
    }
    gcm, err := cipher.NewGCM(block)
    if err != nil {
      return nil, err
    }
    nonceSize := gcm.NonceSize()
    nonce, ciphertext := data[:nonceSize], data[nonceSize:]
    plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
    if err != nil {
      return nil, err
    }
    return plaintext, nil
  }

```

<code>lzw/lzw.go</code>

``` Go

  package lzw

  import (
    "bytes"
    "compress/lzw"
    "fmt"
    "io/ioutil"
  )

  // Write zip the data using lzw
  func Write(data []byte) ([]byte, error) {
    buf := new(bytes.Buffer)
    writer := lzw.NewWriter(buf, lzw.LSB, 8)
    n, err := writer.Write(data)
    if n != len(data) {
      return nil, fmt.Errorf("Not enough write:%d dataSize:%d", n, len(data))
    }
    if err != nil {
      return nil, err
    }
    writer.Close()
    return buf.Bytes(), nil
  }

  // Read unzip the data using lzw
  func Read(data []byte) ([]byte, error) {
    r := bytes.NewReader(data)
    reader := lzw.NewReader(r, lzw.LSB, 8)
    origData, err := ioutil.ReadAll(reader)
    if err != nil {
      return nil, err
    }
    return origData, nil
  }

```

<code>main.go</code>

``` Go
  
  package main

  import (
    "fmt"

    "./cipher"
    "./lzw"
  )

  type Component interface {
    Operator(string)
  }

  var sentData string
  var recvData string

  type SendComponent struct{}

  func (self *SendComponent) Operator(data string) {
    // Send data
    sentData = data
  }

  type ZipComponent struct {
    com Component
  }

  func (self *ZipComponent) Operator(data string) {
    zipData, err := lzw.Write([]byte(data))
    if err != nil {
      panic(err)
    }
    self.com.Operator(string(zipData))
  }

  type EncryptComponent struct {
    key string
    com Component
  }

  func (self *EncryptComponent) Operator(data string) {
    encryptData, err := cipher.Encrypt([]byte(data), self.key)
    if err != nil {
      panic(err)
    }
    self.com.Operator(string(encryptData))
  }

  type DecryptComponent struct {
    key string
    com Component
  }

  func (self *DecryptComponent) Operator(data string) {
    decryptData, err := cipher.Decrypt([]byte(data), self.key)
    if err != nil {
      panic(err)
    }
    self.com.Operator(string(decryptData))
  }

  type UnzipComponent struct {
    com Component
  }

  func (self *UnzipComponent) Operator(data string) {
    unzipData, err := lzw.Read([]byte(data))
    if err != nil {
      panic(err)
    }
    self.com.Operator(string(unzipData))
  }

  type ReadComponent struct{}

  func (self *ReadComponent) Operator(data string) {
    recvData = data
  }

  func main() {
    sender := &EncryptComponent{
      key: "abcde",
      com: &ZipComponent{
        com: &SendComponent{},
      },
    }

    sender.Operator("Hello World")

    fmt.Println(sentData)

    receiver := &UnzipComponent{
      com: &DecryptComponent{
        key: "abcde",
        com: &ReadComponent{},
      },
    }

    receiver.Operator(sentData)
    fmt.Println(recvData)
  }

```
