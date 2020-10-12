우선 Go언어는 C계열 언어로 분류되어 있어 객체지향 언어가 아니다. <br />

### 1. 사라진 세미콜론
``` Go
  package main
  
  import (
      "fmt"
  )
  
  func main() {
      fmt.Println("Hello World")
  }
  
```

Go 컴파일러가 컴파일을 할 때 세미콜론을 자동으로 달아준다. <br />
이 세미콜론을 제외한 선택 때문에 제약이 하나 있는데, <br />

``` Go

if(x) { // 가능
  todo
}

if(x) // 불가능
{
  todo
}

```
이렇게 한칸 띄고 괄호를 넣는 스타일의 방법을 사용하지 못한다. <br />

### 2. if사용 시 괄호 자동 삭제. 

``` Go

if(true) {
   fmt.Println("Hello World")
}

``` 

이렇게 작성 후 저장하면 괄호가 자동으로 삭제된다. <br />

### 3. 변수 선언

``` Go
  
  var a int = 1
  var b [10] int
  
```

보통 이런식으로 선언을 할 수 도 있지만 변수를 선언함과 동시에 값을 할당하고 싶다면

``` Go

a := 1

```

이렇게 쓰면 된다. 1이 들어갔기 때문에 a가 int타입의 변수라는 것으로 자동으로 인식을 한다. <br />

#### 변수 자동 초기화
int는 0, String은 "", pointer는 nil, float는 0.0, bool은 false
 
### 4. 사용하지 않는 패키지 import시. 
예를 들어
``` Go
  
  package main
  
  import (
    "fmt"
    "reflect"
  )
  
  func main() {
  
    a := 1
    
    fmt.Println(a)
  
  }
  
```

reflect패키지는 변수의 타입을 알고 싶을 때 사용하는 패키지인데 Android나 javascript 같은 경우 사용하지 않는 패키지에 따로 표시하지만 <br />
VScode의 경우엔 사용하지 않는 패키지를 없애주지만, LiteIDE라는 Tool 같은 경우엔 <code>imported and not used:"reflect"</code>라는 컴파일 에러가 뜬다. <br />

#### 사용하지 않는 변수.
아래와 같이 a,b를 선언했을 때 b를 사용하지 않으면 오류표시가 뜨는 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95722229-a2cb3000-0cae-11eb-8090-d88cfd9df2a6.png" width = 70%> </img></p>

에러 명은 다음과 같다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95722335-bf676800-0cae-11eb-9970-1b0631cb47a7.png" width = 70%> </img></p>


### 5. 반복문
Go에서는 while과 Do-While 을 날려버리고 for문만 남겨두었다. <br />

기본적으로 
``` Go
  
  for i := 0; i < 100; i++ {
  
  }
  
``` 
이렇게 쓸 수 있고, while이 없는 대신 while처럼

``` Go
  
  for n < 100 {
  
  }
  
```
이렇게도 쓸 수 있다. <br />

### 6. 접근 제어
객체지향 프로그래밍 언어에서 함수의 접근 제어하는 public, privete을 쓴다 할 때
``` java
 
  class changbeom {
    private a
    public b
    
    public void f1() {
    }
    
    private void f2() {
    }
    
  }
  
```
이런식으로 쓰였는데 Go언어에서는 객체지향 프로그래밍 언어는 아니지만 public, private를 쓸 수 있는데 <br />
함수의 이름이 대문자로 시작하면 public, 함수의 이름이 소문자로 시작하면 private이다. <br />

