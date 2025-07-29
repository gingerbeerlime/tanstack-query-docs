## Initial Query Data(초기 데이터 설정)

> `InitialData`는 쿼리 실행 전 즉시 보여주기용 데이터

### (1) 초기 데이터 설정 방법

1. 선언적 방식 - `initialData`
   1. 쿼리가 실행됐을 때 캐시에 값이 없으면 초기 데이터로 채움
2. 명령적 방식 - `prefetchQuery()`, `setQueryData()`
   1. `queryClient.prefetchQuery()` : 데이터를 미리 불러와서 캐시에 저장
      - 페이지 전환 전에 다음 페이지 데이터를 미리 불러와서 로딩 없이 보여주기.
      - ex) 무한 스크롤에서 다음 페이지 데이터를 `Intersection Observer`로 `prefetch`.
   2. `queryClient.setQueryData()` : 직접 캐시에 데이터 넣기
      - 캐시에 데이터를 **강제로 삽입**하는 메서드 (fetch 없이)
      - 낙관적 업데이트 (Optimistic Update).
      - ex) 좋아요 버튼 클릭 시 → 서버 응답 기다리지 않고 UI 즉시 반영.

### (2) initialData로 초기 데이터 설정

- 로딩 상태를 건너뛰고 즉시 데이터 표시할 수 있음

```jsx
const result = useQuery({
  queryKey: ["todos"],
  queryFn: () => fetch("/todos"),
  initialData: initialTodos,
});
```

> ⚠️ initialData는 캐시에 실제로 저장됨 → 불완전한 데이터를 사용하지 말 것

- `initialData`에 값을 넣지말고 함수 자체로 넣으면 최초 한번만 실행되기 때문에 **성능 최적화**에 유리
  ```jsx
  // 리액트 컴포넌트가 렌더링될 때마다 실행
  initialData: getExpensiveTodos();
  // 쿼리가 처음 만들어질 때만 실행하고 그 이후로 실행 안함
  initialData: () => getExpensiveTodos();
  ```

### (3) staleTime과 InitialData

- 기본적으로 `InitialData`는 방금 `fetch`한 최신 데이터로 취급됨
- 따라서 `staleTime`이 **0**이면, 마운트되자마자 즉시 `refetch`가 발생함

```jsx
const result = useQuery({
  queryKey: ["todos"],
  queryFn: () => fetch("/todos"),
  initialData: initialTodos,
});
```

⇒ 첫 화면에 `initialTodos`를 보여주지만, 바로 서버에서 다시 불러옴

> ⚠️ **`initialData`를 `prefetch`한 데이터처럼 다루고 싶다면?**<br/>
> ⇒ prefetchQuery() 또는 fetchQuery() 사용

<br/>

### (4) initialDataUpdatedAt

- `initialData`가 오래된 데이터라면 `initialDataUpdatedAt` 옵션을 사용하는 것이 좋다

```jsx
const result = useQuery({
  queryKey: ["todos"],
  queryFn: () => fetch("/todos"),
  initialData: initialTodos,
  staleTime: 60 * 1000, // 1분
  initialDataUpdatedAt: initialTodosUpdatedTimestamp, // 예: Date.now() 값
});
```

- `initialDataUpdatedAt` 에 데이터가 마지막으로 갱신된 시간 지정함
- `staleTime`이 지나면 `refetch` 실행

### (5) 캐시에서 InitialData 가져오기

- ex) 다른 쿼리에서 가져온 데이터를 이용해 개별 쿼리에 초기 데이터 설정가능

```jsx
const result = useQuery({
  queryKey: ["todo", todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () =>
    queryClient.getQueryData(["todos"])?.find((d) => d.id === todoId),
  initialDataUpdatedAt: () =>
    queryClient.getQueryState(["todos"])?.dataUpdatedAt,
});
```

- 캐시 데이터가 오래됐을 가능성이 크므로, `initialDataUpdatedAt`도 함께 설정하는 것이 좋음

### (6) 조건부 캐시 사용

- 캐시 데이터가 너무 오래됐다면, 서버에서 새로 가져오도록 조건부 처리 가능

```jsx
const result = useQuery({
  queryKey: ["todo", todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () => {
    const state = queryClient.getQueryState(["todos"]);
    if (state && Date.now() - state.dataUpdatedAt <= 10 * 1000) {
      return state.data.find((d) => d.id === todoId);
    }
    // 아니면 undefined 반환 → 서버에서 새로 fetch
  },
});
```
