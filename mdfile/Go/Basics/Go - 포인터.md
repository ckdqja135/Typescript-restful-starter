### 시작
C#, Java는 포인터가 없지만 명시적으로 없을 뿐이지 묵시적으로 내부에선 포인터를 사용하고 있다. <br />
Golang은 포인터가 있다. 대부분 현대언어는 포인터가 없다. 이해하기 어려운 부분도 있고, 포인터 연산자체가 메모리를 직접 접근하기 때문에 위험하기 때문에 <br />
다른 언어들은 포인터를 감추어 내부에서만 사용하고 있다. 포인터를 감추다보니 다른 언어에서는 또 다른 문제들이 생겨나게 되었다. <br />
내부 기능을 이해하기 어려운 부분도 있고, 이 타입이 Pointer타입인지, Value타입인지를 명시적으로 나와 있지 않다 보니까 프로그래머가 알고 있어야 되는데 <br />
그것을 잘 모르고 사용하면 문제가 되는 케이스가 발생하게 된다. <br />

그 반면에 C, C++은 포인터를 가지고 있다. 그런데 포인터의 연산이나 단순히 포인터가 주소 참조 뿐만 아니라 연산이나 형변환 등을 이용해서 굉장히 어려운 문제들이 생겨난다. <br />
그래서 처음에 C나 C++을 배우게 될 때 시험문제를 내주는 사람이 아주 까다롭게 내기 좋은게 포인터였다. (문제를 위한 문제같은....) <br />
그래서 실제로 개발하면서 별로 사용되지 않는 것들이 문제로 나오는 경우들이 많다. <br />

가령 예를 들면

``` C
  
  int * p = 0x0001;
  p += 0x10;
  *p = 1000;
  *((char *)p) = ?
  
```

이런 문제들을 묻는 경우들의 문제를 내기 좋은게 포인터이다. <br />

그래서 이렇게 생겨도 문제, 안생겨도 문제가 생겼는데 Golang은 조금 심플하게 접근을 하였다. <br />
Pointer라는게 어쨌든 존재하는 것이고, 명시적이든, 묵시적이든 개발자가 알아야 되는 것이라면 명시적으로 꺼내 놓았고, 대신 기존 C, C++에서 있었던 연산이나 Casting을 막았다. <br />
직관적으로 심플하고, 명확하게 사용하자는게 Golang의 포인터의 목적이다. <br />

이제 코드로 예제를 살펴보자! <br />

``` Go

  package main

  import "fmt"

  func main() {
    var a int
    var p *int

    p = &a
    a = 3
    
	  fmt.Println(a)
    fmt.Println(p)
  }

```
포인터도 하나의 형태의 타입이기 때문에 <code>*int</code>로 사용해야 하고, <br />
p는 a의 메모리 주소를 가지기 때문에 <code>p = &a</code>로 해야 하는데 <code>p = a</code>로 하면 <br />
**cannot use a (type int) as type *int in assignment**라는 에러가 난다. <br />
해석하면 포인터 타입에 int타입 값을 넣을 수 없다는 의미이다. <br />

이 상태에서 값이 어떻게 나오는지 확인해보자.

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97066655-011ed980-15f2-11eb-9a54-5ffea35f7622.png" width = 70%> </img></p>

3과 a값의 주소 값이 나온다. <br />
p의 메모리 주소가 실제 값을 나타내기 위해서는 


``` Go

  package main

  import "fmt"

  func main() {
    var a int
    var p *int

    p = &a
    a = 3
    
	  fmt.Println(a)
    fmt.Println(p)
    fmt.Println(*p)
  }

```
이렇게 수정해주면 된다. 그 후 출력시키게 되면 다음과 같다.<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97066688-4c38ec80-15f2-11eb-99cd-035eb3b8fd05.png" width = 70%> </img></p>

