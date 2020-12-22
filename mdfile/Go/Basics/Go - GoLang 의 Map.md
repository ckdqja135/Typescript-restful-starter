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
그랬을 때 asc의 value인 aaa가 출력 되는 것을 알 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/102858654-040d3d80-446e-11eb-9977-66f9905325bd.png" width = 70%> </img></p>
