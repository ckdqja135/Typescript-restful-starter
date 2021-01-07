## 시작
이번에는 DeadLock에 대해 해볼 것인데 여기서 Dead는 '죽었다'의 표현이 아니라 막다른 길을 표현할 때 'Dead end'라고 표현을 하는데 그 때의 'Dead'와 같은 의미이다. <br />
그래서 Lock이 막혔다라고 보면 된다. <br />

이 DeadLock은 멀티 스레드 프로그램을 할 때 발생 할 수 있는 치명적인 버그 중에 하나인데 이 DeadLock의 원인과 발생이유를 알아보기 전에 DeadLock을 발생시켜보자. <br />

기존 코드에서 몇가지만 고쳐보도록 하자! <br />
account 만들었을 때 잡아놨던 Lock을 빼준다. <br />

``` Go
package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type Account struct {
	balance int
	mutex   *sync.Mutex
}

func (a *Account) Widthdraw(val int) {
	a.balance -= val
}

func (a *Account) Deposit(val int) {
	a.balance += val
}

func (a *Account) Balance() int {
	balance := a.balance

	return balance
}

var accounts []*Account

func Transfer(sender, receiver int, money int) {
	accounts[sender].Widthdraw(money)
	accounts[receiver].Deposit(money)
}

func GetTotalBalance() int {
	total := 0
	for i := 0; i < len(accounts); i++ {
		total += accounts[i].Balance()
	}
	return total
}

func RandomTransfer() {
	var sender, balance int
	for {
		sender := rand.Intn(len(accounts))
		balance = accounts[sender].Balance()
		if balance > 0 {
			break
		}
	}
	var receiver int
	for {
		receiver = rand.Intn(len(accounts))
		if sender != receiver {
			break
		}
	}

	money := rand.Intn(balance)
	Transfer(sender, receiver, money)
}

func GoTransfer() {
	for {
		RandomTransfer()
	}
}

func PrintTotalBalance() {
	fmt.Printf("Total: %d\n", GetTotalBalance())
}

func main() {
	for i := 0; i < 20; i++ {
		accounts = append(accounts, &Account{balance: 1000, mutex: &sync.Mutex{}})
	}

	for {
		PrintTotalBalance()
		time.Sleep(100 * time.Millisecond)
	}
}
```

이렇게 한 뒤 main()에서 함수 2개를 생성해준다. <br />

```  Go
func main() {
	for i := 0; i < 20; i++ {
		accounts = append(accounts, &Account{balance: 1000, mutex: &sync.Mutex{}})
	}
	go func() {
		for {
			Transfer(0, 1, 100)
		}
	}()

	go func() {
		for {
			Transfer(1, 0 ,100)
		}
	}()

	for {
		PrintTotalBalance()
		time.Sleep(100 * time.Millisecond)
	}
}
```
이렇게 익명함수를 Go스레드에 만들어주고, for문으로 무한루프를 돌려준다. <br />
이렇게 하면 한 쪽에서는 계속 0번에서 1번으로 100원씩 무한루프를 돌면서 보내주고, 다른 한 쪽에선 1번에서 0번으로 100원씩 보내는 프로그램이 된다. <br />

그리고 실제로 보냈는지 안보냈는지 확인하기 위해

```Go
	for {
		PrintTotalBalance()
		time.Sleep(100 * time.Millisecond)
	}
```
여기에서 찍는게 아니라 <br />

``` Go
func Transfer(sender, receiver int, money int) {
	accounts[sender].Widthdraw(money)
	accounts[receiver].Deposit(money)

	fmt.Println("Transfer", sender, receiver, money)
}
```
여기에 찍어준다. <br />

그 후 실행시켜보자! <br/>
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103842045-4d00fb00-50d8-11eb-9785-c2188d03fcc5.png" width = 70%> </img></p>
그러면 위의 행위들이 무한으로 진행하는 것을 알 수 있다. <br />

여기에 Lock을 추가하여 보낼 때 먼저 보내는 쪽에 Lock을 잡고, <br />
``` Go
func Transfer(sender, receiver int, money int) {
	accounts[sender].mutex.Lock()
	accounts[receiver].mutex.Lock()
	
	accounts[sender].Widthdraw(money)
	accounts[receiver].Deposit(money)

	fmt.Println("Transfer", sender, receiver, money)
}
```
받는쪽에 바로 Lock을 잡아서 2개를 확보한 다음에 보내준다. <br />

왜냐하면 빼고 난다음에 넣을 때 <br />

``` Go
	accounts[sender].Widthdraw(money)
	accounts[receiver].Deposit(money)
```

