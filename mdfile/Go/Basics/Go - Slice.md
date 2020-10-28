## 시작
대부분의 현대 언어들은 동적 배열들을 하나씩 가지고 있는데 C++에서는 Vector, Java에서는 ArrayList, C#에서는 List, Python은 Golang과 똑같은 Slice, Golang도 마찬가지이다. <br />
동적배열이 무엇일까? 동적배열의 반대가 정적배열인데 정적배열은(Fixed size array)길이가 바뀌지 않는 배열이다.<br />
<code>[10]int</code>이렇게 사용한다. <br />

반대로 동적배열은 <code>[] int</code> 이렇게 표시하는데 길이가 변하는 배열이라 생각하면 된다. <br />
그래서 처음에 하나가 되었다가 두개가 되었다가 세개가 되는 배열이다. <br />
그럼 이걸 어떻게 만들었는지 생각해보자. 메모리가 늘어날 수는 없다. <br />
메모리는 처음 할당받은 사이즈가 있으면 그 사이즈를 그대로 써야지 그 사이즈를 넘어서 더 쓸 수는 없다. <Br />
이것은 메모리 할당하는 구조를 보면 되는데 컴퓨터 메모리가 있을 때 내가 8byte가 필요하다 할 때 컴퓨터는 8byte의 공간을 확보해서 준다. <br />
그런데 그 메모리 옆 공간도 다른 메모리에 할당 될 수 있다. 그래서 내가 처음에 확보했던 공간을 넘어서는 메모리를 확보할 수가 없다. <br />
그 옆에 다른 애가 올 수 있기 때문에 그 공간을 늘릴 수 없다. 그래서 처음에 받았던 공간을 가지고 써야 되는데 <br />

동적배열은 어떻게 하는 거냐면 생각해보면 단순한데 배열이 늘어나면 공간도 늘어나야 한다. 예를 들어 처음에 배열이 3개였어서 3개의 만큼 공간을 확보했다. <br />
근데 이 배열이 배열 개수가 점점 늘어나게 되어 6개가 됐다 했을 때 그럼 이걸 어떻게 해야 되냐면 6개의 공간을 새로 확보하는 것이다. <br />
새로 확보한 6개의 공간안에 기존에 있던 3개를 그대로 복사한다. 복사를 하고 난 다음에 원래 있던 것을 없애버린다. <Br />
그러면 3개에서 6개로 늘어나게 되는 것이다. 이렇게 하는 것이 배열의 길이를 늘리는 방식이다. <br />

그래서 동적배열은 실제 고정 배열이 있고, 동적배열은 이 고정 길이 배열을 가리키고 있는 것이다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97275980-f7a7a280-1879-11eb-97b2-dfc4332ea203.png" width = 70%> </img></p>
가령 길이가 3개짜리인 동적배열이 있다 했을 때 3개 짜리인 배열을 가리키고 있다 보면 된다. (포인트 하고 있다 봐도 된다.) <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97275990-faa29300-1879-11eb-8e80-550abe07b76d.png" width = 70%> </img></p>
그래서 이게 배열 개수가 6개로 늘어나면 6개 짜리를 만든 다음에 원래 가리키고 있는 것을 취소하고 다시 6개짜리 배열로 가리키고 있는 것으로 보면 된다. <br />
그러면 배열의 길이가 3개였다가 6개로 늘려 놓은 것과 같다고 보면 된다. <br />

그래서 동적 배열은 실제 고정 길이의 배열이 따로 있고 그 고정길이 배열을 포인트하고 있고, 배열의 길이가 늘어나면 새로운 더 긴 배열을 만든 다음에 그 쪽으로 모든 값을 다 복사 시키고 그 다음에 그 배열로 포인터를 바꾸는 거라고 보면 된다. <br />

그런데 이와같이 처음에 정적 배열을 한 개 만들고, 걔를 가리키고, 거기서 하나를 더 추가하면 정적배열 두개를 만들고, 원래 있던 데이터를 거기에 복사하고, 추가하는 데이터를 추가한 뒤에 포인터를 바꾼다. 그 상태에서 하나를 더 추가하면 이와 같은 일들을 반복하게 되고 비효율적으로 되기 때문에 공간을 확보할 때 많이 확보한다. 어떻게 진행되냐면 두배씩 증가한다 생각하면 된다.<br />

