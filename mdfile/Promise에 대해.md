## Q. Promise가 뭔가요?
```typescript
  // 생성된 데이터 리스트 출력
public async all(): Promise<Response> {
    const sampleList = await this.sampleService.find();
    return this.res.send(sampleList);
}

// select -> routes/Sample.route.ts 참조.
public async find(): Promise<Response> {
    const { id } = this.req.params as unknown as { id: number };
    const sample = await this.sampleService.findOneById(id);
    if (sample) {
        return this.res.status(200).send(sample);
    } else {
        return this.res.status(404).send({ text: "not found" });
    }
}
```
이외에도 Promise가 쓰이는 곳이 많은데 Promise가 뭔가요?

## A. [Promise에 대해](https://joshua1988.github.io/web-development/javascript/promise-for-beginners/)
## A. [콜백부터 async await까지 비동기 처리](https://velog.io/@ashnamuh/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%BD%9C%EB%B0%B1%EB%B6%80%ED%84%B0-async-await%EA%B9%8C%EC%A7%80-%EB%B9%84%EB%8F%99%EA%B8%B0-%EC%B2%98%EB%A6%A)
