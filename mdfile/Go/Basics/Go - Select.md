## 시작
지난번에 자동차 공장을 만들었었는데 그 중에 MakeTire()로 타이어를 만들었었는데 이 타이어는 자동차 타이어 외에도 다른 곳에서도 쓰일 수 있는데 <br />
만약 비행기 타이어도 만들 수 있다고 가정한다면 자동차 타이어 요청이 들어오면 자동차 타이어로, 비행기 타이어 요청이 들어오면 비행기 타이어로 만든다 가정해보자. <br />
그러니까 어떤 요청이 들어오냐에 따라서 어떤걸 만들지를 결정하는 것인데 이걸 어떻게 만들지 생각해보자! <br />

carChan이 있고, planeChan이 있다고 하고, Make Tire()라는 함수가 있다고 했을 때 Car Chan와 Plane Chan 두 개 다 기다리게 만들 수 있을까? <br />

가령 첫번째로 아래와 같이 car는 carChan을 기다리고 있다고 가정해보자. <br />

``` Go
func MakeTire() {
  car := <- carChan
  
}
```
이렇게 되었을 때 car는 carChan의 입력이 들어오기 전까지 대기하고 있게 된다. <br />

그 다음 밑에 plane을 받았다고 쳐보자. <br />

``` Go
func MakeTire() {
  car := <- carChan
  plane := <- planeChan
}
```

이렇게 되면 car의 input이 들어오지 않는 이상 plane은 입력이 들어온다 하더라도 처리되지 않는다. <br />

이걸 동시에 같이 기다릴 수 있게 해야 하는데 이걸 해주는게 **Select**이다. <br />
**Select**가 여러개 Channel을 동시에 기다리게 해준다. <br />

Select의 사용법은 Switch문과 비슷하다. <br />
다만 다른점은 Switch문에서는 변수의 값에 따라서 분기가 나눠지는 분기문이라고 한다면 <br />
Select는 기다리고 있는 Channel들을 여러개 걸어놓고 그 중에 하나가 나올 때 거기에 맞게 실행 시켜주는 구문이라고 생각하면 된다. <br />

이것을 실제로 사용해보자! <br />
기존에 만들었던 <code>carfactory/main.go</code>를 열어준다. <br />

그 후 Car struct외에도 Plane struct를 만들어준다. <br />

``` Go
type Plane struct {
	val string
}
```

그 후 MakeTire()에서 PlaneChan을 받을 수 있도록 넣어준다. <br />

``` Go
func MakeTire(carChan chan Car, planeChan chan Plane,outCarChan chan Car, outPlaneChan chan) {

}
```

그 다음 StartWork 함수를 StartCarWork()로 고쳐준 뒤, StartPlaneWork()도 밑에 추가해준다. <br />


``` Go
func StartCarWork(chan1 chan Car) {
	i := 0
	for {
		time.Sleep(1 * time.Second)
		chan1 <- Car{val: "Car" + strconv.Itoa(i)}
		i++
	}
}

func StartPlaneWork(chan1 chan Plane) {
	i := 0
	for {
		time.Sleep(1 * time.Second)
		chan1 <- Plane{val: "Plane" + strconv.Itoa(i)}
		i++
	}
}
```

그 후 MakeEngine() 부분도 수정해준다. <br />

``` Go
func MakeEngine(carChan chan Car, planeChan chan Plane,outCarChan chan Car, outPlaneChan chan Plane) {

}
```

main() 부분을 다음과 같이 수정해준다. <br />

``` Go
func main() {
	carChan1 := make(chan Car)
	carChan2 := make(chan Car)
	carChan3 := make(chan Car)

	planeChan1 := make(chan Plane)
	planeChan2 := make(chan Plane)
	planeChan3 := make(chan Plane)


	go StartCarWork(carChan1)
	go StartPlaneWork(planeChan1)
	go MakeTire(carChan1, planeChan1, carChan2, planeChan2)
	go MakeEngine(carChan2, planeChan2, carChan3, planeChan3)

	for {
		result := <-carChan3
		fmt.Println(result.val)
	}

}
```

그 후 MakeEngine()의 구문을 수정해줄 것인데 기존에는 <br />
``` Go
func MakeEngine(carChan chan Car, planeChan chan Plane,outCarChan chan Car, outPlaneChan chan Plane) {
	for {
		car := <-carChan
		car.val += "Engine, "

		outCarChan <- car
	}

}
```
이렇게 되어있을 것인데 지금은 비행기도 기다려야 하기 때문에 저기에 select를 넣어준다. <br />

``` Go
func MakeEngine(carChan chan Car, planeChan chan Plane, outCarChan chan Car, outPlaneChan chan Plane) {
	for {
		select {
		case car := <-carChan:
			car.val += "Engine_C, "
			outCarChan <- car

		case plane := <-planeChan:
			plane.val += "Engine_P, "
			outPlaneChan <- plane
		}
	}

}
```
자동차를 위한 엔진을 Engine_C, 비행기를 위한 엔진을 Engine_P로 수정했다. <br />

이와 똑같이 MakeTire()부분도 수정해주자! <br />

