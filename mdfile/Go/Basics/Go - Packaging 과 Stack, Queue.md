## 시작
패키지(Package)라는 것은 어떤 모듈, 기능 등을 묶어 놓은 것을 의미한다. 가령 Go 자체가 가지고 있는 "fmt"라는 패키지가 있는데 "format"의 약자인데 이것은 출력과 관련된 것들을 묶어놓은 것이고 <br />
"math"라는 패키지가 있는데 수학과 관련된 함수들을 묶어 놓은 패키지이다. <br />
이런 관련된 기능들을 묶어 놓은 것을 패키지라고 한다. <br />

이전에 LinkedList를 만들었었는데 그 외에도 Stack, Queue, Tree, Heap들을 하나의 패키지로 만들어서 datastruct라는 것으로 만들어 늘려가볼까 한다. <br />

먼저 지난 시간에 만들었던 Linked List를 패키지로 분리시켜보자. <br />

우선 패키지를 만들어야 하니까 폴더를 하나 생성해준다. <br />
dataStruct라는 폴더를 만들어 준 뒤 그 안에 linkedList.go라는 파일을 생성해준다. <br />
linkedList.go파일을 작성해준다. <br />
<code>linkedList.go</code>
``` Go
package dataStruct

import "fmt"

type Node struct {
	next *Node
	prev *Node
	val  int
}

type LinkedList struct {
	root *Node
	tail *Node
}

func (l *LinkedList) AddNode(val int) {
	if l.root == nil {
		l.root = &Node{val: val}
		l.tail = l.root
		return
	}
	l.tail.next = &Node{val: val}
	prev := l.tail
	l.tail = l.tail.next
	l.tail.prev = prev
}

func (l *LinkedList) RemoveNode(node *Node) {
	if node == l.root {
		l.root = l.root.next
		l.root.prev = nil
		node.next = nil
		return
	}

	prev := node.prev

	if node == l.tail {
		prev.next = nil
		l.tail.prev = nil
		l.tail = prev
	} else {
		node.prev = nil
		prev.next = prev.next.next
		prev.next.prev = prev
	}
	node.next = nil
}

func (l *LinkedList) PrintNodes() {
	node := l.root
	for node.next != nil {
		fmt.Printf("%d -> ", node.val)
		node = node.next
	}
	fmt.Printf("%d\n", node.val)
}

func (l *LinkedList) PrintReverse() {
	node := l.tail
	for node.prev != nil {
		fmt.Printf("%d -> ", node.val)
		node = node.prev
	}
	fmt.Printf("%d\n", node.val)
}
```
기존에 linkedList를 작성했던 코드를 잘라내어 가져온다. <br />
그 후 main.go로 돌아와서 위의 패키지를 써준다. <br />
<code>main.go</code>
``` Go
package main

import (
	"fmt"

	"./dataStruct"
)

func main() {
	list := &dataStruct.LinkedList{}
	list.AddNode(0)

	for i := 1; i < 10; i++ {
		list.AddNode(i)
	}

	list.PrintNodes()

	list.RemoveNode(list.root.next)

	list.PrintNodes()

	list.RemoveNode(list.root)

	list.PrintNodes()

	list.RemoveNode(list.tail)

	list.PrintNodes()
	fmt.Printf("tail:%d\n", list.tail.val)

	list.PrintReverse()

	a := []int{1, 2, 3, 4, 5}
	a = append(a[0:2], a[3:]...)
	fmt.Println(a)
}
```
<code>LinkedList{}</code>는 dataStruct 패키지 안에 있는 LinkedList struct이므로 다음과 같이 수정해준다. <br />
이렇게 수정해주면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97824075-50ee5680-1cfe-11eb-9923-1cf0ba0dfd86.png" width = 70%> </img></p>
위와 같이 빨간줄이 그어지면서 에러가 뜰텐데 <br />
에러 내용은 다음과 같다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97824107-65caea00-1cfe-11eb-8d50-7c35b983d503.png" width = 70%> </img></p>
list.root가 정의되지 않았다는 의미인데 dataStruct 패키지 안에 있는LinkedList struct는 정의가 되어있는데 에러가 난다. 그 이유는 패키지에 외부로 공개되는 정보가 있고, 외부로 공개되지 않는 정보를 구분하기 때문이다. <br />
그러니까 dataStruct 패키지 안에 있는LinkedList struct의 root는 외부로 공개를 하지 않는 상태이다. 그것을 어떻게 구분하냐면 어떤 함수, 구조체, 변수 등의 첫글자가 대문자이면 외부로 부터 공개가 되고, 첫글자가 소문자면 외부로 부터 공개가 되지 않는다. <br />