이 사이에 다른 스레드가 껴들 수 있기 때문에 이 사이를 확실히 막기 위해서 sender와 receiver를 빼기전과 넣기전에 미리 한꺼번에 잡아주는 것이다. <br />
그 다음 Unlock()을 시켜준다. <Br />

``` Go
func Transfer(sender, receiver int, money int) {
	accounts[sender].mutex.Lock()
	accounts[receiver].mutex.Lock()

	accounts[sender].Widthdraw(money)
	accounts[receiver].Deposit(money)

	accounts[sender].mutex.Unlock()
	accounts[receiver].mutex.Unlock()

	fmt.Println("Transfer", sender, receiver, money)
}
```
그 다음에 저 사이에 1초동안 Sleep할 수 있도록 time을 추가해준다. <br />

``` Go
func Transfer(sender, receiver int, money int) {
	accounts[sender].mutex.Lock()
  time.Sleep(1000* time.Microsecond)
	accounts[receiver].mutex.Lock()

	accounts[sender].Widthdraw(money)
	accounts[receiver].Deposit(money)

	accounts[sender].mutex.Unlock()
	accounts[receiver].mutex.Unlock()

	fmt.Println("Transfer", sender, receiver, money)
}
```

이제 실행시켜보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103843171-b1bd5500-50da-11eb-970f-53be047237d3.png" width = 70%> </img></p>
Lock을 잡은다음에 출력을 하려고 하니 출력이 되지 않는 모습을 볼 수 있다. <br />

``` Go
func Transfer(sender, receiver int, money int) {
	accounts[sender].mutex.Lock()
	fmt.Println("Lock", sender)
	time.Sleep(1000 * time.Microsecond)
	accounts[receiver].mutex.Lock()
	fmt.Println("Lock", receiver)

	accounts[sender].Widthdraw(money)
	accounts[receiver].Deposit(money)

	accounts[sender].mutex.Unlock()
	accounts[receiver].mutex.Unlock()

	fmt.Println("Transfer", sender, receiver, money)
}
```
그러면 위와 같이 작성하여 어떤 Lock을 잡았는지 확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103847993-c0106e80-50e4-11eb-818c-c0f8774563c8.png" width = 70%> </img></p>
1, 0 번을 잡았는데 그 이후로 진행이 되지 않는 모습을 볼 수 있다. <br />
프로그램이 동작하지 않는 모습을 보여주고 있는데 지금 상태가 Lock이 막혔기 때문에 더 이상 진행이 되지 않는 것이다. <br />
이것이 바로 **DeadLock** 현상이다. <br />

그러면 이 DeadLock이 왜 발생한 것인지 알아보자! <br />
DeadLock을 설명할 때 가장 대표적으로 드는 예가 **철학자의 식사시간**이라는 것이 있는데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103848202-301ef480-50e5-11eb-8950-3926c4aa44f3.png" width = 70%> </img></p>
위와 같이 식탁과 각자 자리에 스파게티가 있는데 철학자들은 양손에 포크가 있어야 밥을 먹을 먹을 수 있다. <br />

그런데 이 철학자들이 항상 먼저 왼쪽손으로 왼쪽에 있는 포크를 들고, 그 다음 오른쪽손으로 오른쪽 포크를 들고 먹는다고 가정해보자. <br />
그러면 동시에 왼쪽에 있는 포크를 들게 될 것이다. 그 후 오른쪽에 있는 포크를 들려고 할 때 각자 왼손에 포크를 쥐고 있는 상태이므로 오른쪽에 있는 사람이 포크를 놓을 때 까지 기다리게 될 것이다.<br />
모두가 왼손에 포크를 들고 있기 때문에 결국에는 모든 철학자들은 아무도 밥을 못먹고 멈춰있는 상태가 된다. <br />
이게 바로 DeadLock을 설명하는 부분인데 자기 왼쪽에 있는 것을 Lock을 잡고, 그 다음 오른쪽에 있는 Lock을 잡아야 하는데 모두가 그렇게 하다 보니 오른쪽에 있는 것을 영원히 잡을 수 없는 이 상태를 **DeadLock** 이라고 한다. <br />

그러면 우리가 만든 코드에서 뭐가 문제인지 알아보자. <br />

``` Go
Transfer(0, 1, 100)
Transfer(1, 0, 100)
```
이렇게 0번에서 1번, 1번에서 0번으로 100원씩 보냈다. 그래서 처음에 0번을 Lock을 잡고, 1번을 잡을려고 시도를 할 것이다. <br />
CPU1과 CPU2가 있다 가정했을 때 아래와 같다. <br />

|CPU1| CPU2  |
|--|--|
| Lock 0  | Lock 1  |
| Lock 1  | Lock 0  |

