## Query Invalidation(쿼리 무효화)

> `invalidateQueries` 함수를 사용해 의도적으로 쿼리 데이터를 `stale` 상태로 표시하고, 다시 `refetch`하도록 설정할 수 있다

### (1) invalidateQueries

- 기본 사용법

```jsx
// 캐시 내의 모든 쿼리를 무효화
queryClient.invalidateQueries();
// queryKey가 'todos'로 시작하는 모든 쿼리를 무효화
queryClient.invalidateQueries({ queryKey: ["todos"] });
```

- 쿼리를 invalidate 시켰을 때
  1. 쿼리가 `stale`로 표시됨 : 이 `stale` 상태는 `useQuery` 또는 관련 훅에서 사용되는 모든 `staleTime` 설정을 무시함
  2. `refetch`가 실행됨 : `useQuery`나 관련 훅을 통해 렌더링되고 있다면 백그라운드에서 리페치가 트리거됨

### (2) invalidateQueries 쿼리 매칭

1. **부분 쿼리 매칭**

   - 쿼리 키가 ‘todos’ 로 시작하는 모든 쿼리 무효화

   ```jsx
   queryClient.invalidateQueries({ queryKey: ["todos"] });

   // ✅ 아래 두 쿼리 모두 무효화
   const todoListQuery = useQuery({
     queryKey: ["todos"],
     queryFn: fetchTodoList,
   });
   const todoListQuery = useQuery({
     queryKey: ["todos", { page: 1 }],
     queryFn: fetchTodoList,
   });
   ```

2. **특정 변수를 가진 쿼리만 무효화**

   ```jsx
   queryClient.invalidateQueries({
     queryKey: ["todos", { type: "done" }],
   });

   // ✅ 무효화
   const todoListQuery = useQuery({
     queryKey: ["todos", { type: "done" }],
     queryFn: fetchTodoList,
   });

   // ❌ 무효화되지 않음
   const todoListQuery = useQuery({
     queryKey: ["todos"],
     queryFn: fetchTodoList,
   });
   ```

3. **정확하게 일치하는 키를 가진 쿼리만 무효화**

   - `exact: true` 옵션 사용
   - 추가 변수나 하위 키가 없는 정확히 동일한 키를 가진 쿼리만 무효화

   ```jsx
   queryClient.invalidateQueries({
     queryKey: ["todos"],
     exact: true,
   });

   // ✅ 무효화
   const todoListQuery = useQuery({
     queryKey: ["todos"],
     queryFn: fetchTodoList,
   });

   // ❌ 무효화되지 않음
   const todoListQuery = useQuery({
     queryKey: ["todos", { type: "done" }],
     queryFn: fetchTodoList,
   });
   ```

4. **`predicate` 함수 사용하기**

   - `invalidateQueries`에 `predicate` 함수를 전달해 세밀한 제어 가능
   - `predicate` 함수는 쿼리 캐시의 각 쿼리 인스턴스를 받아 해당 쿼리를 무효화할지 여부를 `true` 또는 `false`로 반환

   ```jsx
   queryClient.invalidateQueries({
     predicate: (query) =>
       query.queryKey[0] === "todos" && query.queryKey[1]?.version >= 10,
   });

   // ✅ 무효화
   const todoListQuery = useQuery({
     queryKey: ["todos", { version: 20 }],
     queryFn: fetchTodoList,
   });

   // ✅ 무효화
   const todoListQuery = useQuery({
     queryKey: ["todos", { version: 10 }],
     queryFn: fetchTodoList,
   });

   // ❌ 무효화되지 않음
   const todoListQuery = useQuery({
     queryKey: ["todos", { version: 5 }],
     queryFn: fetchTodoList,
   });
   ```
