## 시작
이번에 할 것은 Tree 순회 중에 너비 우선 탐색(BFS, Breadth-First Search)인데 옆에 부터 탐색한다는 것이다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97946919-0ab4f800-1dcf-11eb-9b74-3730b24da6d6.png" width = 70%> </img></p>
이렇0게 구성되있을 때 탐색 순서는 <br />
> 1. 우선 Root인 1번부터 탐색하고, 2번으로 가서 너비로 가기 때문에 3번을 탐색한다. <br />
> 2. 3번 간 뒤에 옆이 없기 때문에 4, 5, 6, 7번을 탐색하게 된다. <br />

BFS는 큐로 이용해서 만들 수 있다. <br />
큐로 이용한 BFS 순서는 아래와 같다. 마찬가지로 아까 했었던 Tree로 구성되어 있을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97946919-0ab4f800-1dcf-11eb-9b74-3730b24da6d6.png" width = 70%> </img></p>

> 1. Root부터 큐에 넣는다. 그러면 1번이 들어가게 되고 <br />

|1| | |
|------|---|---|

> 2. 바로 1번을 Pop한 뒤에 1번의 자식들을 모두 큐에 집어 넣는다. <br />
> 출력값 : 1-<br />

|2|3 | |
|------|---|---|

> 3. 그 후 2번을 꺼내고, 2번의 자식들을 3번 뒤에 넣는다. <br />
> 출력값 : 1-2 <br />

|3|4|5|6|
|------|---|---|---|

> 4. 그 후 3번이 나온 다음에 3번의 자식을 집어 넣는다. <br />
> 출력값 : 1-2-3 <br />

|4|5|6|7|
|------|---|---|---|

> 5. 그 후 4, 5, 6, 7 순서대로 꺼낸다. <br />
> 출력값 : 1-2-3-4-5-6-7<br />

이렇게 하는게 BFS 이다. <br />

이제 코드로 만들어보자. <br />

<code>dataStruct/tree.go</code>
``` Go
func (t *Tree) BFS() {
	queue := []*TreeNode{}
	queue = append(queue, t.Root)

	for len(queue) > 0 {
		var first *TreeNode
		first, queue = queue[0], queue[1:]

		fmt.Printf("%d->", first.Val)

		for i := 0; i < len(first.Childs); i++ {
			queue = append(queue, first.Childs[i])
		}
	}
}
```
Tree노드 포인터를 값으로 갖는 슬라이스를 만들어준다. 이름은 queue로 한다. <br />
queue의 맨 뒤로 값을 집어 넣어준다. <br />
지난번에 했던 것 처럼 queue가 비어 있을 때 까지 돌려준다. <br />
TreeNode의 포인터 형인 first를 선언 해준 뒤 first는 queue의 맨 처음이니까 <code>queue[0]</code> 값을 넣어주고, <code>queue[1:]</code>를 사용하여 첫번째를 빼낸 나머지 그러니까 2번째꺼부터 나머지 부분을 새로 queue에 집어 넣어준다. <br />
이렇게 하면 첫번째 값은 꺼내고, 첫번째 값을 제외한 나머지 값은 다시 큐에 집어 넣게 된다. <Br />

그 후 first에 대한 연산을 해준다. 지금은 값을 출력하도록 해준다. <br />
그 다음 꺼낸 애의 자식들을 다시 큐에 집어 넣어 준다. <br />

이렇게 하면 BFS도 끝이났다. <br />

마찬가지로 main()에 넣어준다. <br />
``` Go 

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
	fmt.Println()

	tree.DFS2()
	fmt.Println()

	tree.BFS()
}
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97947981-62089780-1dd2-11eb-89d6-67fec9fe9f2e.png" width = 70%> </img></p>

정상적으로 출력이 된 것을 알 수 있다. <br />

그러면 DFS와 BFS는 어디에 쓸까? 가장 쉽게 예를 들면 게임에서 DFS는 길을 찾을 때 사용한다. <br />
Dijkstra알고리즘이 최단거리를 찾는 알고리즘인데 그래프의 한 종류가 트리인데 노드와 노드 사이를 edge로 연결하는게 그래프인데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/97953545-31315e00-1de4-11eb-8f83-f11f72fea84b.png" width = 70%> </img></p>
위와 같은 그래프가 있을 때 가장 빠른 길이 무엇인지를 찾는 알고리즘에서 쓰인다. <br />
