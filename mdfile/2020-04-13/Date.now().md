# Date.now()

<code>Date.now()</code> 메소드는 UTC 기준으로 1970년 1월 1일 0시 0분 0초부터 현재까지 경과된 밀리 초를 반환합니다.

# 문법
```typescript

  var timeInMs = Date.now();

```

# 설명
now() 메소드는 1970년 1월 1일 0시 0분 0초부터 현재까지 경과된 밀리 초를 Number 형으로 반환합니다.

now()는 <code>Date</code>의 정적 메소드이기 때문에, 항상 <code>Date.now()</code>처럼 사용하셔야 합니다.

# Polyfill

이 메소든는 ECMA-262 5판에서 표준화되었습니다. 
아직 이 메소드를 지원하도록 갱신되지 않은 엔진들은 이 메소드의 미지원에 대한 차선책으로 다음 코드를 활용하실 수 있습니다.

```javascript

if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

```
