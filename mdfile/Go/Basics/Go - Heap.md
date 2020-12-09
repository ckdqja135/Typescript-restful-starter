## 들어가기전에...

지난 번에 아래와 같은 Tree를 그렸는데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101614147-ee504f00-3a4f-11eb-89ed-2ab2bb740d0d.png" width = 70%> </img></p>
맨위의 root 값이 왜 5인지 궁금해 할 것이다. 왜 가운데 값이 root에 들어갈까? <br />
생각해보면 1~10까지를 갖는 Tree가 있는데 아래와 같은 형태로 그려진다 했을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101614607-80585780-3a50-11eb-8367-58752110d034.png" width = 70%> </img></p>
위와 같이 오른쪽으로만 이어진 Tree도 BST가 맞다. 자기 값보다 큰 값이 오른쪽이 들어가 있기 때문이다. <br />
그래서 1~10까지 Node를 집어 넣을 때 순서대로 집어 넣는다 할 때 위와 같이 한 줄로 나오게 된다. <br />
반대로 10~1까지 거꾸로 집어넣으면 왼쪽으로만 값이 들어가질 것이다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101615019-ff4d9000-3a50-11eb-84a4-ad11a725d680.png" width = 70%> </img></p>
당연히 위의 형태도 BST가 맞다. 하지만 BST의 장점이 어떤 값을 찾을 때 반절을 버리고 찾는다는 것에 있는데 <br />
위의 형태에서 6을 찾는다 하면 버릴 Node들이 없어서 모든 Node들을 탐색하기 때문에 BST로서 갖는 이득이 없게 된다. <br />
위의 형태로 찾을 때 O(N)의 속도를 갖게된다. 그러므로 위와 같은 형태의 Tree도 BST이지만 잘못된, 비효율적인 BST가 된다. <br />

이거를 효율적인 Tree로 바꾸려면 아래와 같이 가운데 값이 위에 올라가는 형태로 가야한다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101614147-ee504f00-3a4f-11eb-89ed-2ab2bb740d0d.png" width = 70%> </img></p>
아까 비효율적인 Tree와 차이가 있다면 높이가 있다는 점이다. BST에서는 높이(Depth)가 가장 적은 높이로 형성 되는 Tree가 가장 이상적인 Tree이다. <br />
그래서 이것을 **최소 신장 트리** 라고 한다. 말 그대로 가장 작은 키(Depth)를 갖는 Tree라는 걸 의미하며 가장 효율적인 Tree라고 볼 수 있다. <br />

그렇다면 이 최소 신장 트리는 어떻게 만들 수 있을까? <br />
여러가지 방법이 있는데 그 중에 **AVL 트리** 라고 있는데 Tree를 회전 시킨다고 생각하면 된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101616433-b3034f80-3a52-11eb-8cca-d641b9ae69ce.png" width = 70%> </img></p>
위와 같은 Tree가 있을 때 화살표 방향으로 회전 하게 되면 2가 올라가고 3이 내려가게 되어 아래와 같이 바뀌는데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101616569-da5a1c80-3a52-11eb-8770-c9bf19d8ae90.png" width = 70%> </img></p>
최소 신장 트리의 형태로 바뀌게 된다. 위와 같이 AVL 트리 알고리즘을 사용하면 최소 신장 트리를 만들 수 있다.<br />

그 외에도 **Black Red 트리**도 있다.

## 시작
오늘 해볼 부분은 **Heap**이다. Heap에는 크게 최대Heap과 최소Heap이 있다. <br />
차이라면 최대를 따지냐, 최소를 따지냐는 차이만 있을 뿐, 크게 차이는 없다. <br />

최대Heap은 부모Node는 자식Node보다 항상 크거나 같아야 한다는 것이고, 최소Heap은 자식Node는 부모Node보다 항상 작거나 같아야 한다는 것을 의미한다. <br />
같은 층에 있는 Node끼리는 대소관계는 없지만 부모, 자식간에는 크고 작음이 있어야 한다. <br />

Heap을 사용하면 최대 값과 최소 값을 찾기 좋다. <br />
부모Node가 자식Node보다 크거나 같아야 하기 때문에 맨위에 있는 Node가 가장 큰 값이 되고, 자식Node는 부모Node보다 작거나 같아야 하기 때문에 가장 아래에 있는 Node가 최소값이 된다. <br />

두번째로는 **Priority Queue**라고 해서 **우선순위 큐** 라고 하는데 이것을 Heap으로 만들 수 있다. <br />
우선순위 큐는 우선순위대로 먼저 나온다는 것을 의미한다. 큐는 들어간 순서대로 나오는 것을 의미하는데 우선순위가 높은 것이 먼저 나오게 된다. <br />

예를 들어 응급실이 있고, 응급실의 대기열을 만든다고 가정할 때 응급실의 응급의 정도가 있을 것이다. 어떤 사람은 빨리 치료해야하는 사람이 있을 수 있고, 어떤 사람은 기다려도 상관없는 사람이 있을 수 있을 것이다. <br />
그렇게 될 때 응급함의 값이 있을 때 그 값이 높은 것 부터 나오게 하고 싶을 때 쓰는게 Priority Queue이다. <br />

