## Mutation 응답으로 쿼리 업데이트하기

### (1) setQueryData

> `Mutation`을 통해 데이터를 업데이트했을 때, 다시 쿼리를 호출(`fetch`)하지 않고 `mutation` 함수에서 반환된 객체를 활용해 `setQueryData` 함수로 기존 쿼리를 즉시 업데이트할 수 있다

- `setQueryData`를 사용해서 기존 쿼리를 업데이트하면
  - 화면이 즉시 업데이트됨
  - 서버에 불필요한 네트워크 요청을 하지 않음
- `onSuccess` 로직에서 사용

```jsx
const useMutateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTodo,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["todo", { id: variables.id }], data);
    },
  });
};
```

- `variables`에는 `mutate` 호출시 넘긴 요청 변수(`id`, 수정 필드들)이 들어있음. `variables.id`를 사용해서 정확한 타겟 캐시를 찾아 수동 업데이트

<br/>

### (2) 쿼리 수동 업데이트시 불변성 유지

> ⚠️ `setQueryData`로 데이터를 업데이트할 때는 불변성 유지<br/>
> ⇒ 기존 캐시 데이터를 직접 수정하지 말고 새로운 객체를 만들어 반환해야 함

```jsx
onSuccess: (updatedUser) => {
  queryClient.setQueryData(['users'], (old) => {
    if (!old) return old
    return old.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
  })
```

<br/>

### (3) setQueriesData

- 여러 리스트(ex. 필터/검색 조건이 다른 캐시들)를 한꺼번에 업데이트 하고 싶을 땐 `setQueriesData`를 사용해 일괄 갱신할 수 있음

```jsx
onSuccess: (updatedUser) => {
  queryClient.setQueriesData(
    { queryKey: ["users"], exact: false }, // 'users'로 시작하는 모든 쿼리
    (old) => {
      if (!old) return old;
      // old가 배열인 경우
      if (Array.isArray(old)) {
        return old.map((u) =>
          u.id === updatedUser.id ? { ...u, ...updatedUser } : u
        );
      }
      // old가 InfiniteData인 경우
      if (old.pages && Array.isArray(old.pages)) {
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((u) =>
              u.id === updatedUser.id ? { ...u, ...updatedUser } : u
            )
          ),
        };
      }
      return old;
    }
  );
};
```

<br/>

### (4) setQueryData vs invalidateQueries

- 정렬/필터에 영향 없는 부분 필드 변경이라면 `setQueryData`를 사용해 캐시를 부분 업데이트하는게 빠르고 효율적
- 리스트의 항목 구성 자체가 바뀔 수 있거나 정렬이 달라질 수 있는 경우는 `invalidateQueries`를 통해 전체를 갱신하는 방식이 더 단순하고 안전할 수 있음
