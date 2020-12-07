<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101354665-d904e480-38d8-11eb-9f7d-ab07a5bcaa28.png" width = 70%> </img></p>
위의 그림 같이 자식이 두 개 밖에 없는 것을 이진트리라고 한다. <br />

기존의 트리는 

``` Go
Type TreeNode struct {
  childs []*TreeNode
}
```
형태로 슬라이스 형태로 가졌는데 이진트리는 자식이 두 개 밖에 없기 때문에 슬라이스 형태로 가질 필요가 없다. <br />

``` Go
Type TreeNode Struct {
  left *TreeNode
  right *TreeNode
}
```

이 부분을 코딩해보자. <br />

``` Go 
package dataStruct

type BinaryTreeNode struct {
	Val   int
	left  *BinaryTreeNode
	right *BinaryTreeNode
}
```

이 부분을 먼저 짚고 가는 이유는 다음에 설명할 BST(Binary Search Tree) 때문이다. <br />
BST는 이진 검색 트리가 Binary Tree로 되어 있기 때문이다. <br />


1~10까지 숫자가 있고, 5가 root라 가정할 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101357199-79103d00-38dc-11eb-9454-0d5b322f1bbf.png" width = 70%> </img></p>
left쪽은 root보다 작은 수, right쪽은 root보다 큰 수가 정렬 되어 있다. 이 규칙은 root에만 적용 되는게 아니라 모든 Node에 적용된다.
보면 2를 보면 2의 왼쪽값은 2보다 작은 수, 오른쪽은 2보다 큰 수가 있으며 8 또한 마찬가지이다. <br />

``` Text
left <= Parent <= right
```
이런 규칙을 띄는 것을 알 수 있다. <br />
이런 것을 **이진 검색 트리** 라고 할 수 있다. <br />

이게 중요한 이유는 어떤 트리에서 어떤 값을 찾는다고 가정 했을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101357672-1c615200-38dd-11eb-9798-9eeb0aaecee3.png" width = 70%> </img></p>
가령 위의 트리로 6이라는 값이 존재하는지 알아 볼 때 모든 트리를 다 검색하는 DFS나 BFS방법을 사용한 순회를 해야한다. <br />

근데 BTS를 만들었다 가정했을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101357199-79103d00-38dc-11eb-9454-0d5b322f1bbf.png" width = 70%> </img></p>
위 트리 안에 6이 있는지 찾으려 한다면 모든 노드를 다 가볼 필요가 없다.

> 1. 먼저 현재 노드인 5와 비교를 먼저 한다. 6은 root 노드인 5보다 크므로 6이라는 값이 있다면 오른쪽에 있을 것이며 왼쪽에 있는 트리는 볼 필요가 없다. <br />
> 2. 그 다음이 8인데 8은 6보다 작으므로 만약에 6이 존재한다면 왼쪽에 있을 것이므로 오른쪽 부분은 검사 대상에 제외 된다. <br />
> 3. 그 후 7이 나오는데 7은 6보다 작으므로 또 왼쪽으로 가게 되어 6을 찾게 된다. <br />

그래서 이진검색트리는 어떤 값을 찾을 때 반절씩 버리며 가기 때문에 훨씬 빠르게 탐색 할 수 있다. <br />

이제 속도를 살펴보자. <br />
일반적인 트리를 보았을 때 어떤 값이 있는지 찾으려면 모든 노드를 돌아보아야 한다고 했는데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101357672-1c615200-38dd-11eb-9798-9eeb0aaecee3.png" width = 70%> </img></p>
여기서 6을 찾으려면 모든걸 다 거쳐 가봐야 한다. 물론 운이 좋게 중간에 발견할 수 도 있겠지만 최악의 경우로 6이 아래와 같이 트리 안에 없다고 가정해보자. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101358595-6991f380-38de-11eb-94ca-5755fbc5878a.png" width = 70%> </img></p>
이 트리 안에 없다 쳐도 없는지 확인하려면 모든 노드들을 다 거쳐서 진짜 없는지 확인해야 한다. <br />
그렇다 했을 때 노드의 개수가 7개 이므로 반복문을 7번 돌아야 한다. <br />
항목의 개수만큼 반복문이 돌아야 하기 때문에 이 때는 O(N)의 속도를 갖게 된다. <br />

그런데 **이진 검색 트리**를 살펴보자. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101358967-f341c100-38de-11eb-8480-094ef85c150a.png" width = 70%> </img></p>
위의 트리에서 6을 찾는다 했을 때 3번 만에 6을 찾을 수 있다. <br />
위의 노드의 개수가 7개인데 3번만에 찾았기 때문에 O(N)은 아니다. <br />
그러면 6이 없을 때는 어떨까? <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101359127-300db800-38df-11eb-870f-81e499b53286.png" width = 70%> </img></p>
5보다 크므로 오른쪽에 가고, 8보다 작으므로 왼쪽으로 가고, 7보다 작으므로 다음 노드로 갈 때 다음 노드가 없으므로 6이 없는 것을 알 수 있다. 이 때도 마찬가지로 3번에 알아낸다. <br />
그래서 이 떄는 O(log2^N)이 된다.
