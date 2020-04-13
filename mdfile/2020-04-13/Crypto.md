# Node 내장 암호화 모듈 Crypto

비밀번호를 단순히 평문으로 데이터베이스에 저장하는 것은 범죄와 다름 없습니다. <br />

데이터베이스가 해킹 당하는 순간 고객들의 비밀번호가 그대로 해커의 손에 넘어가게 되는 것이죠. <br />
(데이터베이스가 해킹 당하지 않는 것이 최선..) <br />
그렇기 때문에 비밀번호 암호화로 안전장치를 만들어 놓는 것입니다. <br />

암호화의 방법은 단방향 암호화와 양방향 암호화 두가지가 있습니다. <br />
먼저 단방향 암호화에 대해서 알아보겠습니다. <br />

# 단방향 암호화

비밀번호는 보통 단방향 암호화를 사용합니다. <br />
단방향 암호화는 복호화 할 수 없는 암호화 방식입니다. <br />
복호화는 암호화된 문자열을 암호화 되기전의 평문으로 되돌려 놓는 것을 의미합니다. <br />
그러므로 단방향 암호화를 사용하게 되면 원래 문자열이 무엇인지 알 수 없습니다. <br />

Q: 왜 비밀번호 저장을 단방향 암호화로 할까요? <br />
A: 고객의 비밀번호를 굳이 복호화할 이유가 없기 때문입니다. <br />

Q: 복호화가 되어있지 않으면 비교는 어떻게하나요? <br />
A: 기존에 데이터베이스에 저장된 암호화된 비밀번호와 로그인할 때 입력받은 비밀번호를 단방향 암호화를 통해 비교하면 됩니다. <br />

즉 기존의 비밀번호는 어디에도 저장되지 않고 **암호화 된 문자열로만 비교**하는 방법입니다. <br />

단방향 암호화는 해시 알고리즘을 사용합니다. 해시는 임의의 크기를 가진 문자열을 고정된 길이의 다른 문자열로 변경하는 것을 말합니다. <br />
예를 들어서 zqxwce라는 문자열과 asdf라는 문자열을 해시 알고리즘을 사용한다면 고정된 길이(6개로 가정) pmonib와 lkjhgf로 바꾸는 방식입니다. <br />
입력된 문자열의 길이가 다르지만, 해시알고리즘으로 변경된 문자열의 길이는 6개로 고정되어 있습니다. <br />

해시함수를 어떻게 쓰는지 알아보겠습니다. <br />

먼저 crypto의 method와 property에 대해서 알아보겠습니다. <br />

- createHash(algorithm[,options]): 사용할 해시 알고리즘을 입력합니다. md5, sha1, sha256, sha512등이 가능합니다. <br />
- update(data[,inputEncoding]): 변환할 문자열을 입력합니다. <br />
- digest([encoding]): 인코딩할 알고리즘을 넣어줍니다. base64, hex, latin1이 주로 사용됩니다. 변환된 문자열을 반환합니다. <br />

```javascript

const crypto = require('crypto')

const password = 'qpmz0192'
const password2 = '2910zmpq'

const base64crypto = password => {
	console.log(crypto.createHash('sha512').update(password).digest('base64'))
}

base64crypto(password)
base64crypto(password2)

```

password는
```javascript

IviAr3rKdKyLCJSx2t3G2OtyBrdtGRnXBeXbvC7Fmxgy9f1207ZpK7nQfMrmZR0elxkmvaBZ+z9BOyzo40GPEQ==
password2는
P0G+Ft+ax+enRlv+3V2KmA1oVHA2W+kKDCAET9os0Ql1s9Wk8ivmDrQ6hbMRJKiBjSVRcmlNtON27Yyu9xge2A==

```
위와 같이 나오게 됩니다. <br />

이렇게 해시화만 사용하면 위험할 수도 있습니다. 

# 단방향 해시 함수의 문제점
동일한 문자열이 항상 같은 암호화된 문자열을 갖는다면 <br />
해커가 많은 암호화된 문자열을 가지고 원본 문자열을 찾거나 동일한 효과의 문자열을 찾을 수 있습니다.  <br />
이와 같은 암호화된 문자열(다이제스트)의 목록을 레인보우 테이블이라고 합니다. <br />

이 문제점을 해결하기 위해선 **salting**과 **key stretching**을 사용하여 보완할 수 있습니다. <br />

기존 문자열에 덧 붙이는 임의의 문자열을 salt라고 합니다. <br />
기존 문자열에 salt를 덧붙여 다이제스트를 생성하는 것을 **salting**이라고 합니다. <br />

기존 문자열의 다이제스트를 생성하고 생성된 다이제스트를 통해 다시 다이제스트를 생성하는 방법을 **키 스트레칭**이라고 합니다. <br />
이렇게 하면 입력된 패스워드를 동일한 횟수 만큼 해시화 해야 입력한 패스워드와 암호화된 패스워드 일치여부를 확인할 수 있습니다. <br />

crypto에서는 randomBytes, pbkdf2라는 메소드로 지원하고 있습니다. <br />
 
```javascript

const upgradeBase64crypto = password => {
	crypto.randomBytes(64, (err, buf) => {
		const salt = buf.toString('base64')
		crypto.pbkdf2(password, salt, 100, 64, 'sha512', (err, key) =>{
			console.log(key.toString('base64'))
		})
	})
}

upgradeBase64crypto(password)
upgradeBase64crypto(password2)

```

