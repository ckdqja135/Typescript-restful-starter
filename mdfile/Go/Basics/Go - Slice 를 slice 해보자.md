## 시작
Slice가 왜 Slice인지 알아보도록 하자. Slice는 어떤 일부를 잘라내서 덜어내는걸 말하는데 그렇듯이 Golang의 Slice는 일부를 잘라낼 수가 있다. <br />

그럼 어떻게 하는지 살펴보자. <Br />

``` Go
a [10]int
```
10개짜리 배열이 있다 가정하고 []를 이용해서 배열의 요소를 접근하는데 <br />
``` Go
a [10]int
a[3]
```
이렇게 하면 a의 4번째 배열요소를 가져올 것이다. 그래서 a가 1~10까지 10개의 요소를 가지고 있다고 하면 <br />
a[3] == 4 가 될 것이다. <Br />

Slice도 마찬가지이다. <br />
``` Go
a []int
a[4:7]
```
Slice는 []안에 ':'을 붙여서 숫자 2개를 적는다. <br />
이 뜻은 첫번째 부분은 시작 index이고 두번째 부분은 마지막Index 부분인데 5~6번째까지 가져온다.<br />
``` Text
a[StartIndex : EndIndex]
```

Start부터 해서 End까지 하는데 End는 포함되지 않는다. <br />
그래서 만약에 <br />
``` Go
a[0:9]
```
라고 한다면 0~8번째까지이다. <br />

또 하나 예를 들어 <br />
``` Go
  a:= []int {1,2,3,4,5,6,7,8,9,10}
  a[4:8]
```
을 하게 되면 [5,6,7,8]을 가져온다. <br />

이것을 코드로 진행해보자 <br />

``` Go
  package main

  import "fmt"

  func main() {
    a := []int {1,2,3,4,5,6,7,8,9,10}
    b := a[4:8]
    
    fmt.Println(b)
  }

```
a는 1~10까지 가지고 있는 배열이고, b는 a의 슬라이스인데 5~7번째까지 값을 가져오는 슬라이스이다. <br />
그래서 b의 요소를 출력해보면 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97397576-ec617f00-192c-11eb-8bf8-8ff2a690e965.png" width = 70%> </img></p>
[5, 6, 7, 8]이 나오는 것을 확인 할 수 있다. <br />
배열은 0부터 시작하기 때문에 다음과 같이 나오는 것을 알 수 있다. <br />
``` Go
 a := []int {1,2,3,4,5,6,7,8,9,10}
             0 1 2 3 4 5 6 7 8 9
 ```
 
 조금 더 보자면 시작 인덱스를 끝나는 인덱스를 적지 않으면 끝까지 슬라이스 하게 된다. <br />
 
 ``` Go
   package main

  import "fmt"

  func main() {
    a := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
    b := a[4:8]
    c := a[4:]
    fmt.Println(b)
    fmt.Println(c)
  }
```
아까와 같은 상황에서 C만 추가하여 출력시켰다. 5번째 값부터 가져 올 것이다.<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97397848-83c6d200-192d-11eb-82e6-259c62318742.png" width = 70%> </img></p>

반대로 <code>a[:4]</code>를 하게 되면 처음부터 4번째까지 나오게 된다. <br />
 ``` Go
  package main

  import "fmt"

  func main() {
    a := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
    b := a[4:8]
    c := a[4:]
    d := a[:4]
    fmt.Println(b)
    fmt.Println(c)
    fmt.Println(d)
  }
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97398504-b32a0e80-192e-11eb-9e3c-ea1629b71987.png" width = 70%> </img></p>
처음부터 4번째까지 Slice되는 것을 확인할 수 있다. <br />

그러면 Slice가 어떻게 동작하는지 보자! Slice는 이름 그대로 잘라내는것은 아니다. <br />
``` Go  
  a := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
  b := a[4:8]
```
이렇게 있을 때 a배열에 5~8까지만 가리키고 있는 것이라고 보면 된다. <br />
지난번에 원래 원 배열이 있고, 그것을 가리키는 포인터라고 했었는데 a는 시작 위치를 가리키고 있는 거라고 한다면 b는 a배열의 5번째부터 가리키고 있는 것이고, 이 때 b의 길이는 4이다. <br />
그러니까 a의 일부분을 가리키고 있다고 보면 된다. <br />

이걸 어떻게 확인해볼 수 있냐면 <br />
``` Go  
  a := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
  b := a[4:8]
