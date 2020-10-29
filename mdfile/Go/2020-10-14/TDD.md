## 시작
TDD란 Test Driven Development의 약자인데 테스트 주도 개발법이라는 뜻이며 개발방법인데 테스트가 주도하는 개발 방법이라는 의미이다. <br />

기존의 개발법은 설계 - 코딩 - 테스트 테스트에서 문제가 발생하면 다시 코딩하는 방식이였었는데 <br />
TDD는 테스트 - 코딩 - 개선을 반복하는 방식이다. <br />

간단하게 TDD를 실습해보자면 Calculator("+", 3, 2)를 만들어서 실행시켰을 때 5라는 결과가 나오는 함수를 만들어본다. <br />
TDD니까 처음부터 테스트를 시켜준다. <br />
<code>hello.go</code>

``` Go

  package main

  func main() {
	  Test()
  }

```

이렇게 작성 후에 코드를 실행 시켜 보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95935476-539c1100-0e0e-11eb-85e0-0c6e0f0abc26.png" width = 70%> </img></p>
<code>undefined: Test</code>가 뜨는 것을 확인 할 수 있다. <br />

이제 Test()를 만들어준다. 여기서 Calculate()를 테스트 할 것이다. <br />

``` Go

  package main

  func main() {
	  Test()
  }
  
  func Test() {

    o := Calculate("+", 3, 2)
    if o != 5 {
      fmt.Printf("Test Failed! expected: %d output:%d\n", 5, o)
      return 
    }
  }
  
```

Calculate라는 함수를 만들고, 결과값이 5가 아니면 에러문구로 원하는 값과, 실제 나온 값을 출력시켜준다. <br />

이렇게 하고, 다시 실행 시켜준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95935890-403d7580-0e0f-11eb-8c62-20e1770593bc.png" width = 70%> </img></p>
당연하게 Calculate라는 함수를 만들지 않았기 때문에 에러가 났다. <br />
이것이 TDD의 모습이다. 코딩이 없는 상태에서 먼저 테스트 부터 하니까 당연히 에러가 나는 것이고, 실패부터 겪는 것이다. <br />

TDD는 앞서 말했듯이 테스트를 먼저하고, 그 다음에 코딩을 하는데, 테스팅을 하는 시점에서 코드가 없기 때문에 첫번째로는 실패를 하는데, <br />
실패를 일단 되도록 실패가 없도록 성공으로 바꿔야 한다. <br />
전체를 다 바꾸는게 아니라 실패된 사항만 성공으로 코딩이다.<br />
실패를 겪고, 성공을 겪은 그 다음이 개선인데, 개선작업은 성공강화이다. <br />
성공한 경험을 강화시킨다라는 의미인데, 이것 후에 다시 실패한 사항으로 돌아가고, 반복하는게 TDD이다. <br />

지금 실패를 겪은 사항이 Calculate라는 함수가 없는데, Calculate가 없다라는 에러부분만 극복하도록 만들어준다. <br />
우선 Calculate()를 만들어준다. <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
    return 0
  }
  
  func main() {
	  Test()
  }
  
  func Test() {

    o := Calculate("+", 3, 2)
    if o != 5 {
      fmt.Printf("Test Failed! expected: %d output:%d\n", 5, o)
      return 
    }
  }
  
```
operation과 int 인자를 2개를 받고 결과가 int인 Calculate()를 0을 return하도록 만들어준다. 한번에 만드는 것이 아니라 지금 나타난 실패만 극복할 수 있도록 만들어준다. <br />
이제 다시 실행해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936592-eb9afa00-0e10-11eb-838c-c344f20aaeca.png" width = 70%> </img></p>
이제 새로운 에러가 나타났다. 원하는 값은 5인데 0이 나왔다. <br />
이 실패를 성공으로 바꾸려면 return 0이 아니라 return 5를 해주면 된다. <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
    return 5
  }
  
  func main() {
	  Test()
  }
  
  func Test() {

    o := Calculate("+", 3, 2)
    if o != 5 {
      fmt.Printf("Test Failed! expected: %d output:%d\n", 5, o)
      return 
    }
  }
  
```
이제 저장 후에 다시 실행하면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936706-2dc43b80-0e11-11eb-9b72-6eb2956abc69.png" width = 70%> </img></p>
성공했기 때문에 성공 메세지를 출력시켜주도록 한다. <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
    return 5
  }
  
  func main() {
	  Test()
  }
  
  func Test() {

    o := Calculate("+", 3, 2)
    if o != 5 {
      fmt.Printf("Test Failed! expected: %d output:%d\n", 5, o)
      return 
    }
    fmt.Println("Success!")
  }
  
