## 시작
이번엔 채널에 대해 좀 더 알아보자! <br />
채널은 말했듯이 Go언어에서 제공하는 멀티스레드용 프로그램을 좀 더 원활하게 하기 위해서 제공하는 타입이고, Fixed Size(정해진 크기를 갖는), Thread Safe(스레드에 안정적으로 돌아가는) 큐이다. <br />

큐는 자료구조의 하나로써 FIFO를 제공하는 자료구조이다. <br />

채널도 하나의 타입인데 Slice랑 Map과 같은 Go에서 제공하는 자료구조 중에 하나라고 보면 된다. <br />
그래서 **chan**으로 사용하면 되는데 선언은 <br />

``` Go
var a chan int
```

이렇게 사용하는데 var로 선언하고 이름은 아무거나 하고, 타입은 chan, 값의 타입은 int, string, *, 등 Go에서 사용가능한 타입은 모두 가능하다. <br />

Slice도 그렇고 Map도 그렇고 초기화를 해야 사용할 수 있는데 

``` Go
a := make(chan int, 10)
```

이런식으로 make를 사용하여 초기화를 할 수 있는데 ','옆에 채널의 사이즈를 정할 수 있다. <br />
현재 10개 사이즈에 해당하는 채널을 만들었는데 10개가 다 차더라도 채널은 자동으로 늘진 않는다. <br />

``` Go
a := make(chan int)
```

이렇게만 초기화 시켜주면 1개짜리가 아닌 0개짜리 채널이 만들어지는데 하나도 못집어 넣는게 아니라 0개 짜리 채널은 넣을 때 다른 곳에서 빼주지 않으면 넣는 연산이 끝이 안난다. <br />
이것을 블로킹된다고 표현하는데 이 부분은 이따 다뤄보도록 하겠다. <br />

그리고 큐는 대표적으로 Push와 Pop을 가지고 있으므로 채널 또한 Push와 Pop을 제공하는데 독특하게 화살표연산(<-)을 사용한다. <br />
그래서 채널을 만든다 가정하면 <br />

``` Go
c := make(chan int, 1)
```
이렇게 초기화를 시켜주고, c에 값을 넣을 때 <br />

``` Go
c <- 10
```
이렇게 c를 향해 화살표를 넣으면 Push가 되고 <br />

``` Go
v := <- c
```

값을 뺄 때는 채널에서 화살표가 나가는 쪽으로 하면 Pop이 되어 v변수에 값이 들어가게 된다. <br />

이 부분을 직접 코딩하여 만들어보자! channel이라는 폴더를 만들고, 그 안에 main.go를 생성해준다. <br />

``` Go
package main

import "fmt"

func main() {
	var c chan int
	c = make(chan int, 1)

	c <- 10
	v := <-c

	fmt.Println(v)
}
```
이렇게 작성 후에 출력 결과를 보면 10이 출력 되는 것을 알 수 있다.<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103984133-e956fa80-51c9-11eb-8e7f-04252a2c39d0.png" width = 70%> </img></p>

이번에는 0개짜리 int형 채널을 만들었다고 가정해보자. 이 때 다른 스레드에서 빼주지 않으면 넣는 구문이 끝나지 않는다고 했는데 이 부분을 구현하여 어떻게 결과가 나오는지 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103984306-36d36780-51ca-11eb-80f8-01b77eb5d6a9.png" width = 70%> </img></p>
deadlock이 발생했다고 출력되었고, 그 옆에 all goroutines are asleep라는 문구가 있는데 모든 고루틴이 잠자고 있다는 의미이며 deadlock이 발생하여 더 이상 진행 할 수 없다는 의미이다. <br />

그 이유는 `c <- 10` 이 부분에서 c가 0개 짜리라서 다른곳에서 빼주지 않았기 때문에 멈춘 것이다. <br />

이번엔 pop()을 만들어보자! <br />
``` Go
func pop(c chan int) {
	fmt.Println("pop func...")
	v := <- c
	fmt.Println(v)
}

func main() {
	var c chan int
	c = make(chan int)
  
	go pop(c)
	c <- 10

	fmt.Println("end of program")
}
```
이렇게 pop을 해주면 어떻게 되는지 확인해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103984758-1061fc00-51cb-11eb-9992-505ef0b56b15.png" width = 70%> </img></p>

코드를 살펴보자면 pop()이 go Thread를 통해 실행 되었기 때문에 `fmt.Println("pop func...")`이 먼저 찍히게 되고, 그리고 `v := <- c`여기에서 대기를 하고 있다가 main()에서 10을 집어 넣으면 <br />
`v := <- c`에서 빠지기 때문에 그대로 멈추지 않고, `fmt.Println("end of program")`이 출력되게 된다. <br />

이 부분을 자세히 설명하자면 우리가 Go Thread 2개를 만들었었는데 <br />
Go Thread1은 main(), Go Thread2는 pop()을 실행하게 된다. 표로 살펴보면 아래와 같다. <br />