예를 들어 아래와 같은 Tree가 있을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101617883-910acc80-3a54-11eb-9fa3-14c768ab4dc9.png" width = 70%> </img></p>
맨 위에 있는 값이 가장 급한 값이 된다. Heap은 그렇게 유지 되도록 만든 Tree이다. <br />
그래서 항상 맨위가 가장 크고, 맨 아래가 가장 작다. <br />

그렇다면 이 Heap을 어떻게 만드는지 살펴보자. <br />
규칙은 위에 말했듯이 부모Node가 자식Node보다 크거나 같고, 자식Node는 부모Node보다 작거나 같다. <br />

먼저 Heap Tree에 element추가(Push) 할 때 어떻게 하는지 알아보자. <br />
가령 Heap이 아래와 같이 구성되어 있을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101618278-2017e480-3a55-11eb-9a82-761bc4915014.png" width = 70%> </img></p>
여기서 새로 들어온 값이 생기면 맨 아래에 넣고, 새로 들어온 값이 부모Node보다 큰지 값을 비교를 한다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101618479-5fdecc00-3a55-11eb-9616-40f7d80a1353.png" width = 70%> </img></p>
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101618577-8a308980-3a55-11eb-9b48-878a92f13844.png" width = 70%> </img></p>

크다면 서로 위치를 바꾸어(Swap)준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101618712-b1875680-3a55-11eb-8796-e2eedba27949.png" width = 70%> </img></p>
그리고 또 다시 부모Node와 값을 비교해서 값이 크다면 위치를 바꾸어준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101618929-eeebe400-3a55-11eb-8093-18b6ea0ccd0b.png" width = 70%> </img></p>
그래서 이것을 더 이상 못바꾸거나, 바꿀 부모Node가 없을 때 까지 반복한다. <br />

그렇다면 항목 삭제는 어떻게 할까? <br />
항목 삭제는 **POP** 이라고 하는데 맨 위부터 빠진다. <br />
최대 Heap은 가장 큰 값을 찾고, 최소Heap은 가장 작은 값을 찾기 때문에 큰 값부터 나오게 되는 것이다. <br />
아래와 같은 Tree가 있다고 가정하면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101619300-6e79b300-3a56-11eb-9114-191623cc57a5.png" width = 70%> </img></p>
먼저 10이 빠져 나오게 된다. <br />
그렇게 되면 빈자리가 생기고, 빈자리를 채워야 하는데 맨 끝에 있는 값을 맨 위로 올린다.<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101619402-92d58f80-3a56-11eb-8326-72f48a98198f.png" width = 70%> </img></p>
그 다음 맨 끝 부분이 없어지게 되고, 맨 위에 있는 값 기준으로 자기보다 큰 값이 존재하면 위치를 바꾼다. <br />
그래서 오른쪽에 있는 7과 8을 바꾼다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101619587-d3cda400-3a56-11eb-8223-63a4e47de0e8.png" width = 70%> </img></p>
그 후 또 비교를 하여 자식Node 중에 자기보다 큰 값이 있는지 비교한다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101620015-5ce4db00-3a57-11eb-82aa-fc146d7b6753.png" width = 70%> </img></p>
맨 위에 값과 비교할 값이 없으면 빠진 쪽이 오른쪽이므로 오른쪽 부모(root)Node와 자식Node를 비교하여 큰 값이 있는지 비교한다. 있으면 Swap을 해주고, 없으면 끝이 난다.<br />
이런식으로 계속 POP을 진행하여 수를 빼내오면 큰 값부터 작은 값 순서대로 Sorting이 되게 된다. <br />

그래서 Heap을 이용하면 정렬을 만들 수 있다. <br />

그 다음 Heap의 속도를 알아보자. <br />
Heap의 속도를 볼 때 Push하는 게 있고, POP하는 게 있는데 Push부터 알아보자면 <br />
Push할 때는 맨 아래로 집어 넣고, 부모와 비교하여 Swap하는데 새로 들어온 값이 Swap해야 되는 반복횟수는 그 값의 층수에 비례된다. <br />
예를 들어 아래와 같은 Tree가 있다고 가정하고 9가 새로 들어온 값일 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101614147-ee504f00-3a4f-11eb-89ed-2ab2bb740d0d.png" width = 70%> </img></p>
9는 2번만 Swap하면 된다. 그러니까 층수 - 1번 반복이 된다. <br />

Heap을 이용하면 자동으로 최소신장트리가 만들어지는데 위의 Tree가 최소신장트리라고 했을 때 **층수 - 1번**의 층수는 전체 항목에서 2로 나눈 값이다. <br />
그러니까 지금 총 Node의 개수가 7개이고 2로 나누면 3, 3을 2로 나누면 1이니까 반절씩 없어진다고 볼 수 있는데 이 때 속도는 log2^N이 된다. <br />
그래서 Heap에서의 Push의 속도는 O(log2^N)이 되고, <br />

POP을 보게 되면 맨위에 있는 걸 빼고 맨 아래 있는 것이 올라가면서 그 값이 내려가면서 비교하며 가기 때문에 위와 같이 층수 만큼 반복하기 때문에 O(log2^N)이 된다. <br/ >

이제 Heap정렬의 속도를 보자. 10개의 항목이 무작위로 있다고 가정할 때 <br />
|10|20|2|8|0|7|
|------|---|---|---|---|---|
