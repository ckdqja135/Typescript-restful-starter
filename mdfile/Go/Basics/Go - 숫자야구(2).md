## 시작

지난번에 이어서 숫자야구를 마저 만들어보도록 하자! <br />

그 다음은 키보드로 부터 입력값을 받는것인데 [여기](https://stackoverflow.com/questions/3751429/reading-an-integer-from-standard-input)에 들어가면 알 수 있다. <br />

``` Go

  func InputNumbers() [3]int {
    // 두 개의 숫자 3개를 비교해서 결과를 반환한다.
    var rst [3]int
    for {
      var no int
      _, err := fmt.Scanf("%d", &no)
      if err != nil {
          fmt.Println("잘못 입력 했습니다.")
          continue
      }
      for no > 0 { // 1
        n := no%10
        no = no/10
        rst[idx] = n
        idx++
      }
      break
    }
    return rst
  }
  
```
이 Scanf가 어떻게 동작하는지 볼려면 [여기](https://golang.org/pkg/fmt/)에 들어가면 되는데 return값으로 몇 개를 입력받았는지와 실패 시 에러가 나온다. <br />
지금은 몇개의 입력을 받았는지는 중요하지 않기 때문에 '이름없는 변수'라는 의미로 '_'표시를 사용해주면 된다. <br />
그 후 if문으로 에러가 있으면 잘못입력했다는 문구를 표시 해주고 다시 입력을 받아야 하기 때문에 반복문을 써주고, 다시 돌아가기 위해 if문에 continue를 사용해서 해당 for문의 끝으로 가서 반복문이 다시 시작된다. <br />

그 다음 continue가 되지 않았다는 것은 에러가 없는 상황에 온 것인데, 여기서 숫자 3개를 뽑아야 되는데 <br />
어떤 숫자에 '%'를 하게 되면 가령 123 % 10을 해서 나머지 값은 3, 123 / 10을 해서 몫은 12가 되는데 <br />
이렇게 하면 맨 마지막 숫자를 꺼낼 수 있고, 그걸 빼고 나머지를 만들 수 있다. <br />
12 % 10 = 2가 되고, 몫은 1이 된다. 이런식으로 하게 되면 1, 2, 3을 뽑아낼 수 있게 된다. <br />

그래서 1번과 같이 반복문안에서 작성해준다. <br /> 
실행 하면 아래와 같이 되는데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97145426-84366000-17a9-11eb-95a1-31ee8d7584b5.png" width = 70%> </img></p>
no이 0이 되면 빠져 나오기 때문에 3,2,1 순으로 숫자들이(n값) 변화하게 될 것이다. <br />

그 후 이 값을 rst의 현재 index값에 n을 넣어준 뒤 index를 증가시켜 준다. <br />
그 다음 숫자를 다 뽑았기 때문에 break로 무한 반복문을 빠져나와준다. <br />

그 후 실행하여 결과를 확인하자. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97146008-7df4b380-17aa-11eb-9d9a-5b34d8df52dc.png" width = 70%> </img></p>
아직 겹치는것을 확인하지 않았기 때문에 다음과 같이 뜨는 것을 확인 할 수 있다. <br />

``` Go

  func InputNumbers() [3]int {
    // 두 개의 숫자 3개를 비교해서 결과를 반환한다.
    var rst [3]int
    for {
      var no int
      _, err := fmt.Scanf("%d", &no)
      if err != nil {
          fmt.Println("잘못 입력 했습니다.")
          continue
      }
      for no > 0 { // 1
        n := no%10
        no = no/10
        rst[idx] = n
        idx++
      }
      fmt.Println(rst)
      break
    }
    
    return rst
  }
  
```

입력한 숫자를 마지막에 출력시켜서 제대로 입력값이 출력되는지 확인하자. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97146257-e2177780-17aa-11eb-9b25-b32eea2b2858.png" width = 70%> </img></p>

입력값이 앞뒤로 바뀐것을 알 수 있다. 맨 뒤 부터 뽑히기 때문에 당연한 일이다. <br />
방법은 간단하다. 앞뒤만 바꾸어주면 된다. <br />

``` Go

  func InputNumbers() [3]int {
    // 두 개의 숫자 3개를 비교해서 결과를 반환한다.
    var rst [3]int
    for {
      var no int
      _, err := fmt.Scanf("%d", &no)
      if err != nil {
          fmt.Println("잘못 입력 했습니다.")
          continue
      }
      for no > 0 { // 1
        n := no%10
        no = no/10
        rst[idx] = n
        idx++
      }
      rst[0], rst[2] = rst[2], rst[0] // 추가
      fmt.Println(rst)
      break
    }
    
    return rst
  }
  
```

다음과 같이 수정해준 뒤 실행해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97146545-5f42ec80-17ab-11eb-97a8-1f4c8ad09a23.png" width = 70%> </img></p>
제대로 들어가는 것을 확인 할 수 있다. <br />

이제 겹치는 경우를 처리해보자! <br />

저번에 했었던 <code>duplicated</code>를 사용하여 해결하자! <br />

``` Go

  func InputNumbers() [3]int {
    // 키보드로부터 0~9사이의 겹치지 않는 숫자 3개를 입력받아 반환한다.
    var rst [3]int

    for {
      fmt.Println("겹치지 않는 0~9사이의 숫자 3개를 입력하세요.")
      var no int
      _, err := fmt.Scanf("%d\n", &no)
      if err != nil {
        fmt.Println("잘못 입력 했습니다.")
        continue
      }
      success := true
      idx := 0

      for no > 0 {
        n := no % 10
        no = no / 10

        duplicated := false

        for j := 0; j < idx; j++ {
          if rst[j] == n {
            // 겹쳐서 다시 뽑아준다.
            duplicated = true
            break
          }
        }

        if duplicated {
          fmt.Println("숫자가 겹치지 않아야 합니다.")
          success = false
          break
        }

        rst[idx] = n
        idx++
      }
      if !success {
        continue
      }
      break

    }
    rst[0], rst[2] = rst[2], rst[0]
    fmt.Println(rst)
    return rst
  }

```

이런식으로 수정 해주고, 실행해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97147833-7c78ba80-17ad-11eb-9ae3-954636ae4a13.png" width = 70%> </img></p>
겹쳤을 때의 처리가 잘 되는 것을 확인 할 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97147952-ab8f2c00-17ad-11eb-80ce-f5a369ca3f47.png" width = 70%> </img></p>
그 다음 해결해야 할 것이 있는데 숫자를 4개를 입력하면 
<code>index out of range [3] with length 3</code>라는 에러가 뜬다. 인덱스의 범위를 벗어났다는 소리인데 <br />
입력값이 3개를 넘었을 때 경우의 코드를 추가해주자! <br />


``` Go

  func InputNumbers() [3]int {
    // 키보드로부터 0~9사이의 겹치지 않는 숫자 3개를 입력받아 반환한다.
    var rst [3]int

    for {
      fmt.Println("겹치지 않는 0~9사이의 숫자 3개를 입력하세요.")
      var no int
      _, err := fmt.Scanf("%d\n", &no)
      if err != nil {
        fmt.Println("잘못 입력 했습니다.")
        continue
      }
      success := true
      idx := 0

      for no > 0 {
        n := no % 10
        no = no / 10

        duplicated := false

        for j := 0; j < idx; j++ {
          if rst[j] == n {
            // 겹쳐서 다시 뽑아준다.
            duplicated = true
            break
          }
        }

        if duplicated {
          fmt.Println("숫자가 겹치지 않아야 합니다.")
          success = false
          break
        }

        if idx >= 3 { // 추가
          fmt.Println("3개 보다 많은 숫자를 입력하셨습니다.")
          success = false
          break
        }

        rst[idx] = n
        idx++
      }
      if !success {
        continue
      }
      break

    }
    rst[0], rst[2] = rst[2], rst[0]
    fmt.Println(rst)
    return rst
  }

```

다음과 같이 수정 해준 뒤 실행 시켜준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97148275-353ef980-17ae-11eb-9e09-04ecbac0faec.png" width = 70%> </img></p>
3개 이상 입력했을 시 문구가 뜨면서 다시 입력받고, 3개가 입력되었을 때 정상적으로 넘어가는 것을 확인할 수 있다. <br />

그리고 2자리의 숫자만 입력한 경우엔 다음과 같이 뜨게 되는데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97148411-720af080-17ae-11eb-951a-4e15c867cfd2.png" width = 70%> </img></p>
나는 34를 입력했는데 화면에는 0 3 4가 출력되는 것을 확인 할 수 있다. <br />

이 경우에는 숫자가 다 해석되고 난 뒤에 맨 마지막에 이 숫자의 갯수가 3보다 작은지 확인 시켜 주면 된다. <br />
다음과 같이 수정해준다. <br />
``` Go

  func InputNumbers() [3]int {
    // 키보드로부터 0~9사이의 겹치지 않는 숫자 3개를 입력받아 반환한다.
    var rst [3]int

    for {
      fmt.Println("겹치지 않는 0~9사이의 숫자 3개를 입력하세요.")
      var no int
      _, err := fmt.Scanf("%d\n", &no)
      if err != nil {
        fmt.Println("잘못 입력 했습니다.")
        continue
      }
      success := true
      idx := 0

      for no > 0 {
        n := no % 10
        no = no / 10

        duplicated := false

        for j := 0; j < idx; j++ {
          if rst[j] == n {
            // 겹쳐서 다시 뽑아준다.
            duplicated = true
            break
          }
        }

        if duplicated {
          fmt.Println("숫자가 겹치지 않아야 합니다.")
          success = false
          break
        }

        if idx >= 3 {
          fmt.Println("3개 보다 많은 숫자를 입력하셨습니다.")
          success = false
          break
        }
        rst[idx] = n
        idx++
      }

      if success && idx < 3 {
        fmt.Println("3개의 숫자를 입력하세요.")
        success = false
      }

      if !success {
        continue
      }
      break
    }

    rst[0], rst[2] = rst[2], rst[0]
    fmt.Println(rst)
    return rst
  }

```
이 후 저장 후에 실행하면 3개 보다 더 썼을 때, 겹치는 것이 있을 때, 2개의 숫자만 받았을 때 모두 처리되는 것을 확인할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97148789-0d9c6100-17af-11eb-9f2c-aef14677f862.png" width = 70%> </img></p>

이제 CompareNumbers()부분으로 넘어가서 두 개의 숫자를 비교하여 스트라이크와 볼이 몇 개 인지 반환하는 함수를 만들어보자! <br />
방법은 여러개가 있을 텐데 예를 들어서  <br/>
3 2 7 이라는 숫자가 있고 <br />
6 2 4 라는 숫자를 비교하려 할 때 <br />
for문을 돌면서 6부터 시작해서 3, 2, 7을 비교해보고 아무것도 없으니 0, 그 다음 2가 되서 3, 2, 7을 비교해서 자리와 숫자가 같으므로 1스트라이크 <br />
그 다음 4가 되서 3 2 7을 비교해보고 아무것도 없으니 0 이런식으로 해보자! <br />

``` Go

  func CompareNumbers(numbers, intputNumbers [3]int) bool {
    // 두 개의 숫자 3개를 비교해서 결과를 반환한다.
    strikes := 0
    balls := 0
    for i := 0; i < 3; i++ {
      for j := 0; j < 3; j++ {
        if numbers[i] == inputNumbers[j] {
          if i == j {
            strikes++
          } else {
            balls++
          }
          break
        }
      }
    }
  
```

이렇게 한 뒤에 strikes와 balls를 저장해서 내보낼 객체가 필요하기 때문에 struct를 하나 정의시켜준다. <br />
``` Go

  package main

  import (
    "fmt"
    "math/rand"
    "time"
  )

  type Result struct {
    strikes int
    balls   int
  }

  func CompareNumbers(numbers, inputNumbers [3]int) Result {
    // 두 개의 숫자 3개를 비교해서 결과를 반환한다.
    strikes := 0
    balls := 0

    for i := 0; i < 3; i++ {
      for j := 0; j < 3; j++ {
        if numbers[i] == inputNumbers[j] {
          if i == j {
            strikes++
          } else {
            balls++
          }
          break
        }
      }
    }
    return Result{strikes, balls}
  }

```

이렇게 맨 위에 struct를 정의 시켜준 뒤 bool형이 아닌 만든 struct를 반환하도록 바꾸어준다. <br />

그 다음 func PrintResult()로 넘어가서 bool형이 아닌 Result가 들어가게 하고, 스트라이크와 볼이 몇 개인지 출력 시켜준다. <br />

``` Go

  func PrintResult(result Result) {
    fmt.Printf("%dS %dB : \n", result.strikes, result.balls)
  }

```

그 다음 func IsGameEnd()도 마찬가지로 bool형이 아닌 Result타입을 받아서 result의 strikes가 3과 같으면 끝나는걸로 처리 해준다. <br />
``` Go
  
  func IsGameEnd(result Result) bool {
    // 비교 결과가 3S 인지 확인
    return result.strikes == 3
  }
  
```

이제 결과를 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97151033-50ac0380-17b2-11eb-99d0-ab2c8fb702dd.png" width = 70%> </img></p>
이제 컴퓨터가 선택한 숫자만 출력되지 않게 하면 완성이다. <br />

``` Go
  func MakeNumbers() [3]int {
    // 0~9사이의 겹치지 않는 무작위 숫자 3개를 반환한다.
    var rst [3]int

    for i := 0; i < 3; i++ {
      for {
        n := rand.Intn(10)
        duplicated := false
        for j := 0; j < i; j++ {
          if rst[j] == n {
            // 겹쳐서 다시 뽑아준다.
            duplicated = true
            break
          }
        }
        if !duplicated {
          rst[i] = n
          break
        }
      }
    }
    // fmt.Println(rst)
    return rst
  }

```
이렇게 수정해준 뒤 다시 실행 시켜보자 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97151437-d9c33a80-17b2-11eb-909d-21104a61d46d.png" width = 70%> </img></p>


## 풀소스 

``` Go

  package main

  import (
    "fmt"
    "math/rand"
    "time"
  )

  type Result struct {
    strikes int
    balls   int
  }

  func main() {
    // 무작위 숫자 3개를 만든다.
    rand.Seed(time.Now().UnixNano())
    numbers := MakeNumbers()
    cnt := 0

    for {
      cnt++
      // 사용자의 입력을 받는다.
      inputNumbers := InputNumbers()

      // 결과를 비교한다.
      result := CompareNumbers(numbers, inputNumbers)

      PrintResult(result)

      // 게임이 3S인가?
      if IsGameEnd(result) {
        // 게임 끝
        break
      }
    }
    fmt.Printf("%d번만에 맞췄습니다.\n", cnt)
  }

  func MakeNumbers() [3]int {
    // 0~9사이의 겹치지 않는 무작위 숫자 3개를 반환한다.
    var rst [3]int

    for i := 0; i < 3; i++ {
      for {
        n := rand.Intn(10)
        duplicated := false
        for j := 0; j < i; j++ {
          if rst[j] == n {
            // 겹쳐서 다시 뽑아준다.
            duplicated = true
            break
          }
        }
        if !duplicated {
          rst[i] = n
          break
        }
      }
    }
    // fmt.Println(rst)
    return rst
  }

  func InputNumbers() [3]int {
    // 키보드로부터 0~9사이의 겹치지 않는 숫자 3개를 입력받아 반환한다.
    var rst [3]int

    for {
      fmt.Println("겹치지 않는 0~9사이의 숫자 3개를 입력하세요.")
      var no int
      _, err := fmt.Scanf("%d\n", &no)
      if err != nil {
        fmt.Println("잘못 입력 했습니다.")
        continue
      }
      success := true
      idx := 0

      for no > 0 {
        n := no % 10
        no = no / 10

        duplicated := false

        for j := 0; j < idx; j++ {
          if rst[j] == n {
            // 겹쳐서 다시 뽑아준다.
            duplicated = true
            break
          }
        }

        if duplicated {
          fmt.Println("숫자가 겹치지 않아야 합니다.")
          success = false
          break
        }

        if idx >= 3 {
          fmt.Println("3개 보다 많은 숫자를 입력하셨습니다.")
          success = false
          break
        }
        rst[idx] = n
        idx++
      }

      if success && idx < 3 {
        fmt.Println("3개의 숫자를 입력하세요.")
        success = false
      }

      if !success {
        continue
      }
      break
    }

    rst[0], rst[2] = rst[2], rst[0]
    fmt.Println(rst)
    return rst
  }

  func CompareNumbers(numbers, inputNumbers [3]int) Result {
    // 두 개의 숫자 3개를 비교해서 결과를 반환한다.
    strikes := 0
    balls := 0

    for i := 0; i < 3; i++ {
      for j := 0; j < 3; j++ {
        if numbers[i] == inputNumbers[j] {
          if i == j {
            strikes++
          } else {
            balls++
          }
          break
        }
      }
    }
    return Result{strikes, balls}
  }

  func PrintResult(result Result) {
    fmt.Printf("%dS %dB : \n", result.strikes, result.balls)
  }

  func IsGameEnd(result Result) bool {
    // 비교 결과가 3S 인지 확인
    return result.strikes == 3
  }

```