```

이 부분이 어떻게 보면 성공강화과정이라고 볼 수 있다. <br />

다시 실행 시키면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>
성공 문구가 뜨는 것을 확인할 수 있다. <br />

이제 이 테스트가 넘어갔으니 다른 테스트도 진행해보자! <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
    return 5
  }
  
  func main() {
	  Test()
  }
  
  func Test() {

    o := Calculate("+", 3, 2)
    if o != 5 {
      fmt.Printf("Test Failed! expected: %d output:%d\n", 5, o)
      return 
    }
    
    o = Calculate("+", 5, 4)
    if o != 9 {
      fmt.Printf("Test Failed! expected: %d output:%d\n", 9, o)
      return 
    }
    fmt.Println("Success!")
  }
  
```

여기서 어떻게 되는지 다시 실행을 시켜준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95937032-d377aa80-0e11-11eb-9c32-ea04a9598938.png" width = 70%> </img></p>
에러가 떴다. 9를 원했는데 5가 나왔다. <br />
이 실패를 겪었기 때문에 첫번째, 두번째 테스트가 성공되도록 바꾸어주자. <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
    return a + b
  }
  
  func main() {
	  Test()
  }
  
  func Test() {

    o := Calculate("+", 3, 2)
    if o != 5 {
      fmt.Printf("Test Failed! expected: %d output:%d\n", 5, o)
      return 
    }
    
    o = Calculate("+", 5, 4)
    if o != 9 {
      fmt.Printf("Test Failed! expected: %d output:%d\n", 9, o)
      return 
    }
    fmt.Println("Success!")
  }
  
```

이것도 단순하게 return a + b로 바꾸어주면 된다. <br />

그래서 다시 실행 해보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>
성공 문구가 뜨는 것을 확인할 수 있다. <br />

지금까지 성공으로 바꾸는 코딩만 했기 때문에 성공강화를 시켜주어야 한다. <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
    return a + b
  }
  
  func main() {
	  Test()
  }
  
  func Test() {

    o := Calculate("+", 3, 2)
    if o != 5 {
      fmt.Printf("Test1 Failed! expected: %d output:%d\n", 5, o)
      return 
    }
    
    o = Calculate("+", 5, 4)
    if o != 9 {
      fmt.Printf("Test2 Failed! expected: %d output:%d\n", 9, o)
      return 
    }
    
    fmt.Println("Success!")
  }
  
```

우선 몇번 테스트가 실패 했는지 확인하기 위해 테스트 번호를 붙여주고, 성공강화가 리팩토링 할 곳이 있으면 리팩토링 하는 것인데 <br />
지금 여기에서 리팩토링 할 요소는 <br />

``` Go 

  o := Calculate("+", 3, 2)
  if o != 5 {
    fmt.Printf("Test1 Failed! expected: %d output:%d\n", 5, o)
    return 
  }

  o = Calculate("+", 5, 4)
  if o != 9 {
    fmt.Printf("Test2 Failed! expected: %d output:%d\n", 9, o)
    return 
  }
    
```

반복되고 있는 이 부분이다. 이 반복을 없애는 리팩토링을 진행해보자! <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
    return a + b
  }
  
  func main() {
	  Test()
  }
  
  func Test() {
    if !testCalculate("Test1", "+", 3, 2, 5) {
      return
    }

    if !testCalculate("Test2", "+", 5, 4, 9) {
      return
    }

    fmt.Println("Success!")
  }
  
  func testCalculate(testcase, op string, a, b int, expected int) bool {
    o := Calulate(op, a, b)
    if o != expected {
      fmt.Printf("%s Failed! expected: %d output:%d\n", testcase, expected, o)
      return false
    }
    return true
  }
  
