## 시작
말 그대로 나무라는 의미인데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97838652-fe279580-1d23-11eb-84d0-fa1f599867a8.png" width = 70%> </img></p>

위 그림처럼 줄기가 있고, 가지가 뻗어 있고, 가지 끝에 나뭇잎이 달려있는 형태를 가지고 있는 자료구조 라고 해서 Tree라고 한다. <br />
하나에서 시작해서 여러 갈래로 나뉘어 가는 형태가 Tree이다. Tree의 형태를 보면 <br />
나무를 뒤집어 놓은 형태인데 아래와 같다.<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97839261-249a0080-1d25-11eb-933c-9ffcbac66e40.png" width = 70%> </img></p>

맨 위에서부터 시작하는데 맨 처음 시작하는 노드를 **Root** <br />
노드(node)들과 노드들을 연결하는 하는 부분을 **간선(edge)** <br />
각 간선 끝에는 노드가 연결 되어 있는데 이 노드를 ** 자식노드(Child Node) ** <br />
자식노드 상위에 있는 노드를 ** Parent Node ** 라고 한다. 이건 상대적인 개념인데 Root 노드는 모든 노드의 항상 부모가 되고 <br />
자식노드도 자식노드를 가질 수 있다. 이렇게 계속 각 노드는 간선을 가질 수 있고, 갯수는 제한이 없다. 한 개 가질 수 도 있고, 한 개도 가지지 않을 수도 있고, 100개를 가질 수도 있고 만개를 가질 수 도 있다. <br/ >
그런데 자식이 없는 노드(맨 말단에 있는 노드)들을 잎(leaf)이라고 한다. 그래서 leaf node라고 부른다. <br />
그리고 같은 층에 있는 노드들을 Sibling, 형제노드라고 부른다. <br />
이렇게 구성되어 있는것이 Tree구조이다. <br />

이거를 컴퓨터에서 어떨 때 쓰냐면 가장 대표적인게 'File'이다. 'directory'구조(또는 폴더 구조)에서 많이 쓰인다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97839833-4f388900-1d26-11eb-8214-f649f2bc96a7.png" width = 70%> </img></p>

이제 Tree를 실제로 만들어보자. 어떻게 만들면 좋을까? <br />
Tree의 기본 단위는 노드이다. 노드는 어떤 값을 가질 수도 있다. 또 노드는 노드안에 자식을 가질 수 있다. <br />
그래서 노드 구조를 봐야하는데 <br />
``` Go
type Node struct {
  Val int
  childs []*Node
}
Val값은 아무거나 될 수 있다. int형이 될 수 있고, String이 될 수 있는데 Node가 표현 하는 값이 있고 자식노드들이 있다. <br />
이 자식들은 여러개가 올 수 있기 때문에 Slice로 받을 것이고, 자식노드의 포인터를 가지고 있는다. <br />
이런식으로 노드가 구성되어 있다. <br />

실제로 만들어보자. <br />
dataStruct폴더에 tree.go라는 파일을 추가해보자 <br />
``` Go
package dataStruct

type TreeNode struct {
	Val int
	childs []*TreeNode
}

type Tree struct {
	Root *TreeNode
}
```
아까 말했던 TreeNode와 Root만 가지고 있는 Tree struct를 만들어준다. <Br />
시작점만 알고 있으면 모든 Tree를 구성할 수 있기 때문이다. <br />

그리고 Root add를 시켜보자. <br />
``` Go
func (t *Tree) AddNode(val int) {
	if t.Root == nil {
		t.Root = &TreeNode{Val:val}
	} else {
		t.Root.childs = append(t.Root.childs, &TreeNode{Val: val})
	}
}
```
Root가 없으면 Root부터 만들어주어야 하기 때문에 Root는 TreeNode를 만들어주고, val값을 초기값으로 초기화 시켜주고 <br />
Root가 존재하면 append로 childs에 새로운 노드를 추가시켜준다. <br />

여기까지 TreeNode를 만들었고, TreeNode는 child 노드를 가지고 있고, Tree는 Root 노드를 가지고 있는 형태가 된다. <br />

Tree는 여기까지하고, 다음에는 이 Tree를 순회하는 방법에 대해 알아보도록 한다. <br />
순회하는 방법은 DFS가 있고, BFS가 있는데 깊이 우선 검색과 너비 우선 검색으로 알면 된다. <br />
