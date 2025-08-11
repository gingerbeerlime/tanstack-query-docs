## Optimistic Updates(낙관적 업데이트)

> **낙관적 업데이트?** 서버 응답이 오기 전에 서버 요청이 성공할 것이라고 믿고 화면을 빠르게 먼저 업데이트 하는 방식, 서버 요청이 실패하면 롤백

### 낙관적 업데이트를 하는 2가지 방법

1. `useMutation` 결과로부터 반환되는 `variables`를 활용해 UI 업데이트
2. `onMutate` 옵션을 사용해 캐시를 직접 업데이트

### (1) UI 임시 표시

```jsx
const addTodoMutation = useMutation({
  mutationFn: (newTodo: string) => axios.post("/api/data", { text: newTodo }),
  // 리페치가 끝날 때까지 mutation이 `pending` 상태를 유지하도록
  // 쿼리 무효화에서 반환된 Promise를 반드시 return!
  // 이유)return하지 않으면 리페치 시작과 함께 mutation이 즉시 완료(success/error)로 전환됨
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
});

const { isPending, submittedAt, variables, mutate, isError } = addTodoMutation;
```

```jsx
<ul>
  {todoQuery.items.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
  // isPending 상태일 때만 임시 데이터 표시
  {isPending && (
    <li key={`temp-${submittedAt}`} style={{ opacity: 0.5 }}>
      {variables}
    </li>
  )}
</ul>
```

- `useMutation`의 `isPending`, `variables(newTodo)` 를 활용해 임시 아이템을 표시할 수 있다
  1. 상태가 `isPending`인 동안 리스트에 아이템을 하나 임시로 붙임
  2. 요청이 완료되면 `invalidateQueries`로 리페치하고 진짜 데이터로 대체
- `variables`에는 마지막으로 실행된 `mutation`의 인자만 담기므로 동시에 여러 `mutation`이 실행되면 UI에는 하나만 반영된다. -> 이런 경우 `useMutationState`가 더 안전함

<br/>

### (2) UI 임시 표시 - `mutation`과 `query`가 같은 컴포넌트에 없는 경우

- `useMutationState` 훅 + `mutationKey`를 사용하면 다른 컴포넌트에서도 `mutation` 상태를 조회할 수 있다.
- 아이템에 고유 `key`가 필요하다면 `mutation.state.submittedAt`을 임시로 사용할 수 있음

```jsx
// 앱의 어딘가
const { mutate } = useMutation({
  mutationFn: (newTodo: string) => axios.post("/api/data", { text: newTodo }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  mutationKey: ["addTodo"],
});

// 다른 곳에서 접근
const variables =
  useMutationState <
  string >
  {
    filters: { mutationKey: ["addTodo"], status: "pending" },
    select: (mutation) => mutation.state.variables,
  };
```

<br/>

### (3) 캐시 낙관적 업데이트 - onMutate()

- `useMutation`훅의 라이프사이클 콜백 중 하나로
- 네트워크 요청(`mutationFn`)이 시작되기 직전에 실행된다
- `mutationFn`은 `onMutate`가 `Promise` 반환하면 그게 끝날 때까지 기다렸다가 실행된다
- 따라서 `onMutate` 함수에서 `cancelQueries`, `setQueryData`를 사용해 낙관적 업데이트를 적용할 수 있다
- `onMutate`에서 반환된 값은 `onError`와 `onSettled` 핸들러의 마지막 인자(`context`)로 전달된다

```jsx
const qc = useQueryClient()
useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await qc.cancelQueries({ queryKey: ['todos'] })
    const prev = qc.getQueryData<Todo[]>(['todos'])
    qc.setQueryData<Todo[]>(['todos'], (old=[]) => [...old, newTodo])
    return { prev }
  },
  onError: (err, newTodo, context) => qc.setQueryData(['todos'], context?.prev),
  onSettled: () => qc.invalidateQueries({ queryKey: ['todos'] }),
})

```

- `onMutate()`에서 낙관적 업데이트 흐름
  1. `cancelQueries`로 리페치 데이터 충돌 방지
  2. 이전값 스냅샷 저장(`getQueryData`) ⇒ `context`로 반환
  3. `setQueryData`로 캐시에 낙관적 값 업데이트(기본값도 함께 설정하는 것이 안전)
  4. 실패 시 `onError`에서 스냅샷(`context`)으로 롤백
  5. 성공/실패 후 `onSettled`에서 `invalidateQueries`로 최종 동기화

<br/>

> 📌 **낙관적 업데이트 UI 업데이트 vs 캐시 업데이트**
>
> - 한 곳에서만 임시 결과를 보여줄 땐<br/>
>   → `variables`로 UI만 임시 처리하는 것이 간단함<br/>
>   → 실패했을 때 롤백 처리 필요 없음
> - 화면의 여러 곳에서 동시에 같은 변경이 일어나야 한다면<br/>
>   → 캐시를 직접 업데이트해야(`onMutate`) 모든 컴포넌트가 동시에 바뀜

<br/>

### (4) 낙관적 업데이트 시 주의점

- 캐시 직접 업데이트할 때 기존 캐시 객체를 직접 변경하지 말고 새 객체/배열 만들어서 교체
- 서버가 `id` 만들어 주는 경우, `submittedAt` 또는 임시 `id`로 `key` 처리
- 낙관적 업데이트를 사용하더라도 종종 `invalidate → refetch`로 서버와 상태 맞추기
- `onMutate`에서 캐시 업데이트시 `cancelQueries`로 리페치 덮어쓰는 것 방어
