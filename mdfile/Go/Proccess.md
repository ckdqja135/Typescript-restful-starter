## 프로세스와 커널
**프로세스(Process)** 는 커널의 관리하에 현재 시스템에서 동작중인 프로그램으로 커널은 프로세스를 관리하기 위해 각 프로세스에게 PCB를 할당하고 <br />
init프로세스는 부팅 시 가장 먼저 실행되어 시스템에 설정을 하는 초기화 프로세스 입니다. <br />
PCB(Process Control Block)는 프로세스 고유번호(PID)입니다.

## 프로세스 종류
프로세스에도 종류가 있는데 아래의 표와 같습니다.
|프로세스명|설명|
|------|---|
|데몬 프로스세스|사용자에게 특정기능이나 서비스를 제공하는 프로그램입니다.|
|부모 프로세스|부모 프로세스는 다른 프로세스를 생성하며 init을 제외한 모든 프로세스는 부모 프로세스를 가지고 있습니다.|
|고아 프로세스|자식 프로세스보다 부모 프로세스가 먼저 종료가 되었을 때 자식프로세스는 고아 프로세스가 되어 init 프로세스가 관리하게 됩니다.|
|좀비 프로세스|자식 프로세스의 종료 신호를 부모 프로세스가 처리하지 못할 경우 자식 프로세스는 좀비 프로세스가 됩니다.|

## 프로세스 확인하기
이러한 프로세스가 실행되는걸 확인하는 ps명령어가 있는데 시스템에 동작중인 프로세스를 확인합니다.  <br />
ps명령어에도 옵션이 있는데 -e는 모든 프로세스에 대한 리스트로 출력하고, -f는 full format으로 출력합니다. <br />
보통 e와 f옵션을 같이 사용하고, 나머지 옵션으로 -a는 다른 사용자들의 프로세스도 출력하고 -u는 사용자이름과 시간 등 상세한 정보를 출력하고, -x는 현재 실행되고 있는 모든 프로세스를 출력합니다. <br />

명령어 ps -ef를 입력하면 나오는 필드가 있습니다.
<p align = "center"> <img src = "https://user-images.githubusercontent.com/33046341/101983663-d54dd500-3cbf-11eb-8b37-092b8ffccc8c.png" width = 70%> </img></p>
UID는 프로세스를 실행시킨 프로세스의 소유자를 뜻하고 PID는 실행된 프로세스에 부여된 숫자를 의미하고 PPID는 Parent Process ID로 프로세스를 생성한 부모 프로세스 PID를 나타내고 <br />
C는 스케줄링 관련 필드인데 짧은 기간 동안의 CPU 사용률을 의미하고, STIME은 프로세스가 연결된 시간이며 TTY는 프로세스가 연결된 터미널을 나타내고 TIME은 프로세스에 의해 사용된 CPU시간을 나타내며 CMD는 실행한 프로세스 이름 혹은 실행한 명령을 뜻합니다. <br />

## 프로세스 다루기
프로세스에 대해 알아보았다면 이 프로세스를 다루는 방법으로 kill이라는 명령어가 있습니다. <br />
kill 명령어는 프로세스에게 SIGNAL(신호)을 전달하는 명령어로서 kil -l을 입력하면 kill에 관한 신호의 종류가 나옵니다. <br />
사용 방법은 kill - `[번호/SIGNAL]` `[PID/작업번호]`입니다. <br />

보통 주로 사용하는 신호는 2번 SIGINT, 9번 SIGKILL, 15번 SIGTERM, 18번 SIGCONT, 19번 SIGSTOP이 있습니다. <br />
시간 관계상 이 신호들에 대한 설명은 생략하도록 하겠습니다. <br />
그래서 100번의 PID를 가진 프로세스를 종료하고 싶으면 kill -9 100, kill -SIGKILL 100 으로 사용합니다. <br />
그 외에도 sleep명령어는 입력한 시간동안 대기하는 상태 프로세스를 생성하는 명령어도 있습니다. <br />

## 프로세스의 동작형태
이제 프로세스를 다룰 수 있다면 프로세스의 동작형태에 대해 알아보겠습니다. <br />
프로세스의 동작형태로 포어그라운드(Foreground Process)와 백그라운드(Background Process)가 있습니다. <br />
포어그라운드는 CLI(Command line interface)환경에서 입력하는 대부분의 명령어(프로세스)는 포어그라운드에서 동작이 되고 명령어의 실행과정이나 결과를 화면에 출력하고 <br />
백그라운드는 프로세스 종료여부와 관계없이 즉시 명령 대기 상태가 되어 다른 명령어를 사용 할 수 있는데 백그라운드로 실행하기 위해서는 명령어 마지막에 "&"(Ampersand)를 붙여서 사용합니다. <br />
백그라운드는 장시간 실행되는 명령어 작업에 사용합니다. <br />

백그라운드 사용시 `cp -r /usr/gsk/sr1 &`을 사용하면 <br />
`[1] 5020` 이라고 뜨는데 이는 백그라운드 명령어 실행 시 출력결과로 작업번호가 출력됩니다. <br />

이러한 백그라운드에서 동작하면 사람의 눈으로 확인하기 힘든데 백그라운드를 사용하기 위해 명령어가 존재합니다. <br />
jobs명령어는 백그라운드로 동작하는 프로세스를 확인하는 명령어로 백그라운드로 실행하면 진행중인 프로세스를 확인할 수 있습니다. <br />
그리고 fg명령어가 있는데 백그라운드 작업을 포어그라운드로 변경시켜 줄 때 사용하고, 반대로 bg명령어는 포어그라운드로 작업하는 것을 백그라운드로 변경시켜줍니다. <br />
사용방법은 `fg %[작업번호]`이고, bg명령어도 같습니다. <br />

