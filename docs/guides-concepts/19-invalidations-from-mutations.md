## Invalidations from Mutations(뮤테이션에서 쿼리 무효화)

> `invalidateQueries`는 쿼리를 최신 데이터로 갱신하는 핵심 도구

- 뮤테이션이 성공해도 쿼리 데이터는 자동으로 갱신되지 않음.
- 따라서 뮤테이션이 성공했을 때 관련 쿼리를 `stale`(오래됨) 상태로 표시하고 다시 `refetch`하도록 설정
- `onSuccess` 콜백에서 `invalidateQueries`실행

```jsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: addTodo, // todos 업데이트
  onSuccess: () => {
    // 뮤테이션 성공 후 todos 쿼리를 무효화시킴으로 refetch 트리거
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```