처음에 하나가 들어오면 공간은 하나만 확보하고, 거기서 하나가 더 들어오면 2개가 되고, 거기에 하나가 더 들어오면 3개가 아니라 4개로 늘린다. 그래서 공간에 여유 분을 잡아 넣는 것인데 <br />
필요한건 3개지만 여유를 더 잡아 놓는 것이다. 그래서 하나가 더 들어 왔을 때 바로 공간을 늘리지 않아도 되도록 하는것이다. <br />
그 상태에서 5개가 되면 5개가 되는게 아니라 8개를 잡게 된다. 8개가 다 차면 16개, 16개가 다차면 32개 이런식으로 2배씩 잡는다. <br />

동적 배열을 선언하는 방법은 여러가지가 있는데 <br />
``` Go
var a [] int
```
이런식으로 변수 선언을 이런식으로 하는 방법이 있고, 그러니까 빈 배열을 하나 더 만드는 것이다. <br />

또는<br />
``` Go
a := []int{1,2,3,4}
```
이런식으로 선언대입문으로 선언 후에 초기화를 시켜 줄 수도 있고 <br />
``` Go
a := make([]int, 3)
```
이런식으로 Golang의 make라는 내장 키워드를 써서 동적배열을 만드는 방법도 있다. 이 때는 동적배열의 초기 길이를 넣어주는데 3개라고 초기 길이를 설정했다. <Br />
또는 <br />
``` Go
a := make([]int, 0, 8)
```
똑같이 make를 쓰는데 길이는 0인데 Capacity(내부 배열의 최대 길이)를 지정하여 Capacity가 8로 지정해 줄 수도 있다. <br />

**Length(길이)** 와 **Capacity(내부 배열의 최대 길이)** 의 차이가 있는데 내가 확보해놓은 공간, 내가 몇 개 까지 쓸 수 있는지를 **Capacity(내부 배열의 최대 길이)** 라고 하고, 실제 내가 쓰고 있는 공간이 몇개인가가 **Length(길이)** 라고 한다. <Br />

그래서 고정배열에서는 길이가 정해져 있기 때문에 Capacity가 의미가 없다 내가 10개 확보해놓고 10개 다 쓰는 것이기 때문이다. 하지만 동적 배열에서는 내가 확보해 놓은 공간과 내가 실제 사용하는 공간은 다를 수 있다. <br />

예를 들면 내가 공간을 2개에서 3개로 확보할 때 3개가 아니라 4개를 확보하게 되는데 그 때는 공간이 4개니까 Capacity 4이고, Length는 3이 된다. <br />
``` Go
a := make([]int, 3, 8)
```
그래서 make를 사용하여 동적배열을 만들면 내가 몇개까지 쓰고 몇개까지 확보 해놓을 것인 지도 정할 수 있다. <br />
위 코드는 처음에 3개를 쓰고 8개를 확보하겠다는 의미인데 공간을 8개를 만들어 놓고 3개만 쓰는 것이다. 처음 3개는 초기값인 0으로 채워진다.<br />

이것을 실제 코드로 진행해보자  <br />
``` Go
  package main

  import "fmt"

  func main() {
      var a []int
      
     	fmt.Printf("len(a) = %d\n", len(a))
	    fmt.Printf("cap(a) = %d\n", cap(a))
	
```

처음에 확보하는 방법은 여러가지가 있다고 했는데 이렇게 하면 a라는 변수 했는데 그 타입은 동적 배열이다. 라는 의미이다. <br />
이렇게하면 빈 공간에 동적배열이 만들어진다.  <br />
len()을 쓰면 그 배열의 길이가, cap()를 쓰면 실제 내가 확보한 공간이 나온다. 그래서 이것을 출력해주면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97382716-5408d180-190f-11eb-8a55-746452f33786.png" width = 70%> </img></p>

그러면 이렇게 비어있는 동적배열(Go에선 Slice이므로 Slice라고 하겠음.)을 만들면 길이는 0이고, Capacity도 0이다. <br />

그러면 이렇게 하지말고 초기 값을 지정해서 해보자! <Br />
``` Go
  package main

  import "fmt"

  func main() {
      var a []int = []int{1, 2, 3, 4, 5}

     	fmt.Printf("len(a) = %d\n", len(a))
	    fmt.Printf("cap(a) = %d\n", cap(a))
	
```
선언 대입문으로 슬라이스를 만드는데 1,2,3,4,5로 초기화해서 하는 경우 출력해서 보게 되면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97383288-9a126500-1910-11eb-8adb-461fe2e2f3ea.png" width = 70%> </img></p>
길이가 5이고 Capacity도 5가 된다. 5개를 확보하면서 5개를 다 쓰도록 해놓은 것이다. <br />

