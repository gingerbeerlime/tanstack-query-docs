### Query Retries

> 쿼리 재시도 기능과 `retryDelay` 설정

### (1) 쿼리 재시도

- `useQuery`로 실행한 쿼리가 실패하면 기본적으로 자동 재시도를 함
- 재시도 횟수 기본값으로 3회로 설정되어있음

<aside>
📌

SSR에서는 속도를 위해 디폴트 0회로 설정되어 있음(재시도 안함)

</aside>

### (2) Retry 옵션

- `retry = false` : 재시도 안함
- `retry = 6` : 최대 6번까지 재시도
- `retry = true` : 무한 재시도
- `retry = (failureCount, error) ⇒ …` : 실패 횟수나 에러 종류에 따라 재시도 여부 설정 가능

### (3) 에러 핸들링

- `defaultOptions`로도 설정 가능하고 개별 쿼리마다 설정도 가능
- 재시도 중 발생하는 에러는 `failureReason` 속성에 저장
- 마지막 시도 후 실패는 `error` 속성으로 반환

```jsx
import { useQuery } from "@tanstack/react-query";

// 특정 쿼리에서 재시도 횟수 설정
const result = useQuery({
  queryKey: ["todos", 1],
  queryFn: fetchTodoListPage,
  retry: 10, // 실패하면 최대 10번 재시도 후 에러 표시
});
```

### (4) Retry Delay

- 기본적으로 실패 후 즉시 재시도하지 않고, 점점 늘어나는 대기 시간을 적용함

```jsx
// 지수 백오프(최대 30초)
1000ms × 2^시도횟수
```

- 1초 → 2초 → 4초 → 8초 .. 재시도 횟수가 증가할 때마다 대기 시간 증가
- 커스텀 가능
