## 시작
Leinked List는 연결된 리스트를 의미하는데 요소들을 서로 연결했다고 보면 된다. <Br />
배열은 하나의 통 메모리를 할당해서 그것을 나눠 쓰는 것인데 붙어 있다고 생각하면 되는데 Linked List는 붙어있는게 아니라 연결을 해놓은 것이다. <br />
배열은 한 덩어리로 존재하지만 Leinked List는 서로 떨어져있는 메모리들을 한 줄로 연결해 놓은 것이라고 생각하면 된다. <br />
연결하는 방법은 포인터를 이용하는 방법이다. Leinked List의 한 요소를 Node라고 하는데 이 Node에서 다음 Node로 포인터를 가지고 서로 연결을 시킬 수가 있다. <br />

그러면 포인터를 가지고 어떻게 연결을 하는지 알아보자. Struct를 하나 정의해보자  <br />
``` Go
  type Node struct {
    next *Node
    val int
  }
```
이 때 다음 노드에 대한 포인터를 이 struct의 맴버로 가지고 있다. <br />
그리고 필요한 자료들이 있으면 저 안에 적는 것이다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97650504-2baedd80-1a9d-11eb-8e5b-47cc06261f54.png" width = 70%> </img></p>
이렇게 하면 하나의 노드가 있으면 이 노드가 메모리 안에 가지고 있는 맴버 변수 중에 next가 있는데 이 next는 다음 노드를 가리키고 있는 포인터이다. <br />
그러면 다음 노드는 마찬가지로 다른 애를 가리키고, 그 다음 노드는 또 다른 애를 가리키고 있는 이 형태를 **Linked List**라고 한다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97650822-0078be00-1a9e-11eb-92fa-64871e70992f.png" width = 70%> </img></p>
이렇게 되면 한 줄로 나타낼 수 있다. 노드들이 서로 next 노드가 그 다음것을 연결하고, 또 next 노드가 그 다음것을 연결하는 식으로 만드는게 **Linked List**이다. <br />
이렇게 쭉 연결하면 무한정 계속 노드들을 연결해 나가면서 각 요소들을 늘릴 수 있다. 이것이 **Linked List** 의 특징이다.<br />

이제 직접 코딩해보자 <br />
``` Go
  package main

  import "fmt"

  type Node struct {
    next *Node
    val int
  }

  func main() {

  }
```
이렇게 노드의 구조체를 만들어준다. next는 노드 포인터, val은 어떤 값을 가지고 있다고 보면 된다. <br />
맨 처음 시작하는 노드에 대해서 알고 있어야 하는데<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97650822-0078be00-1a9e-11eb-92fa-64871e70992f.png" width = 70%> </img></p>
이렇게 노드들이 연결되어 있는데 맨 처음이 뭔지 모르면 그 다음 노드를 타고 순회를 해야 하는데 맨 처음 부터 알고 있어야 다음으로 넘어 갈 수 있는데 맨 처음 노드를 **root** 라고 부른다. <br />
root는 뿌리, 가장 첫 시작이라는 뜻이다. 그래서 root 노드를 알고 있어야 한다. <br />

``` Go
  package main

  import "fmt"

  type Node struct {
    next *Node
    val int
  }

  func main() {
    	var root *Node
	    
      root = &Node{}
	
  }
```

이런식으로 root를 만들어준다. <code>&Node{}</code>는 Node라는 struct를 하나 만든 것이고, 포인터는 주소를 갖고 있으니까 그것의 주소를 root로 가지고 있는 것이다. <br />
그래서 이 root에 값을 넣어주자. <br />

