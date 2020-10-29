## 시작
먼저 슬라이스 하나를 만들어준다. <br />

``` Go
  package main

  import "fmt"

  func main() {
    var s []int

    s = make([]int, 3)

    s[0] = 100
    s[1] = 200
    s[2] = 300

    fmt.Println(s)
  }
```
<s = make([]int, 3)</code> 하면 슬라이스를 initializer 할 수 있는데 3개 짜리 슬라이스를 만들었다. <br />
그 후 각 요소에 값을 주고, 출력을 시키게 되면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97514395-ed98b780-19d1-11eb-8572-288db099d9e2.png" width = 70%> </img></p>
이렇게 100 200 300이 나오는 것을 알 수 있다. <Br />

이 슬라이스의 구조에 대해 좀 더 자세히 알아보자 <br />
슬라이스는 Golang에서 제공하는 동적 배열(Dynamic Array)이다. <br />

지난번에 Struct를 했었는데 슬라이스도 **Struct Value** 라고 보면 된다. 그래서 Struct를 말할 때 가령 Student라는 Struct가 있다 할 때 이것은 이름이 있고, 나이가 있고, 등급, 등등등이 있을 것이다. <br />
``` Go
  type Student struct {
    name string
    age int
    grade int
  }
```
이런 여러 요소(Property)들이 하나의 이름으로 모인게 Struct라고 했었는데 슬라이스도 마찬가지로 Struct로 되어있다고 보면 된다. <br />
Slice라는 Struct가 있는데 Slice의 구성으로 Data Pointer가 있다. 그래서 실제 배열을 가리키는 포인터가 있고, 길이를 나타내는 요소, capacity가 있다.<br />
``` Go
type Slice struct {
  Pointer *
  len int
  cap int
}
```
이렇게 3가지로 구성된 것이 슬라이스라고 보면 된다. <br />

컴퓨터라는 것은 결과적으로 보면 Data는 저장이 되어야 하는데 이 Data는 문자, 숫자, 등등 뭐든 컴퓨터 입장에선 상관이 없다. 뭐든간에 컴퓨터 입장에서는 0,1의 연속된 묶음이기 때문이다. <br />
그러면 이 Data는 실제로는 메모리 상에 어딘가에 있을것이다. 실제 배열을 나타내는 슬라이스가 100,200,300이 있으면 이 배열을 나타내는 메모리가 실제로 존재 할 것인데 그 메모리를 나타내는 포인터를 슬라이스가 가지고 있는 것이다. <br />
그래서 슬라이스는 **실제 배열을 나타내는 곳** 을 가리키고 있고, **시작주소와 길이**를 가지고 있기 때문에 시작 주소로 부터 실제 요소들이 몇개가 있는지 **길이**를 나타내고 있다. <br />
그래서 **길이**가 3일 때 시작 주소부터 3개까지만 자기 것 이라고 표시하는 것이며 <br />
**Capacity**는 실제 메모리에 할당된 배열이 있을 것인데 이게 총 8개까지 저장할 수 있고, 실제 쓰는건 3개라고 가정했을 때  이 배열이 처음 만들어질 때의 할당된 최대 개수를 적어 놓는다. <br />

여기까지만 정리하자면 Slice는 3개의 Property로 구성되어 있는데 첫번째가 Pointer인데 그 실제 배열이 가지고 있는 시작주소를 가지고 있고, 두번째가 length인데 요소의 갯수를 의미한다. <br />
세번째가 Capacity인데 이것은 최대 이 배열에 저장할 수 있는 요소의 갯수가 된다. <br />

이제 코드를 수정해 줄 것인데 슬라이스의 갯수(length)와 Capacity를 출력시켜보자.<br />
``` Go
  package main

  import "fmt"

  func main() {
    var s []int

    s = make([]int, 3)

    s[0] = 100
    s[1] = 200
    s[2] = 300

    	fmt.Println(s, len(s), cap(s))
  }
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97515633-cb546900-19d4-11eb-9f1f-727383a187b7.png" width = 70%> </img></p>
여기를 보면 슬라이스의 내용이 나오고, 길이가 3, Capacity가 3개 인 것을 알 수 있다.<br />

이 상태에서 조금 더 수정해서 append()를 시켜준다. append()를 하게되면 첫번째 인자로 내가 추가하고자 하는 슬라이스를 넣어준다. <br />
``` Go
s = append (슬라이스, 넣을 요소들)
```
이렇게 넣으면 되는데 요소들은 여러개를 넣을 수 있고, 하나를 넣을 수 있다.
``` Go
s = append (s, 400, 500, 600, 700,....)
```
이렇게 넣고 싶은 만큼 넣을 수 있다. 이렇게 하면 4개가 한꺼번에 들어가게 되는데 append라는 말 자체가 **뒤로 붙인다.** 라는 의미인데 첫번째 들어오는 슬라이스에 그 다음에 나오는 값들을 뒤로 붙인 다음에 새로운 슬라이스를 만들어서 반환해주고, 그것을 다시 s에 대입하게 된다. <br />
``` Go
  package main

  import "fmt"

  func main() {
    var s []int

    s = make([]int, 3)

    s[0] = 100
    s[1] = 200
    s[2] = 300
    
    fmt.Println(s, len(s), cap(s))
    
    s = append (s, 400, 500, 600, 700)
    
	  fmt.Println(s, len(s), cap(s))    
  }
