# [목표]
- 모던웹 구현에 필요한 Ajax 개념알기 <br />
- Ajax 직접 구현해보는 것 마음먹기 <br /> <i class="icon-cog"></i>

# [먼저 보면 좋은 게시글]
1) [HTTP 프로토콜 자세히 알기](https://github.com/ckdqja135/Typescript-restful-starter/blob/master/mdfile/2020-04-21/HTTP%20%EA%B7%B8%EB%A6%AC%EA%B3%A0%20REST%20API%20%EB%8B%A4%EA%B0%80%EA%B0%80%EA%B8%B0.md)
2) [싱글쓰레드 자바스크립트 엔진은 비동기처리를 어떻게 하는가](https://github.com/ckdqja135/Typescript-restful-starter/blob/master/mdfile/2020-04-21/js%EC%97%94%EC%A7%84%EC%9D%80%20%EC%96%B4%EB%96%BB%EA%B2%8C%20%EB%8F%99%EC%8B%9C%EC%B2%98%EB%A6%AC%EB%A5%BC%20%ED%95%98%EB%8A%94%EA%B0%80%3F.md)

# [Ajax란]
- 자바스크립트를 이용해서 **비동기적으로** 브라우저와 서버가 데이터를 주고 받는 방식을 말함
- 새로운 언어나 프레임워크, 라이브러리가 아님, 네트워크 통신 방식을 말함
- **A**synchronous **J**avascript **a**nd **X**ML : 자바스크립트로 비동기 통신을 하고, XML 형식으로 데이터 리턴을 받는다는 뜻
- XML 데이터보다 **JSON 데이터 포맷**을 훨씬 더 많이 사용함
- 자바스크립트를 통해서 서버에 요청을 하고, 서버로부터 데이터를 리턴받음
- DOM을 제어해서 서버로부터 리턴받은 데이터를 가지고 랜더링함

# [Ajax 사용하면 좋은 점]
- 비동기 통신의 이점 : 통신 후 데이터 바인딩하는 동안 사용자가 어플리케이션을 사용할 수 있음
- 전체 페이지 로딩(페이지 요청)시 모든 데이터를 서버로부터 받는 것이 아니라 필요한 부분을 그때마다 일부분 랜더링 시키는 것이 가능함
- 일부 데이터를 위해 클라이언트가 전체 페이지를 요청하지않아도됨
- 다시 말해 통신 때마다 페이지 전체 리로드를 하지 않음, 그 말은 브라우저 랜더링 엔진이 하는 일이 줄어든다는 것
- 이를 클라이언트 사이드 랜더링이라 함

# [Ajax 동작방식]
1) **서버로 정보 요청** : 이벤트 발생 -> 핸들러 함수 호출 -> 서버 요청 객체 생성 및 메서드 호출

<p align = "center"><img src = "https://t1.daumcdn.net/cfile/tistory/226F8D3958FA3B230B" width = 90%></img></p>

- XMLHttpRequest : 자바스크립트 객체 및 객체 메서드(open, 아래는 open의 파라미터) 사용
- open 메서드 파라미터 : HTTP 메서드, 요청 URL, 비동기처리여부(boolean)
- HTTP 응답 콜백함수 정의 : 조건문으로 응답 코드(XMLHttpRequest 객체 프로퍼티로 코드 알 수 있음)별 처리다르게
- HTTP Request 관련 정보 구성

2) **서버 내부 처리 후 응답** : json 또는 xml 형태로 데이터 전달
<p align = "center"><img src = "https://t1.daumcdn.net/cfile/tistory/2747723958FA3B2402" width = 50%></img></p>

- HTTP Response 관련 정보 구성
- HTTP Request, HTTP Response 구성 내용보기 : [먼저 보면 좋은 게시글 - 1]

3) **응답을 받으면 이벤트 발생**(onload), **이벤트의 콜백함수 호출**
<p align = "center"><img src = "https://t1.daumcdn.net/cfile/tistory/255EF53958FA3B243D" width = 90%></img></p>

- 응답 코드 체크하기 : 200(응답완료, 이상 무), 304(이전과 바뀐것 x), 404(요청 주소 찾을 수 없음), 500(서버 내부 오류)
- 응답 데이터 파싱 후 DOM을 제어하여 랜더링 : 전체 페이지 로드 방식 X 

# [Ajax 응답 데이터형식]
- XML, JSON이 등장하게된 배경 : 각기 다른 인코딩, 자릿수 표현 방식 === 데이터 깨짐 현상 <br />
=> 데이터 구조화, 데이터 포멧 표준화 : 동일된 데이터셋 - 어느 환경에서나 상관없이 온전한 데이터를 송수신할 수 있음(호환성)<br />

### 1) XML
```XML

  <?xml version="1.0" encoding="UTF-8"?>
  <bookstore>
       <book category="cooking">
            <title lang="en">Everyday Italian</title>
            <author>Giada De Laurentiis</author>
            <year>2005</year>
            <price>30.00</price>
       </book>

       <book category="children">
            <title lang="en">Harry Potter</title>
            <author>J K. Rowling</author>
            <year>2005</year>
            <price>29.99</price>
       </book>

       <book category="web">
            <title lang="en">Learning XML</title>
             <author>Erik T. Ray</author>
             <year>2003</year>
             <price>39.95</price>
        </book>
  </bookstore>

```
(출처 : w3c school XML Tree : https://www.w3schools.com/xml/xml_tree.asp)

- 태그로 데이터명(속성), 데이터값을 구분해서 가독성이 좋음
- 사용자 정의 마크업 언어, 데이터 내용 정의할 때 사용
- 용량이 큼(태그 텍스트까지)
- 데이터가 많아지면 파싱 속도가 떨어짐

### 2) JSON

```JSON

  { "bookstore": [ 
    {
         "category": "cooking",
          "title" : "Everyday Italian", 
          "author": "Giada De Laurentiis",
          "year": 2005,
          "price": 30.0 
    },

    {        
         "category": "web",
         "title" : "Learning XML ", 
         "author": "Erik T. Ray ",
          "year": 2003 ,
          "price": 39.95
     }
] }

```

자바스크립트 객체형식(property - value)
- 최소한의 데이터 관련 정보만 들어있음, XML에 비해 가벼움
- 가독성이 좋음
- 의미 축약형임 : 최대한 축약할 수 있을만큼(위험성도 있음)
- 객체 형태이기 때문에 객체 내 객체, 객체 내 배열 안 배열 등 유연하게 전송할 수 있음
- 그룹핑하는 것에 따라 유연하게 데이터를 표현할 수 있음
- 위의 예제는 bookstore 프로퍼티의 값이 배열( [ ... ] )이고, 배열에는 book 정보 객체가 있음, 배열은 순서화된 collection
- json 객체(JSONObject, { property: value } )가 여러개일 경우 json 배열(JSONArray, [  ..... ] )에 담음 

# reference
1) [생활코딩, Ajax](https://opentutorials.org/course/1375/6843)
2) [_Jbee 티스토리, 서버사이드 랜더링 그리고 클라이언트 사이드 랜더링](http://asfirstalways.tistory.com/244)
3) [w3schools, AJAX](https://www.w3schools.com/xml/ajax_intro.asp)
4) [w3schools, JSON](https://www.w3schools.com/js/js_json_intro.asp)
5) [MDN, AJAX XMLHttpRequest 객체](https://developer.mozilla.org/ko/docs/XMLHttpRequest)
6) [JSON 공식 홈페이지](http://json.org/json-ko.html)