```

testCalculate()라는 함수를 만들어서 테스트 케이스 이름, a , b인자와 원하는 결과 값을 넣어주고, 성공 실패를 bool로 나타내준다. <br />
그리고 이 안에 반복되는 코드들을 넣어준다. 그 후 실패했을 경우 false, 성공했을 경우 true를 넣어준다. <br />
그 후 Test()안에 해당 값이 false가 나오면 그냥 return시켜주도록 바꾸어 준다. <br />
지금 전 코드 보다 훨씬 단순해졌고, 쉬워졌다. <br />
지금도 성공을 했는지 실행시켜본다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>

이제 다른 케이스를 만들어준다. <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
    return a + b
  }
  
  func main() {
    Test()
  }
  
  func Test() {
    if !testCalculate("Test1", "+", 3, 2, 5) {
      return
    }

    if !testCalculate("Test2", "+", 5, 4, 9) {
      return
    }
    
    if !testCalculate("Test3", "-", 5, 3, 2) {
      return
    }

    fmt.Println("Success!")
  }
  
  func testCalculate(testcase, op string, a, b int, expected int) bool {
    o := Calulate(op, a, b)
    if o != expected {
      fmt.Printf("%s Failed! expected: %d output:%d\n", testcase, expected, o)
      return false
    }
    return true
  }
  
```

"-"테스트 케이스를 추가했다. 이제 결과를 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95938020-f1dea580-0e13-11eb-8b81-143abeb86cfa.png" width = 70%> </img></p>

실패했다. 이제 성공으로 바꾸어줄 코딩을 해야한다. <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
     if op == "+" {
       return a + b
     } else if op == "-" {
       return a - b
     }
     return 0
  }
  
  func main() {
    Test()
  }
  
  func Test() {
    if !testCalculate("Test1", "+", 3, 2, 5) {
      return
    }

    if !testCalculate("Test2", "+", 5, 4, 9) {
      return
    }
    
    if !testCalculate("Test3", "-", 5, 3, 2) {
      return
    }

    fmt.Println("Success!")
  }
  
  func testCalculate(testcase, op string, a, b int, expected int) bool {
    o := Calulate(op, a, b)
    if o != expected {
      fmt.Printf("%s Failed! expected: %d output:%d\n", testcase, expected, o)
      return false
    }
    return true
  }
  
```

이것을 성공으로 바꾸어주기 위해 Calulate()를 수정해주었다. <br />

다시 재실행 해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>

이제 성공 강화를 해야하는데 Calulate()에서 바꾸어야 할 거 같지만 아직까지 if문 2개까지는 괜찮다고 보여지고, 테스트 케이스를 추가해보자. <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
     if op == "+" {
       return a + b
     } else if op == "-" {
       return a - b
     }
     return 0
  }
  
  func main() {
    Test()
  }
  
  func Test() {
    if !testCalculate("Test1", "+", 3, 2, 5) {
      return
    }

    if !testCalculate("Test2", "+", 5, 4, 9) {
      return
    }
    
    if !testCalculate("Test3", "-", 5, 3, 2) {
      return
    }
    
    if !testCalculate("Test4", "-", 3, 6, -3) {
      return
    }

    fmt.Println("Success!")
  }
  
  func testCalculate(testcase, op string, a, b int, expected int) bool {
    o := Calulate(op, a, b)
    if o != expected {
      fmt.Printf("%s Failed! expected: %d output:%d\n", testcase, expected, o)
      return false
    }
    return true
  }
  
```
이번에는 조금 더 큰 수를 넣어보자! 테스트 케이스는 촘촘할 수 록 좋다. 
최댓값, 최솟값, 경계값 테스트는 넣을 필요가 있다. (지금은 경계값 테스트는 아니지만..) <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>