``` Go
func MakeTire(carChan chan Car, planeChan chan Plane, outCarChan chan Car, outPlaneChan chan Plane) {
	for {
		select {
		case car := <-carChan:
			car.val += "Tire_C, "
			outCarChan <- car

		case plane := <-planeChan:
			plane.val += "Tire_P, "
			outPlaneChan <- plane
		}
	}

}
```

지금까지 작업한 부분을 살펴보자면 Plane이라는 Struct를 만들었고, MakeTire()에 입력 채널 4개를 넣어주어 select문을 통해서 2개의 채널에 대한 입력을 기다리고 있고, 둘 중 어떤 값이 들어오냐에 따라 자동차용 타이어로 만들지, 비행기용 타이어로 만들지 결정해서 거기 해당하는 출력채널에 출력하는 함수를 만들었다. MakeEngine()도 마찬가지다. <br />

그리고 StartPlaneWork()이라는 함수를 만들고, main()에서 비행기용 채널, 자동차용 채널 각각 3개씩 만들어 돌렸다. <br />

이제 결과를 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104415327-2d287600-55b5-11eb-927c-f9b7a5088cc5.png" width = 70%> </img></p>
deadlock이 발생하게 되는데 이유는 출력 루틴이 막혀서 그런건데 main()쪽에서 출력하는 것을 보면 자동차만 출력하고 있어서 입력과 출력이 모두 막히게 된 것이다. 수정해보자!<br />

``` Go
func main() {
	carChan1 := make(chan Car)
	carChan2 := make(chan Car)
	carChan3 := make(chan Car)

	planeChan1 := make(chan Plane)
	planeChan2 := make(chan Plane)
	planeChan3 := make(chan Plane)

	go StartCarWork(carChan1)
	go StartPlaneWork(planeChan1)
	go MakeTire(carChan1, planeChan1, carChan2, planeChan2)
	go MakeEngine(carChan2, planeChan2, carChan3, planeChan3)

	for {
		select {
		case result := <-carChan3:
			fmt.Println(result.val)

		case result := <-planeChan3:
			fmt.Println(result.val)
		}
	}

}
```

이제 출력시켜보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104415647-b8a20700-55b5-11eb-9e3d-9f03ace8e93c.png" width = 70%> </img></p>
1초에 한 번씩 자동차와 비행기가 생산 되는것을 알 수 있다. <br />

select 문의 또 다른 구문을 살펴보자! <br />
어떤 일을 계속 하고 있는데 어떤 입력이 들어오면 그 입력을 처리하고, 입력이 없으면 하던 일을 계속 하게 할 수도 있다. <br />

이번엔 폴더를 새로 만들어서 <code>select/main.go</code>를 만들어준다. <br />

``` Go
func main() {
	c := make(chan int)
	for {
		select {
		case v := <-c:
			fmt.Println(v)
		default:
			fmt.Println("Idle")
			time.Sleep(1 * time.Second)

		}

	}

}
```
먼저 c라는 int형 채널을 만들어 준 뒤 c에 입력값이 있으면 출력시켜주고, 없을 때(또는 일반적인 경우)에는 default에 넣어주는데 Idle을 1초씩 쉬면서 출력시키도록 해준다. <br />

그 후 입력을 넣어주는 push()함수를 만들어서 무한루프를 돌면서 2초 간격으로 c에 입력을 넣어주도록 한다. <br />

``` Go
func push(c chan int) {
	i := 0
	for {
		time.Sleep(2 * time.Second)
		c <- i
		i++
	}
}
```

그 후 main()에 push()를 go Thread에 넣어 별도로 진행 되도록 넣어준다. <br />
``` Go
func main() {
	c := make(chan int)
  
	go push(c)
  
	for {
		select {
		case v := <-c:
			fmt.Println(v)
		default:
			fmt.Println("Idle")
			time.Sleep(1 * time.Second)

		}

	}

}
```

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104417290-762df980-55b8-11eb-9691-4e3600279f99.png" width = 70%> </img></p>
결과를 보면 Idle을 출력 했다가 0을 출력하고, Idle을 출력했다가 1를 출력하는 형태를 볼 수 있다. <br />
이와 같이 어떤일을 하고 있다가 입력이 들어오면 그걸 처리하고, 하던 일을 계속 하는 형태를 select로 만들 수 있다. <br />

그리고 Go의 Time패키지에는 어떤 시간 간격으로 반복하는 것을 빠르게 해주기 위해서 **Tick**이라는 것과 **After**를 제공하고 있는데 이것은 채널을 제공해주는 것인데 <br />
**Tick**의 경우 어떤 일정한 시간 간격으로 알려주는 채널을 제공해주고 있고, **After**는 어떤 특정 시간 이후에 한 번만 알려주는 채널을 제공해주고 있다. <br />
이 것들을 이용하면 일정한 시간 간격으로 반복하는 것을 편하게 만들 수 있다. <br />