이게 동시에 일어난다 가정하면 CPU1입장에선 0번을 잡고 1번을 잡으려 했더니 이미 CPU2에서 잡고 있기 때문에 CPU2가 Lock을 풀어줄 때 까지 기다리게 되고, CPU2도 1번을 잡고, 0번을 잡아야 하기 때문에 CPU1번이 풀어줄 때 까지 기다리고 있는 상태가 된다. 양쪽이 모두 상대방이 Lock을 놓을 때 까지 기다리고 있기 때문에 영원히 프로그램이 진행이 안되는 DeadLock상황이 된다. <br />

그런데 아까도 봤겠지만 <br />

``` Go
func Transfer(sender, receiver int, money int) {
	accounts[sender].mutex.Lock()
	// time.Sleep(1000 * time.Microsecond)
	accounts[receiver].mutex.Lock()  

```
`time.Sleep(1000 * time.Microsecond)` 부분에 시간간격을 띄우지 않았다면 잘 돌아가나 언제 멈출 지 모르는 프로그램이 된다. <br />

그러니까 <br />

``` Go
func Transfer(sender, receiver int, money int) {
	accounts[sender].mutex.Lock()
	accounts[receiver].mutex.Lock()  
}
```
이 코드 자체가 문제가 되는 코드인데 이 문제가 언제 발생할 지 모른다는 것이다. <br />

일반적으로 처음 만들어서 테스트 할 때는 잘 되다가 실제로 그 서비스를 오픈 하려고 하는 순간 문제가 터지게 되는 일들이 많이 발생한다. <br />
이 DeadLock이라는 것은 눈에 잘 보이지 않는다. 프로그램이 실행할 때 버그가 바로 발생하는게 아니라 간혈적으로 발생하기 때문이다. <br />
그렇기 때문에 이 DeadLock이 발생했을 때 잡기가 굉장히 힘들고, 지금 상황에서는 Lock이 바로 보이니 어디가 문제인지 알 수 있지만 <br />
실제 실무에서는 코드가 훨씬 복잡하기 때문에 어떤 부분에서 충돌이 났는지 파악하기가 힘들다. <br />

결국엔 이 DeadLock을 막으려면 Lock을 잘 잡아야 하는데 지금 처럼 저렇게 잡으면 안된다. <br />
그래서 DeadLock을 잡으려면 Lock을 작게 잡거나 크게 잡아야 하는데 <br />

``` Go
func (a *Account) Widthdraw(val int) {
	a.mutex.Lock()
	a.balance -= val
	a.mutex.Unlock()
}

func (a *Account) Deposit(val int) {
	a.mutex.Lock()
	a.balance += val
	a.mutex.Unlock()
}
```
예전에 했던거 처럼 빼고, 넣는곳에서 Lock을 잡다고 했을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103851666-a293d280-50ed-11eb-9232-f20e22544a67.png" width = 70%> </img></p>
Lock을 작게 잡았기 때문에 DeadLock 상황이 발생하지 않게 된다. <br />
이 부분이 Lock을 작게 잡아서 사용하는 방법이고 <br />

Lock을 크게 잡는 방법은 저번에 했던거 처럼 globalLock을 만드는 방법인데 <br />

``` Go
var globalLock *sync.Mutex

func Transfer(sender, receiver int, money int) {
	globalLock.Lock()
	accounts[sender].Widthdraw(money)
	accounts[receiver].Deposit(money)
	globalLock.Unlock()
	fmt.Println("Transfer", sender, receiver, money)
}

func main() {
	for i := 0; i < 20; i++ {
		accounts = append(accounts, &Account{balance: 1000, mutex: &sync.Mutex{}})
	}

	globalLock = &sync.Mutex{}

	go func() {
		for {
			Transfer(0, 1, 100)
		}
	}()

	go func() {
		for {
			Transfer(1, 0, 100)
		}
	}()

	for {
		PrintTotalBalance()
		time.Sleep(100 * time.Millisecond)
	}
}
```
이렇게 만들어주면 마찬가지로 DeadLock 현상을 피할 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103851666-a293d280-50ed-11eb-9232-f20e22544a67.png" width = 70%> </img></p>

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103848202-301ef480-50e5-11eb-8950-3926c4aa44f3.png" width = 70%> </img></p>
작게 잡는다 라는 것은 위의 그림으로 설명하자면 포크 두개를 한꺼번에 잡는게 아니라 하나만 잡아 밥을 먹고, 다시 내려놓고를 반복하는 것이고 <br />
크게 잡는것은 포크 2개를 놓고, 한 사람씩 가서 포크를 확보한 다음에 밥을 먹고, 반납하면 다른사람이 가져가서 밥을 먹는 형태이다. <br />

