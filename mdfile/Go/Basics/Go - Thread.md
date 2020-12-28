## 시작
쓰레드(Thread)는 현대 프로그래밍 언어에서 가장 중요한 개념중에 하나이고, 현대 프로그래밍에서 가장 많이 쓰이는 부분이기도 하고, 가장 풀기 어렵고 복잡한 문제들이 발생하는 곳 중에 하나가 
쓰레드가 된다. 쓰레드를 잘 모르면 나중에 더 고 수준의 프로그램을 하는데 문제가 있게 된다. <br />

그래서 쓰레드의 개념을 파악하고, 어떤 문제들이 발생하는지, 또 그 문제들을 어떻게 해결 할 수 있는지 잘 알고 있어야 한다. 하지만 쓰레드를 잘 몰라도 프로그래밍 하는데 있어서 크게 문제되진 않는다. <br />

가령 웹 페이지를 만든다거나 할 때는 멀티쓰레드 환경에 대해서 몰라도 되지만 시스템 프로그램을 한다거나, 게임서버 같이 헤비, 하드한 작업을 하게 되면 쓰레드의 개념이 필수이기 때문에 쓰레드를 알고 가는게 좋다. <br />

쓰레드 개념을 이해하면 컴퓨터의 기본 동작을 이해하는데 도움이 되기 때문에 꼭 필요한 개념이라 본다. <br />

쓰레드의 뜻은 실, 줄(한 줄, 두 줄), 시냇물, 등 어떤 한 줄로 연결된 것을 쓰레드라고 한다. <br />