이제 곱하기 테스트 케이스를 추가해보자 <br />
``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
     if op == "+" {
       return a + b
     } else if op == "-" {
       return a - b
     }
     return 0
  }
  
  func main() {
    Test()
  }
  
  func Test() {
    if !testCalculate("Test1", "+", 3, 2, 5) {
      return
    }

    if !testCalculate("Test2", "+", 5, 4, 9) {
      return
    }
    
    if !testCalculate("Test3", "-", 5, 3, 2) {
      return
    }
    
    if !testCalculate("Test4", "-", 3, 6, -3) {
      return
    }
    
    if !testCalculate("Test5", "*", 3, 7, 21) {
      return
    }

    fmt.Println("Success!")
  }
  
  func testCalculate(testcase, op string, a, b int, expected int) bool {
    o := Calulate(op, a, b)
    if o != expected {
      fmt.Printf("%s Failed! expected: %d output:%d\n", testcase, expected, o)
      return false
    }
    return true
  }
  
```
이렇게 곱하기 테스트 케이스를 추가하고, 실행을 해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95939076-484ce380-0e16-11eb-8ed6-77cc48d697f1.png" width = 70%> </img></p>
21이 나와야 하는데 0이 나왔다고 에러문구가 떴다! 수정해주자. <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
     if op == "+" {
       return a + b
     } else if op == "-" {
       return a - b
     } else if op == "*" {
       return a * b
     }
     return 0
  }
  
  func main() {
    Test()
  }
  
  func Test() {
    if !testCalculate("Test1", "+", 3, 2, 5) {
      return
    }

    if !testCalculate("Test2", "+", 5, 4, 9) {
      return
    }
    
    if !testCalculate("Test3", "-", 5, 3, 2) {
      return
    }
    
    if !testCalculate("Test4", "-", 3, 6, -3) {
      return
    }
    
    if !testCalculate("Test5", "*", 3, 7, 21) {
      return
    }

    fmt.Println("Success!")
  }
  
  func testCalculate(testcase, op string, a, b int, expected int) bool {
    o := Calulate(op, a, b)
    if o != expected {
      fmt.Printf("%s Failed! expected: %d output:%d\n", testcase, expected, o)
      return false
    }
    return true
  }
  
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>

이제 Calulate()의 if문이 3개가 되었기 때문에 리팩토링 시켜주자! <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
     rst := 0
     switch op {
     case "+": 
         rst = a + b
     case "-":
         rst = a - b
     case "*":
         rst = a * b
     }
    return rst
  }
  
  func main() {
    Test()
  }
  
  func Test() {
    if !testCalculate("Test1", "+", 3, 2, 5) {
      return
    }

    if !testCalculate("Test2", "+", 5, 4, 9) {
      return
    }
    
    if !testCalculate("Test3", "-", 5, 3, 2) {
      return
    }
    
    if !testCalculate("Test4", "-", 3, 6, -3) {
      return
    }
    
    if !testCalculate("Test5", "*", 3, 7, 21) {
      return
    }
    
    fmt.Println("Success!")
  }
  
  func testCalculate(testcase, op string, a, b int, expected int) bool {
    o := Calulate(op, a, b)
    if o != expected {
      fmt.Printf("%s Failed! expected: %d output:%d\n", testcase, expected, o)
      return false
    }
    return true
  }
  
```

이렇게 좀 더 보기 좋게 switch문으로 바꾸어 줄 수 있다. 그 후 다시 실행시켜준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>

그 후 몇가지 테스트 케이스를 더 만들어본다. <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
     rst := 0
     switch op {
     case "+": 
         rst = a + b
     case "-":
         rst = a - b
     case "*":
         rst = a * b
     }
    return rst
  }
  
  func main() {
    Test()
  }
  
  func Test() {
    if !testCalculate("Test1", "+", 3, 2, 5) {
      return
    }

    if !testCalculate("Test2", "+", 5, 4, 9) {
      return
    }
    
    if !testCalculate("Test3", "-", 5, 3, 2) {
      return
    }
    
    if !testCalculate("Test4", "-", 3, 6, -3) {
      return
    }
    
    if !testCalculate("Test5", "*", 3, 7, 21) {
      return
    }
    
    if !testCalculate("Test6", "*", 3, 0, 0) {
      return
    }
    
    if !testCalculate("Test7", "*", 3, -3, -9) {
      return
    }

    fmt.Println("Success!")
  }
  
  func testCalculate(testcase, op string, a, b int, expected int) bool {
    o := Calulate(op, a, b)
    if o != expected {
      fmt.Printf("%s Failed! expected: %d output:%d\n", testcase, expected, o)
      return false
    }
    return true
  }
  
