## 시작
이번에는 저번에 이어서 쓰레드에 더 자세히 알아보는 시간을 갖아보자! <br />

먼저 헷갈릴 수 있는 부분이 있기 때문에 용어 정리 부터 진행하자. <br />

프로그램이 있고, 프로세스가 있고, 쓰레드가 있다. 이 용어들의 차이를 알아보자. <br />
프로그램과 프로세스는 비슷한 개념이지만 프로그램이 좀 더 큰 개념이라 볼 수 있고 <br />
`프로그램 ≥ 프로세스` <br />
프로세스는 스레드를 가지고 있다. 또한 여러개의 스레드를 가질 수 도 있다. <br />

그러면 프로그램이 뭔지 부터 알아보자. <br />
우리가 어떤 프로그램이라고 하면 게임, 음악, 그림쪽의 프로그램이 있는데 이 프로그램에 의미 안에는 실행파일 + 데이터가 포함 되어 있다. 그러니까 이 두개를 합친 것을 프로그램이라고 부른다. <br />

그래서 대부분의 프로그램들을 보면 하나의 실행파일을 갖는 경우가 있지만 꼭 하나의 실행 파일만 가질 필요는 없다. <br />
프로그램이라고 하는 것은 어떤 논리적, 객관적인 개념들을 묶은 것이기 때문에 가령 Zip파일을 압축하는 프로그램을 다 포함하고 있지만 압축파일 안에는 여러가지 실행 파일로 이루어 질 수 있다. <br />
어떤 프로그램은 UI를 제공하는(윈도우 창을 제공하는) 실행파일이 있고, 어떤 프로그램은 커맨드라인 형태로 되어있는 실행파일도 포함하고 있을 수 있다. <br />

그래서 프로그램이라고 하는 것은 굳이 꼭 하나의 실행파일로 되어 있을 필요는 없다. <br />

그렇다면 프로그램이 실행되는 과정을 알아보자. 그러니까 OS(여기서는 Windows)입장에서 어떤 사용자가 아이콘을 더블클릭해서 프로그램을 실행한다는게 OS입장에서 어떤 의미인지 살펴보자.<br />
우리가 아이콘을 더블 클릭해서 프로그램을 실행하게 되면 OS는 어떤일을 하냐면 그것의 실행파일인 .exe파일을 메모리에 올린다. 이것을 메모리에 Load한다, 메모리에 적재한다. 라고 표현하는데 <br />
그리고 OS는 실행파일의 시작위치(I.P 포인트)를 가지고 있어서 메모리에 표시해놓고 거기서 부터 한 줄씩 한 줄씩 CPU를 통해 실행한다. <br />
그래서 메모리에 적재된 실행파일을 **프로세스** 라고 한다. <br />

다시 정리하자면 프로그램이라는 것은 개념적인, 논리적인 개념인데 어떤 하나의 기능을 묶어놓은 App이라 생각하면 되고, 프로세스는 이 프로그램을 이루고 있는 실행파일이 메모리에 적재 되서 <br />
CPU를 통해 실행되고 있는 상태가 프로세스이다. <br />
그리고 이 프로세스는 스레드 여러개를 가질 수 있다. <br />
윈도우 작업관리자에서 각 프로세스가 갖는 스레드 수를 알 수 있는데 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103328831-a3998400-4a9d-11eb-86a2-39db45804576.png" width = 70%> </img></p>
위와 같이 세부정보 탭에 들어가 아래 CPU, PID, 상태가 표시된 부분에 우클릭을 하면 열 선택이라는게 있는데 <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103328868-cd52ab00-4a9d-11eb-837a-4879863cb296.png" width = 70%> </img></p>
거기서 위와 같이 스레드에 체크를 해주면 다음과 같이 스레드의 수를 알 수 있다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103328898-e65b5c00-4a9d-11eb-9d41-5bf658b09bff.png" width = 70%> </img></p>

대부분의 프로그램들은 한 개 이상의 스레드를 갖고 있는 것을 볼 수 있다. <br />

스레드의 장점은 CPU의 성능을 최대한 끌어 올려서 쓸 수 있다는 장점이 있지만 그러니까 노는 CPU가 없도록 모두가 바쁘도록 만들 수 있다는 장점이 있지만 <br />
단점은 데이터 동기화(Synchnoize) 문제가 있다. <br />
예를 들어 어떤 백지가 있다 가정하면 아이 두명에게 이 한장의 종이에 각자 그림을 그려도 되고, 원래 있던 그림을 지워도 된다 가정하면 서로 좋아하는 것들을 그려갈 것이다. <br />
그러다 서로 상대 영역에 침범하게 될 것이고, 지워도 된다 했으니 상대방 그림을 지우고 자기꺼 그리고, 상대방도 그렇게 할 것이다. <br />
그렇게 되니 엉망진창이 되고 말 것이다. <br />

이 처럼 두 개의 쓰레드가 하나의 같은 메모리를 사용하고 있는 상황이다. 프로그램 당 메모리는 하나씩 할당되는데(이걸 가상메모리라고 한다.) OS는 프로그램이 실행 할 때 하나의 메모리 영역(백지)을 잡아준다. <br />
근데 쓰레드는 하나의 메모리영역에 있지만 프로그램은 쓰레드가 여러개 있기 때문에 이 쓰레드들은 같은 메모리 영역을 사용하게 된다. 같은 백지를 두 명의 아이가 같이 사용하고 있다 생각하면 된다. <br />
이 메모리를 각자가 마구잡이로 조정하기 때문에 상태가 엉망진창이 될 수 있다. <br />

이걸 예제코드로 알아보자 대표적으로 예를 드는 것중에 송금문제가 있다. 한번 코드를 살펴보자! <br />