``` Go
  package main

  import "fmt"

  type Node struct {
    next *Node
    val int
  }

  func main() {
    	var root *Node
	    
      root = &Node{val:0}
	    
  }
```
그러면 여기다 어떤 요소를 추가하는 방법을 생각해보자. 어떻게 추가 해야할까?<br />
현재 root라는 애를 만들었고, next는 있지만 다른 노드를 가리키고 있진 않는 상황이다. <br />
어떤 노드를 추가하려면 하나의 노드를 만든 다음에 맨 끝에 있는 노드의 next를 새로 만든 애로 가리키면 될 것이다. <br />
그 다음에 또 추가하려면 하나의 노드를 만들고 맨 끝에 있는 노드의 next가 새로운 노드를 가리키면 될 것이다. <br />

그러면 맨 끝에 있는 노드가 어떤것인지 알아야 하는데 맨 끝에 노드는 2가지 방법으로 알 수 있는데 <br /> 
## 첫번째 방법은 root부터 시작해서 next로 타고가다가 다음 next가 없을 때 까지 가는 것이다. <br />
그 다음 노드가 없다는 것은 그 노드가 맨 끝이라는 의미이기 때문이다.

이걸 사용하여 코딩해보자 <br />

``` Go
  package main

  import "fmt"

  type Node struct {
    next *Node
    val int
  }

  func main() {
    var root *Node

    root = &Node{val:0}

    var tail *Node
    tail = root
    for tail.next != nil { // 1
      tail = tail.next
    }
  }
```
맨 끝의 노드를 tail이라 두고 맨 끝의 노드는 맨 처음 노드부터 시작해서 하나씩 하나씩 그 다음 노드가 존재하면 앞으로 가는 것인데 <br />
1 : 현재 tail은 지금 코드상으로는 root이므로 맨 처음 root의 next가 존재하면 tail은 그 다음 노드에 대입하게 된다. <br />
    그렇게 되면 <code>tail.next</code>는 그 다음 노드가 될 것이며, for문으로 올라가서 그 다음 노드의 next가 존재하면 tail을 그 다음 노드에 대입하여 앞으로 전진해 나간다. <Br />

그림으로 설명하면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97654667-c829ad80-1aa6-11eb-9e0e-8727182bd536.png" width = 70%> </img></p>
처음에는 tail이 root 노드를 가리키고 있을 것이다. 처음에는 root이면서 tail이 되는데 next가 존재하면<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97654719-e8f20300-1aa6-11eb-9be8-f23d28765e94.png" width = 70%> </img></p>
그 다음 애가 있다는 의미이기 때문에 그 다음 노드가 있으면 tail은 그 다음 노드를 가리키게 된다.<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97654780-0cb54900-1aa7-11eb-9cdd-5cf18893ffa7.png" width = 70%> </img></p>
그 다음에 또 다음 노드가 있으면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97654802-1474ed80-1aa7-11eb-9b8a-7805b19cd79b.png" width = 70%> </img></p>
tail은 그 다음 노드에 바꾼다. <br />

이렇게 계속 링크를 따라서 다음 next가 nil인 경우까지 전진하면 그 노드가 맨 마지막 노드가 될 것이며 그 맨 마지막에 노드를 추가하는 것이다. <br />

코드로 넘어가서 새로운 노드를 만드는 코드를 추가하자. <br />

``` Go
  package main

  import "fmt"

  type Node struct {
    next *Node
    val int
  }

  func main() {
    var root *Node
    root = &Node{val:0}

    var tail *Node
    tail = root
    
    for tail.next != nil {
      tail = tail.next
    }

    node := &Node{val:1}
    tail.next = node
  }
```

이렇게 새로운 노드를 만든 후 tail.next에 새로운 노드를 지정하게 되면 하나가 추가가 되는 것이다. <br />

이 추가하는 과정을 함수로 만들어보자 <br />

``` Go
  package main

  type Node struct {
    next *Node
    val  int
  }

  func main() {
    var root *Node
    root = &Node{val: 0}
  }

  func AddNode(root *Node, val int) {
      var tail *Node
      tail = root
      
      for tail.next != nil {
        tail = tail.next
      }
      
      node := &Node{val: val}
      tail.next = node
  }
```