``` Go
type LinkedList struct {
	root *Node
	tail *Node
}
```

이것만 살펴보면 LinkedList struct는 첫글자가 대문자이기 때문에 외부로부터 공개가 되지만, root, tail은 소문자이기 때문에 외부로부터 공개가 되지 않는다. <br />
그렇기 때문에 외부 패키지에서도 공개되도록 root, tail의 첫글자를 대문자로 바꾸어준다. <br />
<code>dataStruct/likedList.go</code>
``` Go
  package dataStruct

  import "fmt"

  type Node struct {
    next *Node
    prev *Node
    val  int
  }

  type LinkedList struct {
    Root *Node
    Tail *Node
  }

  func (l *LinkedList) AddNode(val int) {
    if l.Root == nil {
      l.Root = &Node{val: val}
      l.Tail = l.Root
      return
    }
    l.Tail.next = &Node{val: val}
    prev := l.Tail
    l.Tail = l.Tail.next
    l.Tail.prev = prev
  }

  func (l *LinkedList) RemoveNode(node *Node) {
    if node == l.Root {
      l.Root = l.Root.next
      l.Root.prev = nil
      node.next = nil
      return
    }

    prev := node.prev

    if node == l.Tail {
      prev.next = nil
      l.Tail.prev = nil
      l.Tail = prev
    } else {
      node.prev = nil
      prev.next = prev.next.next
      prev.next.prev = prev
    }
    node.next = nil
  }

  func (l *LinkedList) PrintNodes() {
    node := l.Root
    for node.next != nil {
      fmt.Printf("%d -> ", node.val)
      node = node.next
    }
    fmt.Printf("%d\n", node.val)
  }

  func (l *LinkedList) PrintReverse() {
    node := l.Tail
    for node.prev != nil {
      fmt.Printf("%d -> ", node.val)
      node = node.prev
    }
    fmt.Printf("%d\n", node.val)
  }
```

수정 후에 main.go로 넘어가면 에러가 사라진 것을 알 수 있는데 여기에서도 소문자인 root,tail을 첫글자만 대문자로 바꾸어준다. <br />

<code>main.go</code>
``` Go
package main

import (
	"fmt"

	"./dataStruct"
)

func main() {
	list := &dataStruct.LinkedList{}
	list.AddNode(0)

	for i := 1; i < 10; i++ {
		list.AddNode(i)
	}

	list.PrintNodes()

	list.RemoveNode(list.Root.next)

	list.PrintNodes()

	list.RemoveNode(list.Root)

	list.PrintNodes()

	list.RemoveNode(list.Tail)

	list.PrintNodes()
	fmt.Printf("Tail:%d\n", list.Tail.val)

	list.PrintReverse()

	a := []int{1, 2, 3, 4, 5}
	a = append(a[0:2], a[3:]...)
	fmt.Println(a)
}
```
수정한 뒤 실행시켜주면 다음과 같은 에러가 뜨는 것을 알 수 있는데 <br />
``` Text
.\main.go:19:27: list.Root.next undefined (cannot refer to unexported field or method next)
.\main.go:30:35: list.Tail.val undefined (cannot refer to unexported field or method val)
```
이 부분도 마찬가지로 외부로 공개되지 않아 생긴 문제이다. 저 부분들도 바꾸어주자. <br />
<code>dataStruct/likedList.go</code>에서
``` Go
type Node struct {
	next *Node
	prev *Node
	val  int
}
```
이 부분을 수정해주고, 이것과 관련되어 있는 것들도 수정해주자. <br />