```
이 코드에서 5,6,7,8을 가리키고 있다고 했는데 이 때 b의 첫번쨰와 두번째를 바꾸고 a를 찍어준다. 어떻게 될까? <Br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97399023-a0fca000-192f-11eb-99a1-df968d4605de.png" width = 70%> </img></p>
원래 a는 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]이였는데 [1, 2, 3, 4, 1, 2, 7, 8, 9, 10]으로 중간값이 바뀐 것을 알 수 있다. <br />
b는 잘라낸게 아니라 a의 5번째부분을 가리키고 있기 때문에 b의 첫번째는 5가 되며 같은 메모리를 쓰고 있기 때문에 a의 슬라이스가 바뀌는 것이다. <br />

그래서 슬라이스는 말 그대로 잘라오는게 아니라 그 일부분을 가리킨 슬라이스를 새로 만든 것이고, 같은 메모리를 가리키고 있다는 것을 주의하고 알고 있어야 한다. <br />

몇가지 슬라이스를 활용한 예제들을 살펴보자! <br />
배열이 아래와 같이 있을 때 배열의 맨끝을 하나씩 삭제하려고 한다. 어떻게 해야할까? <br />
``` Go
a := []int {1,2,3, .... 10}
```
처음에 10을 없애고, 9를 없애고, 8을 없애는 식으로 하나씩 지워나가는 것을 만들어보자 <br />

``` Go
  package main

  import "fmt"

  func RemoveBack(a []int) []int {
    return a[:len(a)-1]
  }

  func main() {
    a := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

    for i := 0; i < 5; i++ {
        a = RemoveBack(a)
    }
    
    fmt.Println(a)

  }

```
하나씩 지워가는 RemoveBack()이라는 함수를 만든다고 하자. 이 함수의 입력값은 슬라이스를 받고, 출력은 슬라이로 나가도록 한다. <br />
그랬을 때 a가 for문을 도는데 5번을 돈다고 가정하자. <br />
그 후 a를 출력하도록 만들자. <br />

그러면 어떻게 Back을 해야 할까? <br />
``` Go
  package main

  import "fmt"

  func RemoveBack(a []int) []int {
    return a[:len(a)-1]
  }

  func main() {
    a := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

    for i := 0; i < 5; i++ {
        a = RemoveBack(a)
    }
    
    fmt.Println(a)

  }

```
a의 맨끝을 없앤다는 것은 처음부터 맨 끝에서 하나 뺀거 까지만 간다는 것이기 때문에 다음과 같이 작성해준다. <br />
이 때 출력 시켜보자. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97403151-3bacad00-1937-11eb-9ed9-9f980b0bbfe9.png" width = 70%> </img></p>
처음 RemoveBack을 하면 10이 없어지고, 그 다음은 9가 없어지고, 그 다음은 8, 7....해서 5번을 돌기 때문에 남은건 1,2,3,4,5이다. <br />

좀 더 확실히 알기위해 없어지는 과정을 찍어보면 이렇다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97403381-a3fb8e80-1937-11eb-9013-fb3322b09920.png" width = 70%> </img></p>

이번에는 맨 뒤에 값을 없애는데 맨 뒤에 값을 반환하는 함수를 만들어보자 <br />
``` Go
  package main

  import "fmt"

  func RemoveBack(a []int) ([]int, int) {
    return a[:len(a)-1], a[len(a)-1]
  }

  func main() {
    a := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

    for i := 0; i < 5; i++ {
      var back int
      a, back = RemoveBack(a)
      fmt.Printf("%d, ", back)
    }
    fmt.Println()
    fmt.Println(a)

  }
```

함수에서 return값이 다중으로 나오면 위와 같이 ()로 묶어 주어야 하고, 맨 뒤에 값은 back으로 받고 출력시켜준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97404066-d954ac00-1938-11eb-8524-56a983566366.png" width = 70%> </img></p>
없어진 맨 뒤에 숫자들이 출력되는 것을 알 수 있다. <Br />

그러면 이제는 맨 앞에 값을 없애보자. <br />
``` Go
  package main

  import "fmt"

  func RemoveBack(a []int) ([]int, int) {
    return a[:len(a)-1], a[len(a)-1]
  }

  func RemoveFront(a []int) ([]int, int) {
    return a[1:], a[0]
  }

  func main() {
    a := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

    for i := 0; i < 5; i++ {
      var front int
      a, front = RemoveFront(a)
      fmt.Printf("%d, ", front)
    }
    fmt.Println()
    fmt.Println(a)

  }
```
RemoveFront()를 만들어서 마찬가지로 없어진 슬라이스와 맨 앞에 값을 반환하도록 해준다. <br />
a의 맨 앞을 빼고 그 다음 부터인 인덱스 2번째부터 끝까지 반환하면 되고, 없어진 맨 앞에 값은 인덱스 0번째 값 부터 이므로 위와 같이 해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97407694-62baad00-193e-11eb-8f93-79679dc806f1.png" width = 70%> </img></p>

이거는 실제로 메모리 상에서 사라지게 하는 것은 아니라는 점. 다시 한번 알아 두어야 한다. 아까도 말했지만 그냥 가리키는 포인터만 바뀌게 되는 것이다. <br />

