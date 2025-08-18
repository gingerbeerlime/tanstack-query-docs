## Filters

### (1) Query Filters (쿼리 필터)

쿼리 캐시에 저장된 쿼리들을 조건별로 선택/제거/갱신할 때 사용

```jsx
// 필터 없음 - 모든 쿼리 취소
await queryClient.cancelQueries()

// queryKey가 'posts'로 시작하는 모든 비활성 쿼리 제거
queryClient.removeQueries({ queryKey: ['posts'], type: 'inactive' })

// queryKey가 'posts'로 시작하는 모든 활성 쿼리 다시 가져오기
await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })})

// query key는 'posts'로 시작하면서,
// 마지막으로 업데이트된 시간이 5분 넘은 쿼리만 취소
queryClient.cancelQueries({
  queryKey: ['posts'],
  predicate: (query) => {
    return (Date.now() - query.state.dataUpdatedAt) > 5 * 60 * 1000
  },
})
```

- `queryKey`: 매칭할 쿼리 키 지정 - 기본적으로 key가 포함된 모든 쿼리 검색
- `exact`: `true`면 `queryKey`를 정확히 일치시켜 검색
- `type` : `active`(활성 쿼리) / `inactive`(비활성 쿼리) / `all`(기본값)
- `stale`: `true`(오래된 쿼리) / `false`(최신 쿼리)
- `fetchStatus`: `fetching` / `paused` / `idle`
- `predicate`
  - 개발자가 직접 정의하는 최종 필터 함수
  - 다른 필터(`queryKey`, `type`, `stale`, `fetchStatus`)와 함께 사용 가능
  - 캐시된 쿼리 객체의 `state`를 활용해 세밀하게 제어 가능

### (2) Mutation Filters (뮤테이션 필터)

진행중인 뮤테이션들을 조건별로 필터링

```jsx
// 진행중인 모든 뮤테이션 수 가져오기
await queryClient.isMutating();

// mutationKey로 필터링
await queryClient.isMutating({ mutationKey: ["posts"] });

// 실패한 mutation 중에서 네트워크 에러인 것만 필터링
await queryClient.isMutating({
  status: "error",
  predicate: (mutation) =>
    mutation.state.error?.message.includes("Network Error"),
});
```

- `mutationKey`: 매칭할 뮤테이션 키 지정
- `exact`: `true`면 `mutationKey`를 정확히 일치시켜 검색
- `status`: 뮤테이션 상태별 필터링 가능
- `predicate`
  - variables 값에 따라 특정 mutation만 선택
  - mutation 상태(loading, success, error)와 결합해 세밀하게 제어

### (3) Utils

- `matchQuery(filters, query)` - 쿼리가 필터 조건과 일치하는지 확인, `boolean`값 반환
- `matchMutation(filters, mutation)` - 뮤테이션이 필터 조건과 일치하는지 확인, `boolean` 값 반환
