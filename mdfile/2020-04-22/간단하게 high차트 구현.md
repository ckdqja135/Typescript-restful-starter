# [JavaScript] 캔들차트 그리기, Highcharts 이용

다음 소스를 따라하면 그래프가 그려집니다.

```HTML

  <html>
    <head>
      <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
      <script src="https://code.highcharts.com/stock/highstock.js"></script>
      <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
    </head>
    <body>
      <div id="container" style="height: 400px; min-width: 310px"></div>
      <script>
        function draw3(){
          var chartdata = [];
          $.getJSON('https://poloniex.com/public?command=returnChartData&currencyPair=BTC_ETH&start=1455699200&end=9999999999&period=14400', function (data) {
            $.each(data, function(i, item){
              chartdata.push([item.date*1000, item.open, item.high, item.low, item.close]);
            });
          }).done(function(){
            Highcharts.stockChart('container',{
              title: {
                text: 'ETH/BTC'
              },
              rangeSelector: {
                buttons: [
                  {type: 'hour',count: 1,text: '1h'}, 
                  {type: 'day',count: 1,text: '1d'}, 
                  {type: 'all',count: 1,text: 'All'}
                ],
                selected: 2,
                inputEnabled: true
              },
              plotOptions: {
                candlestick: {
                  downColor: 'blue',
                  upColor: 'red'
                }
              },
              series: [{
                name: 'ETH/BTC',
                type: 'candlestick',
                data: chartdata,
                tooltip: {
                  valueDecimals: 8
                }
              }]
            });
          });
        }
        draw3();
      </script>
    </body>
  </html>

```

### 색깔 설정
```JSON
  
   plotOptions: {
                candlestick: {
                  downColor: 'blue',
                  upColor: 'red'
                }
              }
            
```
위의 코드를 통해 차트의 색상을 조절할 수 있습니다.

### 데이터
위 차트의 데이터는 [여기](https://poloniex.com/public?command=returnChartData&currencyPair=BTC_ETH&start=1455699200&end=9999999999&period=14400)에서 확인 할 수 있습니다.

### 홈페이지 구동
[여기](211.207.68.165/high.html)에 들어가면 해당 코드를 체험 하실 수 있습니다.