``` Go
package dataStruct

import "fmt"

type Node struct {
	Next *Node
	Prev *Node
	Val  int
}

type LinkedList struct {
	Root *Node
	Tail *Node
}

func (l *LinkedList) AddNode(Val int) {
	if l.Root == nil {
		l.Root = &Node{Val: Val}
		l.Tail = l.Root
		return
	}
	l.Tail.Next = &Node{Val: Val}
	Prev := l.Tail
	l.Tail = l.Tail.Next
	l.Tail.Prev = Prev
}

func (l *LinkedList) RemoveNode(node *Node) {
	if node == l.Root {
		l.Root = l.Root.Next
		l.Root.Prev = nil
		node.Next = nil
		return
	}

	Prev := node.Prev

	if node == l.Tail {
		Prev.Next = nil
		l.Tail.Prev = nil
		l.Tail = Prev
	} else {
		node.Prev = nil
		Prev.Next = Prev.Next.Next
		Prev.Next.Prev = Prev
	}
	node.Next = nil
}

func (l *LinkedList) PrintNodes() {
	node := l.Root
	for node.Next != nil {
		fmt.Printf("%d -> ", node.Val)
		node = node.Next
	}
	fmt.Printf("%d\n", node.Val)
}

func (l *LinkedList) PrintReverse() {
	node := l.Tail
	for node.Prev != nil {
		fmt.Printf("%d -> ", node.Val)
		node = node.Prev
	}
	fmt.Printf("%d\n", node.Val)
}
```

마찬가지로 main.go부분도 수정해준다. <br />

``` Go
  package main

  import (
    "fmt"

    "./dataStruct"
  )

  func main() {
    list := &dataStruct.LinkedList{}
    list.AddNode(0)

    for i := 1; i < 10; i++ {
      list.AddNode(i)
    }

    list.PrintNodes()

    list.RemoveNode(list.Root.Next)

    list.PrintNodes()

    list.RemoveNode(list.Root)

    list.PrintNodes()

    list.RemoveNode(list.Tail)

    list.PrintNodes()
    fmt.Printf("Tail:%d\n", list.Tail.Val)

    list.PrintReverse()

    a := []int{1, 2, 3, 4, 5}
    a = append(a[0:2], a[3:]...)
    fmt.Println(a)
  }
```
이제 실행을 해보자 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97824803-492fb180-1d00-11eb-95fd-e261a5f6f322.png" width = 70%> </img></p>
기존에 했었던 부분과 똑같이 출력되는 것을 알 수 있다. <br />

이제 다른 프로그램에서도 저 패키지를 쓸 수 있게 되었다. 이제부터 만드는 코드들은 저 패키지 안에 넣으며 진행할 것이다. <br />
***
이제 Stack과 Queue를 시작해보자. 애네 둘은 구현도 비슷하고, 성격도 비슷하지만 동작은 서로 반대로 동작한다. <br />
Stack은 보통 FILO(First In Last Out)으로 표현을 하고, Queue는 FIFO(First In First Out)으로 표현을 한다. <br />
그러니까 Stack은 제일 먼저 들어간 애가 제일 나중에 나온다는 것이고, Queue는 제일 먼저 들어간 애가 제일 먼저 나온다는 의미이다. <br />

Stack의 구조는 아래와 같은데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97825438-0078f800-1d02-11eb-96b6-80822f7f5b1f.png" width = 70%> </img></p>
들어갈 때는 A-B-C 순서로 들어왔다면 나올 때는 C-B-A순으로 나온다. <br />

그러면 Stack을 코드로 어떻게 만들어야 위와 같이 만들면 좋을까? FILO(First In Last Out)을 하려면 메모리에서 data를 넣을 때는 맨 처음부터 넣고, 꺼낼 때는 맨 마지막 부터 꺼내면 된다. <br />

이제 Queue로 넘어가보자. Queue는 대기열이라고 보면 된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97826172-39b26780-1d04-11eb-9049-5a7b1d9234ec.png" width = 70%> </img></p>

실제 구조는 아래와 같은데<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97826465-f99fb480-1d04-11eb-95ad-d029438ea391.png" width = 70%> </img></p>
오른쪽에서 들어가서 왼쪽으로 나오기 때문에 들어올 때와 나올 때가 1-2-3-4-5 순으로 나오게 된다. <br />

마찬가지로 Queue는 코드로 어떻게 만들어야 좋을까? 배열이 있으면 넣는것은 뒤로 넣고, 뺄 때는 앞에서 빼면 된다. <br />

Stack과 Queue를 비교해보면 Stack은 맨 뒤에서부터 넣고, 맨 뒤에서부터 뺴고, Queue는 맨 뒤에서부터 넣고, 맨 앞에서부터 뺀다. 이러한 차이가 있다. <br />
이제부터 Stack과 Queue를 만들어보자. 처음에는 Slice로 만들어준다. <br />

