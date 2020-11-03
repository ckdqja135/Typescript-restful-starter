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
