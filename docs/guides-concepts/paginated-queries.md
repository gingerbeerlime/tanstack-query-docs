## Paginated / Lagged Queries

> 페이징 처리, `placeholderData` 활용 방식

### (1) 기본 페이징 처리 방식

```jsx
useQuery({
  queryKey: ["projects", page],
  queryFn: fetchProjects,
});
```

- `queryKey`에 `page` 정보를 포함시키면 자동으로 페이징 처리가 됨
- **한계점** : 페이지를 이동할 때 **각 새로운 페이지 요청이 새로운 쿼리로 인식**되어 이전 페이지 데이터는 사라지고, 새 페이지 데이터가 올 때까지 `pending` 상태 ⇒ UI 깜빡거림

### (2) ✨placeholderData

- `placeholderData`는 새 데이터가 로드되기 전, 이전 데이터를 임시로 보여줄 수 있는 기능 ⇒ 자연스러운 화면 전환

```jsx
import { keepPreviousData, useQuery } from '@tanstack/react-query'

...

  const { data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['projects', page],
    queryFn: () => fetchProjects(page),
    placeholderData: keepPreviousData,
  })
```

- `placeholderData: keepPreviousData`
  - 새 페이지를 요청하는 동안 이전 페이지 데이터 유지
  - 새 데이터 도착 시 자연스럽게 새 데이터로 교체
  - `isPlaceholderData` 플래그로 현재 보여지는 데이터가 임시 데이터인지 구분 가능
- `useInfiniteQuery`에도 `placeholderData` 사용 가능 ⇒ 스크롤 UX 개선