시스템에서 실행되고 있는 프로세스는 /proc 디렉토리 아래에서 확인할 수 있고, /proc 디렉토리는 실제 하드디스크에는 존재하지 않고 메모리에 저장되어 있는 내용을 확인할 수 있는 가상의 디렉토리 입니다. <br />
그리고 cat명령어로도 확인해 볼 수 있는데 /proc/meminfo를 확인하면 시스템 메모리 정보를 확인할 수 있습니다. 그 외에도 /proc/cpuinfo로 cpu정보를 확인 할 수 있고, /proc/version으로 커널의 버전을 확인할 수 있습니다. <br />

## 현재  사용 하는 방법
현재 go를 실행하기 위해서는 리눅스 버전으로 컴파일을 해야 합니다. 그러면 실행 파일이 생기는데 이 실행 파일에 실행권한을 주어야 하고, <br />
./실행파일 &로 백그라운드로 실행시켜줍니다. <br />
그런데 그냥 백그라운드로 실행할 때 터미널을 종료하면 프로그램이 종료 되지만 <br />
nohup이라는 데몬을 사용하면 프로그램을 종료하는 시그널을 무시 하기 때문에 터미널을 종료해도 프로그램이 종료되지 않게 되며 현재 이 부분이 쉘 스크립트로 구현되어 있기 때문에 <br />
쉘 스크립트를 실행하기만 하면 됩니다. <br />

쉘 스크립트? : 쉘을 통하여 프로그램을 만든 것. <br />

## 그 외
### systemd 서비스로 SleepService 만들기 
systemd 를 이용해서 서비스로 만들기 위해서는 `“/lib/systemd/system/sleepservice.service”` 아래에 <br />
다음과 같은 것을 만든다.  <br />

``` Shell
[Unit] 
Description=Sleep service 
ConditionPathExists=/home/ubuntu/work/src/sleepservice/sleepservice 
After=network.target 

[Service] 
Type=simple 
User=sleepservice
Group=sleepservice 
LimitNOFILE=1024 
Restart=on-failure 
RestartSec=10 
startLimitIntervalSec=60 
WorkingDirectory=/home/ubuntu/work/src/sleepservice 
ExecStart=/home/ubuntu/work/src/sleepservice/sleepservice --name=foo 

# make sure log directory exists and owned by syslog 
PermissionsStartOnly=true 
ExecStartPre=/bin/mkdir -p /var/log/sleepservice
ExecStartPre=/bin/chown syslog:adm /var/log/sleepservice 
ExecStartPre=/bin/chmod 755 /var/log/sleepservice 
StandardOutput=syslog 
StandardError=syslog 
SyslogIdentifier=sleepservice 

[Install] 
WantedBy=multi-user.target
```
위의 파일에서 사용된 패스들은 여러분의 경로에 맞게 수정 하면 될 것 이다.  <br />
물론 sleepservice 라는 서비스 이름 자체도 말이다. <br />

해당 프로그램 전용 사용자를 만들고 , 깃헙에서 만들어 둔것이 있으면 제대로 된 위치로 옮기고, 755 권한을 준다. <br />

``` Bash
$ cd /tmp 
$ sudo useradd sleepservice -s /sbin/nologin -M 
$ wget https://raw.githubusercontent.com/fabianlee/blogcode/master/golang/sleepservice/systemd/sleepservice.service 
$ sudo mv sleepservice.service /lib/systemd/system/. 
$ sudo chmod 755 /lib/systemd/system/sleepservice.service
```

**systemctl** 를 이용해서 sleepservice.service 를  enable 시키고 시작시키고, journalctl 을 통해 제대로 시작되는지 확인한다.

``` Bash
$ sudo systemctl enable sleepservice.service

$ sudo systemctl start sleepservice

$ sudo journalctl -f -u sleepservice

May 21 16:20:43 xenial1 sleepservice[4037]: 2017/05/21 16:20:43 hello foo
May 21 16:20:43 xenial1 sleepservice[4037]: 2017/05/21 16:20:43 About to sleep 1526ms before looping again
May 21 16:20:45 xenial1 sleepservice[4037]: 2017/05/21 16:20:45 hello foo
May 21 16:20:45 xenial1 sleepservice[4037]: 2017/05/21 16:20:45 About to sleep 196ms before looping again
```

그 밖에도 기존의 etc/init.d 를 이용해서 할 수도 있다. <br />

#### 1) /etc/init.d 아래 스크립트 작성 (Golang 프로그램을 시작시키거나 멈추는 run 스크립트를 부팅시 호출 해준다.) 

``` Shell
#! /bin/sh
# /etc/init.d/myservice


USERNAME=who??
COMMAND_MYSERVICE_SCRIPT="/home/$USERNAME/myservice/run"


case "$1" in
  start)
    echo "Starting myservice .."
    sudo -u $USERNAME $COMMAND_MYSERVICE_SCRIPTstart
  
    echo "Done!!"
    ;;
  stop)
    echo "Stopping myservice .."
    sudo -u $USERNAME $COMMAND_MYSERVICE_SCRIPTstop
    echo "Done!!"
    ;;
  *)
    echo "Usage: /etc/init.d/myservice {start|stop}"
    exit 1
    ;;
esac

exit 0
```

권한설정

* sudo chmod 755 myservice

* update-rc.d 로 설정   ( sudo update-rc.d myservice defaults) 
