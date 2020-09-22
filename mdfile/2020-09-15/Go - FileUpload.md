### 시작
시작하기 앞서 myapp/app_test.go파일에 테스트 코드를 하나 만들어준다. <br />

``` Go

  func TestFooHandler_WithoutJson(t *testing.T) {
    assert := assert.New(t)

    res := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/foo", nil)

    mux := NewHttpHandler()
    mux.ServeHTTP(res, req)

    assert.Equal(http.StatusBadRequest, res.Code)
  }

```