이렇게 main()에 있는 것을 잘라서 AddNode()에 넣어주면 root를 받아서 맨 끝에 val값을 추가하는 것인데 특정 val를 갖는 노드를 추가하는 것이다. <Br />
그래서 tail root부터 시작해서 맨끝까지 전진시킨다음에 맨 끝에 지정한 val를 갖는 새로운 노드를 추가하는 것이다.<br />

이렇게 함수를 만든 다음에 root부터 시작해서 하나씩 val를 증가시키면서 10개의 노드를 추가해보자! <br />

``` Go
  package main

  type Node struct {
    next *Node
    val  int
  }

  func main() {
    var root *Node

    root = &Node{val: 0}

    for i := 1; i < 10; i++ {
      AddNode(root, i)
    }

  }

  func AddNode(root *Node, val int) {
    var tail *Node
    tail = root
    for tail.next != nil {
      tail = tail.next
    }
    node := &Node{val: val}
    tail.next = node
  }
```

이렇게하여 추가 시켜준 다음에 출력을 시켜 줄 것인데 출력은 root부터 시작해서 그 다음 노드가 있으면 전진하는데 전진하기 전에 현재값을 출력하고 전진하도록 수정해준다. <br />

``` Go
  package main

  import "fmt"

  type Node struct {
    next *Node
    val  int
  }

  func main() {
    var root *Node

    root = &Node{val: 0}

    for i := 1; i < 10; i++ {
      AddNode(root, i)
    }

    node := root
    
    for node.next != nil {
      fmt.Printf("%d ->", node.val)
      node = node.next
    }
    fmt.Printf("%d\n", node.val)
  }

  func AddNode(root *Node, val int) {
    var tail *Node
    tail = root
    for tail.next != nil {
      tail = tail.next
    }
    node := &Node{val: val}
    tail.next = node
  }
```

main()부분에서 <br />

``` Go
  for node.next != nil {
      fmt.Printf("%d ->", node.val)
      node = node.next
  }
```

여기서 출력하며 갈 때 맨 마지막 노드는 next가 nil이기 때문에 <code>fmt.Printf("%d\n", node.val)</code>여기는 맨 마지막 노드가 올 것이다. 여기에 현재 노드의 val값을 출력시켜준다. <br /> 

출력하여 결과를 확인해보자 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97655761-2bb4da80-1aa9-11eb-88a5-11e7b346e35c.png" width = 70%> </img></p>
노드들이 서로 쭉 연결된 것을 알 수 있다. <Br />

이 방법이 처음부터 시작해서 링크가 연결되어 있는 것을 순회해서 출력하는 방법이다. <br />

## 두번째 방법은 root와 tail을 항상 갖고 있어서 맨 끝의 값을 기억하고 있는 방법이다.
그러면 root부터 시작해서 맨 끝까지 전진할 필요 없이 tail에다 노드를 하나 추가 하고 노드가 추가 되었으면 tail을 새로 추가된 노드에 바꿔주면 된다. <br />
어떻게보면 조금 쉬워졌는데 기존 코드에 적용해보자 <br />

``` Go
  package main

  import "fmt"

  type Node struct {
    next *Node
    val  int
  }

  func main() {
    var root *Node
    var tail *Node
    
    root = &Node{val: 0}
    tail = root
    for i := 1; i < 10; i++ {
      tail = AddNode(tail, i)
    }
  }
```

이렇게 tail도 기억하고 있게 하고, 맨 처음에 root가 추가가 되었는데 그 말은 tail과 root가 같다는 이야기다. <Br />
거기에 하나가 더 추가되면 root(맨 처음 노드)는 가만히 있지만 tail은 새로 추가된 노드로 바뀌게 된다. <br />

그 다음 add했을 때 root를 넣는 것이 아니라 tail을 넣고 맨 마지막 노드로 바뀔 것이기 때문에 새로운 노드로 갱신하는 것으로 함수를 바꿔준다. <br />

