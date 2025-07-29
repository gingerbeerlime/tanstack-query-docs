## Placeholder Query Data

> Placeholder Data는 가짜 데이터를 미리 넣어서 로딩 상태 없이 UI를 빠르게 보여주는 기능

### (1) Placeholder Data를 사용할 때

- 서버에서 데이터를 다 가져오기 전에 화면을 미리 그려야 할 때(미리 보기)
  - ex) 블로그 상세페이지 로드 시, 리스트 조회 시 받은 제목 + 미리보기만 먼저 보여주기
  - ⇒ 로딩 스피너 표시 X

### (2) Placeholder Data의 특징

- 쿼리가 이미 데이터를 갖고 있기 때문에 `state: success` 상태로 시작
  - `isPlaceholderData` 플래그를 통해 진짜 데이터인지 플레이스홀더 데이터인지 구분 가능
- `initialData`와 달리 캐시에 저장되지 않음

### (3) Placeholder Data 사용법

1. **값**

```jsx
function Todos() {
  const result = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/todos"),
    placeholderData: placeholderTodos, // 예: 가짜 할일 목록
  });
}
```

1. **메모이제이션** - `useMemo` : 한번만 계산하기 때문에 플레이스홀더 데이터를 만드는 함수가 복잡할 때 사용 가능

```jsx
function Todos() {
  const placeholderData = useMemo(() => generateFakeTodos(), []);
  const result = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/todos"),
    placeholderData,
  });
}
```

1. **함수로 전달**

   1. **이전 쿼리 데이터 재활용** : 페이지 변경 시 이전 페이지 데이터를 `plcaeholder`로 보여줌

   ```jsx
   const result = useQuery({
     queryKey: ["todos", id],
     queryFn: () => fetch(`/todos/${id}`),
     placeholderData: (previousData) => previousData,
   });
   ```

2. **캐시에서 가져오기**

   1. 리스트 쿼리에서 미리보기 데이터 가져와 상세 쿼리의 `placeholder`로 사용

   ```jsx
   function BlogPost({ blogPostId }) {
     const queryClient = useQueryClient();
     const result = useQuery({
       queryKey: ["blogPost", blogPostId],
       queryFn: () => fetch(`/blogPosts/${blogPostId}`),
       placeholderData: () => {
         return queryClient
           .getQueryData(["blogPosts"])
           ?.find((d) => d.id === blogPostId); // 리스트에서 해당 글 찾아서 사용
       },
     });
   }
   ```

### (4) initial Data vs Placeholder Data

| 특징              | initialData               | placeholderData                                  |
| ----------------- | ------------------------- | ------------------------------------------------ |
| 캐시에 저장?      | ✅ 저장됨                 | ❌ 저장 안 됨                                    |
| isPlaceholderData | ❌ 없음                   | ✅ true                                          |
| 주로 사용 용도    | 이미 정확한 데이터가 있음 | 미리보기 / 가짜 데이터                           |
| staleTime 영향    | 있음                      | 있음(실제 데이터가 들어온 후부터 staleTime 적용) |

- `InitialData`는 **캐시에 저장되고 리액트 쿼리가 진짜 데이터로 인식하고 관리**하기 떄문에 불완전한 데이터를 사용하면 안됨
- `placeholderData`는 **캐시에 저장되지 않고 데이터 페칭 중 렌더링을 위한 임시 데이터**이기 때문에 불완전한 데이터여도 상관없음. 리액트 쿼리도 `isPlaceholderData: true` 로 임시 데이터임을 인식

### (5) initialData, PlaceholderData, prefetchQuery, setDataQuery의 사용케이스

- `initialData`
  - 이미 정확한 데이터를 메모리나 SSR에서 갖고 있을 때
- `placeholderData`
  - 리스트 → 상세페이지 전환 시 리스트에서 받은 일부 데이터(타이틀, 썸네일)로 상세 화면 레이아웃 먼저 보여줄 때
  - 로딩 스피너 대신 가짜 데이터 보여주고 싶을 때
- `prefetchQuery`
  - 페이지 전환 전에 다음 페이지 데이터를 미리 불러와서 로딩 없이 보여주기.
  - ex) 무한 스크롤에서 다음 페이지 데이터를 I`ntersection Observer`로 `prefetch`.
- `setQueryData`
  - 캐시에 데이터를 **강제로 삽입**하는 메서드 (fetch 없이)
  - 낙관적 업데이트 (Optimistic Update).
  - ex) 좋아요 버튼 클릭 시 → 서버 응답 기다리지 않고 UI 즉시 반영.
