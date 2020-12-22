### 시작 
종이와 게임으로 했었던 게임인데 룰은 간단하다 두 사람이 0 ~ 9까지의 겹치지 않는 숫자 3개를 생각해둔다. <br />
첫번째 A 사람이 2 6 3을 생각해두었고, 두번째 B 사람이 5 4 1을 생각했다고 가정했을 때 <br />
각자 자기 차례가 되면 숫자 3개를 말한다. A사람이 1 2 3이라고 했을 때 B는 상대방이 말한 숫자와 자신이 생각한 숫자와 비교를 한다. <br />
그래서 자리도 같고 숫자도 같으면 '스트라이크', 숫자는 같지만 자리가 다르면 '볼'이다. <br />
그러면 B는 5 4 1을 생각했었고, A는 1 2 3을 외쳤으니 1볼이 된다. <br />
그렇게 해서 B차례가 되었고, A에게 마찬가지로 1 2 3 을 외쳤을 때 2 6 3과 1 2 3을 비교해보면 2는 숫자가 있지만 자리가 다르고, 3은 자리와 숫자가 같기 때문에 1볼 1스트라이크가 된다.<br />
그래서 A가 B에게 1볼 1스트라이크라고 말해준다. 이렇게 서로 차례를 반복하여 나온 결과를 토대로 추리하여 상대방이 생각한 숫자를 맞추는 게임이다. <br />

이걸 컴퓨터가 생각한 숫자를 몇번만에 맞추는지의 형태를 가진 프로그램으로 만들어서 컴퓨터가 먼저 겹치지 않는 0~9 숫자 3개를 뽑은 다음에 사용자의 입력(숫자3개)을 받아서 <br />
그걸 가지고 컴퓨터가 비교해서 결과를 출력하여 3스트라이크가 될 때 까지 입력받고 결과받는 만들어 본다. <br />

순서도를 그려보자면 아래와 같다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97132564-b2f10e00-178a-11eb-99d0-54745eb33715.png" width = 70%> </img></p>

우선 GoPath에 임의적인 폴더를 하나 만들어 놓고, 그 안에 NumberBaseball폴더를 생성하여 Go파일을 만들어준다. <br />
<code>NumberBaseball/main.go</code>

``` Go

  package main
  
  import (
      "fmt"
  )
  
  func main() {
    // 무작위 숫자 3개를 만든다. 
    numbers := MakeNumbers()
    cnt := 0
    
    for {
      cnt++
      // 사용자의 입력을 받는다.
      inputNubers := InputNumbers()

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
  
```

먼저 이런식으로 큰 그림만 그려준다. 게임이 끝이 나지 않으면 for문으로 무한루프를 3스트라이크가 나올 때 까지 돌려서 결과를 알려주고, 게임 결과가 3스트라이크이면 break로 무한루프를 빠져나오고, 3스트라이크가 아니라면 다시 돌아와서 사용자에게 입력을 받는 식이다. <br />

for문이 빠져 나온 경우는 게임이 끝이난 경우 이므로 몇번만에 이것을 맞추었는지 출력시켜준다. <br />
다시 정리하면 처음에 숫자 3개를 만들어주고 반복문을 돌고 매 반복문마다 cnt를 증가시키고 사용자에게 숫자 3개를 입력받고, 입력받은 값과 비교를 해서 결과를 출력시키고, 결과가 게임이 끝이면 break로 반복문을 빠져나오고, 그렇지 않으면 다시 입력을 받아 반복하여 게임이 끝이 나면 몇번만에 맞추었는지 출력시켜준다. <br />

먼저 이것을 빌드시키면 해당하는 함수들을 만들어주지 않고 선언만 했기 때문에 아래와 같이 에러가 뜨게 된다. <Br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97136054-65c66980-1795-11eb-90de-2dc79781b043.png" width = 70%> </img></p>

항상 빌드가 가능한 상태로 만들어 놓는게 좋은데 지금은 큰 그림만 그렸기 때문에 동작하진 않더라도 빌드가 되는 상태만 만들어주자! <br />
하나하나 차례차례 함수들을 만들어보자! <br />

``` Go
  func main() {
    // 무작위 숫자 3개를 만든다.
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

  func MakeNumbers() [3]int { // 1
    // 0~9사이의 겹치지 않는 무작위 숫자 3개를 반환한다.
    var rst [3]int
    return rst
  }
  
  func InputNumbers() [3]int { // 2
    // 키보드로부터 0~9사이의 겹치지 않는 숫자 3개를 입력받아 반환한다.
    var rst [3]int
    return rst
  }
  
  func CompareNumbers(numbers, intputNumbers [3]int ) bool { // 3
    // 두 개의 숫자 3개를 비교해서 결과를 반환한다.
    return true
  }
  
  func PrintResult(result bool) { // 4
    fmt.Println(result)
  }
  
  func IsGameEnd(result bool) bool { // 5
     // 비교 결과가 3 스트라이크인지 확인
     return result
  }
  
```

1 : 숫자 3개가 return되는 MakeNumbers함수. <br />
2 : 숫자 3개가 return되는 InputNumbers함수. <br />
3 : 컴퓨터가 뽑은 숫자와 사용자가 입력한 3개의 숫자를 받고, bool형을 반환하는 CompareNumbers함수.
4 : 결과 출력 함수. 나중에는 스트라이크, 볼이 몇개 있는지에 대한 Struct로 바뀔 예정이지만 간단하게 빌드가 되게 하기 위해 bool로 했다. <br />
5 : IsGameEnd함수 생성. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97138790-54349000-179c-11eb-8fb3-1a41d052e524.png" width = 70%> </img></p>