<code>main.go</code>
``` Go
  package main

  import (
    "fmt"
  )

  func main() {
    stack := []int{}

    for i := 1; i <= 5; i++ {
      stack = append(stack, i)
    }

    for len(stack) > 0 {
      var last int
      last, stack = stack[len(stack)-1], stack[:len(stack)-1]
      fmt.Println(last)
    }
  }
```

먼저 stack부분부터 만들어 줄 것인데 Slice형태를 가진 stack이라는 변수를 만들어주고, stack에 append로 1 ~ 5까지 데이터를 추가시켜주고 <br />
뺄 때는 맨 마지막부터 빼기 때문에 last와 stack이 바뀌게된다. last는 맨 마지막에 있는 것이기 때문에 **stack의 길이 - 1 한 인덱스 값** 이 마지막 값이 되고 <br />
그리고 stack은 처음부터 시작해서 맨 마지막 값 -1 한 것 까지 스택을 바꿔준다. 이렇게 하면 last가 나오게 된다. <br />
그래서 그것을 스택의 길이가 0보다 클 때까지 반복해주고, 맨 마지막 값을 출력시켜준다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97827092-a0d11b80-1d06-11eb-974e-223d3da680c7.png" width = 70%> </img></p>

출력이 5,4,3,2,1 순으로 됐고, 들어간 순서도 출력시켜주면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97827141-c4946180-1d06-11eb-99a9-4c890cc872cc.png" width = 70%> </img></p>
1,2,3,4,5가 들어간 것을 알 수 있다. <br />

그 아래에 Queue를 만들어보자 <br />

``` Go
  package main

  import (
    "fmt"
  )

  func main() {
    stack := []int{}

    for i := 1; i <= 5; i++ {
      stack = append(stack, i)
    }

    fmt.Println(stack)

    for len(stack) > 0 {
      var last int
      last, stack = stack[len(stack)-1], stack[:len(stack)-1]
      fmt.Println(last)
    }

    queue := []int{}
    for i := 1; i <= 5; i++ {
      queue = append(queue, i)
    }

    fmt.Println(queue)

    for len(queue) > 0 {
      var front int
      front, queue = queue[0], queue[1:]
      fmt.Println(front)
    }
  }
```

마찬가지로 queue 빈 slice로 만들어주고 <br />
queue에 맨 뒤에서 부터 append해서  1 ~ 5까지 추가해 주었다. 이 상태를 출력시켜주고<br />
stack과 마찬가지로 queue의 길이가 0보다 클 때 까지 출력을 시켜주는데 front는 맨 첫번째 것인 0번째가 되고, 맨 앞에서 뺐으니 1부터 잘라준다. <br />
그렇게 해서 front가 나오면 front를 출력시켜준다. <br />

이제 저장 후에 출력시켜보자 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97827548-f9ed7f00-1d07-11eb-95e1-6f8024cc72d8.png" width = 70%> </img></p>
위에 것은 stack 밑에 것은 queue이다. stack은 뺄 때 <code>stack[len(stack)-1], stack[:len(stack)-1]</code>로 해서 맨 뒤에 것 부터 빼주었고 <br />
Queue는 <code>queue[0], queue[1:]</code>를 사용하여 맨 앞에 것 부터 빼주었다. <br />

이 Slice를 잘 봐야 하는데 저번에 설명했을 때 stack[시작포인트:엔드포인트]라고 했었고, 시작포인트 부터 시작해서 엔드를 포함하지 않고 끝낸다고 했었다. <br />
그래서 <code>stack[:len(stack)-1]</code> 이렇게 썼으면 시작포인트가 생략되었기 때문에 0부터 시작해서 길이-1까지니까 <br />

|1|2|3|4|
|------|---|---|---|
|0|1|2|3|

이렇게 있다고 가정하면 길이는 4가 된다. (위에는 데이터 밑에는 인덱스) 그래서 4-1까지인 3까지인데 3을 포함하지 않게 되어 맨 뒤에 것이 없어지게 된다. <br />

|1|2|3|
|------|---|---|
|0|1|2|

그 다음 것은 또 맨 뒤것이 없어지게 되고가 반복되는 식이 된다. <br />

Queue는 맨 앞에 것인 <code>queue[0]</code>이 front에 대입되게 되고, 그 다음 <code>queue[1:]</code>를 사용하여 자르는데 뒤에 것이 생략되었기 때문에 1 부터 나머지이다. <br />

