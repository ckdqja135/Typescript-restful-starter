## [jQuery]동적 태그에 이벤트 바인딩하기 - .on()의 쓰임새

체크 박스에 체크가 되거나, 체크가 해제될 때마다 이벤트가 발생하는 로직이 있었다. <br />
보통 페이지를 최초로 로딩할 때 해당 체크박스를 다 부려주니 아래와 같이 구현하여 쓰고 있었다. <br />

```javascript

  $(document).ready(function () {
    $("input[name='optionCheck']").change(function() {
      // 이벤트 바인딩
    });
  });
  
```

그런데 체크박스를 동적으로 만들어주는 경우에는 위와 같은 태그가 먹지 않았다. <br />
찾아보니 동적 태그일 경우에는 document.ready의 이벤트가 작동하지 않는다. <br />
document.ready는 화면이 최초에 로드되었을 때에 화면 안에 있는 태그들에 이벤트를 걸기 때문에, **로드되었을 때 존재하지 않는 태그에 대해서는 이벤트를 걸 수 없는 것이다.** <br />

이런 때엔 어떻게 이벤트를 거는 지 찾아보았더니 아래와 같은 방법이 있었다.

```javascript
  
  $(document).on("change","input[name='optionCheck']", function() {
    // 이벤트 바인딩
  });
  
```  
그리고 더 찾아보았더니, on에는 생각보다 많은 장점들이 존재한다. 하나의 element에 여러 개의 이벤트가 바인딩 될 때에도 아래와 같이 깔끔하게 jQuery를 구현 할 수 있다.

```javascript
  
  $("input[name='optionCheck]").on({
    "change" : function() { // 이벤트 바인딩 },
    "click" : function() { // 이벤트 바인딩 },
  });
  
```

## 참조
[참조](https://brunch.co.kr/@ourlove/98)