```
이렇게 수정해준 뒤 출력시켜보자 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97516102-bfb57200-19d5-11eb-8046-a335413d95cd.png" width = 70%> </img></p>
길이는 7개 Capacity는 8개 인것을 알 수가 있다. <br />

이제 이 **append**의 과정을 살펴보자 <br />
``` Go
s = make([]int, 3)
```

아까 이렇게 슬라이스를 하나 만들었었다. 참고로 3은 길이를 말한다. <Br />
이렇게 하면 Golang에서는 메모리에 int 3개를 담을 수 있는 배열을 하나 만든다. 그리고 이것을 어떤 Slice struct를 만들어서 그 안에 있는 Point요소가 만들어 놓은 배열의 시작 주소를 가지고 있고, 두번째 요소인 Length가 3을 가지고 있고, Capacity도 3을 가지게 된다. 그러면 이 부분들은 어디에 저장될까? <br />
이것도 마찬가지로 s라는 변수의 값으로 슬라이스의 요소들이 들어가는 것이다. 그러니까 이 s도 메모리안에 저장되어 있을 것이다. <br />
그래서 이 메모리 상에 슬라이스의 요소들이 들어가 있는 것이다. <Br />

그래서 실제 보면은 슬라이스 객체는 실제 배열을 나타내는 것이 있고 가령 이 주소가 **0xC01401**다 라고 했을 때 실제 s를 나타내는 변수도 메모리상에 공간을 차지하고 있고 첫번째 Property로 **0xC01401**라는 주소값이 들어가 있고, 두번째 Property로 길이 세번째 Property로 Capacity가 들어가 있게 된다. <br />

그래서 잘 알아야 할 것이 실제 데이터를 가지고 있는 배열의 주소와 s의 값은 별개라는 것이다. 다만 이 포인터가 실제 배열의 시작주소를 가리키고 있는 것 뿐이다. <Br />

그래서 <br />
``` Go
s = make([]int, 3)
```
했을 때 실제 배열을 가지고 있는 메모리는 다른 곳에 있고, 메모리의 시작주소만 s의 포인터 Property로 가지고 있다는 것이다. <br />
그리고 <br />
``` Go
s[0] = 100
s[3] = 300
```
으로 요소를 넣을 때 실제 s가 나타내고 있는 포인터, 이것은 배열을 나타내고 있는데 그 배열의 첫번째 값에 100을 적게되고, 그 다음은 실제 나타내고 있는 배열의 4번째 값에 300을 넣는것인데 <br />
이 s의 Length값은 3이기 때문에 에러가 난다. <br />

이제 append로 넘어가서 <br />
 
``` Go
s = append(s, 400)
```

원래 슬라이스가 <br />
|100|200|300|
|------|---|---|

이렇게 있었으면 이 append가 먼저 하는 일은 s라는 슬라이스에 빈 공간이 있는지 먼저 확인을 한다. <br />
<code>Capacity - Length</code>를 하게 되면 남는 공간이 나오는데 s의 cap이 3개고, len이 3이기 때문에 남는 공간이 없다. <br />
그러면 append는 더 큰 곳으로 이사를 가야 하기 때문에 더 큰 메모리 공간(일반적으로 cap의 2배)을 만든다. cap이 3이기 때문에 6개를 만든다. <br />
그 후 원래 있던 값들을 더 큰 메모리 공간에 모두 복사한 다음에 400을 넣는다. <br />
|100|200|300|400|||
|------|---|---|---|---|---|

이렇게 되면 Length는 4가 되고, cap이 6이 되고, 포인터는 100 부분을 가리키게 된다. <br />
그러면 배열이 3개짜리와 6개짜리 2개가 생겼다. len는 4로 늘었고 cap도 6으로 늘었고, 포인터도 바뀌었다. 이것도 마찬가지로 슬라이스 구조체인데 <br />
이렇게 만들어진 새로운 슬라이스 구조체를 return시켜서 기존에 있던 s의 값에 덮어써지는 것이다. <br />

이 과정을 해보자 <br />
``` Go
	package main

	import "fmt"

	func main() {
		var s []int

		s = make([]int, 3)

		s[0] = 100
		s[1] = 200
		s[2] = 300

		s = append(s, 400)

		fmt.Println(s, len(s), cap(s))

	}