|1|2|3|4|
|------|---|---|---|
|0|1|2|3|

이렇게 있다고 가정하면 시작 지점이 1부터 끝까지기 때문에 맨 앞에 있는 0번 값은 사라지게 된다. <br />

|2|3|4|
|------|---|---|
|0|1|2|

그 다음에는 2가 인덱스 0을 가지는 첫번째 값이 되기 때문에 2가 사라지게 된다. <br />

|3|4|
|------|---|
|0|1|

이것이 반복되는 것이 Queue이다. <br />

그러면 Stack과 Queue를 위와 같은 배열로 만드는 것과 Linked List로 만들 때 어떤 차이가 있는지 알아보자 <br />
우선 Stack을 배열로 구현 했을 때를 보자 <br />

|1|2|3|4|
|------|---|---|---|

이렇게 배열안에 값이 있다고 했을 때 값을 추가하면 맨 뒤에 값이 추가된다. 그랬을 때 Capacity가 다 차게 되면 더 큰 배열을 만들고 그 값들 옮겨 담는다고 했었다. <br />
그 때 속도는 O(N)이 필요하다. (이 때는 Queue도 마찬가지이다.) <br />

꺼낼 때는 Stack은 맨 뒤에서 부터 하나씩 꺼내기 때문에 Capacity는 그대로 있고, Length만 하나씩 줄어든다. Length만 움직이게 되는 것이기 떄문에 배열을 옮길 필요가 없다. <br />
그렇기 때문에 꺼내는건 O(1)이다. <br />

Queue는 꺼낼 때 StartIndex가 하나씩 전진하며 꺼내기 때문에 O(1)이 된다.<br />
정리하자면 Queue와 Stack은 요소를 추가할 때는 O(1)이지만 Capacity가 다 떨어졌을 때는 O(N)이 되고, 요소를 꺼낼 때는 항상 O(1)이 된다. <br />

이번에는 Stack과 Queue를 Linked List로 만들었을 때로 넘어가보자 <br />
Linked List는 넣을 때는 맨뒤로 넣으면 되는데 tail을 알고 있기 때문에 O(1)이다. <br />
Stack에서 뺄 때는 그 요소를 빼고 링크만 끊으면 되기 때문에 O(1)이다. Queue도 마찬가지이다. <br />

그래서 정리하자면 Slice로 했을 때 데이터를 넣을때는 O(N), 뺄때는 O(1)이고 <br />
Linked List로 했을 때는 모두 O(1)이다. Linked List가 더 빠르지만 Slice로 해도 크게 무리는 없다. <br />
데이터를 넣을때 O(N)이 발생하지만 간혹 간혹 발생하기 때문인데 이 말이 무슨말이냐면 배열이 처음에는 1개, 2개, 4개, 8개..... 로 늘어나서 배열의 크기가 나중에는 엄청 커다랗게 될텐데 <br />
배열이 이렇게 어느정도까지 성장할 때 까지는 시간이 걸리지만 한번 성장하고 난 다음에는 시간이 크게 걸리지 않는다. <br />
하지만 O(N)보다는 느리고 Linked List로 만들면 더 빠를 수 있다. 정도로만 알고 있으면 된다. <br />

그리고 저번에도 말했듯이 배열하고 리스트는 메모리상의 구획이 틀리다. 그래서 배열처럼 따닥따닥 붙어있는 상황에서 좋은점은 캐시미스가 덜 나기 때문에 반복문에서 더 빠르게 수행할 수 있다는 점이다.  <br />

이런 차이만 있다. 정도로만 알고 있으면 된다. 그래서 Slice로 만드나, Linked List로 만드나 적은 요소에서는 커다란 차이가 없다. <br />

***

이제는 Linked List로 이용해서 만들어보자 <br />

하기 앞서 dataStruct폴더에 stack.go를 추가해준다. <br />

``` Go
package dataStruct

type Stack struct {
	ll *LinkedList
}

func NewStack() *Stack {
	return &Stack{ll: &LinkedList{}}
}

func (s *Stack) Push(val int) {
	s.ll.AddNode(val)
}
```
Stack이라는 struct를 추가해주고, LinkedList를 안에 넣어준다. <br />
그 아래에 Stack의 기능을 추가해주는데 먼저 Add 해주는 Push를 추가해준다. <br />
Push()안에 <code>LinkedList.go</code>의 AddNode()를 가져온다. <br />
그 다음에 NewStack()이라는 생성자를 하나 만들어준다. 이 함수는 초기화 시켜주는 것인데 새로운 LinkedList를 하나 만들어서 그 주소를 넣어서 초기화해서 그것을 반환하는 함수이다. <br />
그 다음 꺼내오는 함수인 POP()을 만들어주는데 <code>LinkedList.go</code>안에 Pop()에 쓸만한 함수가 없기 때문에 하나 추가해준다. <br />