이제 정상적으로 빌드가 되는 것을 확인 할 수 있다. <br />
지금 부터 할 일은 함수들 마다 주석 처리해서 설명한대로 구현 시켜주면 완성이다. <br />

첫번째 함수부터 만들어주자! <br />
무작위 숫자를 뽑아내는 방법을 찾아야 한다. [여기](https://gobyexample.com/random-numbers)가 그 방법을 어떻게 사용하는지에 대해 나온다. <br />
rand.Intn()이라는 함수를 사용하여 값을 뽑아낸다고 써 있는데 Intn()에 대한 자세한 설명은 [여기](https://golang.org/pkg/math/rand/#Intn)에 있는데 <br />
Intn()을 호출하면 그 결과로 0~n사이의 랜덤한 숫자가 반환된다는 것을 알 수 있다. 정확히 말하면 n-1까지의 값이 나오는 것이다. <br />
그래서 이것을 사용해보자! <br />

``` Go

  import (
    "fmt"
    "math/rand"
  )


  func MakeNumbers() [3]int { // 1
    // 0~9사이의 겹치지 않는 무작위 숫자 3개를 반환한다.
    var rst [3]int
    
    for i := 0; i < 3; i++ {
      n := rand.Intn(10)
    }
    
    return rst
  }
  
```

이렇게 해서 3개의 숫자를 뽑아주는데 문제는 겹치지 않아야 한다. 겹치지 않을려면 자기 순서보다 앞에 있는 것을 비교해서 같으면 안되고, 모두 다르다면 겹치지 않는것이 된다. <br />
그래서 다음과 같이 수정해준다. <br />
``` Go

  import (
    "fmt"
    "math/rand"
  )


  func MakeNumbers() [3]int { // 1
    // 0~9사이의 겹치지 않는 무작위 숫자 3개를 반환한다.
    var rst [3]int

    for i := 0; i < 3; i++ { // 1
      for { // 2
        n := rand.Intn(10)
        duplicated := false      // 4
        for j := 0; j < i; j++ { // 3
          if rst[j] == n { // 5
            // 겹쳐서 다시 뽑아준다.
            duplicated = true
            break
          }
        }
        if !duplicated { // 6
          rst[i] = n
          break
        }
      }
    }
    fmt.Println(rst)
    return rst
  }
```
1 : 3개의 숫자를 뽑아야 하기 때문에 3번 반복해준다. <br />
2 : 아래 if문에서 숫자가 겹치지 않으면 if문 위에 있는 반복문을 빠져나가고, 겹치는 경우엔 다시 뽑게 하기 위해 for문을 추가했다. <br />
3 : 자기 순서보다 앞에 있는 것을 비교해주기 위해 사용. <br />
4 : 겹치는지 안겹치는 지에 대한 Flag <br />
5 : 겹치는지 여부 확인 <br />
6 : 모두 다 돌고나서 겹치지 않은 경우 반복문을 빠져나가서 결과값에 뽑은 숫자들을 넣어준다. <br />

이제 결과가 제대로 나오는지 확인해보자 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97141237-b17f1000-17a1-11eb-81c5-6b7960e58673.png" width = 70%> </img></p>
여기서 문제가 하나 생기는데 계속 실행하면 그 문제를 알 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97141450-15093d80-17a2-11eb-947e-9fa3047cba8a.png" width = 70%> </img></p>
이렇게 같은 숫자가 나오면 무작위 숫자가 아니게 된다. 그 이유는 랜덤을 만드는 로직에 대해 알아야 하는데 <br />
랜덤을 만드는 방법은 컴퓨터가 정해진 작업만 하기 때문에 아예 아무도 모르는 숫자 3개를 만들 수 있다는 건 말이 안된다. <br />
그래서 어떻게 하냐면 랜덤을 만들기 위해서 변하는 Seed라는 것을 만들어주면 변하는 Seed 값을 기반으로 숫자들을 뽑아낸다. <br />
그래서 이 Seed 값이 같으면 항상 같은값이 나오게 되는 것인데 지금 Seed값을 지정한게 없기 때문에 같은 숫자가 나오는 것이다. <br />
생각해보면 항상 변하는 가장 쉬운 값은 'Time'이다. <br />

[여기]https://golang.org/pkg/math/rand/)를 보게 되면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97143003-31f34000-17a5-11eb-8606-994468850b24.png" width = 70%> </img></p>
Seed값은 time의 now의 UnixNano()를 많이 사용한다고 되어 있다. <br />

그래서 [여기](https://gobyexample.com/random-numbers)에도 사용하고 있는 것을 확인 할 수 있다. <Br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97143189-8a2a4200-17a5-11eb-8a4f-5a101492f279.png" width = 70%> </img></p>
이것을 프로그램 처음 시작할 때 Seed값을 지정해주고 시작하자. <br />

``` Go

  package main

  import (
    "fmt"
    "math/rand"
    "time"
  )

  func main() {
    // 무작위 숫자 3개를 만든다.
    rand.Seed(time.Now().UnixNano()) // 추가
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

```

이제 다시 빌드해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97143396-f7d66e00-17a5-11eb-985a-d64ac748f080.png" width = 70%> </img></p>
같은 값이 나오지 않는 것을 확인 할 수 있다. <br />