쓰레드의 개념을 살펴보기 전에 [튜링머신](https://namu.wiki/w/%ED%8A%9C%EB%A7%81%20%EB%A8%B8%EC%8B%A0)에 대해 살펴보자. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103188952-d6147700-490d-11eb-8104-96af70c84a01.png" width = 70%> </img></p>

위의 그림이 튜링머신이라는 것인데 저 가운데 있는 기계가 컴퓨터인데 이 컴퓨터가 하는 일은 종이를 앞으로 뒤로 밀면서 종이에 적힌 명령어들을 수행하게 된다. <br />

그랬을 때 쓰레드는 저 하나의 줄로 이루어진 명령어들을 쓰레드라 한다. <br/ >
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103189065-53d88280-490e-11eb-983d-b1d07d945e15.png" width = 70%> </img></p>

그래서 컴퓨터는 한번에 하나의 명령밖에 할 수 밖에 없다. 그래서 이 한 줄의 프로그램(예전엔 저 명령어들을 프로그램이라 불렀고, 지금와서 쓰레드라 부르게 되었다.)하나 밖에 돌릴 수가 없다. <br />
그래서 옛날에는 컴퓨터에 프로그램을 하나밖에 못돌렸다. 예를 들어 게임 하나만 할 수 있다면 게임 하나밖에 못했고, 워드프로세서 하나밖에 못했다면 워드프로세서 하나밖에 못했다. <br />

옛날 컴퓨터 구조를 보려면 MS-DOS창을 띄워보면 되는데 Windows 있기 전에 있던 것이 MS-DOS였다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103189197-d95c3280-490e-11eb-8d1b-e6f3039ae3f0.png" width = 70%> </img></p>

이렇게 명령어를 쳐서 사용하는 형태인데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103189232-fa248800-490e-11eb-9efb-f7aca41ff493.png" width = 70%> </img></p>

여기서 어떤 명령을 수행하면 그 명령이 끝나기 전까지는 다른 명령을 수행할 수 없게 되었다. 그런데 Windows가 나오면서 멀티 태스킹 개념이 생겨나게 되었다. <br />
그래서 지금은 웹브라우저를 실행된 상태에서 음악을 듣거나, 게임을 하는 등의 여러가지 일을 처리 할 수 있게 되었다. <br />

그렇다면 이게 어떻게 가능하게 되었는지 생각해보자. <br />
옛날에 Windows가 처음 나왔을 때는 CPU 코어 갯수가 1개 뿐이였다. 지금은 코어가 여러개이기 때문에 각 CPU마다 다른 쓰레드를 물릴 수가 있었다. <br />
하지만 옛날에는 CPU가 하나였기 때문에 쓰레드를 하나만 돌릴 수 있었다. <br />

그런데 이 CPU가 하나인 상황에서 프로그램을 2개를 돌린다고 가정해보자. 어떻게 돌릴 수 있을까? <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103189577-9c913b00-4910-11eb-8801-d8e735dbc7e3.png" width = 70%> </img></p>

아주 단순하게 문제를 해결 하면 이 CPU가 왔다 갔다 하면 된다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103189622-deba7c80-4910-11eb-8b4f-9bbbee23f134.png" width = 70%> </img></p>
그러니까 저 CPU가 저 자리에서 어느정도 명령어를 수행하다가 자리 옮겨서 명령어를 수행하고, 또 어느정도 수행하면 자리를 옮겨서 이어서 명령어를 왔다갔다하며 수행 하는 방법이다. <br />
이론적으로 보면 한번에 2개도 되고, 3개도 되고, 10개도 된다. <br />

이렇게 한번에 여러가지 일을 처리하는 것을 멀티태스킹이라고 하고, 어떤 사람들 중에서도 음악을 들어면서 책을 읽고, 전화를 하는 식으로 3가지 일을 하는 사람들이 있고, 이런 사람들을 멀티테스커 라고 부른다. <br />
사실 우리 뇌에서도 그렇다고 하는데 한번에 여러가지 일을 수행는건 불가능 하다고 한다. 그러면 멀티테스커는 어떻게 여러가지일을 한번에 하는 것일까? <br />
사실 이 모든 작업들을 순간적으로 빠르게 전환하면서 여러가지 일들을 수행하는 것이다. 예를 들면 잠깐 음악을 들었다가, 잠깐 책읽다가, 잠깐 전화에 집중했다가 다시 음악을 들었다, 책읽다를 반복하는 것이다. 이렇게 빠르게 전환을 하면서 실제로는 싱글테스킹인데 마치 멀티테스킹이 되는 것처럼 보여지게 된다.<br />

이 방식이 바로 CPU가 태스킹을 전환하는 방식이다. <br />
그래서 아래와 같이 쓰레드가 있을 때 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103189986-694fab80-4912-11eb-8668-b7353ffbdb11.png" width = 70%> </img></p>
처음 쓰레드를 어느정도 진행하다가 어디까지 수행 했는지 기록해 놓고 위에 있는 쓰레드로 갈아끼운다. 그러면 위에 있는 쓰레드에서 어느정도 진행하고, 기록했다가, 다시 밑에 있는 쓰레드로 넘어가 마지막 했던 부분에서 이어서 수행하다가, 위의 쓰레드로 넘어가는 식으로 계속 전환하면서 수행하는 것을 멀티 태스킹이라고 한다. <br />

이런 개념은 현대에 와서도 유효하다. 현대에는 CPU가 쿼드코어, 옥타코어, 등 여러개인데 CPU가 있다 하더라도 쓰레드는 여러개가 있을 것이다. 지금 현재에도 모르고 있는 사이에도 프로그램들이 수십개가 돌고 있다. 이걸 확인하기 위해서 작업관리자를 켜서 확인해보면 되는데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103190144-06aadf80-4913-11eb-944b-fad030e5fd37.png" width = 70%> </img></p>
이 백그라운드 프로세스라고 해서 100개가 넘는 프로그램들이 이미 돌고 있는 것을 볼 수 있다. <br />

이게 어떻게 가능하냐면 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103190349-d6b00c00-4913-11eb-92f1-6a579e170f04.png" width = 70%> </img></p>
이런식으로 수행하고, 기록하고, 전환하고를 빈틈 없이 계속 쓰레드를 번갈아가며 수행하고 있기 때문에 100개가 넘는 여러개의 프로그램들을 돌릴 수 있게 되는 것이다. <br />

그렇다면 이걸 누가 조율하고, Managing하는 사람이 필요할텐데 그걸 운영체제가 해준다. <br />
그래서 개발자 입장에서는 내부에서 어떻게 Managing되는지 잘 몰라도 내가 어떤 쓰레드를 만들면 그게 CPU에 할당되서 돌아 갈 것이라는 가정을 할 수 있게 된다. <br />

아까 하나의 CPU가 있고, 여러개의 쓰레드가 있을 때 어느 정도 수행 후 마지막까지 수행 한 부분 저장 후, 전환 된다고 했는데 이 전환을 [Context Swiching](https://ko.wikipedia.org/wiki/%EB%AC%B8%EB%A7%A5_%EA%B5%90%ED%99%98)라고 한다. <br />
Context를 바꾼다는 얘기인데 Context라는 것은 여기서 Context란, CPU 가 다루는 Task(Procee / Thread) 에 대한 정보를 의미한다. <br />
그래서 이 Thread 하나를 전환한다는 의미인데 전환할 때 비용이 든다. CPU를 교체한다거나, 마지막까지 수행했던 것을 기록한다거나 하는 등의 비용이 든다. <br />
그래서 Context Swiching이 자주, 많이 일어나게 되면 수행하는 시간보다 전환하는 비용이 더 커진다. 그래서 효율이 떨어진다. <br />
그렇게 되면 CPU가 Swiching하느랴 정작 자기가 해야 될 일인 Thread를 진행 시키는 일을 잘 못하게 된다. <br />

그래서 Thread를 너무 많이 만들게 되면 Context Swiching이 자주 일어나게 되서 오히려 비효율적이 된다는 점이 있기 때문에 적정량을 만들어 주어야 한다. <br />

## 그렇다면 Go에서 쓰레드를 살펴보자
Go에서는 쓰레드 기능을 제공하는데 Go에서는 OS에서 기본으로 제공하는 커널 쓰레드가 있는데 커널이라는 것은 OS가 관리하는 영역이라 생각하면 되고, OS가 관리하는 쓰레드이다. <br />
이 커널 쓰레드는 Go에서 바로 쓰는게 아니라 Wrapping이라고 해서 한 번 포장을 해서 만들어 쓴다. <br />
이 것을 **Go Thread**라고 한다. <br />

그래서 커널 쓰레드와 Go Thread는 서로 다르다. <br />
Go Thread안에서 커널 쓰레드를 사용하고 있지만 Go를 사용하는 개발자는 커널 쓰레드를 알 필요가 없다. Go Thread를 사용하게 되면 자동적으로 Go Thread안에서 커널 쓰레드를 사용하게 된다. <br />

왜 이렇게 했냐면 아까 말했던 Context Swiching에서 일어나는 비용을 최대한 줄이고자 했다. 그래서 OS영역에서 사용되는 Thread를 최소한으로 사용하고, 그걸 한번 포장(Wrapping)해서 Go Thread를 만드는 것이다. <br />

그래서 Go Thread는 OS Thread를 최소한 사용하면서 그것을 잘게 쪼개서 사용하는 방식이다. 그래서 NM Thread라고 말하는데 <br />
이 말은 N(하나의 OS Thread에) M(여러개의 Go Thread가 들어갈 수 있다)는 의미이다. <br />

복잡한 이야기 이므로 다시 한번 살펴보자. <br />
Context Swiching을 최대한 안 일어나도록 해야 성능이 올라간다고 말을 했었다. <br />
그렇다면 Context Swiching를 안 일어나도록 해야 한다면 어떻게 해야 할까? <br />

예를 들면 CPU가 2개가 있고, 쓰레드가 2개가 있다 하면 각각 CPU가 쓰레드 1개씩 잡고 돌리면 된다. 이럴 경우에 Context Swiching이 일어나지 않는다. <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103191261-9eaac800-4917-11eb-8bd0-5b4282d79348.png" width = 70%> </img></p>

그런데 CPU가 2개가 있는데 쓰레드가 4개가 있다 가정해보자.
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103191303-d1ed5700-4917-11eb-9682-d500f01fdec7.png" width = 70%> </img></p>
1~4번의 쓰레드가 있다고 했을 때 1번 쓰레드가 첫 번째 CPU를 잡고, 2번 쓰레드가 두 번째 CPU를 잡고, 수행 할 때 <br />
3, 4번 쓰레드가 놀고 있으니 어느정도 수행을 하고, 각각 CPU들이 3, 4번 쓰레드를 잡아주기 위해 Context Swiching이 일어나게 된다. <br />
그러니까 CPU갯수가 Thread갯수보다 적을 때 Context Swiching이 일어나게 되는 것인데 Context Swiching이 일어나지 않게 하려면 CPU의 갯수와 Thread의 갯수를 맞춰주면 된다. <br />

하지만 맞춘다는 것은 불가능에 가깝고, 최대한 가깝게 만드는게 좋다. <br />
그래서 Go는 컴퓨터가 가지고 있는 CPU의 갯수 만큼(갯수와 가깝게) OS 쓰레드를 만들고, 각 OS 쓰레드를 잘게 잘라서 여러개의 Go Thread를 할당한다. <br />

그래서 개발자 입장에서 보면 이 Context Swiching을 신경쓰지 않아도, 그러니까 내 CPU의 갯수와 현재 쓰레드 갯수가 몇개인지 관심이 없어도 막 쓰레드를 만들어도 Go내부에서 이것을 <br />
OS Thread(커널 쓰레드)를 알아서 할당해주기 때문에 큰 걱정없이 Thread를 마구 할당할 수 있다. <br />
이게 Go Thread의 특징이다. <br />

그래서 Go Thread는 개발자가 Thread의 갯수를 크게 신경쓰지 않아도 된다. 잘 돌아가도록 만들어져 있다. <br />
Go로 개발하다 보면 Go Thread를 자주 쓰게 되고, 어떤 프로그램은 수천개의 Thread가 돌아간다고 한다. <br />

가령 다른 언어의 같은 경우 C++, C#, Java 같은 경우엔 하나의 쓰레드가 하나의 OS 영역에 1:1로 대응 되어 있어서 수천개의 쓰레드를 만들면 Context Swiching이 굉장히 많이 일어나게 되서 성능에 문제가 생기게 된다. <br />

물론 C#이나 Java같은 경우 **Thread Pool**이라는 것을 제공하고 있기 때문에 이 것을 사용하여 문제를 해결 하면 되지만 <br />

Go Thread는 바로 하나의 OS Thread를 여러개의 Go Thread가 나눠쓰기 때문에 그냥 Thread만 사용해도 Context Swiching을 최대한 막을 수 있다는 점이 다른점이다. <br />

그럼 간단하게 프로그래밍을 해보자! <br />
thread라는 폴더를 만들고, main.go파일을 추가해준다. <br />

``` Go
package main

import (
	"fmt"
	"time"
)

func main() {
	go fun1()
	for i := 0; i < 20; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println("main", i)
	}
	fmt.Scanln()
}

func fun1() {
	for i := 0; i < 10; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println("fun1", i)
	}
}
```
time.Sleep을 사용하여 한 번찍고, 한번 쉬었다가 찍도록 해준다. <br />

이것을 출력하면 아래와 같이 나오는데 <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103192324-99e81300-491b-11eb-9411-f2abfcf31a9b.png" width = 70%> </img></p>

출력이 둘 씩 섞여서 나오는 것을 알 수 있다.<br />
기존 같았으면 예를 들어 go를 빼고 fun1()을 넣었을 때 <br />

``` Go
func main() {
	fun1()
	for i := 0; i < 20; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println("main", i)
	}
	fmt.Scanln()
}

func fun1() {
	for i := 0; i < 10; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println("fun1", i)
	}
}
```

fun1()이 모두 수행되고, 다 끝난 다음에 main이 수행되서 fun1()이 먼저 출력되고, main이 나중에 출력 될 것이다. <br />
확인해보자! <br />
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/103192452-0e22b680-491c-11eb-8ba2-feb742d0cb3b.png" width = 70%> </img></p>
보는 것처럼 fun1()이 먼저 출력 되는 것을 알 수 있다. <br />

그런데 fun1()에 go를 붙이면 go Thread로 돌려서 쓰라는 의미이다. 그래서 하나의 Thread를 만들어서 fun1()을 수행하라는 의미이다. <br />
그래서 fun1()의 Thread와 main()의 Thread는 서로 다른 Thread이 된다. fun1()을 수행하는 동시에 main()도 수행하게 되는 것이다. <br />

즉
``` Go 
func main() {
	fun1()
	for i := 0; i < 20; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println("main", i)
	}
	fmt.Scanln()
}
``` 
이 부분과 <br />

``` Go
func fun1() {
	for i := 0; i < 10; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println("fun1", i)
	}
}
```
이 부분이 동시에 실행 된다. <br />

물론 말은 동시지만 CPU가 Thread를 전환시켜 가면서 수행하는 것이다. <br />
그래서 이 전환이 얼마정도 수행해서 전환할 지는 OS가 결정할 일이고, Go Thread 내부에서 결정하는 일이기 때문에 개발자들은 잘 모른다. <br />
그냥 저 두개의 함수가 동시에 실행 된다는 것을 가정하는 것 뿐이다. 그래서 fun1()이 어느정도 수행되고 main()이 수행되는 지 모르기 때문에 그 부분에서 Thread를 사용하고, 다루는데 까다로운 부분이 생기게 된다.<br />

이렇게 Go에서 Thread를 만드는 것은 굉장히 단순하다. 그냥 앞에 go만 붙이면 된다. <br />
그래서 <br />
``` Go 
func main() {
  go fun1()
  go fun1()
  
	for i := 0; i < 20; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println("main", i)
	}
	fmt.Scanln()
}
``` 
이런식으로 쓰면 Thread가 2개가 된다. 이런식으로 얼마든지 Thread를 쉽게 만들 수 있기 때문에 Go에서는 많은 Go Thread들을 사용할 수 있게 된다. <br />
