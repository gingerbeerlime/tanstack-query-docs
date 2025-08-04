## Mutations

> 뮤테이션(`useMutation`) : 데이터를 생성, 수정, 삭제하거나 서버에서 어떤 사이드 이펙트를 일으킬 때 사용

### (1) useMutation 훅

```jsx
function App() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post("/todos", newTodo);
    },
  });
}
```

- `useMutation`훅을 사용해 **“어떤 작업을 서버에 어떻게 요청할지”** 정의
- `mutationFn` : 실제로 서버에 요청을 보내는 함수
- `mutation.mutate()` 로 뮤테이션 함수를 실행시킬 수 있다.
- 호출할 때 파라미터를 함께 전달할 수 있음. 파라미터는 **단일 변수 or 객체**로 묶어서

```jsx
mutation.mutate({ id: new Date(), title: "Study Tanstack Query" });
```

<br/>

### (2) Mutaion의 상태

| isIdle    | 아무것도 안하는 상태 or 데이터가 신선한 상태 |
| --------- | -------------------------------------------- |
| isPending | 요청을 보내고 있는 중                        |
| isError   | 요청이 실패했을 때                           |
| isSuccess | 요청이 성공했을 때                           |

- `isError = true` 일 때 `error` 속성 사용가능
- `isSuccess = true` 일 때 `data` 속성 사용 가능

<br/>

### (3) Mutation은 비동기

> ⚠️ `useMutation.mutate()` 함수는 비동기적으로 동작하는데, 리액트 16버전 이하에서는 *리액트 이벤트 풀링*으로 인해 `mutate` 함수에서 이벤트 객체를 사용할 수 없다.<br/>

- **리액트 이벤트 풀링이란**? React 16 이하에서는 `onClick`, `onSubmit`과 같은 이벤트 객체(`event`)를 재사용하기 위해 한번 사용하고 비움. 따라서 이벤트 핸들러가 끝나면 `event` 객체가 초기화돼서 속성 접근이 불가능해짐<br/>
  ⇒ 이벤트 객체를 비동기 함수 안에 쓸 수 없음<br/>

> 📌 리액트 17부터는 이벤트 풀링 기능이 없어져서 `mutate()` 함수에서 이벤트 객체를 바로 사용해도 무방함

```jsx
// ❌ 리액트 16이하에서 동작 안함
const CreateTodo = () => {
  const mutation = useMutation({
    mutationFn: (event) => {
      event.preventDefault(); // mutate()함수가 event 객체를 사용하려할 때 이미 비워지고 없음
      return fetch("/api", new FormData(event.target));
    },
  });
};
```

```jsx
// ✅ 이벤트 객체 처리는 다른 함수에서
const CreateTodo = () => {
  const mutation = useMutation({
    mutationFn: (formData) => {
      return fetch("/api", formData);
    },
  });
  const onSubmit = (event) => {
    event.preventDefault(); // 이벤트는 동기 처리
    mutation.mutate(new FormData(event.target)); // mutate에는 안전한 데이터만 전달
  };

  return <form onSubmit={onSubmit}>...</form>;
};
```

<br/>

### (4) Mutation 초기화

- `reset()` : Mutation에서 발생한 에러나 서버 응답 데이터를 지우고 싶을 때 사용

```jsx
const CreateTodo = () => {
  ...
  return (
    <form onSubmit={onCreateTodo}>
      {mutation.error && (
        <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button type="submit">Create Todo</button>
    </form>
  )
}
```

- `mutation.error` 가 있으면 에러 메시지 표시
- `mutation.reset()`
  - status === ‘idle’
  - data === undefined
  - error === null
  - isError / isSuccess / isLoading 초기화 로 변경

<br/>

### (5) useMutation 라이프사이클 콜백

| 콜백 종류 | 실행 시점                                            | 주요 목적                                             |
| --------- | ---------------------------------------------------- | ----------------------------------------------------- |
| onMutate  | mutate()가 호출된 직후, 서버 요청을 보내기 전에 실행 | - Optimistic UI 업데이트, 롤백용 데이터 저장(context) |
| onError   | 요청 실패 시 실행                                    | - Optimistic UI 롤백                                  |
| onSuccess | 요청 성공 시 실행                                    | - 성공 알림                                           |
| onSettled | 성공/실패와 관련없이 무조건 마지막에 실행            | - 로딩 상태 초기화, 공통 정리 작업                    |

```jsx
useMutation({
  mutationFn: addTodo,
  onMutate: (variables) => {
    console.log("뮤테이션 시작 전!", variables);
    return { id: 1 }; // 롤백할 때 사용할 데이터
  },
  onError: (error, variables, context) => {
    console.log(`에러 발생! 롤백: ${context.id}`);
  },
  onSuccess: () => {
    console.log("성공!");
  },
  onSettled: () => {
    console.log("성공이든 실패든 끝!");
  },
});
```

> **`mutate()`호출 시 추가 콜백**
>
> - 컴포넌트 별로 다른 사이드 이펙트를 실행하거나
> - 공통 콜백 이후 별도의 콜백을 실행하고 싶을 때(`useMutation`에 설정된 콜백 이후에 실행)
> - `onSuccess`, `onError`, `onSettled` 3가지 사용 가능, `onMutate`는 `useMutation` 옵션으로만 제공

```jsx
mutation.mutate(todo, {
  onSuccess: () => {
    console.log("useMutation에 정의된 onSuccess 이후 실행!");
  },
});
```

### (6) useMutation 콜백 vs mutate() 콜백

