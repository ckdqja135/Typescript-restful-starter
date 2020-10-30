## 시작
Double Linked List를 만들기 전에 지난시간에 했었던 코드를 정리해보자 <br />
AddNode와 RemoveNode를 따로 했었는데 이거를 하나의 struct를 정의해서 그 struct안에 몰아넣도록 해준다. <br />
현대 프로그래밍 언어에서는 결합성을 올리고 의존성을 내리는데 관련되어 있는 것들은 하나로 묶어서 하나의 모듈로 만들고, 관련 없는 것들 끼리는 서로 의존관계가 생기지 않도록 의존성을 끊는다는 의미이다. <br />

그래서 AddNode와 RemoveNode는 서로 관련이 있기 때문에 하나의 struct로 묶겠다는 것이다. <br />

``` Go
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
    l.tail = l.tail.next
  }
```

이런식으로 struct를 만들어주고 이 struct가 가지고 있는 메소드는 AddNode()와 RemoveNode()를 갖게 될 것이다. <br />
그래서 그것을 복사해서 AddNode()를 다시 만들어준다. 이 함수는 그냥 함수가 아니라 Linked List를 가지고 있는 메소드이고, tail은 가지고 있기 때문에 받을 필요 없고, Add했을 때 반환값은 필요 없기 때문에 다음과 같이 작성한다. <br />

1 : 맨 처음 LinedList를 만들 당시에는 root와 tail이 nil인 상태일 것이다. 그래서 없는 상태면 root는 노드를 하나 만들어서 새로 만든 노드의 주소를 포인터 형태로 가지고 있고
    tail은 root하고 똑같기 때문에(노드가 1개기 때문에) root값을 넣어주고 반환시켜준다. <br />
    
2 : 만약에 root가 nil이 아닐 경우 그럴 때는 tail 뒤에 새로운 노드를 만들어서 붙여주면 된다. <br />
3 : tail이 추가 되어 tail이 변경 되었기 때문에 tail을 갱신해주어야 한다. <br />

Add를 했으니 Remove를 만들어보자 <br />

``` Go
  func (l *LinkedList) RemoveNode(node *Node) {
    if node == l.root { // 1
      l.root = l.root.next
      node.next = nil
      return
    }

    prev := l.root // 2
    for prev.next != node {
      prev = prev.next
    }

    if node == l.tail { 
      prev.next = nil
      l.tail = prev
    } else {
      prev.next = prev.next.next
    }
    node.next = nil // 3
  }
```

RemoveNode는 Remove할 Node만 입력받으면 되고, 갱신 정보도 반환할 필요가 없기 때문에 위와 같이 수정해준다. <br />

1 : 노드가 l의 root와 같을 때, 맨 앞에 있는 노드를 지우려 할 때 root를 다음 노드로 바꾸어준다. <br />
    현재 노드의 연결만 끊어준다. <br />

2 : 노드가 tail과 같다면 맨 뒤에 것을 끊어주어야 하는데 지난 시간에 했던 코드를 가져온다. <br />

3 : 노드가 지워졌기 때문에 node의 next는 nil로 바꾸어준다. <br />

그 다음 PrintNode도 만들어주자! <br />

``` Go
  func (l *LinkedList) PrintNodes() {
    node := l.root
    for node.next != nil {
      fmt.Printf("%d -> ", node.val)
      node = node.next
    }
    fmt.Printf("%d\n", node.val)
  }
```

root는 이미 갖고 있기 때문에 다음과 같이 수정해준다. <br />

이렇게 바꾸면 새로운 struct를 만들었고, 이 struct가 root와 tail을 맴버 변수로 가지고 있다. <br />
그리고 이 LinkedList struct안에 포함된 메소드를 3개를 추가했다. <br />

이것을 사용하는 방법은 간단하다. <br />

``` Go
  func main() {
    list := &LinkedList{}
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
  }
```
지난번에는 tail과 root를 전역변수 형태로 가지고 있어야 했는데 이제 그럴 필요없이 list를 하나 만들고 LinkedList struct 주소 값을 넣어준다. 그렇게 되면 그 안에 root와 tail이 포함되어 있기 때문에 따로 만들 필요가 없다. <br />

