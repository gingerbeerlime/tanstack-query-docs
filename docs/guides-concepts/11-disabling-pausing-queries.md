## Disabling/Pausing Queries

> 쿼리 비활성화 & 지연 실행 방법들
> enabled, Lazy Query, skipToken

### (1) `enabled = false`

- `enabled`는 쿼리를 자동으로 실행할지 말지를 제어하는 옵션
- `enabled = false` 로 설정하면 쿼리가 자동으로 실행되지 않음
  - 컴포넌트 마운트 시 실행 안함
  - 백그라운드 리페치 없음
  - `invalidateQueries`, `refetchQueries`로 실행 안됨
  - `refetch()`로는 수동 실행 가능(파라미터 전달할 수 없음) ⇒ 더 알아보기(실제로 잘 쓰이는 패턴인지)
- 쿼리 영구 비활성화처럼 사용될 수 있음
- `skipToken`과 함께 사용 불가

<br/>

> `invalidateQueries` : 해당 쿼리를 `stale` 상태로만 만들고 다음 렌더나 포커스 시점에 자동으로 `refetch`가 일어나도록 함<br/>
> ⇒ 이 데이터가 더 이상 신선하지 않음을 표시<br/> > `refetchQueries` : 해당 쿼리를 즉시 `refetch`함, `invalidate` 과정을 건너뛰고 바로 서버 호출

<br/>

### (2) 조건부 `enabled` - `Lazy Query`

- `enabled`를 조건부로 `true`로 바꿔서 조건 만족 시 자동 실행
  - Boolean값 or Boolean 값을 리턴하는 콜백함수 사용 가능
- ex) 특정 데이터 값이 있을 때만 실행시키기

```bash
function Todos() {
  const [filter, setFilter] = React.useState('')

  const { data } = useQuery({
    queryKey: ['todos', filter],
    queryFn: () => fetchTodos(filter),
    enabled: !!filter, // filter가 비어있으면 실행 안 함
  })

  return (
    <div>
      <FiltersForm onApply={setFilter} /> {/* 필터 적용 시 enabled=true */}
      {data && <TodosTable data={data} />}
    </div>
  )
}
```

> ⚠️
> `enabled: false` 일 때는 `status = ‘pending’` 상태이나 실제로
> `fetching`이 되지 않고 있기 때문에 로딩 UI를 띄울 때 주의!<br/>
> → `isLoading` 상태 사용(isLoading은 **isPending && isFetching** 이 true일 때만 true)<br/>
> → 처음 데이터 가져오는 중에만 로딩 UI 표시

<br/>

### (3) skipToken

- `skipToken`은 `enabled` 대신 쿼리를 아예 실행하지 않는 방법
- 조건부로 쿼리를 비활성화 시키고 싶을 때 + **타입 안정성**을 유지하기 위함
- `skipToken`은 특수 타입으로 `TypeScript`에서 안정성이 높은 방법
- `refetch()`로도 실행할 수 없음

```bash
import { skipToken, useQuery } from '@tanstack/react-query'

function Todos() {
  const [filter, setFilter] = React.useState<string | undefined>()

  const { data } = useQuery({
    queryKey: ['todos', filter],
    queryFn: filter ? () => fetchTodos(filter) : skipToken,
  })

  return (...
}

```

### (4) enabled vs skipToken

- `enabled`

```jsx
useQuery({
  queryKey: ['todos', filter],
  queryFn: () => fetchTodos(filter!), // filter 없으면 오류 -> ! 필요
  enabled: !!filter
})
```

- `skipToken`

```jsx
useQuery({
  queryKey: ["todos", filter],
  queryFn: filter ? () => fetchTodos(filter) : skipToken, // ! 불필요
});
```

- ex) 조건부 실행 + 개별 쿼리에 refetch 기능 필요 → `enabled`
- ex) TypeScript + filter가 선택값인 경우 → `skipToken`
