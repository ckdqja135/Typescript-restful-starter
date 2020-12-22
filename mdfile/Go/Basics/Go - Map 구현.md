이번에 Hash Map을 직접 만들어 볼 것인데 지금 만들어볼 Hash Map은 [Rolling hash](https://en.wikipedia.org/wiki/Rolling_hash)인데 간단한 Hash중에 하나이다. <br />
"abcde"라는 String있을 때 첫번째를 s0, 그 다음 s1, s2, s3, s4라 했을 때 <br />

``` Text
a  b  c  d  e
s0 s1 s2 s3 s4
```

(s0 * A(특정숫자) + s1) % B 한 값을 **Rolling hash** 라고 한다. <br />

다시 적어보면 s는 s0 ~ sN까지 있을 때 <br />
H(Hash의 H)i = (Hi-1 * A + si) % B 가 된다. <br />
아까 예를 들어 <br />
``` Text
a  b  c  d  e
s0 s1 s2 s3 s4
```
이러한 값이 있다고 했는데 <br />
이 첫번째 글자의 Hash값은 H0가 된다. <br />
``` Text
a  b  c  d  e
H0
```
그럴 때 H0-1은 없으니까 H0 = (s0) % B가 되는데 s0는 문자에 해당하는 키값이다. 한 문자는 1byte의 아스키 코드 값이 나오는데 0 ~ 255사이 값이 나올 것인데 거기에 % B한 값이 H0이고, <br />
H1은 위와 같이 구한 H0에 A를 곱한다음 s1을 더한 값에 B를 나머지 연산 한 값이 된다. <br />
`H1 = (H0 * A + s1) % B` <br />
이제 이것을 끝까지 반복하면 아래와 같이 모두 구할 수 있게 된다. <br />
``` Text
a  b  c  d  e
H0 H1 H2 H3 H4
```
그래서 문자열 끝까지 다 돌렸을 때 나오는 최종 Hash값인 H4가 이 문자열의 최종 Hash값이 될 것이다. <br />
이게 Rolling hash라고 부르는 이유는 한 글자 씩 굴러가면서 만들어 낸다해서 그렇게 부른다. <br />

이 때 A와 B의 숫자를 정해야 되는데 A는 보통 s값의 범위를 적어주는게 좋다. 그러니까 s가 문자의 값은 아스키 문자열에서 0 ~ 255사이의 값이 나오니까 A는 곱해서 들어가니까 저 값보다 큰 <br />
A = 256으로 하면 좋다. <br />

이제 B는 나머지 연산을 하는건데 B값을 소수잡는게 좋다. 소수로 잡으면 값의 분포가 넓게 퍼지기 때문인데 B는 아무 소수나 상관 없는데 <br />
적당히 크고 적당히 좋은 3571을 B로 하자! <br />
B = 3571 <br />

이제 이것을 구현해보자! <br />
dataStruct 패키지에 map.go를 추가해주자! <br />

``` Go 
package dataStruct

func Hash(s string) int { // 1
	h := 0
	A := 256
	B := 3571
	for i :=0; i< len(s); i++ {
		h = (h*A + int(s[i])) % B
	}
	return h
}

```
1 : string을 입력받고 int를 return 시켜주는 Hash함수 생성. <br />
Hash를 뜻하는 h, A, B는 위에 써놓은 것처럼 값을 지정해주고, s의 길이만큼 `h = (h * A + s[i]) % B`계산을 반복 한 뒤 h를 return 시켜준다. <br />

이제 이것을 실행 시켜 줄 것인데 main.go에 Hash값을 출력해보자! <br />

<code>main.go</code>
``` Go
package main

import (
	"fmt"

	"./dataStruct"
)

func main() {
	fmt.Println("abcde = ", dataStruct.Hash("abcde"))
}
```

결과를 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102849599-d2d74200-445a-11eb-9cb7-8b808a9d5f6e.png" width = 70%> </img></p>

값이 2598이 나왔는데 이 숫자는 사실 의미가 없다. 그냥 이 문자열을 Rolling hash를 통해 돌렸을 때 나온다는 것이다. <br />

Hash의 조건 중 같은 값을 입력했을 때 같은 값이 나와야 하는데 두 번 넣었을 시 똑같은 값이 나오는지 확인해보자!
<code>main.go</code>
``` Go
package main

import (
	"fmt"

	"./dataStruct"
)

func main() {
	fmt.Println("abcde = ", dataStruct.Hash("abcde"))
  fmt.Println("abcde = ", dataStruct.Hash("abcde"))
}
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102850254-55143600-445c-11eb-9f75-2aecdcaca566.png" width = 70%> </img></p>
같은 값이 나오는걸 확인 할 수 있다. <br />

그러면 반대로 다른 값을 넣었을 때 다른 값이 나오는 지 확인해보자! <br />
<code>main.go</code>
``` Go
package main

import (
	"fmt"

	"./dataStruct"
)

func main() {
	fmt.Println("abcde = ", dataStruct.Hash("abcde"))
  fmt.Println("abcde = ", dataStruct.Hash("abcde"))
  fmt.Println("abcdef = ", dataStruct.Hash("abcdef"))
}
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102850437-cf44ba80-445c-11eb-9edd-d62ddfb627b7.png" width = 70%> </img></p>
다른 값이 나오는 것을 확인 할 수 있다! <br />
또한 눈치가 빠르신 분들은 아시겠지만 B값인 3571보다는 작은 값들이 출력되고 있다는 것을 알 수 있다. <br />

그러면 이 Hash를 가지고 Map을 만들어보자! <br />
현재 Hash라는 function을 하나 만들었는데 결과값은 0 ~ 3570까지 값이 나올 것이다. <br />
그러면 이것을 Array를 하나 만들어서 이 Array의 수를 3570개로 하여 Map을 만들 때 Array에 Key값으로 문자열이 들어오면 해당 문자열의 Hash()를 돌려서 나온 결과값을 그 값에 해당하는 Array의 Index에 Value로 저장을 하면 된다. 그러면 다음번에 해당 Key로 값을 조회할 때 같은 Hash가 출력되므로 해당 Index에 있는 Value를 가져오게 된다. <br />

문제는 Hash가 0 ~ 3570 사이의 값이 나오는데 문자열은 입력되는 범위는 무한대라는 것이다. 문자열의 길이도 정해져 있지 않고, 문자열 종류도 정해져 있지 않기 때문이다. <br />
하지만 출력은 0 ~ 3570사이의 값이다. 그 말은 압축한 것이라 볼 수 있다. 정보가 손실되는 것을 말하는데 무한개의 입력이 들어왔는데 유한개의 출력이 나오기 때문이다. <br />
정보가 손실되었기 때문에 다시 저 값을 가지고 복원할 수 없다. Hash의 기본 기능이고, 또한 같은 입력 시 같은 값이 나오지만 다른 입력을 넣었음에도 불구하고 같은 값이 나올 수 있다. <br />
이것을 [Hash충돌](https://ko.wikipedia.org/wiki/%ED%95%B4%EC%8B%9C_%EC%B6%A9%EB%8F%8C) 이라고 한다. <br />

예를 들어보면 우리가 전화번호부를 만들 때 <br />
김AA Hash값이 3일 때 박CC의 Hash값도 3이 될 수 있어서 Array에 김AA의 전화번호를 먼저 넣고, 나중에 박CC의 전화번호를 조회할 때 김AA의 값이 나올 수 있다는 말이다. <br />

그래서 이것을 방지해야 하는데 가장 단순하게 방지해주는 방법은 Array에 Value를 그냥 집어넣는게 아니라 Array에 각각 또다른 Array를 집어넣는다. 그래서 같은 Hash값을 갖는 Data들을 다른 Array에 집어 넣어주는 것이다. <br />
그래서 같은 값의 Hash가 나왔을 시 그 List를 돌면서 어떤 값의 Hash가 겹치는지 확인 후에 그것의 전화번호를 반환하도록 만들어서 충돌을 방지시켜준다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102852444-9b1fc880-4461-11eb-9d9d-e36c5f9033ac.png" width = 70%> </img></p>

이 방법은 전체를 다시 도는 방법이랑은 다르다. 이것은 Hash와 같은 값만 비교하기 때문에 훨씬 비교하는 대상이 적고, 빠르게 만드는 방법이고, 이렇게 만드는 이유는 Hash의 충돌을 방지해주기 위해서 이다. <br />

이제 코드로 구현을 해보자! <br />

<code>map.go</code>
``` Go
package dataStruct

func Hash(s string) int {
	h := 0
	A := 256
	B := 3571
	for i := 0; i < len(s); i++ {
		h = (h*A + int(s[i])) % B
	}
	return h
}

type KeyValue struct { // 1
  key string
  value string
}

type Map struct { // 2
  keyArray [3571][]KeyValue
}

func CreateMap() *Map { // 10
  return &Map{}
}

func (m * Map) Add(key, value string) { // 3
	h := Hash(key) // 4
  m.keyArray[h] = append(m.keyArray[h], keyValue{key, value}) // 5
}

func (m *Map) Get(key string) string { // 6
	h : Hash(key) // 7
  	for i:=0; i< len(m.keyArray[h]); i++ { // 8
		if m.keyArray[h][i].key == key { // 9
			return m.keyArray[h][i].value
		}
	}
	return ""
}

```
1 : KeyValue struct 생성. <br />
2 : 먼저 Map이라는 struct를 생성시켜주고, 이 안에 각 hash값에 해당하는 범위인 3571개의 Array를 넣어주고, 그 Array의 항목에는 Key와 ValueList를 갖는 들어간다.<br />
3 : 그 후 Add라는 함수를 만들어서 key와 value를 입력받아 add 할 수 있게 해준다. <br />
4 : 먼저 key에 해당하는 Hash값을 뽑아주고 <br />
5 : hash에 해당하는 Index에 keyValue를 append 시켜주고, append한 결과를 `m.KeyArray[h]`에 넣어준다. <br />
이렇게 되면 Hash()에 key를 넣고 돌린 h라는 값에 해당하는 List가 있을텐데 그 List에 keyValue를 추가하고, 추가된 List를 다시 재정의 하는 부분으로 보면 된다. <br />
6 : 이제 가져오는 key를 입력받아 value를 가져오는 Get함수를 생성해준다. <br />
7 : 마찬가지로 key에 대한 hash값을 구해주고 <br />
8 : 이 hash값을 for문을 돌려서 이 hash값에 해당하는 list안에 key값이 있는지 확인을 해준다. <br />
9 : 같은 키가 있으면 그 value를 반환해주고, 없을 경우엔 빈 문자열을 반환해준다. <br />
10 : Map의 포인터를 반환하는 CreateMap이라는 함수를 생성해준다. <br />

이제 main함수로 넘어와 기존에 있던거 놔두고 코드를 추가해준다. <br />

<code>main.go</code>
``` Go
package main

import (
	"fmt"

	"./dataStruct"
)

func main() {
	fmt.Println("abcde = ", dataStruct.Hash("abcde"))
	fmt.Println("abcde = ", dataStruct.Hash("abcde"))
	fmt.Println("abcdef = ", dataStruct.Hash("abcdef"))
	fmt.Println("")
	m := dataStruct.CreateMap()
	m.Add("AAA", "01012345555")
	m.Add("BBB", "01023456666")
	m.Add("CCDASDQWEQDASD", "01011112222")
	m.Add("DDD", "01775756665")

	fmt.Println("AAA = ", m.Get("AAA"))
	fmt.Println("BBB = ", m.Get("BBB"))
	fmt.Println("DDD = ", m.Get("DDD"))
	// 없는 key
	fmt.Println("FFASDSAD = ", m.Get("FFASDSAD"))
}

```
먼저 빈 map을 만들어주고, 빈 map에 Add()를 사용하여 data를 채워준 뒤, 해당 key값을 가진 data를 조회하기 위해 Get함수에 key값을 넣어주어 조회시켜준다. <br />
마지막에 넣지 않는 key값을 조회시켜 어떤 일이 일어나는지도 살펴보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102855193-8ba37e00-4467-11eb-8fef-e1ca5a31bcaf.png" width = 70%> </img></p>
넣었던 값들은 정상적으로 출력이 되고, 넣지 않은 값은 정상적으로 출력이 되지 않는 것을 알 수 있다. <br />

이렇게 Map을 만들었다! <br />
Map은 List와 함께 보편적으로 사용되는 struct 중 하나이다. <br />
Map의 장점은 key와 value형태로 되어있는 data struct에서 Find, Add, Remove가 모두 O(1)로 끝나기 때문에 속도가 빠르다는 점이다. <br />

단점은 Hash value는 순서가 없어서 정렬된 형태로 사용할 수 없다는 점인데 어떤 입력값이 들어왔을 때 어떤 결과값이 나오는지 알 수 없기 때문에 Hash의 결과값이 정렬 되어있는 상태가 아니라는 점이다. <br />
그래서 Hash의 값이 작다고 해서 입력값이 작은게 아니고, 크다고 해서 큰 것이 아니기 때문에 key를 정렬되게 뽑을 수가 없다. <br />
그래서 정렬 하고 싶다면 Sorted Map을 사용하면 되지만, 이 때 속도는 O(1)이 아니라 O(log2^N)이 된다는 점을 알아두어야 한다. <br />

이것을 외울게 아니라 왜 HashMap은 add와 Remove와 Fined가 O(1)인지, 왜 Sorted Map은 Add와 Remove와 Fined가 O(log2^N)인지 이해해야 한다. 원리를 알아야 한다. <br />
이 부분이 이해가 되지 않는다면 앞에 다 설명을 했기 때문에 다시 보는 것을 추천한다. <br />
간략하게 말하자면 HashMap은 Hash를 사용하기 때문에 O(1), Sorted Map은 BST를 사용하기 때문에(반절씩 버리고 가기 때문에) O(log2^N)이 된다. <br />