위 처럼  upgradeBase64crypto라는 함수의 randomBytes 메소드에서 64바이트 길이의 임의의 문자열(salt)을 생성합니다. <br />
pbkdf2 메소드에서는 순서대로 비밀번호, salt, 반복 횟수, 출력될 바이트 수, 해시 알고리즘을 parameter로 받아서 처리합니다. <br />
위 예제는 키스트링을 100번 반복하는 예제입니다. <br />

실행결과는
```javascript

UASaKTAjm46exaPsXN9W1JXF++AtJNQGkpPWqIfAfZQu1X1p4gfpRCseIxQyUErTBgSctSJyyGv7sLzMnzEUhA==
1fyLd3zGHaiug80tNvbcS1yW/wDTJJZIGT7lwkUh04hUWIrgzspeD14aAn8z9iPwaEwNus9TyaYqN6Jrg1BK6A==
neBI6ejXbwnUPhAm5fCHfNZtBkIDIyZBpKxn9XYhobzJSYKUlSc2hxeb7jvy5kjNTiUJHGAmYBcHXTnjXkkfkQ==
G8dCveDRh3fjmtDnLHySQFbiqAkvkWH2rj8U344qM1mT4Uzw8xMXcthNUfl2NuDx87YUn2twH7veeHeXUuQdIQ==

```

이렇게 나오게 됩니다. **pbkdf2**는 간단하게 사용할 수 있지만 **bcrypt**나 **scrypt**보다 취약하기 때문에 더 나은 보안이 필요할 경우에 사용하면 됩니다. <br />

* 실행할때 마다 값이 다르게 출력되는 이유는 randomBytes를 통해서 salt의 값이 매번 변경이 됩니다. 이점 유의하세요. <br />

* bcrypt
패스워드 저장을 목적으로 설계 되었다.  <br />
openBSD에서 기본 암호 인증 메커니즘으로 사용되고 있다. 단 입력값이 72byte인 제약이 있다. <br />

* scrypt
pbkdf2와 유사하게 솔팅과 키스트레칭을 반복하며, 다이제스트를 생성할 때 메모리 오버헤드를 갖게끔 설계되어 있어서 억지기법공격을 시도할 때 병렬화 처리가 어렵다. <br />

# 2. 양방향 암호화
양방향 암호화에는 **대칭형 암호화**와 **비대칭형 암호화**가 있습니다.  <br />
양방향 암호화는 암호화된 문자열을 기존 문자열로 복호화 할 수 있는 암호화 기법입니다. <br />
암호화 된 문자열을 복호화 하기 위해선 암호화 할 때 사용했던 **키**와 같은 것을 사용해야 합니다. <br />

**암호화에 사용되는 메소드**
- createCipher(algorithm, key[,options]): 암호화 알고리즘과 key를 넣어 줍니다. 예시에서는 암호화 알고리즘은 'des'를 입력하였습니다. <br />
- encrypt.update(data[,inputEncoding][,outputEncoding]): 암호화 할 문자열과 문자열의 인코딩, 출력 문자열의 인코딩을 입력합니다. <br />
- encrypt.final([outputEncoding]): 출력된 문자열의 인코딩을 입력합니다. <br />

**복호화에 사용되는 메소드**
- createDecipher(algorithm, key[,options]): 복호화 할때 사용하는 메소드입니다. 암호화에 사용했던 알고리즘과 key를 입력합니다. <br />
- decode.update(data[,inputEncoding][,outputEncoding]): 암호화된 문자열, 그 문자열의 인코딩, 복호화 할 인코딩을 순서대로 입력합니다. <br />
- decode.final[outputEncoding]): 복호화 결과의 인코딩을 입력합니다. <br />
 
```javascript

const key = 'gracefulife'

const cipher = (password, key) => {
	const encrypt = crypto.createCipher('des', key)
	const encryptResult = encrypt.update(password, 'utf8', 'base64')
		+ encrypt.final('base64')
	console.log(encryptResult)
	return encryptResult
}

const decipher = (password, key) => {
	const decode = crypto.createDecipher('des', key)
	const decodeResult = decode.update(password, 'base64', 'utf8')
		+ decode.final('utf8')
	console.log(decodeResult)
}

const encrypt = cipher(password, key)
decipher(encrypt, key)
const encrypt2 = cipher(password2, key)
decipher(encrypt2, key)

```

password와 password2의 값은 단방향 암호화에서 사용했던 값과 동일합니다. <br />

실행해 보면
```typescript

dzzmUb9NevZXKjSIZiZbHQ==
qpmz0192
vPwzzznk4gezbixB1Fr9wA==
2910zmpq

```
위와 같이 나오게 됩니다.  <br />
암호화 됬던 문자열이 정상적으로 기존의 문자열로 복호화 되는 모습을 볼 수 있습니다. <br />

더 자세한 사항은 노드 공식문서의 [crypto](https://nodejs.org/api/crypto.html
)를 참고 하시면 될 것 같습니다.<br />

# reference
> * [참고자료](https://m.blog.naver.com/PostView.nhn?blogId=tpgns8488&logNo=221336473460&proxyReferer=https:%2F%2Fwww.google.com%2F)
> * [암호와 알고리즘](https://namu.wiki/w/%EC%95%94%ED%98%B8%20%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)
> * [ZeroCho crypto모듈](https://www.zerocho.com/category/NodeJS/post/593a487c2ed1da0018cff95d)