<code>dataStack/LinkedList.go</code>
``` Go
func (l *LinkedList) Back() int {
	if l.Tail != nil {
		return l.Tail.Val
	}
	return 0
}
```

맨 뒤에 값을 반환하는 Back()을 만들어준다. Tail이 nil이 아니면 Tail의 Val를 반환해주고, nil이면 0을 반환시킨다. <br />
<code>stack.go</code>로 넘어와서 Pop()코드를 추가 시켜준다. <br />
``` Go
package dataStruct

type Stack struct {
	ll *LinkedList
}

func NewStack() *Stack {
	return &Stack{ll: &LinkedList{}}
}

func (s *Stack) Push(val int) {
	s.ll.AddNode(val)
}

func (s *Stack) Pop() int {
	back := s.ll.Back()
}

```

back이라는 변수에 Back()함수를 넣어 저장시켜주고, 맨 뒤에 값을 지워야하기 때문에 <code>LinkedList.go</code>로 넘어와 PopBack()을 추가해준다. <br />

<code>LinkedList.go</code>
``` Go
func (l *LinkedList) PopBack() {
	if l.Tail == nil {
		return
	}
	l.RemoveNode(l.Tail)
}
```
Tail이 없는 경우에는 지울 필요가 없기 때문에 있는 경우엔 그냥 넘어가고, Tail이 있는 경우엔 Tail을 지워준다. <br />
다시 이것을 <code>stack.go</code>로 넘어와서 Pop()안에 추가 시켜준다. <br />
``` Go
package dataStruct

type Stack struct {
	ll *LinkedList
}

func NewStack() *Stack {
	return &Stack{ll: &LinkedList{}}
}

func (s *Stack) Push(val int) {
	s.ll.AddNode(val)
}

func (s *Stack) Pop() int {
	back := s.ll.Back()
	s.ll.PopBack()
	return back
}
```
PopBack() 써서 맨 뒤를 지운 다음에 back을 반환시켜준다. <br />
이렇게 하면 Stack이 만들어질 것이다. 이제 <code>main.go</code>에서 사용해보자.<br />

``` Go
package main

import (
	"fmt"

	"./dataStruct"
)

func main() {
	stack := []int{}

	for i := 1; i <= 5; i++ {
		stack = append(stack, i)
	}

	fmt.Println(stack)

	for len(stack) > 0 {
		var last int
		last, stack = stack[len(stack)-1], stack[:len(stack)-1]
		fmt.Println(last)
	}

	queue := []int{}
	for i := 1; i <= 5; i++ {
		queue = append(queue, i)
	}

	fmt.Println(queue)

	for len(queue) > 0 {
		var front int
		front, queue = queue[0], queue[1:]
		fmt.Println(front)
	}

	stack2 := dataStruct.NewStack()

	for i := 1; i <= 5; i++ {
		stack2.Push(i)
	}
}
```
Linked List형태의 Stack을 stack2로 지정했다. NewStack()을 사용했기 때문에 새로운 Stack을 만들어서 그 메모리 주소를 반환하기 때문에 새로운 Stack이 stack2에 대입이 될 것이다. <br />
그 후 마찬가지로 1 ~ 5까지 stack2에다 Push를 해준다. <br />
그리고 비었는지 확인하기 위해 <code>stack.go</code>와 <code>dataStack/LinkedList.go<code>에 Empty()를 만들어준다. <br />
	
<code>dataStack/LinkedList.go<code>
``` Go
func (l *LinkedList) Empty() bool {
	return l.Root == nil
}
```
Root가 없으면 Empty()가 True이고, 있으면 False이다. <br />
	