```

이렇게 하고 실행 시키면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>
통과가 되었다. <br />

이제 나누기 테스트 케이스를 추가시켜주자! <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
     rst := 0
     switch op {
     case "+": 
         rst = a + b
     case "-":
         rst = a - b
     case "*":
         rst = a * b
     }
    return rst
  }
  
  func main() {
    Test()
  }
  
  func Test() {
    if !testCalculate("Test1", "+", 3, 2, 5) {
      return
    }

    if !testCalculate("Test2", "+", 5, 4, 9) {
      return
    }
    
    if !testCalculate("Test3", "-", 5, 3, 2) {
      return
    }
    
    if !testCalculate("Test4", "-", 3, 6, -3) {
      return
    }
    
    if !testCalculate("Test5", "*", 3, 7, 21) {
      return
    }
    
    if !testCalculate("Test6", "*", 3, 0, 0) {
      return
    }
    
    if !testCalculate("Test7", "*", 3, -3, -9) {
      return
    }
    
    if !testCalculate("Test8", "/", 9, 3, 3) {
      return
    } 

    fmt.Println("Success!")
  }
  
  func testCalculate(testcase, op string, a, b int, expected int) bool {
    o := Calulate(op, a, b)
    if o != expected {
      fmt.Printf("%s Failed! expected: %d output:%d\n", testcase, expected, o)
      return false
    }
    return true
  }
  
```
실행 시켜주자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95940854-57ce2b80-0e1a-11eb-89d2-fd5702b56bf1.png" width = 70%> </img></p>
이번에도 3을 나오길 원했는데 0이 나왔다고 에러창이 떴다. 나누기 케이스를 추가해주자! <br />

``` Go

  package main
  
  import "fmt"
  
  func Calulate(op string, a, b int) int {
     rst := 0
     switch op {
     case "+": 
         rst = a + b
     case "-":
         rst = a - b
     case "*":
         rst = a * b
     case "/":
         rst = a / b
     }
    return rst
  }
  
  func main() {
    Test()
  }
  
  func Test() {
    if !testCalculate("Test1", "+", 3, 2, 5) {
      return
    }

    if !testCalculate("Test2", "+", 5, 4, 9) {
      return
    }
    
    if !testCalculate("Test3", "-", 5, 3, 2) {
      return
    }
    
    if !testCalculate("Test4", "-", 3, 6, -3) {
      return
    }
    
    if !testCalculate("Test5", "*", 3, 7, 21) {
      return
    }
    
    if !testCalculate("Test6", "*", 3, 0, 0) {
      return
    }
    
    if !testCalculate("Test7", "*", 3, -3, -9) {
      return
    }
    
    if !testCalculate("Test8", "/", 9, 3, 3) {
      return
    } 

    fmt.Println("Success!")
  }
  
  func testCalculate(testcase, op string, a, b int, expected int) bool {
    o := Calulate(op, a, b)
    if o != expected {
      fmt.Printf("%s Failed! expected: %d output:%d\n", testcase, expected, o)
      return false
    }
    return true
  }
  
```

이제 실행을 시켜보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>
이제 성공을 했으니 성공 강화를 해보자! <br />

