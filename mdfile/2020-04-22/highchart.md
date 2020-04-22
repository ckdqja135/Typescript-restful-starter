# JavaScript에 Highchart를 이용한 그래프 삽입
이번에는 https://www.highcharts.com/에서 제공하는 데모버전을 적용하는 방법을 알아보겠습니다.

먼저 [여기](https://www.highcharts.com/)로 들어갑니다.

### 왼쪽 상단에 있는 Demo를 들어갑니다.
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79947631-3d3f7900-84ad-11ea-9fdd-4bf835a4b7ff.png" width = 90%></img></p>

### 맘에 드는 차트를 찾습니다.
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79947756-7d066080-84ad-11ea-83de-f9c915b8464c.png" width = 90%></img></p>

### 원하는 Demo의 속성에 맞게 다운로드 해줍니다.
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79947876-b939c100-84ad-11ea-9807-41f726526fe3.png" width = 90%></img></p>

### 아까 마음에 들던 차트를 들어갑니다.
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79947925-d66e8f80-84ad-11ea-8d7e-fef76a795d52.png" width = 90%></img></p>

### Edit IN JSFIDDLE를 눌러줍니다.
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79948014-fdc55c80-84ad-11ea-8cc8-2affb6649c59.png" width = 90%></img></p>

### 왼쪽 상단에 <script>를 확인합니다. 그리고 아까 다운 받았던 파일을 엽니다.
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79948105-2d746480-84ae-11ea-9acf-9acd04da4c9b.png " width = 90%></img></p>

### 여기서 파일을 찾아야합니다.
파일은 위 사진의 맨 위측 코드에서 참고하면 되는데 <br />
```JAVASCRIPT

<script src = "https://code.highcharts.com/highcharts.js"></script> <br />
<script src = "https://code.highcharts.com/modules/exporting.js"></scripts> <br />

```
이 부분에 있는 <code>highcharts.js</code>와 <code>exporting.js</code>를 찾으시면 됩니다. <br />
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79948189-55fc5e80-84ae-11ea-99cb-2b371acd99b0.png" width = 90%></img></p>

### 그리고 경로에 맞게 <code><script src ="highcharts.js"></script></code> 등등을 넣어줍니다.
DEMO를 보고 있는 사이트의 경로는 https:// ~~~~ 로 되어있는데 꼭 자신에 맞게 경로를 다시 지정해주셔야 됩니다. <br />
그리고 <code><script src = ...></code> 아래에 있는 
```HTML

<div id = "container" style = "min-width: 310px; height: 400px; margin: 0 auto"></div>

```
를 넣어줍니다. <br />
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79948599-200baa00-84af-11ea-8058-12976d530618.png" width = 90%></img></p>

### 그리고 또 하나의 JS파일을 만들고
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79949207-22223880-84b0-11ea-80ec-208c6bdbf5b4.png" width = 90%></img></p>

### 왼쪽 하단에 있는 function() 부분을 복사해서 넣습니다
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79949264-3a925300-84b0-11ea-9c3a-8e0d633ce504.png" width = 90%></img></p>


### 다시 HTML로 돌아옵니다.
아까 새로 function() 부분이 들어간 js파일(graph.js)과 다운 받았던 폴더에 있던
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79949333-5f86c600-84b0-11ea-95fb-a9695cc50334.png" width = 90%></img></p>
jquery-1.11.3 버전이나 최신버전의 jquery를 다운받아서 <script>....</script>에 넣어 주시면 됩니다. <br />
jquery-1.12.3min.js로 돌아가는거 확인했습니다. jquery가 맞지 않으면 돌아가지 않을 수 있습니다. <br />
또한 jquery위치를 가장 위에 올려주시면 되겠습니다. 아래에 놓으면 동작안할 가능성이 있습니다. <br />

### 최종적인 모습은 이렇게 될 것입니다
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79950243-c0fb6480-84b1-11ea-95f2-b1afeb31d586.png" width = 90%></img></p>

### 그리고 실행 시키면
<p align = "center"><img src = "https://user-images.githubusercontent.com/33046341/79950310-d7a1bb80-84b1-11ea-9e38-b384a8541083.png" width = 90%></img></p>

DEMO버전과 똑같은 그래프가 그려집니다. <br />
이제 여기서 원하는 데이터 값을 넣는 것을 추가하거나 여러가지 방법을 통해 각자의 입맛에 맞게 바꿀 수 있습니다. <br />