<code>stack.go</code>
``` Go
func (s *Stack) Empty() bool {
	return s.ll.Empty()
}
```
마찬가지로 LinkedList.go의 Empty()를 사용하여 확인해준다.  <br />
<code>main.go</code>로 돌아와 계속해서 작성하자. <br />
``` Go
package main

import (
	"fmt"

	"./dataStruct"
)

func main() {
	stack := []int{}

	for i := 1; i <= 5; i++ {
		stack = append(stack, i)
	}

	fmt.Println(stack)

	for len(stack) > 0 {
		var last int
		last, stack = stack[len(stack)-1], stack[:len(stack)-1]
		fmt.Println(last)
	}

	queue := []int{}
	for i := 1; i <= 5; i++ {
		queue = append(queue, i)
	}

	fmt.Println(queue)

	for len(queue) > 0 {
		var front int
		front, queue = queue[0], queue[1:]
		fmt.Println(front)
	}

	stack2 := dataStruct.NewStack()

	for i := 1; i <= 5; i++ {
		stack2.Push(i)
	}
	
	fmt.Println("newStack")
	
	for !stack2.Empty() {
		val := stack2.Pop()
		fmt.Printf("%d ->", val)
	}
}
```

stack2가 비어있지 않을 때까지 Pop()을 해서 출력시켜준다. <br />
그리고 그 위에 새로운 Stack이 시작된다고 알려준다. 이렇게 해서 실행을 시켜보자 <br />

이 상태에서 실행을 시켜보면 에러가 난다.  <br />
그래서 VS Code안에 디버그 버튼이 있는데 그것을 눌러보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97835492-a71ec200-1d1d-11eb-85b8-11c68666d4fb.png" width = 70%> </img></p>
현재 함수가 호출된 상태가 나온다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97835577-d59c9d00-1d1d-11eb-8ce9-71a2d3c910ef.png" width = 70%> </img></p>

그래서 보게 되면 
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97522424-12e1f180-19e3-11eb-9bc9-836f70a3029f.png" width = 70%> </img></p>
RemoveNode()를 하는데 에러가 난 것이다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97835751-3a57f780-1d1e-11eb-8768-9425b79b427f.png" width = 70%> </img></p>
그 원인을 보면 Root를 다음 것으로 갱신하는데 그 Root가 nil인 상태인 것이다. 그러니까 아무것도 없는 것에 접근을 하니까 에러가 난 것이다. <br />
이것이 Access Violation이 난 것인데 이 부분을 고쳐주도록 하자. <br />

``` Go
func (l *LinkedList) RemoveNode(node *Node) {
	if node == l.Root {
		l.Root = l.Root.Next
		if l.Root != nil { // 바뀐 부분
			l.Root.Prev = nil
		}
		node.Next = nil
		return
	}

	Prev := node.Prev

	if node == l.Tail {
		Prev.Next = nil
		l.Tail.Prev = nil
		l.Tail = Prev
	} else {
		node.Prev = nil
		Prev.Next = Prev.Next.Next
		Prev.Next.Prev = Prev
	}
	node.Next = nil
}
```
위와 같이 Root가 nil이 아닌 경우에면 바꾸어 주도록 한다. <br />

그 후 다시 실행을 시켜주자 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97836120-ef8aaf80-1d1e-11eb-8bc5-680d1df9d052.png" width = 70%> </img></p>
이제 에러 없이 잘 동작하는 것을 알 수 있다. <br />

이제 Queue도 만들어보자 마찬가지로 dataStruct패키지안에 queue.go를 추가해준다. <br />

``` Go
package dataStruct

type Queue struct {
	ll *LinkedList
}

func NewQueue() *Queue {
	return &Queue{ll:&LinkedList{}}
}

func (q *Queue) Push(val int) {
	q.ll.AddNode(val)
}
```
마찬가지로 생성함수인 NewQueue()를 만들어준다. <br />
그리고 데이터를 넣어주는 Push()을 만들어준다. <br />
데이터를 빼오는 Pop()을 만들어주어야 하는데 앞에서부터 빼오기 때문에 linkedList.go에서 Front()를 만들어준다. <br />

<code>dataStruct/linkedList</code>
``` Go
func (l *LinkedList) Front() int {
	if l.Root != nil {
		return l.Root.Val
	}
	return 0
}
```

Root가 nil이 아니면 Root의 값을 반환하고, nil이면 0을 반환하도록 만들어준다. <br />
다시 <code>dataStruct/queue.go</code>로 넘어와서 <br />
``` Go
func (q *Queue) Pop() int {
	front := q.ll.Front()
	q.ll.PopFront()
	return front
}
```
queue에서 Front()을 하면 front값을 저장해놓고, 맨 앞에서 하나 지워줘야 하기 때문에 <code>dataStruct/linkedList.go</code>에서 PopFront()를 만들어준다. <br />