이것을 활용하기 앞서 이것과 관련된 문서를 살펴보자. <br />
> * [After](https://golang.org/pkg/time/#After) <br /> 
> * [Tikc](https://golang.org/pkg/time/#Tick) <br />

After의 경우 입력이 Duration, 어떤 시간 간격을 받고, 결과는 Time 채널을 반환하는 함수이다. <br />
After의 예제를 살펴보면 <br />

``` Go
package main

import (
	"fmt"
	"time"
)

var c chan int

func handle(int) {}

func main() {
	select {
	case m := <-c:
		handle(m)
	case <-time.After(10 * time.Second):
		fmt.Println("timed out")
	}
}
```
평상 시에는 c의 입력을 handle()하고, 10초 이후에 timed out을 출력하는 구문을 만들 수 있게 된다. <br />
이것을 활용해보자! <br />

``` Go
func push(c chan int) {
	i := 0
	for {
		time.Sleep(1 * time.Second)
		c <- i
		i++
	}
}

func main() {
	c := make(chan int)
	go push(c)
	for {
		select {
		case v := <-c:
			fmt.Println(v)
		case <-time.After(10 * time.Second):
			fmt.Println("time out")
			return
		}

	}

}
```
push()에서 1초마다 값을 넣도록 수정했고, main()에서 채널에 input이 있는 경우 10초 뒤에 종료 되도록 수정했다. <br />

결과를 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104418382-28b28c00-55ba-11eb-92fa-da98f5801725.png" width = 70%> </img></p>

멈추지 않고 계속 값이 들어가는 걸 확인할 수 있다. 

``` Go
func After(d Duration) <-chan Time {
	return NewTimer(d).C
}
```

이렇게 된 원인은 After의 결과가 chan Time이 나오고 있고, 함수의 내용을 보게 되면 NewTimer(d).C를 반복하고 있다. <br />
NewTimer()라는 것은 새로운 타이머를 만들겠다는 것이고, 그 새로운 타이머에 C라는 채널을 return하고 있다. <br />
이게 무슨 얘기냐면 After()를 호출할 때마다 새로운 타이머가 만들어져서 그 타이머에 채널을 반환하고 있다는 얘기이다. <br />

그러니까 `<-time.After(10 * time.Second):`를 했을 때 10초 뒤에 입력이 오는 채널을 반환 했는데 그 반환값에 입력을 뽑아보니 처음에는 아무것도 없기 때문에 return 되어 for문을 다시 돌게 된다. <br />
그러면 또 `<-time.After(10 * time.Second):`에서 새로운 타이머를 만들게 되고, 또 다시 안걸리게 된다. <br />
이것이 반복이 되어 `<-time.After(10 * time.Second):`는 영원히 호출이 되지 않게 된다. <br />

이것을 해결하려면 처음에 `<-time.After(10 * time.Second):` 여기에서 만들어진 채널을 가지고 있다가 그 채널에서 입력 값이 있는지 확인해야 한다. <br />

코드를 다음과 같이 수정해준다. <br />

``` Go
func main() {
	c := make(chan int)
	go push(c)

	timerChan := time.After(10 * time.Second)

	for {
		select {
		case v := <-c:
			fmt.Println(v)
		case <-timerChan:
			fmt.Println("time out")
			return
		}

	}

}
```


timerChan를 만들어서 timerChan에서 입력값이 있는지 확인하여 매번 새로 만드는게 아니라 한번 만들어진 것을 재활용하여 계속 살펴보게 한다. <br />

다시 실행하여 결과를 살펴보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104419359-b5117e80-55bb-11eb-91ee-b13d3e67c4ce.png" width = 70%> </img></p>
이전과 다르게 time out이 일어나는 것을 알 수 있다. <br />

이번에는 일정 주기 간격으로 나오는 Tick을 사용해보자! <br />

``` Go

func main() {
	c := make(chan int)
	go push(c)

	timerChan := time.After(10 * time.Second)
	TickTimerChan := time.Tick(2 * time.Second)

	for {
		select {
		case v := <-c:
			fmt.Println(v)
		case <-timerChan:
			fmt.Println("time out")
			return
		case <-TickTimerChan:
			fmt.Println("Tick")
		}

	}

}
```

2초마다 반복되는 TickTimerChan을 만들어주고, TickTimerChan에 입력이 있는 경우 Tick을 출력 시켜 주도록 해보자! <br />

이제 실행을 하여 결과를 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/104419735-3b2dc500-55bc-11eb-9e99-b1fbd43119b4.png" width = 70%> </img></p>
이렇게 2초 간격으로 tick이 반복 되다가 10초가 될 때 time out되는 것을 알 수 있다. <br />

이렇게 일정 주기 간격으로 어떤일을 반복하는 것과, 특정 시간 이후에 일을 할 수 있는 타이머가 있다는 것을 알아두면 된다. <br />

이로써 Golang에서 제공하는 멀티 스레드용 프로그래밍에서 제공하는 Go Thread, Channel, Select에 대해 알아 보았다. <br />

다음에는 OOP에 대해 알아보도록 하겠다! Golang에서 OOP는 어떻게 사용하는지, OOP에 대한 전반적인 것과 Golang의 OOP는 일반적인 OOP와 어떻게 다른 것인지를 몇차례에 걸쳐 알아보도록 하겠다.<br />