그 다음에 list의 AddNode를 해서 0을 추가 해주고, 전에 했던 것처럼 1 ~ 10까지 노드를 추가해준다. <br />
그리고 list의 PrintNodes로 출력시켜주고, 지난 번에 했던 코드들을 LinkedList struct에 맞추어 수정해준다. <br />
그 다음 기존의 함수들은 필요 없기 때문에 지워주고, 실행시켜주자 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97671183-19e42f00-1acb-11eb-9596-cbb735f014be.png" width = 70%> </img></p>
0부터 9까지 추가를 했고, 첫번째 root의 next를 지워서 1을 없앴고, root를 없애서 0을 없어지고, tail을 없애서 9가 없어져서 2 ~ 8까지 남아있는 것을 볼 수 있다. <br />

지금까지 지난번 코드들을 정리했었고, struct로 묶어서 지난번의 코드보다 훨씬 깔끔해진 것을 알 수 있다. <br />

***

이제 Double Linked List를 만들어 볼 것인데 Double Linked List는 지난번에 말했듯이 전에 값인 prev를 기억하고 있다고 했었다. 그래서 LinkedList struct를 수정해준다. <br />

``` Go
  type LinkedList struct {
    root *Node
    prev *Node
    tail *Node
  }
```

그 뒤 AddNode할 때 prev를 지정해주어야 한다. <br />

``` Go
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
```

prev가 기존 tail을 저장하고 있고, 새로운 tail의 prev를 기존 tail로 바꾸어준다. <br />

Remove할 때도 연결을 끊어주기 위해 prev의 정보도 날려주어야 한다. <br />

``` Go
  func (l *LinkedList) RemoveNode(node *Node) {
    if node == l.root {
      l.root = l.root.next
      l.root.prev = nil // 1
      node.next = nil
      return
    }

    prev := node.prev // 3

    if node == l.tail {
      prev.next = nil
      l.tail.prev = nil // 2
      l.tail = prev
    } else {
      node.prev = nil
      prev.next = prev.next.next
      prev.next.prev = prev // 4
    }
    node.next = nil
  }
```

1 : root를 갱신 했기 때문에 root의 prev를 날려준다. <br />
2 : tail과 같으면 tail의 prev로 갱신해주는데 갱신해주기 전에 tail의 prev도 날려준다. <br />
3 : 기존과 다르게 현재 지우고자 하는 노드의 prev로 가면 되기 때문에 루트부터 시작해서 지울 값을 찾을 필요가 없어졌다. <br />
4 : 건너 뛸 때 지워주는 노드의 prev를 없애주고 건너 뛴 다음에 새로운 next의 prev를 현재 prev로 바꾸어준다. <br />

이렇게 한 뒤에 실행해보자 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97672874-274ee880-1ace-11eb-9282-e43e953246c6.png" width = 70%> </img></p>
결과가 똑같은 걸 알 수 있다. <br />

그리고 tail을 알고 있기 때문에 끝에서 처음으로 출력하는 것도 가능하다. prev node가 없었을 때는 역으로 출력이 안됐지만 prev node가 있기 때문에 역으로 출력이 가능하다. <br />
만들어보자! <br />

``` Go
  func (l *LinkedList) PrintReverse() {
    node := l.tail
    for node.prev != nil {
      fmt.Printf("%d -> ", node.val)
      node = node.prev
    }
    fmt.Printf("%d\n", node.val)
  }
```
PrintNodes()랑 똑같은데 차이가 있다면 PrintNodes()는 node.next로 전진했다면, PrintReverse()에서는 node.prev로 전진한다는 차이가 있다. <br />
main()에 PrintReverse()를 추가한 뒤 실행하여 확인해보자 <br />

``` Go 
  func main() {
    list := &LinkedList{}
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
  }
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97673801-b9a3bc00-1acf-11eb-97f8-f99aeeb06b46.png" width = 70%> </img></p>

거꾸로 출력되는 것을 알 수 있다. 이것이 **Double Linked List**이다. <br />