|Go Thread1|Go Thread2|
|---|---|
|main()|pop()|
||"pop"|
|c <- 10|v:= <- c|
|"end of program"|"10"|
 
처음에 main()에서 pop()을 만들어서 Go Thread2에서 pop을 출력을 했고, 그 다음 v에 값을 뺐는데 뺄 값이 없기 때문에 이 빼는 구문에서 값이 생길 때 까지 기다리고 있는 상태가 된다. <br />
그래서 값을 넣었을 때 `v:= <- c`이 빠져 나오게 되고, 그 다음 10이라는 값을 출력하게 되고, Thread1은 길이가 0개짜리 이므로 `c <- 10`에서 값이 빠질 때까지 기다리고 있다가 Thread2에서 값이 빠졌을 때 end of program을 출력하게 된다. <br />

이를 통해 길이가 0개짜리인 채널은 다른 스레드에서 값을 뺄 때 까지 기다린다는 것을 알 수 있다. <br />

이 것을 통해서 어떤것을 할 수 있냐면 저번에 언급했던 컨베이어 벨트 시스템이라고 부르는 Producer - Consumer 패턴을 만들 수 있다. <br />
지금 이 부분을 사용하여 만들어보자! <br />

자동차 공장을 만든다는 가정해서 carfactory라는 폴더를 생성해주고, 그 안에 main.go를 만들어주자! <br />

``` Go
package main

type Car struct {
	val string
}

func MakeTire(carChan chan Car, outChan chan Car) {
	car := <- carChan
	car.val += "Tire, "

	outChan <- car
}
```
먼저 타이어를 만드는 함수를 만들었다. <br />
차체가 넘어오는 큐인 carChan을 받아오는 함수이고, 받아온 carChan을 빼서 받아오고, val에 Tire를 추가해주었다. <br />
그리고 Tire가 추가된 것을 outChan에 집어 넣어준다. <br />

이제 타이어를 만들었고, 엔진을 만드는 함수를 추가해보자! <br />

``` Go
func MakeEngine(carChan chan Car, outChan chan Car) {
	car := <- carChan
	car.val += "Engine, "

	outChan <- car
}
```
타이어 만드는 함수와 구조는 같다. 우선은 이렇게 만들어주고, main()를 추가해주자! <br />

``` Go
func main() {
	chan1 := make(chan Car)
	chan2 := make(chan Car)
	chan3 := make(chan Car)

	go MakeTire(chan1, chan2)
	go MakeEngine(chan2, chan3)

	chan1 <- Car{val: "Car1: "}
	result := <-chan3

	fmt.Println(result.val)
}
```
채널을 초기화 시켜주고, chan1에 Car를 하나 만들어주고, chan1에 타이어를 붙여서 chan2에 넘겨주고, chan2에 엔진을 붙여서 chan3에 넣어주니 결과값을 chan3에서 받아오면 된다. <br />
그 후 출력을 시켜 결과를 확인해보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103989992-da754580-51d3-11eb-9bfa-695e20770ed7.png" width = 70%> </img></p>

이번에는 무한루프를 돌도록 수정해보자! <br />

``` Go
func MakeTire(carChan chan Car, outChan chan Car) {
	for {
		car := <-carChan
		car.val += "Tire, "

		outChan <- car
	}

}

func MakeEngine(carChan chan Car, outChan chan Car) {
	for {
		car := <-carChan
		car.val += "Engine, "

		outChan <- car
	}

}
```

이렇게 바꾸어주고, 차체를 입력하는 부분도 만들어주자! <br />
``` GO
func StartWork(chan1 chan Car) {
	i := 0
	for {
		time.Sleep(1 * time.Second)
		chan1 <- Car{val: "Car" + strconv.Atoi(i)}
		i++
	}
}
```
이렇게 1초씩 만들도록 해준다. 시작점이라고 생각하면 된다. <br />

그 후 main()로 내려와서 <br />
``` Go
func main() {
	chan1 := make(chan Car)
	chan2 := make(chan Car)
	chan3 := make(chan Car)

	go StartWork(chan1)
	go MakeTire(chan1, chan2)
	go MakeEngine(chan2, chan3)

	for {
		result := <-chan3
		fmt.Println(result.val)
	}

}
```
`go StartWork(chan1)`를 추가 해준 뒤, 결과를 출력하는 부분도 무한 루프로 돌려준다. <br />

그 후 실행을 시켜보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103992565-a56af200-51d7-11eb-87e2-d3a3b41bfc05.png" width = 70%> </img></p>
1초 단위로 쉬면서 계속 출력하는 것을 알 수 있다. <br />

그래서 Go언어에서는 멀티 스레드를 제공하기 위해 Go Thread와 Channel, Select를 제공하고 있다. <br />
이 3가지를 하면 굉장히 효율적으로 멀티 스레드를 만들 수 있다. <br />

