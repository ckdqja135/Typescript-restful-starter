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
func (h *Heap) Pop() int { // 1
	if len(h.list) == 0 { // 2
		return 0
	}

	top := h.list[0] // 3
	last := h.list[len(h.list)-1] // 4
	h.list = h.list[:len(h.list)-1] // 5

	h.list[0] = last // 6
	idx := 0 // 7
	for idx < len(h.list) { // 8
		leftIdx := idx*2 + 1 // 14

		if leftIdx >= len(h.list) { // 19
			break
		}

		left := h.list[leftIdx] // 9
		rightIdx := idx*2 + 2 // 14
		right := h.list[rightIdx] // 10

		if left > last && left >= right { // 11
			h.list[idx], h.list[leftIdx] = h.list[leftIdx], h.list[idx] // 12
			idx = leftIdx // 13
		} else if right > last { // 15
			h.list[idx], h.list[rightIdx] = h.list[rightIdx], h.list[idx] // 16
			idx = rightIdx // 17
		} else { // 18
			break
		}
	}
}
```
1 : Pop()의 함수를 만들어주는데 return값은 Pop된 값이 나오게 된다. <br />
2 : Heap이 아예 비어있는 경우. 0을 return 시켜준다. <br />
3 : 맨 위에 있는 값(h.list[0])을 가져온다. <br />
4 : 맨 마지막에 있는 값을 가져온다. last의 값은 heap의 항목 길이 -1번째가 가장 뒤에 있는 값이다. <br />
5 : heap 끝을 잘라내서 list를 하나 줄여준다. <br /> 
    이렇게 하면 맨 마지막 애를 잘라내는 효과를 낸다. <br />
6 : 맨 마지막에 있는 애를 맨 처음에 올려주고 <br />
7 : 현재 index는 맨 처음으로 해준다. <br />
8 : index가 전체 길이보다 작은 경우. 자식 노드로 가면서 자식 중에 가장 큰 애랑 바꾸게 된다. <br />
9 : 왼쪽 자식 Node를 가져온다. <br />
10 : 오른쪽 자식 Node를 가져온다. <br />
11 : 이랬을 때 현재 나의 Node보다 내 자식 노드가 큰 경우 바꾸게 되는데 <br />
12 : h의 list의 현재 Node값과 Swap하게 된다. <br />
13 : Index를 leftIdx로 바꾸어준다. <br />
14 : idx * 2 + 1, idx * 2 + 2 부분이 반복되므로 변수로 묶어서 관리하도록 해준다. <br />
15 : 만약에 right가 last보다 큰 경우 이 때는 left가 last보다 크지 않거나 left가 right보다 크지 않는 경우인데 <br />
     즉, 부모 Node보다 크고, left보다 크다는 이야기인데 <br />
16 : 이 때는 right랑 바꾸어준다. <br />
17 : 그 후 Index값은 rightIdx값으로 바꾸어준다. <br />
18 : 현재 값이 자식노드보다 작지 않은경우 바꿀 필요가 없기 때문에 break로 나간다. <br />
19 : 내 자식Node가 현재 길이보다 더 큰 경우에도 비교할 필요가 없으므로(자식이 없다는 소리니까...) break로 빠져나온다. <br />

그 이후에도 right부분도 없을 경우도 19번과 마찬가지로 바꾸어주어야 하는데 코드가 복잡해지기 때문에 다시 코드를 수정해준다. <br />

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
		swapIdx := -1 // 4
		leftIdx := idx*2+1 // 1
		if leftIdx >= len(h.list) { // 2	
				break
		}
		if h.list[leftIdx] > h.list[idx] { // 3
				swapIdx = leftIdx // 5
		}
		
		rightIdx := idx*2+2 // 6
	  if rightIdx < len(h.list) { // 7
				if h.list[rightIdx] > h.list[idx] { // 8
						if swapIdx < 0 || swapIdx >= 0 && h.list[swapIdx] < h.list[rightIdx] { // 9
								swapIdx = rightIdx // 10
						}
				}
		}
		
		if swapIdx < 0 { // 11
			break
		}
		h.list[idx], h.list[swapIdx] = h.list[swapIdx], h.list[idx] // 12
		idx = swapIdx // 13
	}
	return top // 14
}
```
1 : leftIdx 값. <br />
2 : leftIdx가 길이보다 크거나 같다면 -> 자식노드가 없다면 break를 해준다. <br />
3 : leftIdx가 현재꺼보다 큰 경우 바꾸어준다. <br />
4 : 바꾼 것을 표시해주기 위해 swapIdx를 추가 해준 뒤에 <br />
5 : 여기어 넣어 준다. <br />
6 : rightIdx 추가. <br />
7 : 마찬가지로 rightIdx가 list길이보다 작은 경우. <br />
8 : 안에 right 자식 Node가 있는 경우를 비교. <br />
9 : swapIdx가 0보다 작거나 swapIdx에 해당하는 값이 현재 내 값과 작은 경우를 비교한다.<br />
10 : 그 때 swapIdx를 왼쪽이 아닌 오른쪽 값으로 바꾸도록 하고 <br />
11 : swapIdx가 0보다 작은 경우 swap할 값이 없다는 뜻이기 때문에 break를 해주고 <br />
12 : 그렇지 않은경우 서로 swap 시켜준다. <br />
13 : 위에서 바꾸었기 때문에 Index값을 swapIdx로 바꾸어 준 뒤 for문으로 다시 돌아간다. <br />
14 : 이렇게 for문에 돌아가 다시 비교를 해준 뒤 마지막에 아까 뽑아놓았던 top값을 retrun하여 끝낸다. <br />

그 후 print를 확인하자. <br />
<code>main.go</code>
``` Go
package main

import (
	"fmt"

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

	fmt.Println(h.Pop())
	fmt.Println(h.Pop())
	fmt.Println(h.Pop())

}
```
출력값을 확인하자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102198067-46ca9500-3f05-11eb-813b-01f8c837c816.png" width = 70%> </img></p>
맨 앞의 값부터 나오는 것을 확인할 수 있다. <br />
어떻게 보면 list에 값을 넣고, list에 있는 값을 순서대로 뽑아내는거 아니냐?고 생각할 수 있는데 이걸 확인하는 방법은 <br />
처음에 넣을 때 값을 무작위로 넣어보겠다. <br />
<code>main.go</code>
``` Go
package main

import (
	"fmt"

	"./dataStruct"
)

func main() {
	h := &dataStruct.Heap{}

	h.Push(2)
	h.Push(7)
	h.Push(1)
	h.Push(4)
	h.Push(9)

	h.Print()

	fmt.Println(h.Pop())
	fmt.Println(h.Pop())
	fmt.Println(h.Pop())

}
```

이렇게 하고 값을 확인해보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102198380-a88aff00-3f05-11eb-85b2-c1a877e7b755.png" width = 70%> </img></p>
Heap 처리 되어 나오는 것을 알 수 있다. <br />
