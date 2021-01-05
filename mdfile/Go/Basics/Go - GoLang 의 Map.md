드디어 data struct의 마지막 시간이다. 저번에도 말했듯이 slice와 더불어 많이 쓰이는 것중 하나이다.<br />
Go에서 기본적으로 map을 지원해주고 있기 때문에 직접 만들필요는 없고, 직접 만든 이유는 Map의 동작원리를 알기 위해서 만들어 본 것이다. <br />

Go에서 map을 사용하는 방법에 대해 알아보자 <br />
<code>main.go</code>
``` Go
package main

import (
	"fmt"
)

func main() {
	var m map[string]string
}
```
위와 같이 m이라는 변수를 만들고, map이라고 쓰고 []를 사용하여 []안에는 key타입 값을 넣어주고, []밖에는 value타입 값을 넣어준다. <br />
현재는 key타입은 string, value타입은 string형태의 map을 만든 것이고, 그 외에도 여러가지로 만들 수 있는데 <br />

``` Go
  var m1 map[int]string
	var m2 map[int]int
```

이런식으로 만들거나 따로 key와 value를 struct 형태로 해서 넣을 수 도 있다.<br />
``` Go
type Key struct {
	v int
}

type Value struct {
	v int
}

func main() {
	var m map[Key]Value
	var m2 map[Key]*Value
}
```

다시 돌아와서 <br />

``` Go
package main

import (
	"fmt"
)

func main() {
	var m map[string]string
}
```

위와 같이 했을 때 map을 선언한 것인데 이 선언만 한다 해서 바로 쓸 수가 없다. m의 값안에 nil값이 들어가기 때문인데 이것을 사용하려면 map을 초기화를 해주어야 한다. <br />
그래서 아래와 같이 초기화를 하지 않고, 바로 사용하게 되면 에러가 난다. <br />

``` Go
package main

import (
	"fmt"
)

func main() {
	var m map[string]string
  m["abc"] = "bbb"
}
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102858126-120e8e80-446d-11eb-8cb3-e7f0c4e48f31.png" width = 70%> </img></p>

결과를 보면 panic이 일어나는 것을 알 수 있다. <br />

초기화를 해주려면 slice를 사용해서 초기화를 해줄 수 있다. <br />

``` Go
package main

import (
	"fmt"
)

func main() {
	var m map[string]string
  m = make(map[string]string)
  m["abc"] = "bbb"
}
```

이제 이것을 실행시켜보면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102858313-674aa000-446d-11eb-886f-e40d68c88a36.png" width = 70%> </img></p>
에러없이 프로그램이 종료되는 것을 알 수 있다. <br />

이제 Map에 set을 해줄건데 <br />
map쓰고 []안에 key를 넣고 = 한 뒤 value를 넣어주면된다. <br />

``` Go
package main

import (
	"fmt"
)

func main() {
	var m map[string]string
  m = make(map[string]string)
  
  m["asc"] = "aaa"
  m["abc"] = "bbb"
}
```

이렇게! <br />

이렇게 Setting해주면 되고, 읽는 것은 map을 쓰고 []안에 key값을 넣어주면 된다. <br />

``` Go
package main

import "fmt"

func main() {
	var m map[string]string
	m = make(map[string]string)

	m["asc"] = "aaa"
	m["abc"] = "bbb"

	fmt.Println(m["asc"])

}

```

그랬을 때 key값 asc의 value인 aaa가 출력 되는 것을 알 수 있다. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102858654-040d3d80-446e-11eb-9977-66f9905325bd.png" width = 70%> </img></p>

이 외에도 선언과 대입 동시에 가능한 선언대입문 사용도 가능한데 <br />
``` Go
package main

import "fmt"

func main() {
	var m map[string]string
	m = make(map[string]string)

	m["asc"] = "aaa"
	m["abc"] = "bbb"

	fmt.Println(m["asc"])

	m1 := make(map[int]string)
	m1[11] = "vvv"
	fmt.Println(m1[11])
	
}
```

위와 같이 해준 뒤 출력하면 <br />

정상적으로 출력 되는 것을 알 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102859019-94e41900-446e-11eb-8cba-db0ab2539702.png" width = 70%> </img></p>

한가지 재밌는 것은 Golang에서는 값을 대입하지 않는 값을 출력하고자 할 경우 기본 값이 출력이 된다. <br />
``` Go
package main