그래서 Go언어가 갖는 최대 강점중에 하나가 멀티스레드 환경에서 최적화된 프로그래밍을 할 수 있다는 것이 있다. <br />

그렇다면 왜 멀티스레드를 사용하면 훨씬 복잡해지는 문제에 직면하게 되는데 왜 사용해야 할까? <br />
답은 효율적으로 만들기 위해서이다. 머신의 성능을 최대한 이용하기 위해서이다. <br />

예를 들어 지금 사용하는 컴퓨터가 CPU가 2개가 있다 가정하면 싱글 스레드로 하게 되면 한쪽에서만 스레드를 돌리고 있고, 다른 쪽에선 놀게 되는데 이 노는 자원을 놀지 않게 하기 위해서는 <br />
2개의 스레드를 만들어서 프로그램을 실행시키면 된다. <br />

물론 싱글스레드로 할 경우에 장점이 더 많은데 프로그램이 간단해지고, DeadLock문제도 발생하지 않아 더 좋은데 <br />
멀티 스레드를 현대 프로그램에서 필수인 이유는 **공짜점심** 이 끝났기 때문이다.<br />

이 말은 이전에 무어의 법칙이라는게 있다. 무어가 인텔의 전 CEO인데 앞으로 인텔에서 나온 CPU는 성능이 1년에 2배씩 좋아질 것이다. 라고 했었고, 이 법칙을 지키기 위해 인텔이 엄청난 노력을 했었다. <br />
근데 이 법칙이 깨져서 매년 인텔에서 2배이상 빠른 CPU를 만들어 내지 못하게 됐다. 이유는 이미 집적도가 너무 높아졌기 때문인데 이 집적도는 CPU의 같은 면적에 얼마나 많은 트랜지스터를 집어 넣느냐가 관건인데 이 트랜지스터가 나노공정까지 굉장히 작게 만들었었는데 너무 작게 만들다보니 물리적 한계에 부딫히게 되었다. <br />

대표적으로 열이 많이 발생하게 되었고, 전자방해라고 해서 너무 집적도가 높다 보니 서로간에 전기적신호, 자기장이 발생하게 되어 잘 컨트롤 하기가 어려워졌다. <br />
그래서 이런 요소들로 인해서 CPU를 더 많이 집어 넣을 수가 없다. 그래서 현대의 CPU회사들(인텔, AMD)이 어떤 방식을 취했냐면 멀티코어로 가는 방향으로 취했다. <br />
하나의 코어를 더 빠르게 만들지 못하니까 여러개 만들자!로 바뀌어서 쿼드, 헥사, 옥타코어 등의 들이 나오게 되었다.<br />

그래서 공짜점심이라는 것은 무엇이냐면 가만히 있어도 컴퓨터가 2배씩 빨라지니까 프로그램이 가만히 있어도 (아무런 수정을 하지 않아도) 2배씩 빨라져서 공짜점심이라고 불렀다. <br />
근데 공짜점심이 끝났다는 것은 이제 가만히 있어도 2배씩 빨라지지 않는다는 것을 의미한다. 그래서 이제 CPU의 성능을 다 뽑아오기 위해서는 멀티스레드를 꼭 써야겠다. 라는 것이다. <br />

그런데 꼭 멀티 스레드를 쓰지 않아도 된다. 멀티 프로세스를 해도 된다. <br />
현재 윈도우 운영체제는 멀티프로세스를 제공하고 있다. 멀티 태스킹이라고 하는데 저번에 얘기 했었지만 지금 윈도우즈도 돌리고 있는 프로그램 수가 수십개가 된다 했었는데 <br />
이 얘기는 각각 돌아가는 프로세스가 싱글스레드여도 돌아가는 프로세스가 4개면 4개의 CPU가 각각 프로세스를 맡아서 돌릴 수 있다는 것이다. <br />

그렇다는 얘기는 1개의 프로세스가 4개의 스레드를 가지고 있는 것과, 4개의 프로세스가 1개의 스레드를 가지고 있는 것과 비슷하다는 얘기이다. <br />
물론 운영체제에서는 스레드와 프로세스를 돌리는 기준은 다르지만 비슷하다. <br />

그리고 현대 프로그래밍에서는 가상화가 잘 되기 때문에 가상화를 이용해서 싱글 스레드를 가지고 있는 프로세스를 수십, 수백개를 돌릴 수 있다. <br />
이걸 이용하면 굳이 멀티 스레드를 사용하지 않고, 싱글 스레드로 CPU의 성능을 최대한으로 끌어 올릴 수 있지만 모든 경우에 다 맞다는 아닌점 알아야 한다. <br />
상황에 따라 멀티 프로세스를 가야하는 상황이 있고, 멀티 스레드로 가야 하는 상황을 알아두어야 한다. <br />

다음에는 Select에 대해 알아보도록 하겠다. <br />