make로 만들어 보자 길이는 0인데 Capacity를 8로 확보시켜 놓았다.
``` Go
  package main

  import "fmt"

  func main() {
      var a := make([]int, 0, 8)

     	fmt.Printf("len(a) = %d\n", len(a))
	    fmt.Printf("cap(a) = %d\n", cap(a))
	
```

이 때 출력값은 어떻게 되는지 살펴보자 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97384108-61738b00-1912-11eb-8994-800175e00c23.png" width = 70%> </img></p>

길이는 0인데 Capacity는 8인 것을 알 수 있다. <Br />
공간은 확보해놓았지만 하나도 쓰고 있지 않고 있는 상태이다. <br />
그래서 이 확보된 공간에 Element들을 추가하는 방법은 append를 사용해서 Element들을 추가할 수 있다. <Br />

``` Go
  package main

  import "fmt"

  func main() {
      var a := make([]int, 0, 8)

     	fmt.Printf("len(a) = %d\n", len(a))
	    fmt.Printf("cap(a) = %d\n", cap(a))
      
      a = append(a, 1)

      fmt.Printf("len(a) = %d\n", len(a))
      fmt.Printf("cap(a) = %d\n", cap(a))
```

이렇게 append()를 사용하여 a에 1을 추가 한 뒤에 어떻게 변하는 지 출력해보자! <Br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97384399-faa2a180-1912-11eb-910d-9b7416e5abe4.png" width = 70%> </img></p>
결과를 보면 처음에는 길이가 0 확보한 공간이 8이였는데, append()를 사용하여 a에 1을 추가 한 뒤에는 길이기 1이고, 확보한 공간이 여전히 8인 것을 알 수 있다. <br />
그러니까 사용하지 않은 상태에서 a에 1을 추가했기 때문에 길이가 1이 되고, 확보한 공간에는 여전히 빈공간이 남아있기 때문에 8이 유지가 된 것을 알 수 있다. <Br />

이것을 자세히 보아야 하는데 append()를 할 때 넣는 부분이 슬라이스가 들어가고, 어떤 항목을 추가 할 것인가가 나오는데 그리고 이 반환 값은 다시 슬라이스가 반환된다. <br />
``` Go
a = append(a, 1)
```
이 말은  a라는 슬라이스에다가 1이라는 항목을 추가해서 그 결과로 다른 슬라이스가 나온다는 것이다. <br />
그래서 엄밀히 따지면 입력할 슬라이스에다 항목을 추가하는 게 아니기 때문에 입력 받은 슬라이스와 출력되는 슬라이스는 서로 다를 수 있다는 것이다. <br />

이 이야기를 다시 설명하면 가령 예를 들어서 내가 a라는 슬라이스를 만들었다고 가정하자. <Br />

``` Go
  a := []int{1,2}
  append(a, 3)
```
a라는 슬라이스는 1과 2로 되어 있다. 그러면 a라는 것은 길이가 2개짜리인 배열을 가리키고 있을 것이다. <br />
여기에 append(a, 3)을 했을 때 현재 길이가 2개인 배열을 가리키고 있기 때문에 3을 추가할 공간이 없게된다. <br />
그렇게 되면 3을 넣기 위해서 하나 더 확보 해야 한다. 그러면 가리키고 있는 배열을 늘릴 수 가 없으니까 새로운 공간을 확보 할 것이다. <br />
새로운 공간을 확보하고 거기에 3을 집어 넣을 것인데 이것을 반환 하는 것이다. <br />
그래서 엄밀히 따지고 보면 처음에 입력으로 했던 배열에 3이 추가가 된 것이 아니고, 새로운 배열을 만들어서 거기에 3을 추가해서 반환 하는 거라고 보면 된다. <br />

그렇지만 무조건 새로운 배열을 만드는게 아니고, 어쩔땐 기존배열에 추가가 되고, 어쩔땐 새로 만드는데 a라는 것에 공간이 있으면 그 배열에 값을 추가해서 반환 하지만 <br />
공간이 여유가 없으면 새로 만들어서 새로 만든 배열을 반환한다. <br />

실제로 그러는지 확인해보자 <br />

``` Go
  package main

  import "fmt"

  func main() {
    a := []int{1,2}
    b := append(a, 3)
    
    fmt.Printf("%p %p\n", a, b)
  }
```
처음에 a라는 슬라이스를 만들어 1과 2로 초기화를 시켜주고, b라는 슬라이스는 a에 3을 추가한 슬라이스이다. 그랬을 때 이 둘이 가리키고 있는 주소를 찍어보면 <br />
<code>%p</code>라고 하면 주소로 찍는 것인데 a와 b의 주소를 찍어준다. <Br />
이렇게 했을 때 결과를 보게되면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97385911-13608680-1916-11eb-98dc-d192a65ef130.png" width = 70%> </img></p>
주소가 서로 다르다는 것을 알 수 있다. a와 b는 서로 다른 주소를 가리키고 있는 것이고, 서로 공간이 다르다는 의미이다.<br />