```
이것을 출력시켜보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97518178-1ae96380-19da-11eb-9423-4086fccfeebc.png" width = 70%> </img></p>
|100|200|300|400|||
|------|---|---|---|---|---|
이러한 배열이 만들어 졌고 길이가 4, cap이 6인 것을 알 수 있다.<br />

새롭게 만든 슬라이스를 s에 대입을 했는데 그렇다는 얘기는 이 append의 결과를 다른 슬라이스에 저장할 수도 있다는 말이 되는데 그렇게 되는지 확인해보자 <br />
그래서 새로운 슬라이스 t를 만들고, t를 출력하게 되면 어떻게 되는지 보자<br />

``` Go
	package main

	import "fmt"

	func main() {
		var s []int
		var t []int
		s = make([]int, 3)

		s[0] = 100
		s[1] = 200
		s[2] = 300

		t = append(s, 400)
		fmt.Println(s, len(s), cap(s))
		fmt.Println(t, len(t), cap(t))

	}

```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97518530-b2e74d00-19da-11eb-9092-a98571bff504.png" width = 70%> </img></p>
기존의 s는 <br />
|100|200|300|
|------|---|---|
Length가 3이고 cap이 3인데 
t는 <br />
|100|200|300|400|||
|------|---|---|---|---|---|
길이가 4, cap이 6인 것을 알 수 있다.<br />

이렇게 보면 s와 t는 완전히 다른 슬라이스라는것을 알 수 있다. s는 요소가 3개짜리고 100,200,300이 들어있으면 <br />
t는 요소가 4개짜리고 100,200,300,400이 들어있다. <br />
그래서 이 append의 역할은 내가 추가 하고 싶은 슬라이스를 받아서 그 슬라이스에 넣을 공간이 있는지 확인을 하고, 넣을 공간이 없으면 새로운 공간을 만들어서 기존의 값들을 모두 복사하고, 맨 뒤에 값을 추가한 다음에 새롭게 만들어진 슬라이스를 반환하는 것이고 그것을 대입 연산자로 대입한다. <br />
그렇기 때문에 넣었던 슬라이스와 다른 슬라이스가 나올 수 있다는 것이다. <br />

그런데 넣었던 슬라이스와 같은 포인터가 나올수도 있다. u라는 슬라이스를 추가하여 확인해보자 <Br />
이번에는 t에 500을 넣고 출력해준다. <br />

``` Go
	package main

	import "fmt"

	func main() {
		var s []int
		var t []int
		s = make([]int, 3)

		s[0] = 100
		s[1] = 200
		s[2] = 300

		t = append(s, 400)
		fmt.Println(s, len(s), cap(s))
		fmt.Println(t, len(t), cap(t))
		
		fmt.Println("////////////////////")
		var u []int 
		u = append(t, 500)
		
		fmt.Println(s, len(s), cap(s))
		fmt.Println(t, len(t), cap(t))
		fmt.Println(u, len(u), cap(u))

	}
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97519080-f42c2c80-19db-11eb-8c5e-bf631ea98bf9.png" width = 70%> </img></p>

구분자 뒤로 보면 s,t는 변한 것이 없지만 u는 500이 추가되었지만 len은 변했지만 cap이 변하지 않았다. <br />
이 상황에서 u의 첫번째 값을 9999로 바꾸고 구분자를 다시 표시하고 s,t,u를 출력해준다. <br />

``` Go
	package main

	import "fmt"

	func main() {
		var s []int
		var t []int
		s = make([]int, 3)

		s[0] = 100
		s[1] = 200
		s[2] = 300

		t = append(s, 400)
		fmt.Println(s, len(s), cap(s))
		fmt.Println(t, len(t), cap(t))
		fmt.Println("////////////////////")

		var u []int
		u = append(t, 500)

		fmt.Println(s, len(s), cap(s))
		fmt.Println(t, len(t), cap(t))
		fmt.Println(u, len(u), cap(u))

		u[0] = 9999
		fmt.Println("////////////////////")
		fmt.Println(s, len(s), cap(s))
		fmt.Println(t, len(t), cap(t))
		fmt.Println(u, len(u), cap(u))
	}
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97519287-5be27780-19dc-11eb-9a54-9ebfc746cab0.png" width = 70%> </img></p>
여기서 봐야할 게 마지막 부분인데 방금 u의 첫번째 부분을 바꾸었는데 t의 첫번째 값도 바뀐 것을 알 수 있다. s와는 다른 슬라이스기 때문에 s는 바뀌지 않았다.(포인터가 다르기 때문)<br />

여기까지 슬라이스에 대해 좀 더 자세히 알아보았다. <br />
