# Query Functions

> 쿼리 함수는 `Promise`를 반환하는 어떤 함수든 사용할 수 있다.

- 성공 시 : `Promise.resolve(data)`
- 실패 시: `throw` 또는 `Promise.reject()`

<br/>

## (1) 쿼리 함수 작성법

```jsx
// 기본
useQuery({ queryKey: ["todos"], queryFn: fetchAllTodos });

// 파라미터 직접 전달
useQuery({ queryKey: ["todos", todoId], queryFn: () => fetchTodoById(todoId) });

// async-await
useQuery({
  queryKey: ["todos", todoId],
  queryFn: async () => {
    const data = await fetchTodoById(todoId);
    return data;
  },
});
```

- `queryKey`를 통해 `queryFn`에 파라미터 전달하기

  ```jsx
  function Todos({ status, page }) {
    return useQuery({
      queryKey: ["todos", { status, page }],
      queryFn: fetchTodoList,
    });
  }

  function fetchTodoList({ queryKey }) {
    const [_key, { status, page }] = queryKey;
    return fetch(`/api/todos?status=${status}&page=${page}`).then((res) =>
      res.json()
    );
  }
  ```

## (2) 에러 처리

- 반드시 `throw` 하거나 `Promise.reject()` 처리해야 에러 상태로 인식됨

```jsx
const { error } = useQuery({
  queryKey: ["todos", todoId],
  queryFn: async () => {
    if (somethingGoesWrong) {
      throw new Error("문제가 발생했어요!");
    }

    if (somethingElseWrong) {
      return Promise.reject(new Error("다른 문제도 발생했어요!"));
    }

    return data;
  },
});
```

> ⚠️ fetch를 사용할 떄는 기본적으로 404, 500 같은 상태 코드에서 에러를 throw 하지 않기 때문에 직접 검사하고 throw 해야 함. axios는 자동으로 throw 해줌

<br/>

## (3) QueryFunctionContext\*\*

- 쿼리 함수에 자동으로 전달되는 `context` 객체

  | 항목       | 설명                                           |
  | ---------- | ---------------------------------------------- |
  | `queryKey` | 쿼리 키 배열                                   |
  | `client`   | QueryClient 인스턴스                           |
  | `signal`   | `AbortSignal` – 쿼리 취소용                    |
  | `meta`     | 쿼리에 부여된 메타데이터 (`queryOptions.meta`) |

  ```jsx
  function fetchData({ queryKey, signal, meta }) {
    // signal: 요청 취소할 때 사용 가능
    return fetch("/api", { signal }).then((res) => res.json());
  }
  ```