하지만 실제 실무에서는 위와 같이 단순하게 해결 할 수 있는 방법은 많지 않다는 것을 알아두자! <br />

그래서 이 문제를 해결하기 위해서 근본적인 문제를 보면 저번 시간에 여러 사람이 공유된 자원을 사용하기 때문에 헝클어진다고 말했었는데 <br />

이번엔 다르게 접근을 해보자. <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103853208-dfad9400-50f0-11eb-822a-a7edf8dbe44b.png" width = 70%> </img></p>
커다란 도화지에 4명이 한꺼번에 달려들어 그림을 그리는게 아니고, 먼저 1번이 그림을 아래 그림만큼 그리는 것이다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103853375-403cd100-50f1-11eb-8221-239b8d53ece6.png" width = 70%> </img></p>
그리고 이 종이를 2번에게 주어 2번이 아래의 그림만큼 사용하고 3번에게 넘겨주고<br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103853482-809c4f00-50f1-11eb-8529-978f4504a818.png" width = 70%> </img></p>
3번이 받으면 아래의 그림만큼 사용하고 4번에게 넘겨주면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103853531-a6295880-50f1-11eb-9460-016648bc9245.png" width = 70%> </img></p>
4번이 마지막으로 그리게 되면 하나의 그림이 완성될 것이다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103853575-c2c59080-50f1-11eb-8fca-3ae698926a9c.png" width = 70%> </img></p>
이 처럼 하나의 종이를 돌아가며 한 바퀴를 돌았을 때 완성되는 식으로 접근할 수도 있다. <br />

이 방식은 공장 컨베이어 벨트 방식으로 만든다고 보면 된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103853859-6747d280-50f2-11eb-9837-84ae7db5d0b0.png" width = 70%> </img></p>
그래서 자기 차례가 오면 각자 맡은 일이 달라 자기에게 맡겨진 자원만 건드리기 때문에 서로 자원이 충돌 될 일이 없고, 속도면에서도 물건이 계속 움직이고 있고, 자기가 할 일만 끝내고 넘기는 식이라 자원을 독점하는 형태가 아니기 때문에 효율적이라고 볼 수 있다. <br />

이런식으로도 접근 할 수 있는데 이런 형태의 패턴을 **생산자-소비자 패턴(roducer-Consumer Pattern)**이라고 한다. <br />
한쪽에서 자원을 넘기면 소비자쪽에서 자원을 소비하는 패턴이라 생각하면 되는데 <br />
Go에서는 이러한 형태의 프로그램을 만들기 좋게 하기 위해서 [채널(Channel)](http://pyrasis.com/book/GoForTheReallyImpatient/Unit34)을 제공해준다. <br />

이 채널이라는 것은 일종의 큐(Queue)로 보면 되는데 이 큐를 제공한다 생각하면 된다. <br />
그래서 생산자-소비자 패턴을 만들 때 가장 중요한 것이 큐인데 아까 컨베이어 벨트에 대해 얘기를 했었는데 그 컨베이어 벨트가 큐라고 보면 된다. <br />

FIFO형태로 물건이 들어가면 들어간 순서대로 물건이 나오는 형태인데 2개의 스레드가 있을 때 어떤 물건이 들어와서 자기가 속한 작업을 한 뒤 넘겨줄 때 큐에 담아서 주게 된다. <br />
그래서 넘겨줄 때는 큐에 Push하고, 받을 때는 큐에 Pop을 하고, 다시 넘겨줄 때는 Push하는 식이 된다. <br />
이런식으로 중간에서 스레드 간에 정보를 주고 받을 수 있게 해주는 큐가 제일 중요하며 스레드간에 정보를 넣고, 빼기를 하기 때문에 스레드간에 충돌이 없어야 한다. <br />
그렇기 때문에 이 큐를 얼마나 안정적이면서 성능을 빠르게 만드느냐가 중요한데<br />

Go에서는 이것을 이미 만들어서 언어자체에서 가장 효율적이고 가장 빠르고 안정적인 큐를 만들어서 제공해주고 있는 것을 채널이라고 하고 <br />
Thread Safe한 멀티 스레드 환경에서 안전하게 쓸 수 있고, Fixed Size라고 해서 큐가 size가 정해져 있는데 10개 짜리를 만들면 물건을 10개를 넣을 수 있고, 1개 짜리를 만들면 1개 까지만 넣을 수있다. <br />

그래서 channel이라는 것은 Go에서 제공하는 Thread Safe하고, Fixed Size이고, 성능이 매우 뛰어난 큐라고 보면 된다. <br />

이 큐를 사용해서 프로그래밍 하는 방법은 다음 시간에 설명하도록 하겠다. <br />