``` Go 

  func Calulate(op string, a, b int) int {
     rst := 0
     switch op {
     case "+": 
         rst = a + b
     case "-":
         rst = a - b
     case "*":
         rst = a * b
     case "/":
         rst = a / b
     }
    return rst
  }
  
```
이 부분 단순한 function을 위해서는 나쁘지는 않지만 지금은 연습하는 것이기 때문에 좀 더 이 부분을 리팩토링 해보도록 하겠다. <br />
행위를 클래스로 캡슐화해 동적으로 행위를 자유롭게 바꿀 수 있게 해주는 패턴
같
[strategy패턴](https://gmlwjd9405.github.io/2018/07/06/strategy-pattern.html)을 사용해서 리팩토링을 진행해보겠다. <br />

``` Go

  package main
  
  import "fmt"
  
  var opMap map[string]func(int, int) int // 1
  
  func inintopMap() { // 3
      opMap = make(map[string]func(int, int) int)
      
      opMap["+"] = add
      opMap["-"] = sub
      opMap["*"] = mul
      opMap["/"] = div
  }

  func add(a, b int) int { // 4
    return a + b
  }
  
  func sub(a, b int) int {
    return a - b
  }
  
  func mul(a, b int) int {
    return a * b
  }

  func div(a, b int) int {
    return a / b
  }
  
  func Calulate(op string, a, b int) int { // 5
     if v, ok := opMap[op]; ok {
	return v(a, b)
     }
     return 0
  }
  
  func main() {
    inintopMap() // 2
    Test()
  }
  
  func Test() {
   ...

    fmt.Println("Success!")
  }

  ...
  
```

1 : opMap이라는 맵을 만들어준다. key 타입은 string, value 타입은 int형 2개를 받고, 결과를 int를 반환하는 람다 함수를 갖는다. <br />
2 : 이 맵은 main()에서 initOpMap()으로 초기화가 된다. <br />
3 : 먼저 opMap을 초기화 시켜주고, 각각의 function을 대입시켜준다. <br />
4 : 그 후 각각의 function을 추가시켜준다. <br />
5 : opMap이 있으면 v에 a,b를 넣어주고, 없으면 0을 return 시킨다.

이렇게 해서 성공강화를 했고, 실행을 시키면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>
성공하는 것을 볼 수 있다. <br />
이렇게 까지하면 Test Driven방식으로 Calculate가 완성이 되었다. <br />

나중에 이 코드를 인수인계 했을 때

``` Go

  func main() {
    inintopMap()
    // Test()
  }
  
```
이 부분만 주석처리해서 주면 된다. <br />

만약 추가적인 제곱해주는 기능을 추가하려 할 때 마찬가지로 먼저 테스트 케이스 부터 추가를 해준다.<br />

``` Go
  ...
  
  func Test() {
    ...
    if !testCalculate("Test9", "**", 2, 3, 8) {
      return
    }
    ...
  }
  
```
그 후 또 에러를 확인하고, <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95946617-e2695780-0e27-11eb-813a-63b7a787007a.png" width = 70%> </img></p>

저 부분만 해결 해주기 위해

``` Go
 ...
 
 func inintopMap() {
    opMap = make(map[string]func(int, int) int)

    opMap["+"] = add
    opMap["-"] = sub
    opMap["*"] = mul
    opMap["/"] = div
    opMap["**"] = pow
   }

  func add(a, b int) int {
    return a + b
  }
  func sub(a, b int) int {
    return a - b
  }
  func mul(a, b int) int {
    return a * b
  }
  func div(a, b int) int {
    return a / b
  }

  func pow(a, b int) int {
    return 8
  }

```
이렇게 추가해주고, 다시 실행해서 제대로 실행되는지 확인을 한 뒤 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>

제대로 된 기능으로 수정해준다. <br />
``` Go
  ...
  
  func inintopMap() {
    opMap = make(map[string]func(int, int) int)

    opMap["+"] = add
    opMap["-"] = sub
    opMap["*"] = mul
    opMap["/"] = div
    opMap["**"] = pow
   }

  func add(a, b int) int {
    return a + b
  }
  func sub(a, b int) int {
    return a - b
  }
  func mul(a, b int) int {
    return a * b
  }
  func div(a, b int) int {
    return a / b
  }

  func pow(a, b int) int {
    rst := 1
    for i := 0; i < b; i++ {
      rst *= a
    }
   return rst
  }

...

```

그 후 다시 실행을 해서 테스트가 되는지 확인하면 된다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/95936856-7da30280-0e11-11eb-8a20-189cccd725c6.png" width = 70%> </img></p>