import "fmt"

func main() {
	var m map[string]string
	m = make(map[string]string)

	m["asc"] = "aaa"
	m["abc"] = "bbb"

	fmt.Println(m["asc"])

	m1 := make(map[int]string)
	m1[11] = "vvv"
	fmt.Println(m1[11])
	fmt.Println(m1[22])
}
```
이렇게 했을 때 m1에 22는 Setting을 해주지 않았기 때문에 없는 값인데 이 값의 기본 값인 빈 문자열이 나오게 된다. 확인해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102859187-de346880-446e-11eb-9584-b4a005484463.png" width = 70%> </img></p>

이번엔 key, value가 int인 map을 만들어본 뒤 위와 같이 했을 때 어떤 기본값이 나오는지 확인해보자! <br />
``` Go
func main() {
	var m map[string]string
	m = make(map[string]string)

	m["asc"] = "aaa"
	m["abc"] = "bbb"

	fmt.Println(m["asc"])

	m1 := make(map[int]string)
	m1[11] = "vvv"
	fmt.Println(m1[11])
	fmt.Println(m1[22])

	m2 := make(map[int]int)
	m2[4] = 4

	fmt.Println(m2[5])
}
```
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102859436-3f5c3c00-446f-11eb-8f82-276dad299869.png" width = 70%> </img></p>
int형의 기본값은 0이기 때문에 0이 출력되는 것을 볼 수 있다. <br />

이 성질을 이용해서 C++에서 제공하는 Set과 같은 것을 만들어 낼 수 있다. <br />
set이라는 것은 어떤 값이 항목에 있는지 없는지를 검사하는 것이다. <br />

``` Go
func main() {
	var m map[string]string
	m = make(map[string]string)

	m["asc"] = "aaa"
	m["abc"] = "bbb"

	fmt.Println(m["asc"])

	m1 := make(map[int]string)
	m1[11] = "vvv"
	fmt.Println(m1[11])
	fmt.Println(m1[22])

	m2 := make(map[int]int)
	m2[4] = 4

	fmt.Println(m2[5])

	m3 := make(map[int]bool)
	m3[4] = true

	fmt.Println(m3[4], m3[5])
}
```

그래서 이렇게 하면 이 m3안에 어떤 key값이 Setting이 되어 있는지 없는지를 알기 위해 사용하는 방법인데 그 값이 true, false를 보면 그 값이 Setting되어 있는지, 아닌지, 존재하는지 안하는지를 알 수 있다. <br />
그래서 이 부분을 출력하게 되면 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102859776-ec36b900-446f-11eb-9625-5a4637527089.png" width = 70%> </img></p>
true, false가 나온 것을 볼 수 있는데, m3의 4는 미리 Setting을 했고, m3의 5는 Setting을 하지 않았기 때문인데, bool형의 기본 값은 false이기 때문에 false가 나온 것이다.<br />

이렇게 했을 경우 한가지 문제가 생기는데 이 기본값이 내가 설정한 기본값인지, 아니면 key가 존재하지 않아 나온 기본값인지 알 수 없다는 점이다. <br />
위의 코드를 예로 들어 보면 <br />

``` Go
	m2 := make(map[int]int)
	m2[5] = 0
	fmt.Println(m2[5])
	fmt.Println(m2[6])
```

이렇게 하면 둘 다 0이 나오게 된다. 하지만 두개는 차이가 있는데 `m2[5]`는 0으로 설정했기 때문에 0이 나온것이고, `m2[6]`은 그 값이 비었기 때문에 기본값인 0이 나온 것이다. <br />
그래서 내가 이 값을 설정했는지 안했는지를 보기 위해서 Golang에서는 읽기에서 value만 제공하는 게 아니라 그 값이 있는지 없는지도 제공해주고 있다. <br />
``` Go
	m2 := make(map[int]int)
	m2[4]= 4
	m2[5] = 0
	
	v := m2[5]
	v1 := m2[4]
	fmt.Println(v, v1)
```
그래서 위와 같이 v에 `m2[5]`를 대입했을 때 v값은 `m2[5]`의 값인 0이 대입이 되고, v1은 `m2[4]`의 값인 4가 대입이 된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102861368-e1c9ee80-4472-11eb-9f67-97f16c821401.png" width = 70%> </img></p>

마찬가지로 아래와 같이 했을 때도 0은 그대로 나오게 된다. <br />
``` Go
	m2 := make(map[int]int)
	m2[4]= 4
	m2[5] = 0
	
	v := m2[5]
	v1 := m2[4]
	v2 := m2[10]
	fmt.Println(v, v1, v2)
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102861512-25245d00-4473-11eb-9dee-733089848b9d.png" width = 70%> </img></p>