``` Go
  package main

  import "fmt"

  type Node struct {
    next *Node
    val  int
  }

  func main() {
    var root *Node
    var tail *Node

    root = &Node{val: 0}
    tail = root

    for i := 1; i < 10; i++ {
      tail = AddNode(tail, i)
    }

    node := root

    for node.next != nil {
      fmt.Printf("%d ->", node.val)
      node = node.next
    }
    fmt.Printf("%d\n", node.val)
  }

  func AddNode(tail *Node, val int) *Node {
    node := &Node{val: val}
    tail.next = node
    return node
  }
```
기존에 root가 들어오는 것이 아니라 tail이 들어오고, 새로 추가된 노드로 반환값을 추가해준다. <br />
tail이 입력으로 들어오기 때문에 맨처음부터 시작해서 끝까지 갈 필요가 없어서 저 두줄의 코드를 제외한 기존 부분을 지워주고 <br />
그래서 새로 추가된 노드가 있고, 그 노드가 tail의 next로 들어가고 새로 추가된 노드를 반환시켜준다. <br />
이렇게 하면 원래 있던 것보다 훨씬 깔끔하게 완성된다. <br />

그래서 새로 추가된 노드가 반환되니까 반환된 노드가 새로운 tail이 되는 것이다. 그래서 맨 끝의 값이 유지가 된다. <br />
이렇게해서 출력을 해보자 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97657097-5d7b7080-1aac-11eb-9133-ec72dee840b2.png" width = 70%> </img></p>
첫번째 방법과 똑같이 출력되는 것을 알 수 있다.

## 그럼 첫번째 방법과 두번째 방법의 차이점을 알아보자
첫번째 방법은 tail을 따로 지정하지 않았다. 그냥 root가 있고, 새로운 노드를 추가할 때 맨 끝값을 찾아야 하니까 root부터 전진해서 맨 끝에 값을 찾아낸 다음에 거기에 새로운 노드를 추가하는 방식이였다. <br />
이렇게 되면 현재 노드의 개수가 3개라고 하면 root부터 시작해서 따라가는 for문을 3번 돌아야한다. 10개면 10번을 돌아야 하고, 현재 노드의 개수가 n개면 n번 돌아야 한다. <br />
이걸 알고리즘에서 어떻게 애기하냐면 **Add를 하기 위해서 O(N)이 필요하다.** 고 표현한다. <br />
이걸 **비고법** 이라고하는데 알고리즘에서 시간을 계산하는 방법 중 하나이다. <br />

두번째 방법은 root와 tail을 기록하고 있었다. root는 항상 맨 처음값, tail은 항상 맨 마지막 값이 되었다. <br />
여기서 Add를 하려고 하면 그냥 tail에 노드를 추가해서 tail값을 바꿔주면 되었다. <br />
그러면 현재 노드의 갯수가 10개라고 했을 때 add를 하기 위해서 for문을 돌지 않아도 된다. tail은 항상 맨 마지막 값을 가지고 있기 때문에 tail을 찾을 필요가 없이 그냥 노드만 추가하면 된다. <br />
이럴 때는 **시간이 O(1)이 든다.** 고 말을한다. 여기서 1은 상수타임이다. 1㎳가 든다는 게 아니라 그 시간이 얼마나 될진 모르지만 조금 든다는 의미이다. <br />
그래서 Add를 할 때 필요한 시간이 O(1)이다. <br />

첫번째와 두번째방법중 당연히 두번째방법이 훨씬 빠르다. <br />
그래서 두번째방법은 메모리(변수)를 더 써서 알고리즘을 획기적으로 개선 시켰다. <br />
보통은 메모리를 많이 쓰면 속도가 빨라지긴 한다. (항상 그런것은 아니지만) <br />

지금까지 Linked List를 Add했는데 이제 Remove하는 방법을 알아보자 <br />

