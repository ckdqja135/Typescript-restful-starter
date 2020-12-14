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
|------|---|---|---|---|---|---|---|

그리고 그 다음에 추가되는 값은 빈 공간에 추가되고, 뺄 때는 맨 앞에서 빠지고, 맨 뒤에 있는 값이 맨 앞으로 오게 된다. <br />
그래서 이와 같이 배열로 하게 되면 Tree와 다르게 맨 뒤의 값을 쉽게 알 수 있게 된다. <br />

|9|7|8|3|4|6|7||
|------|---|---|---|---|---|---|---|

그러면 9는 Root Node인데 9가 가지고 있는 자식 Node는 7, 8이 되고 <br />
7의 자식 Node는 3, 4이 되고, 8의 자식 Node는 6, 7이 된다. <br />

그리고 이 배열의 Index를 보게 되면 <br />

|9|7|8|3|4|6|7||
|------|---|---|---|---|---|---|---|
|0|1|2|3|4|5|6||

이렇게 된다. <br />

그러면 N번째 Left Node의 자식은 어떻게 되냐면 2N + 1이 된다. <br />

9를 보면 9의 Index는 0이고, 0의 Left 자식 Node는 1이다. 2 * 0(N) + 1을 하면 1이 된다. <br />
7의 Left 자식 Node를 살펴보자 7은 Index가 1이고, 2N + 1 을 하게 되면 3이 된다. <br />
8을 보면 8의 Index는 2이고, 2 * 2 + 1을 하게되면 5가 된다. <br />

그러면 Right 자식 Node는 어떻게 될까? 2N + 2가 된다. <br />
그래서 현재 나의 Index가 몇번인지 알면 나의 Left, Right 자식의 Node를 가져올 수 있다. <br />

그리고 N번째 Node의 부모는 N - 1 / 2 이다. <br />
3의 부모는 7인데 3은 Index가 3이고, 2을 2로 나누면 1이 되어 7이 부모라는 것을 알 수 있고 <br />
4의 부모도 알아보기 위해 4의 Index값인 4 - 1 / 2를 해줘서 1.5가 되는데 소수점을 버리고 1의 Index를 가진 7이 부모 Node임을 알 수 있다. <br />
6은 5 - 1 / 2가 되기 때문에 2가 되어 8이 부모 Node가 되는 것을 알 수 있고, 7의 경우 6 - 1 / 2가 되기 때문에 2.5가 되고, 소수점 날려 2가 되어 8이 부모라는 것을 알 수 있다. <br />

그래서 Tree를 표현할 때 배열을 사용하게 되면 내가 알고자 하는 Node의 Index만 알게 되면 Left 자식 Node와 Right 자식 Node, 부모의 Node를 알 수 있게 된다. <br />
이 부분을 코드로 구현해보자! <br />

dataStruct 폴더에 Heap.go라는 파일을 추가 해주자! <br />

<code>dataStruct/Heap.go</code>
``` Go
  package dataStruct

import "fmt"

type Heap struct { // 1
	list []int
}

func (h *Heap) Push(v int) { // 2
	h.list = append(h.list, v) // 1

	idx := len(h.list) - 1 // 2
	for idx >= 0 { // 3
		parantIdx := (idx - 1) / 2 // 4
		if parantIdx < 0 { // 5
			break
		}
		if h.list[idx] > h.list[parantIdx] { // 6
			h.list[idx], h.list[parantIdx] = h.list[parantIdx], h.list[idx]
			idx = parantIdx // 7
		} else { // 8 
			break
		}
	}
}

func (h *Heap) Print() { // 3
	fmt.Println(h.list)
}
```
1 : Heap이란 타입을 정의 해주고, int형 Slice를 가지도록 한다. <br />
2 : Heap 포인터의 메소드 Push를 정의하고, 새로운 int형 값 v를 받도록 한다. <br />
2-1 : 새로운 값을 넣을 때는 맨 뒤에 추가하므로 append()를 사용하여 추가해준다. <br />
2-2 : 그리고 현재 Index를 가져오는데 list의 길이의 -1 이다. (길이는 Index보다 하나 큰 것이기 때문에) <br />
2-3 : Index가 0보다 크거나 같은 경우 부모로 올라가면서 비교하는데 <br />
2-4 : 부모 Index는 아까 공식에 따라 (Index-1)/2이 된다. <br />
2-5 : 부모 Index가 -값일 경우에 Break를 시켜준다. <br />
2-6 : 현재 자식Node 값이 부모 Index에 있는 값보다 크다면 서로 Swap시켜준다. <br />
2-7 : 현재 Node의 Index값을 parantIdx로 바꾸어준다. <br />
2-8 : 크지 않은 경우 바꿀 필요가 없기 때문에 Break로 빠져 나온다. 그렇게 되면 Push가 끝이 난다. <br />
3 : list를 출력해주는 함수. <br />

이제 Push를 만들었기 때문에 제대로 동작하는지 확인해보자! <br />

<code>main.go</code>
``` Go
package main

import (
	"./dataStruct"
)

func main() {
	h := &dataStruct.Heap{}

	h.Push(9)
	h.Push(8)
	h.Push(7)
	h.Push(6)
	h.Push(5)
  
	h.Print()
}
```

잘 들어갔는지만 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102065210-98a6e880-3e3b-11eb-928f-349f6931915e.png" width = 70%> </img></p>

그래서 지금까지의 Data를 Tree로 표현하면 아래와 같다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102065350-ca1fb400-3e3b-11eb-9581-b5904ab17497.png" width = 70%> </img></p>

이제 Pop을 구현해보자! <br />
``` Go
func (h *Heap) Pop() int {
	if len(h.list) == 0 {
		return 0
	}

	top := h.list[0]
	last := h.list[len(h.list)-1]
	h.list = h.list[:len(h.list)-1]

	h.list[0] = last
	idx := 0
	for idx < len(h.list) {
		leftIdx := idx*2 + 1

		if leftIdx >= len(h.list) {
			break
		}

		left := h.list[leftIdx]
		rightIdx := idx*2 + 2
		right := h.list[rightIdx]

		if left > last && left >= right {
			h.list[idx], h.list[leftIdx] = h.list[leftIdx], h.list[idx]
			idx = leftIdx
		} else if right > last {
			h.list[idx], h.list[rightIdx] = h.list[rightIdx], h.list[idx]
			idx = rightIdx
		} else {
			break
		}
	}
}
```