<code>dataStruct/linkedList.go</code>
``` Go
func (l *LinkedList) PopFront() {
	if l.Root == nil {
		return
	}
	l.RemoveNode(l.Root)
}
```
PopFront()는 Root를 없애는 것이니까 Root가 없으면 그냥 반환해주고, Root가 있으면 지워주도록 하자. <br />

다시 <code>dataStruct/queue.go</code>로 넘어와서 비었는지 확인하는 Empty()를 만들어준다.<br />
``` Go
package dataStruct

type Queue struct {
	ll *LinkedList
}

func NewQueue() *Queue {
	return &Queue{ll: &LinkedList{}}
}

func (q *Queue) Push(val int) {
	q.ll.AddNode(val)
}

func (q *Queue) Pop() int {
	front := q.ll.Front()
	q.ll.PopFront()
	return front
}

func (q *Queue) Empty() bool {
	return q.ll.Empty()
}
```

이제 main에 넘어와서 <code>queue.go</code>를 이용해서 만들어보자 <br />
``` Go
package main

import (
	"fmt"

	"./dataStruct"
)

func main() {
	stack := []int{}

	for i := 1; i <= 5; i++ {
		stack = append(stack, i)
	}

	fmt.Println(stack)

	for len(stack) > 0 {
		var last int
		last, stack = stack[len(stack)-1], stack[:len(stack)-1]
		fmt.Println(last)
	}

	queue := []int{}
	for i := 1; i <= 5; i++ {
		queue = append(queue, i)
	}

	fmt.Println(queue)

	for len(queue) > 0 {
		var front int
		front, queue = queue[0], queue[1:]
		fmt.Println(front)
	}

	stack2 := dataStruct.NewStack()

	for i := 1; i <= 5; i++ {
		stack2.Push(i)
	}

	fmt.Println("newStack")

	for !stack2.Empty() {
		val := stack2.Pop()
		fmt.Printf("%d ->", val)
	}

	queue2 := dataStruct.NewQueue()

	for i := 1; i <= 5; i++ {
		queue2.Push(i)
	}

	fmt.Println("newQueue")

	for !queue2.Empty() {
		val := queue2.Pop()
		fmt.Printf("%d ->", val)
	}

}
```
<code>queue2 := dataStruct.NewQueue()</code>에서 마찬가지로 새로운 queue로 초기화 시켜주고, 아까 stack2 했던 부분을 그대로 복사하여 stack2부분을 queue2로 바꾸어준다. <br />
이제 실행 시켜준 뒤 출력을 확인해보자 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97837739-31692500-1d22-11eb-9330-4707727ca51b.png" width = 70%> </img></p>
정상적으로 출력되는 것을 확인할 수 있다. <br />

여기까지 Slice, Linked List로 Stack과 Queue를 만들었다. <br />
***
이것을 어디에 사용하는지 알아보자 우선 Stack의 경우 예시 코드를 살펴보면 <br />
``` Go
{
	int a 
		for ... {
			int b
		}
}
```
이라 할 때 나중에 선언된 b가 먼저 없어지게 된다. 이 경우 a를 만들고, b를 만들었고, 없어지는 순서는 b가 없어지고 그 다음에 a가 사라진다. <br />
들어간 순서와 반대로 없어지게 되는데 Stack으로 만들면 처음에 a가 만들어지고, 그 다음에 b가 만들어지기 때문에 b가 먼저 없어지고, 그 다음에 a가 없어지는데 <br />
이 처럼 맨 마지막에 넣는 것이 맨 처음으로 빼고 싶을 때 Stack을 사용한다. <br />

Queue는 대기열이다. 어떤 줄을 세우고 싶을 때 Queue를 사용한다. <br />
예를 들면 어떤 번호를 뽑았는데 뽑은 번호 순서대로 실행시키고 싶을 때 Queue를 쓰고 <br />
대기를 시켜 줄을 세워서 그 순서대로 하고 싶을 때도 Queue를 쓰고 <br />
LOL 같은 경우에도 게임시작 버튼을 눌러서 매칭할 때도 먼저 누른 사람 순서대로 잡아주는데 그 때도 Queue를 쓴다. <Br />