이 때 값이 있는지 없는 지 확인하려면 2번째 값을 넣으면 되는데 Golang에서는 map을 읽기로 Access했을 때는 두 개의 값을 반환하는데 <br />
첫번째 값엔 Value, 두번재 값엔 Bool형이 나온다. 그래서 아래와 같이 수정을 하면 확인이 가능하다. <br />

``` Go
	m2 := make(map[int]int)
	m2[4]= 4
	m2[5] = 0
	
	v, ok1 := m2[5]
	v1 := m2[4]
	v2, ok2 := m2[10]
	fmt.Println(v, ok1, v1, v2, ok2)
```

이렇게 해서 결과를 확인하면 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102862031-d9be7e80-4473-11eb-9436-5ac46527773e.png" width = 70%> </img></p>

존재 여부를 확인 할 수 있는 것을 알 수 있다. <br />
그래서 값의 여부를 확인할 때는 value값이 아니라 bool형 타입 값을 넣어 확인해야 한다는 것을 알 수 있다. <br />

이번에는 값을 지우는 부분을 해보자! 값을 지울 때는 delete(mapname, key)를 넣어서 지울 수 있다.<br />

``` Go
func main() {
	var m map[string]string
	m = make(map[string]string)

	m["asc"] = "aaa"
	m["abc"] = "bbb"

	fmt.Println(m["asc"])

	m1 := make(map[int]string)
	m1[11] = "vvv"
	fmt.Println(m1[11])
	fmt.Println(m1[22])

	m2 := make(map[int]int)
	m2[4] = 4

	fmt.Println(m2[5])

	m3 := make(map[int]bool)
	m3[4] = true

	fmt.Println(m3[4], m3[5])
	
	m2[5] = 0
	v, ok1 := m2[5]
	v1 := m2[4]
	v2, ok2 := m2[10]
	fmt.Println(v, ok1, v1, v2, ok2)
	
	delete(m2, 5)
	v, ok1 = m2[5]
	fmt.Println(v, ok1, v1, v2, ok2)
}
```

key값 5를 지우고 나서 다시 출력하면 어떻게 될지 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102862392-66693c80-4474-11eb-9718-90aba0cc2484.png" width = 70%> </img></p>

false로 바뀐 것을 알 수 있다. <br />

마지막으로 순회 하는 부분이 남았는데 순회 하는 방법은 반복문을 사용하면 되는데 key와 value가 나오는데 대입선언문으로 range를 쓰고, map을 적어주게 되면 map의 모든 항목을 반복하면서 key와 value를 알려주게 된다. <br />

``` Go
func main() {
	var m map[string]string
	m = make(map[string]string)

	m["asc"] = "aaa"
	m["abc"] = "bbb"

	fmt.Println(m["asc"])

	m1 := make(map[int]string)
	m1[11] = "vvv"
	fmt.Println(m1[11])
	fmt.Println(m1[22])

	m2 := make(map[int]int)
	m2[4] = 4

	fmt.Println(m2[5])

	m3 := make(map[int]bool)
	m3[4] = true

	fmt.Println(m3[4], m3[5])
	m2[5] = 0
	v, ok1 := m2[5]
	v1 := m2[4]
	v2, ok2 := m2[10]
	fmt.Println(v, ok1, v1, v2, ok2)

	delete(m2, 5)
	v, ok1 = m2[5]
	fmt.Println(v, ok1, v1, v2, ok2)

	m2[2] = 72
	m2[10] = 456

	for key, value := range m2 {
		fmt.Println(key, " = ", value)
	}
}
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102862696-d37cd200-4474-11eb-84fd-7bd27eae672e.png" width = 70%> </img></p>

여기서 한가지 더 눈여겨 보아야 할게 2, 10, 4 순으로 나왔는데 작은 값 ~ 큰 값 순으로 나오지 않았다는 점이다. <br />
저번에도 Hash함수 설명할 때 크기와 상관없이 key값이 정렬되어 나오지 않는다고 설명했는데 여기서도 무작위로 나왔다는 것을 알 수 있다. <br />

