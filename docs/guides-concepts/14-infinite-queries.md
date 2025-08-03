## Infinite Queries

> **`useInfiniteQuery`란?** 무한 스크롤 또는 더 보기와 같은 점진적 데이터 로딩을 지원하는 훅

### (1) useInfiniteQuery 핵심 기능

- **반환되는 `data`는 객체 형태**
  - `data.pages` : 페이지 별로 받은 데이터 리스트 배열
  - `data.pageParams` : 각 페이지를 받을 때 사용한 파라미터 배열
  - ⚠️ `initialData`, `placeholderData` 사용할 때도 객체 구조 유지해야 작동
- **핵심 옵션**
  - `initialPageParam` : 처음 호출할 때 사용할 초기 페이지 파라미터(필수값)
  - `getNextPageParam(lastPage, allPages, lastPageParam)`
    → 마지막 페이지 기준으로 다음 요청 파라미터 반환
    - `lastPage`: 마지막 응답 데이터
    - `allPages`: 지금까지의 모든 페이지 배열
    - `lastPageParam`: 마지막 요청에 사용된 pageParam
  - `getPreviousPageParam(lastPage, allPages, lastPageParam)`
    → 이전 페이지 요청 시 파라미터 반환
- **제공 함수**
  - `fetchNextPage()` → 다음 페이지 로드
  - `fetchPreviousPage()` → 이전 페이지 로드(양방향 스크롤 시)
- **상태값**
  - `status`: `'pending' | 'error' | 'success'` (초기 상태 판단)
  - `isFetching`: **모든 요청(리패치, 다음 페이지, 이전 페이지 포함)** 로딩 상태
  - `isFetchingNextPage`, `isFetchingPreviousPage` : 다음/이전 페이지 로딩 상태
  - `hasNextPage`, `hasPreviousPage` : 다음/이전 페이지 존재 여부
  - `isRefetching` : 전체 리페치 중인지 여부

```jsx
const fetchProjects = async ({ pageParam }) => {
  const res = await fetch(`/api/projects?cursor=${pageParam}`);
  return res.json();
};

useInfiniteQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

- `initialPageParam : 0` → 처음엔 `cursor = 0`으로 호출
- `getNextPageParam`함수는 마지막 응답을 기준으로 다음에 호출할 `cursor` 값 반환

> ⚠️ **동시에 fetchNextPage() 여러 번 호출하면 데이터 충돌 위험**<br/>
> 기본적으로 `cancelRefetch: true`이므로 마지막 요청만 유지됨.<br/>
> 병렬 호출을 허용하려면 → `fetchNextPage({ cancelRefetch: false })`<br/>
> or 조건 체크 → `if (**hasNextPage && !isFetchingNextPage**) fetchNextPage()`

</aside>

### (2) useInfiniteQuery 확장 기능

- **양방향 스크롤** : 위로 스크롤해서 이전 페이지 불러오기 - `fetchPreviousPage()`

```jsx
useInfiniteQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
});
```

- **정렬 순서 바꾸기** : `select` 옵션 활용

```jsx
select: (data) => ({
  pages: [...data.pages].reverse(),
  pageParams: [...data.pageParams].reverse(),
});
```

- **수동으로 데이터 수정 - `queryClient.setQueryData`**
  - ex) 첫 페이지 제거, 개별 페이지에서 특정 아이템 제거, 특정 페이지만 남기기 등
    ```jsx
    // 첫 페이지 삭제
    // *항상 pages & pageParams 데이터 구조 유지해야 함
    queryClient.setQueryData(["projects"], (data) => ({
      pages: data.pages.slice(1),
      pageParams: data.pageParams.slice(1),
    }));
    ```
- **페이지 수 제한** - `maxPages`
  - 너무 많은 페이지를 캐시에 유지하지 않도록 제한하기 위한 옵션
    → 최신 n개의 페이지만 캐시에 유지되며, 이전 페이지는 자동으로 제거
  - 내부적으로 `pages` 배열의 앞 또는 뒤를 잘라내는 방식으로 동작하기 떄문에 어느 쪽으로 페이지를 추가해야 하는지 명시해야 의도대로 동작한다.
    - ex) 단방향 로딩 - `getNextPageParam`, ex) 양방향 로딩 - `getNextPageParam & getPreviousPageParam` 둘 다 정의
  - infinite Query가 `stale`되면 **모든 페이지를 첫 페이지부터 순차적으로 `refetch`함**
  ```jsx
  useInfiniteQuery({
    ...,
    maxPages: 3,
  })
  ```

### (3) 커서가 없는 API(페이지 번호 기반 or 단순 next 버튼)대응

1. **페이지 번호 기반** - 직접 페이지 번호 계산해서 다음 페이지 요청

```json
{ data: [...], page: 1, totalPages: 10 }
```

```jsx
getNextPageParam: (lastPage, allPages, lastPageParam) => {
  return lastPage.length === 0 ? undefined : lastPageParam + 1;
};
```

1. `offset`(몇 개 가져올지)만 받는 경우

```json
{ data: [...], count: 3 }
```

```jsx
getNextPageParam: (lastPage, allPages, lastPageParam) => {
  if (lastPage.data.length === 0) return undefined; // 데이터 없으면 종료
  return lastPageParam + 3; // offset 증가
};
```

### (4) useInfiniteQuery 동작 제어

> `useInfiniteQuery`는 데이터를 언제, 어느 방향으로 가져올지 판단하지 않음 → 개발자가 직접 제어

1. **Intersection Observer**

   - 특정 엘리먼트를 관찰해 화면에 나타나면 `fetchNextPage()` 또는 `FetchPreviousPage()` 실행

   ```jsx
   <List>
     {pages.map(...)}
     <div ref={loadMoreRef}></div> {/* sentinel element */}
   </List>

   // Observer 예시:
   if (isIntersecting && hasNextPage) fetchNextPage();

   const observer = new IntersectionObserver(
     (entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
         fetchNextPage();
       }
     },
     { threshold: 1 }
    ;
   observer.observe(loadMoreRef.current);
   ```

1. **스크롤 위치 계산**

   1. 스크롤이 맨 아래/맨 위에 가까우면 호출

   ```jsx
   const handleScroll = () => {
     if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage) {
       fetchNextPage();
     }
     if (scrollTop <= 50 && hasPreviousPage) {
       fetchPreviousPage();
     }
   };
   ```