```jsx
// useMutateion 콜백
useMutation({
  onSuccess: () => {
    console.log("useMutation: 매번 실행됨!");
  },
});

// mutate() 콜백
mutate("Todo 1", {
  onSuccess: () => console.log("mutate: 첫 번째 콜백"),
});
mutate("Todo 2", {
  onSuccess: () => console.log("mutate: 두 번째 콜백"),
});
mutate("Todo 3", {
  onSuccess: () => console.log("mutate: 세 번째 콜백"),
});
```

```jsx
useMutation: 매번 실행됨!  // Todo 1
useMutation: 매번 실행됨!  // Todo 2
useMutation: 매번 실행됨!  // Todo 3
mutate: 세 번째 콜백           // (마지막 호출만 실행, 비동기므로 호출 순서와 다를 수 있음)
```

> ⚠️ 여러개의 `Mutation`을 연속 실행할 때 `mutate()` 안의 콜백들은 마지막 요청에서만 실행됨.<br/>
> 반면에 `useMutation`에 정의된 콜백들은 모든 요청마다 실행됨

- 리액트 쿼리는 `mutate()`를 호출할 때마다 새로운 `observer`로 재구독함
  ⇒ 따라서 `mutate()`에 전달한 콜백은 현재 `observer`에만 연결됨
- 새로운 `mutate()`가 실행되면 이전 `observer`는 해제되므로 이전 콜백은 실행되지 않음
- `useMutation` 옵션 콜백은 `mutation` 전체를 관찰하므로 모든 호출에 대해 실행됨

<br/>

### (7) mutate vs mutateAsync

```jsx
const result = await mutation.mutateAsync(formData);
console.log(result); // 서버 응답 데이터
```

| 함수                   | 실행 방식                    | 반환값                     | 사용 예시                                                                                               |
| ---------------------- | ---------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| `mutation.mutate`      | **즉시 실행** 후 비동기 처리 | **아무것도 반환하지 않음** | 폼 제출 버튼처럼 “그냥 실행”할 때<br/>실행 후 결과는 콜백으로 처리(`onSuccess`, `onError`, `onSettled`) |
| `mutation.mutateAsync` | **Promise를 반환**           | **Promise**                | `await`로 직접 결과를 받고 싶을 때                                                                      |

<br/>

### (8) Retry(재시도)

기본적으로 탠스택 쿼리에서 `mutation`은 에러가 나도 재시도를 하지 않지만 `retry` 옵션으로 커스텀 설정을 할 수 있음

```jsx
const mutation = useMutation({
  mutationFn: addTodo,
  retry: 3,
});
```

<br/>

### (9) 오프라인에서도 안전하게 데이터 업데이트하기(Persist Mutations)

> 인터넷이 끊겨서 `mutation`이 실패하면, 다시 네트워크가 연결될 때 자동으로 재시도 한다.
> 오프라인 앱, 모바일 환경, 중요한 요청(ex. 결제, 데이터 저장)와 같은 상황에서 활용

1. `Mutation`을 등록하고 실행

   - 오프라인이 되면 `status = ‘paused’`

   ```jsx
   const mutation = useMutation({ mutationKey: ["addTodo"] });
   mutation.mutate({ title: "title" });
   ```

2. 앱 종료 전에 상태 저장(`Dehydrate`)

   - `queryClient`의 모든 상태(`query + mutation`)를 직렬화해서 저장 → `localStorage`, `indexedDB`등에 보관
   - `mutationFn` 함수 자체를 저장할 수는 없으니 `queryClient.setMutationDefaults()` 실행할 기본 함수를 지정.

   ```jsx
   const state = dehydrate(queryClient);
   ```

3. 앱 재시작 시 상태 복원(`Hydrate`)

   - 앱 시작 후, 저장해둔 상태를 `queryClient`에 다시 주입

   ```jsx
   hydrate(queryClient, state);
   ```

4. 중단된 `mutation` 재개

   - 온라인 상태로 돌아오면 중단된 `mutation`들이 다시 실행

   ```jsx
   queryClient.resumePausedMutations();
   ```

   <br/>

> 간단한 persist & resume 사용

```jsx
const queryClient = new QueryClient();

// 기본 mutation 함수 설정
queryClient.setMutationDefaults(["addTodo"], {
  mutationFn: addTodo, // 서버에 할 일 추가 요청
  retry: 3, // 실패 시 최대 3번 재시도
});

// 앱을 종료할 때 현재 상태 저장
const state = dehydrate(queryClient);

// 앱을 다시 켰을 때 상태 복원
hydrate(queryClient, state);

// 중단된 뮤테이션 재개
queryClient.resumePausedMutations();
```

> persistQueryClientProvider

```jsx
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24시간 캐시 유지
    },
  },
});

// 기본 mutation 함수 설정
queryClient.setMutationDefaults(["todos"], {
  mutationFn: ({ id, data }) => api.updateTodo(id, data),
});

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        queryClient.resumePausedMutations(); // 로컬스토리지에서 복원 성공 시 뮤테이션 이어서 실행
      }}
    >
      <RestOfTheApp />
    </PersistQueryClientProvider>
  );
}
```

<br/>

### (10) Mutation Scopes(순차 실행)

- 기본적으로 모든 뮤테이션은 병렬(동시에) 실행됨
- 그러나 `scope.id`를 주면 순차적으로 실행됨

```jsx
const mutation = useMutation({
  mutationFn: addTodo,
  scope: {
    id: "todo", // 이 ID가 같은 요청은 차례대로 실행됨
  },
});
```

###