그래도 좀 더 확실하게 여기에 이 두개의 항목들을 출력해보자! <br />

``` Go
  package main

  import "fmt"

  func main() {
    a := []int{1,2}
    b := append(a, 3)
    
    fmt.Printf("%p %p\n", a, b)
    for i := 0; i < len(a); i++ {
      fmt.Printf("%d, ", a[i])
    }
    
    fmt.Println()

    for i := 0; i < len(b); i++ {
      fmt.Printf("%d, ", b[i])
    }
    fmt.Println()
  }
```
먼저 a를 출력시키고, 한 줄 띄어 쓴 다음에 b를 출력시켜준다. 이렇게 했을 때 어떤 값이 출력되는지 보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97386418-16a84200-1917-11eb-9348-d9c4b5ee25f0.png" width = 70%> </img></p>
a는 1,2를 가지고 있고, b는 1,2,3을 가지고 있는다. 그리고 서로 다른 메모리 공간이다. <br />

그 후 서로의 Capacity를 출력시켜준다. <Br />

``` Go
  package main

  import "fmt"

  func main() {
    a := []int{1,2}
    b := append(a, 3)
    
    fmt.Printf("%p %p\n", a, b)
    for i := 0; i < len(a); i++ {
      fmt.Printf("%d, ", a[i])
    }
    
    fmt.Println()

    for i := 0; i < len(b); i++ {
      fmt.Printf("%d, ", b[i])
    }
    fmt.Println()
    fmt.Println(cap(a), " ", cap(b))
  }
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97386577-7868ac00-1917-11eb-937b-5ee85c14e9df.png" width = 70%> </img></p>
보게 되면 2,4가 나온다. a가 확보된 공간은 2고, b가 확보된 공간은 4인 것을 알 수 있으며, 서로 다른 슬라이스가 만들어졌다는 것을 알 수 있다. <Br />

이제 다르게 봐보자! <br />

``` Go
  import "fmt"

  func main() {
    a := make([]int, 2, 4)
    b := append(a, 3)
    
    fmt.Printf("%p %p\n", a, b)
    
```

처음에 a를 make로 슬라이스를 만들고, 공간은 2개인데 Capacity는 4개짜리로 만들어준다. 그러면 초기값으로 0,0으로 초기화가 되고 <br />
b는 a에 3이라는 것을 추가했을 경우에 이 두개의 주소를 찍어본다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97386963-60ddf300-1918-11eb-9827-6646d73e10bb.png" width = 70%> </img></p>
보면은 메모리 주소가 잘 나오는데 서로 똑같은 메모리를 가리키고 있다는 것을 알 수 있다. <br />
이게 중요한 차이점이 있는데 예를 들어 <br />

``` Go
  import "fmt"

  func main() {
    a := make([]int, 2, 4)
    a[0] = 1
    a[1] = 2
    
    b := append(a, 3)
    
    fmt.Printf("%p %p\n", a, b)
    fmt.Println(a)
	  fmt.Println(b)
    
```
a의 첫번째 요소가 1이고, 두번째 요소가 2라고 쳤을 때 b가 3을 추가 했기 때문에 두 개의 요소 값을 출력해준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97387336-1e68e600-1919-11eb-89c9-a312a52e1c59.png" width = 70%> </img></p>
a는 1,2 b는 a에 3을 추가한 것이기 때문에 1,2,3이 된 것을 알 수 있다. <br />

그런데 여기에 b의 첫번째를 4, b의 두번째를 5로 바꾼다음에 a와 b를 출력하면 어떻게 되는지 확인해보자<br />
``` Go
  import "fmt"

  func main() {
    a := make([]int, 2, 4)
    a[0] = 1
    a[1] = 2
    
    b := append(a, 3)
    
    fmt.Printf("%p %p\n", a, b)
    fmt.Println(a)
	  fmt.Println(b)
    
    b[0] = 4
    b[1] = 5
    
    fmt.Println(a)
	  fmt.Println(b)
    
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97387649-c7174580-1919-11eb-8bba-71747cab51f7.png" width = 70%> </img></p>

보면은 a도 4,5 b도 4,5,3으로 되서 a도 바뀌는 것을 알 수가 있다. 그것은 어떻게 보면 당연한 건데 같은 메모리를 가리키고 있다 보니 b가 바뀌면 a도 바뀌는 것이다. <Br />

``` Go
  package main

  import "fmt"

  func main() {
    a := []int{1,2}    
    b := append(a, 3)
    
    fmt.Printf("%p %p\n", a, b)
    fmt.Println(a)
	  fmt.Println(b)
    
    b[0] = 4
    b[1] = 5
    
    fmt.Println(a)
	  fmt.Println(b)
  }
```
아까랑 다른점이 있는데 아까는 서로 다른 메모리였었다. 이럴 경우엔 어떻게 되는지 확인해보자. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97387914-54f33080-191a-11eb-99d9-836e83d90e74.png" width = 70%> </img></p>
서로 다른 메모리를 가리키고 있고, 처음에는 a는 1,2 b는 1,2,3이 찍혔지만 b의 요소들을 변경했을 때 a는 그대로, b는 4,5,3이 되어 서로 결과가 달라졌다. <br />

이 차이를 알아야 하는데 첫번째 경우에는 공간을 2개만 확보해서 1,2를 넣었고, 그 다음 a에 append()해서 3을 추가해서 b에 넣는 경우 <br />
3을 추가할 공간이 없어서 4개를 확보하여 복사를 하고 그 뒤에 3을 추가한 공간을 b라고 했다. 그 후 b의 첫번째를 바꾸면 a랑은 다른 것이기 때문에 b만 바뀌게 된다. <br />

그런데 두번째 경우엔 a에 처음부터 공간을 4개로 확보해 놓고, 1,2를 넣었고, b에 a에 append()로 3을 했다. 공간이 있기 때문에 a가 가리키고 있는 곳에 3을 넣고, 이것을 b가 가리킨다. <Br />
그 때 b의 첫번째를 4로 바꾸면 같은 메모리이기 때문에 a도 바뀌게 되는 것이다. 이런 차이가 있는데 이것을 실수를 하기가 좋다. <br />

왜냐면 append()했을 때 상황에 따라 하나가되고, 따로가 되서 어떨땐 하나를 고치면 다른 것이 같이 바뀌는 경우가 있고, 어떨땐 하나를 고쳤는데 다른 것이 안 바뀌기도 하다. <br />

그래서 append()안에 있는 결과랑은 다른 것이라고 보는게 편하고, 만약에 a와 b가 다른 메모리 공간을 확보하고 싶다할 때는 append()를 쓰는게 아니라 Copy를 한 다음에 append()를 하는게 좋다. <br />
코드로 설명해주자면 <br />

``` Go
package main

import "fmt"

func main() {
	a := make([]int, 2, 4)
  a[0] = 1
	a[1] = 2
  
	b := make([]int, len(a))

	for i := 0; i < len(a); i++ {
		b[i] = a[i]
	}

	b = append(b, 3)

	fmt.Printf("%p %p\n", a, b)
}

```
a는 make로 슬라이스로 여유있게 만들고,  b는 make로 슬라이스로 만든 다음에 a의 길이만큼을 확보해놓고 만들어서 for문으로 a에 있는 내용들을 b에 복사 시켜놓는다. <br />
복사를 한 다음 append()를 한 다음 포인터 조소를 찍어보게 되면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97389013-bcaa7b00-191c-11eb-84d6-972b4bd9a9c5.png" width = 70%> </img></p>
항상 다른 메모리 공간이 확보 된다. <Br />

어떻게 보면 당연한 것인데 <code>a := make([]int, 2, 4)</code> 여기서 슬라이스를 만들었는데 공간이 남아있어도 <code>b := make([]int, len(a))
</code>로 슬라이스를 또 다른 공간에 만들었으니까 서로 다른 메모리가 확보되게 된다. 그리고 그대로 for문으로 복사를 한 다음에 3을 추가한 경우 서로 다른 메모리 공간이 확보가 된다. <br />
그래서 여기에 b의 값을 바꾸어도 a의 값은 바뀌지 않게 된다. <Br />

``` Go
  package main

  import "fmt"

  func main() {
    a := make([]int, 2, 4)
    a[0] = 1
    a[1] = 2
    b := make([]int, len(a))

    for i := 0; i < len(a); i++ {
      b[i] = a[i]
    }

    b = append(b, 3)

    fmt.Printf("%p %p\n", a, b)

    b[0] = 4
    b[1] = 5

    fmt.Println(a)
    fmt.Println(b)
  }
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97389238-33477880-191d-11eb-9928-4608daec67cf.png" width = 70%> </img></p>
