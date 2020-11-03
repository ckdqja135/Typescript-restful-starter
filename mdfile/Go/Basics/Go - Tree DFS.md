## 시작
이번에는 지난번에 했던 부분에 이어서 DFS에 대해 알아보도록 한다. <br />
[DFS](https://ko.wikipedia.org/wiki/%EA%B9%8A%EC%9D%B4_%EC%9A%B0%EC%84%A0_%ED%83%90%EC%83%89)는 Depth-First Search의 약자로 깊이 우선 탐색이라고 부른다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97841975-37630400-1d2a-11eb-9da4-b3b73b929c19.gif" width = 70%> </img></p>
이런 순서로 탐색을 진행한다. Root를 시작으로 깊이 우선이기 때문에 자식부터 들어간다. <br />

DFS를 만드는 방법은 두가지 방법이 있는데 <br />
> 1. 재귀 호출을 사용. <br />
> 2. 스택을 사용. <br />

먼저 재귀 호출부터 살펴보자. <br />
함수가 자기 자신을 Call한다는 의미이다. 코드로 예를 들어<br />
``` Go
func DFS(node *TreeNode) {
  ... node ...
  foreach node.child
    DFS(node.child[i])
}

```
DFS라는 함수가 있을 때 트리 노드를 받는다. 먼저 자기 노드 부터 할 일을 하고, 그 다음에 모든 자식 노드를 순회한다. Go에 foreach가 있어서 저렇게 쓰는건 아니고, 슈도코드(pseudocode)라고 해서 설명을 위해서 만든 코드라고 보면 된다. <br />
현재 노드의 child를 순회하면서 그 노드의 DFS()를 다시 Call한다. 이렇게 했을 때 아래와 같은 Tree가 있다고 가정하자. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97842930-ce7c8b80-1d2b-11eb-8272-2cbc9897ac1c.png" width = 70%> </img></p>
처음 <code>func DFS(node *TreeNode)</code>에 1이 들어가게 될 것이고, <code>... node ...</code>1을 출력한다고 쳐보자. <br /> 
그 다음 자식 노드르 돌면서 DFS()를 다시 Call하게 되면 <code> DFS(node *TreeNode)</code>를 다시 Call하는 것인데 이 때 node값은 2가 된다. <br />
그러면 <code>... node ...</code>에서 2를 출력하게 될 것이고, 그리고 <code>foreach node.child</code>로 넘어와서 2의 자식노드를 <code>DFS(node.child[i])</code>로 다시 Call하게 한다. <br />
그러면 <code>DFS(node *TreeNode)</code> 4가 들어가게 될 것이다. 그럼 4를 출력하게 되고 <code>foreach node.child</code>로 넘어와서 자식노드를 돌려할 때 자식 노드가 없으므로 <br />
아무것도 안하고 return되게 된다. return된다는 얘기는 2번 노드로 다시 돌아가게 된다는 것이다. 그 다음 2의 다른 자식노드를 탐색하는 데 없기 때문에 다시 1로 올라가서 <br />
1에서 다음 자식 노드인 3이 Call하게 된다. <br />

그렇게 해서 1 - 2 - 4 - 3 순으로 출력하게 된다. <br />

이 부분을 코딩을 해보자. 지난번에 만들었던<code>dataStruct/tree.go</code>를 수정해보자.<br />
``` Go
  package dataStruct

  type TreeNode struct {
    Val    int
    Childs []*TreeNode
  }

  type Tree struct {
    Root *TreeNode
  }

  func (t *TreeNode) AddNode(val int) {
    t.Childs = append(t.Childs, &TreeNode{Val:val})
  }

  func (t *Tree) AddNode(val int) {
    if t.Root == nil {
      t.Root = &TreeNode{Val: val}
    } else {
      t.Root.Childs = append(t.Root.Childs, &TreeNode{Val: val})
    }
  }
```

우선 TreeNode에 자식 노드를 추가하는 AddNode함수를 만들어보자. 지난번에 만들었던것은 Tree를 추가하는 메소드이고, 이번 것은 TreeNode의 메소드이다.<br />
이렇게 하면 자식노드에 노드가 추가가 될 것이다. <br />

그리고 DFS를 만들어보자. <br />

``` Go
package dataStruct

import "fmt"

type TreeNode struct {
	Val    int
	Childs []*TreeNode
}

type Tree struct {
	Root *TreeNode
}

func (t *TreeNode) AddNode(val int) {
	t.Childs = append(t.Childs, &TreeNode{Val: val})
}

func (t *Tree) AddNode(val int) {
	if t.Root == nil {
		t.Root = &TreeNode{Val: val}
	} else {
		t.Root.Childs = append(t.Root.Childs, &TreeNode{Val: val})
	}
}

func DFS1(node *TreeNode) {
	fmt.Printf("%d->", node.Val)

	for i := 0; i < len(node.Childs); i++ {
		DFS1(node.Childs[i])
	}
}

```
TreeNode 포인터를 받고, node의 Val값을 먼저 출력하고, 자식노드를 돌면서 DFS1()를 다시 Call하도록 해준다. <br />
이렇게하면 재귀 호출을 이용한 DFS가 끝이난다. 이제 이것을 <code>main.go</code>에 적용시켜 출력해보자. <br />

``` Go
package main

import (
	"./dataStruct"
)

func main() {
	tree := dataStruct.Tree{}

	val := 1
	tree.AddNode(val)
	val++

	for i := 0; i < 3; i++ {
		tree.Root.AddNode(val)
		val++
	}

	for i := 0; i < len(tree.Root.Childs); i++ {
		for j := 0; j < 2; j++ {
			tree.Root.Childs[i].AddNode(val)
			val++
		}
	}

	tree.DFS1()

}
```

우선 tree라는 변수에 Tree를 하나 만들어준다. <br />
tree에 AddNode를 해서 현재 값을 저장한다. val를 처음에 1로 두고, 값을 증가시켜준다. <br />
그 다음에 자식노드 3개를 만들어 주는데 tree의 Root(첫번째 노드)에 자식노드를 추가시켜준 뒤 val값을 증가시켜준다. <br />
이렇게 하면 처음에 node가 Root 1이 들어간 다음에 2,3,4가 들어가게 된다. <br />
그리고 각 자식 노드를 돌면서 이중 for문으로 각 자식들에게 2개씩 더 추가시켜준다. <br />

그 후 tree에 DFS1메소드가 없기 때문에 추가시켜준다. <br />
``` Go
  func (t *Tree) DFS1() {
    DFS1(t.Root)
  }
```

기존에 만들었었던 <br />
``` Go
  func DFS1(node *TreeNode) {
    fmt.Printf("%d->", node.Val)

    for i := 0; i < len(node.Childs); i++ {
      DFS1(node.Childs[i])
    }
  }
```
는 일반함수이다. <br />

지금 만드는 것은 Tree의 메소드인데 이 메소드는 단순하게 Root를 넣고 DFS1()를 호출해주는 메소드이다. <br />
이렇게 하면 Tree에 DFS1()이 추가가 되었다. <Br />
이제 실행 후에 값을 확인해보자 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97847096-64b3b000-1d32-11eb-9a60-781859ef0266.png" width = 70%> </img></p>

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97847697-5dd96d00-1d33-11eb-85cd-c0cdda3bfcc1.png" width = 70%> </img></p>
처음에 1을 Root에 넣었고, 그 다음에 1의 자식노드를 3개 추가했고 (2, 3, 4) 그리고 그 각 노드에 자식들을 더 추가를 하였다. (5,6 , 7,8, 9,10) <br />
그러면 DFS를 하면 1이 출력되고, 자식노드인 2, 그 다음 자식 노드인 5가 출력되고, 그 다음 자식노드가 없으니까 2로 올라가서 2의 다른 자식인 6이 출력되고, 이제 더 이상 자식이 없으니까 <br />
1로 올라가서 2 다음 자식인 3이 출력되고, 3의 자식인 7,8이 출력된 후 다시 1로 올라가서 다음 자식인 4가 출력되고, 4의 자식인 9,10이 출력이 되는 것을 알 수 있다. <br />

이게 바로 깊이 우선 탐색(DFS)이고, 함수가 자신의 함수를 계속 Call하는 재귀 호출로 살펴보았다. <br />

***

이제 재귀호출을 사용하지 않고 Stack을 사용하여 만드는 방법을 알아보자. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97936252-47c4be80-1dbe-11eb-8df7-c37875629266.png" width = 70%> </img></p>
이렇게 있다고 하고, 값을 아래와 같은 방향으로 넣었다 가정하면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97937152-2d401480-1dc1-11eb-8789-cce708aea73c.png" width = 70%> </img></p>
우선 맨 처음 1부터 스택에 넣는다. <br />

|  |
|------|
|  |
|  |
|1|

그 후 바로 1을 Pop해서 1을 출력시킨다. <br />
그 다음에 자식들을 전부 스택에 넣는다. 1을 POP했기 때문에 1이 사라지게 되고, <br />

|  |
|------|
|4|
|3|
|2|

이렇게 넣은 뒤, 4를 Pop한다. 4를 Pop한 뒤 4의 자식들을 넣는데, 4의 자식들이 없기 때문에 3을 Pop한다. 그러면 지금까지 1-4-3이 출력되고, 3의 자식들을 전부 스택에 넣는다. <br />

|  |
|------|
|8|
|7|
|2|

이렇게 들어가게 되고, 8,7을 Pop하고 그 다음 2를 Pop한 뒤 2의 자식들을 스택에 전부 넣는다. <br />
그러면 지금까지 1-4-3-8-7-2가 출력되게 된다. <br />

|  |
|------|
|  |
|6|
|5|

그 후 이렇게 스택에 저장되어 6,5가 Pop되어 최종적으로 1-4-3-8-7-2-6-5이 출력되게 된다. <br />

이것이 스택의 방식이고, 스택을 이용해서 만드는 방법은 
> 1. 현재 스택에 있는 걸 하나 Pop한다. 맨 처음에 Root를 넣고, 현재 스택에 있는 것을 Pop한다. <br />
> 2. 그것에 대한 연산을 한 뒤, 그 자식들을 전부 스택에 넣는다. <br />
> 3. 그리고 다시 돌아가서 Pop하고, Pop한 자식을 스택에 넣는다. <br />

이것의 반복이 된다. <br />

그래서 슈도코드를 짜보면 <br />
``` Go
	DFS {
		Stack
		Stack. push(root)
		
		for !Stack.empty() {
			n = Stack.pop()
				foreach.n.childs
					stack.push
		}
	}
```

스택이 있고, 스택에다 root를 집어 넣는다.(push)<br />
그리고 스택이 더 이상 없을 때 까지 for문을 도는데 스택이 뭔가 있으면 스택에서 첫번째 노드를 Pop한다. <br />
그러면 첫번째 노드가 나올텐데, 그것에 대한 연산을 하고, 그것의 자식들을 스택에 Push한다. <br />

이런식으로 돌아가는게 스택의 DFS이다. <br />

이제 코딩을 시작하자! <br />

전 시간에 만들었던 Stack은 여기에서 쓸 수 가 없다. 기존 linkedList.go에서 노드의 Value값을 int만 가질 수 있게 했었다. <br />

``` Go
	type Node struct {
		Next *Node
		Prev *Node
		Val  int
	}
```

지금은 스택에 int값을 넣는게 아니라 node의 포인터형을 넣어야 하기 때문에 <br />

``` Go
	type Node struct {
		Next *Node
		Prev *Node
		Val  *TreeNode
	}
```

이렇게 바꾸어야 하는데 이렇게 바꾸면 다른 곳도 바꿔야 할 부분들이 많아진다. <br />
물론 방법은 있다. <br />

``` Go
	type Node struct {
		Next *Node
		Prev *Node
		Val  interface{}
	}
```
특정 타입의 값을 받는게 아니라 모든 타입의 값을 받을 수 있도록 interface를 이용하면 할 수 있지만 지금 저것을 사용할 때는 아니기 때문에 그냥 int로 놔두고 <br />