account폴더를 생성 후 main.go를 생성해준다. <br />

``` Go
package main

type Account struct { // 1
	  balance int
}

func(a *Account) Widthdraw(val int) { // 2 
  a.balance -= val
}

func(a *Account) Deposit(val int) { // 3
  a.balance += val
}

func(a *Account) Balance() int { // 4
  return a.balance
}

var accounts []*Account // 5

func Transfer(sender, receiver int, money int) { // 6
  accounts[sender].Widthdraw(money)
  accounts[receiver].Deposit(money) 
}

func GetTotalBalance() { // 7
  total := 0
  for i := 0; i < len(accounts); i++ {
    total += accounts[i].Balance()
  }
  return total
}

func RandomTransfer() { // 8
  var sender int
  for {
    sender := rand.Intn(len(accounts))
    if accounts[sender].Balance() > 0 {
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
  
  money := rand.Intn(accounts[sender].Balance())
  Transfer(sender, receiver, money)
}

func GoTransfer() { // 9
  for {
    RandomTransfer()
  }
}

func PrintTotalBalance() { // 10
  fmt.Printf("Total: %d\n", GetTotalBalance())
}

func main() { // 11
  for i := 0; i < 20; i++ {
    accounts = append(accounts, &Account{balance:1000})
  }
  
  PrintTotalBalance()
  
  for i := 0; i < 10; i++ {
    go GoTransfer()
  }
  
  for {
    PrintTotalBalance()
    time.Sleep(100 * time.Millisecond)
  }
}
```
1 : Account라는 struct를 생성해준다. Account는 은행 계좌이다. 이 안에는 잔액(balance)이라는 항목이 있다.<br />
2 : 그 후 widthdraw(인출)메소드를 만들어주고, 인출 하고 싶은 양을 받아온다. 인출이 완료되면 balance를 빼준다. <br />
3 : Deposit(입금)메소드를 만들어주고, 입금 하고 싶은 양을 받아온다. 입금이 완료되면 balance를 더해준다. <br />
4 : 잔액을 확인하는 Balance 메소드를 만들어준다. <br />
5 : 그 후 Account 포인터 슬라이스 형태의 accounts라는 전역 변수를 만들어준다. <br />
6 : 그 다음 송금 함수를 만든다. sender(송금자)가 있고, receiver(받는자)가 있고, 송금하는 액수를 받는다. <br />
    이 함수는 accounts배열의 sender에서 Widthdraw를 한 다음에 돈을 빼고, accounts배열의 receiver에게 Deposit를 해준다. <br />
7 : 그 다음 전체 잔액량을 가져오는 함수를 만들어준다. <br />
8 : RandomTranfer함수를 만들어주는데 account중에 랜덤하게 뽑은 sender의 돈을 뽑아서 랜덤하게 뽑은 receiver에게 돈을 보내는 함수이다. 송금을 막 해보는 거라 생각 하면 된다.<br />
    [rand](https://golang.org/pkg/math/rand/)는 여기에서 참고하여 사용했다. <br />
    이것을 저장하면 자동으로 Visual Studio가 자동으로 import 시켜줄 것이다. <br 
    sender를 무작위로 뽑은다음에 이 sender가 잔액이 있는지 부터 확인해 준다. 잔액이 있는 sender를 찾을 때까지 무한히 반복한다. <br />
    그 다음 receiver를 찾을 것인데 sender와 같으면 안되니까 서로 다른 애를 찾을 때 까지 무한히 반복한다. <br />
    그리고 송금하는 양도 랜덤하게 뽑아주는데 보내는 사람의 잔액만큼보다 작게 송금시켜준다. <br />
    
9 : GoTransfer라고 아무렇게나 이름을 지었는데 이 함수는 무한히 RandomTransfer()를 호출 해주는 역할을 한다. <br />
10 : TotalBalance를 계속 출력해주는 함수이다. <br />
11 : 마지막으로 main함수를 만들어주는데 여기서 처음에 accounts를 초기화 시켜주는데 Account의 balance를 1000으로 초기화 시켜준 뒤 append해서 20개를 만들어준다. <br />
     그 후 PrintTotalBalance()로 출력을 찍어 준 뒤 Go Thread 10개를 만들어준다. <br />
     그리고 PrintTotalBalance()를 하는데 매번 찍어주면 너무 많이 나오기 때문에 잠깐 쉬어가며 찍어주도록 한다. <br />
     [sleep](https://golang.org/pkg/time/#Sleep)을 참고했다. <br />
    
이 후 저장 후 실행시켜보자! <br />

<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103332629-16aaf680-4aae-11eb-9696-f8fc12f20c68.png" width = 70%> </img></p>
보면은 20000이라는 숫자가 반복되다가 숫자가 들쭉날쭉하게 됐다. <br />
똑같이 빼서 똑같이 넣는데 왜 갑자기 숫자가 마구잡이로 바뀌게 되는 것일까? <br />

이게 바로 메모리가 헝크러졌기 때문이다. 여러 스레드가 마구잡이로 건드려서 메모리가 엉망진창이 되었기 때문이다. <br />

``` Go
  for i := 0; i < 10; i++ {
    go GoTransfer()
  }
```
에서 go Thread 10개를 만들게 되고 이 10개가 무한루프를 돌면서 RandomTransfer()함수를 호출시킨다. <br />

Account가 20개가 있고, 각각의 Balance가 1000씩 가지고 있다. 이거는 메모리상에 데이터가 있는 것인데 20개의 배열이 있고, 배열의 Balance가 1000씩 있는 상태이다.

|----|
|1000|
|1000|
|1000|
|1000|
|1000|
|1000|
|1000|
|1000|
