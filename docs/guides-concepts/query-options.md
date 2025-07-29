# Query Options

> `queryOptions()`는 `queryKey`, `queryFn`, 기타 옵션들을 하나의 함수로 묶어 재사용할 수 있도록 도와주는 헬퍼 함수

<br/>

## (1) Query Options 사용법

```jsx
import { queryOptions } from "@tanstack/react-query";

// 1. 쿼리 옵션을 함수로 정의
function groupOptions(id: number) {
  return queryOptions({
    queryKey: ["groups", id],
    queryFn: () => fetchGroups(id),
    staleTime: 5 * 1000,
  });
}

// 2. 여러 곳에서 재사용
useQuery(groupOptions(1));
useSuspenseQuery(groupOptions(5));

useQueries({
  queries: [groupOptions(1), groupOptions(2)],
});

queryClient.prefetchQuery(groupOptions(23));
queryClient.setQueryData(groupOptions(42).queryKey, newGroups);
```

<br/>

> `staleTime`은 데이터가 얼마나 오래 유지되면 `stale`(오래됨) 상태로 바뀔지 설정하는 시간<br/> > `staleTime`이 지났다고 무조건 리페칭을 해오는 것은 아니며, 데이터가 신선한가를 판단하는 기준<br/>
> 실제 리페칭은 데이터가 `stale` 하면서 && (쿼리가 처음 마운트될 때 | 사용자가 창을 벗어났다가 다시 돌아올 때 | 네트워크 연결이 끊겼다가 다시 연결될 때) 일어남<br/> > `staleTime`의 기본 설정 값은 0

<br/>

## (2) Query Options를 사용할 때의 이점

- **타입 안정성** : queryKey와 queryFn이 한 곳에 정의되어 타입이 자동 추론됨
- **재사용성** : 여러 쿼리 훅(useQuery, useQueries, prefetch…)에서 옵션을 중복 작성할 필요 없음 → 유지보수 편리

<br/>

## (3) Query Options 오버라이드 가능

- 쿼리 옵션을 사용하는 컴포넌트에서 개별적으로 커스텀할 옵션을 오버라이드 할 수 있다.

```jsx
const query = useQuery({
  ...groupOptions(1),
  select: (data) => data.groupName,
});
```

> `select` : `queryFn`으로 받아온 원본 데이터를 후처리해서 컴포넌트에서 사용할 최종 형태로 반환하는 함수

- `select` 함수의 결과값이 `query.data`에 들어감
- 필요한 값만 뽑아 쓸 때, 배열 정렬/필터링 등 가공할 때, Map/Set으로 구조 바꿀 때 유용한 기능
- **타입도 정확하게 추론됨** → query.data 타입은 string(groupName)
- `select`는 오직 `status === 'success'` 일 때만 실행
- `select` 안에서 에러가 발생하면 해당 쿼리는 실패 상태가 됨

(+) `useInfiniteQuery`를 위한 `infiniteQueryOptions` 별도 헬퍼 존재
