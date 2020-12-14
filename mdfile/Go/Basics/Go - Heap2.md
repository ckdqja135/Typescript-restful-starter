## 시작
지난 시간에 최대 값과 최소 값을 빠르게 가져오기 위해 Heap을 사용한다고 했었고, Heap의 추가 방법, 삭제 방법에 대해 알아보았다. <br />
이 Heap을 Tree로 만들려고 하면 상당히 어렵다 부모와 자식간 Linked list로 연결되어 있기 때문에 각각 층간에 연결되어야 하기 때문에 보통 Heap의 같은 경우 Array를 많이 사용한다. <br />
Go에서는 Slice라고 한다. <br />

보통 맨 앞을 Root Node로 두는데 아래와 같이 Heap이 구성되어 있다고 가정할 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102062167-b5d9b800-3e37-11eb-8677-8aa5f6e04c77.png" width = 70%> </img></p>
이걸 배열로 표시를 하면 맨 앞이 Root니까 9인데 BFS하듯이 돈다고 생각 하면 된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102062422-0e10ba00-3e38-11eb-8af1-1e8efe278b6d.png" width = 70%> </img></p>
그래서 아래와 같은 배열이 구성된다. <br />

|9|7|8|3|4|6|7||
|------|---|---|---|---|---|---|
