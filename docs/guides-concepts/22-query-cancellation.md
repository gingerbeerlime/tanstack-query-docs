## Query 취소하기

### (1) Abort Signal

> 사용자가 페이지를 떠나거나 컴포넌트가 언마운트돼 더 이상 필요없는 네트워크 요청을 중간에 끊고싶을 때 사용할 수 있는 기능

- **Tanstack Query**는 쿼리를 관리하면서 쿼리가 오래되거나(`stale`) 비활성화되면(`inactive`) 내부적으로 `AbortSignal`의 `abort()`를 호출해서 쿼리가 더 이상 필요없다는 신호를 보낸다.
  → 이 `signal`을 네트워크 요청에 연결해 실행중인 네트워크 요청을 중단하도록 제어할 수 있다
- 기본적으로 쿼리는 컴포넌트에서 언마운트되거나 사용되지 않게 되더라도 `Promise`가 `resolve` 되기 전에는 취소되지 않는다(재마운트시 캐시 데이터 사용). 하지만 `AbortSignal`을 사용해 요청을 중단하면 쿼리 자체가 취소되고 이전 상태로 되돌아간다.

### (2) 사용 예시

- **fetch와 함께 사용** - `fetch` 옵션에 `signal`을 전달하면 감지해서 자동 취소

```jsx
const query = useQuery({
  queryKey: ["todos"],
  queryFn: async ({ signal }) => {
    const res = await fetch("/todos", { signal });
    return res.json();
  },
});
```

- **axios(v0.22.0+)**

```jsx
axios.get("todos", { signal });
```

- **axios 구버전, XMLHTTpRequest, graphql-request 구버전**은 `AbortSignal`을 기본 지원하지 않으므로 `signal`에 직접 **이벤트 리스너**를 달아줘야 함

```jsx
import axios from "axios";

const query = useQuery({
  queryKey: ["todos"],
  queryFn: ({ signal }) => {
    // Create a new CancelToken source for this request
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const promise = axios.get("/todos", {
      // Pass the source token to your request
      cancelToken: source.token,
    });

    // Cancel the request if TanStack Query signals to abort
    signal?.addEventListener("abort", () => {
      source.cancel("Query was cancelled by TanStack Query");
    });

    return promise;
  },
});
```

### (3) 수동 취소

- `queryClient.cancelQueries({ queryKey })` 호출하면 쿼리가 즉시 취소, 이전 상태로 롤백
  - 실행중인 네트워크 요청은 중단되지 않고 응답이 도착하면 탠스택 쿼리는 응답 데이터 무시
  - 만약 쿼리 함수에서 `signal`을 사용했다면 `HTTP` 요청도 함께 중단됨

### (4) 한계

- `Suspense` 모드에서는 쿼리 취소가 동작하지 않는다
  - `useSuspenseQuery`, `useSuspenseQueries`, `useSuspenseInfiniteQuery`
