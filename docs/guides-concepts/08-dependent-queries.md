# Dependent Queries(의존 쿼리)

> 앞에 실행된 쿼리의 결과가 있어야만 실행되는 쿼리

<br/>

## (1) 의존 쿼리 사용법 - `enabled`

```jsx
// 1단계: 이메일로 유저 정보 가져오기
const { data: user } = useQuery({
  queryKey: ["user", email],
  queryFn: getUserByEmail,
});

const userId = user?.id;

// 2단계: 유저 ID가 준비된 후, 해당 유저의 프로젝트 가져오기
const { data: projects } = useQuery({
  queryKey: ["projects", userId],
  queryFn: getProjectsByUser,
  enabled: !!userId, // userId가 있어야 실행됨!
});
```

- 🔁 상태 변화 흐름

  |                    | status  | fetchStatus                   |
  | ------------------ | ------- | ----------------------------- |
  | userId가 아직 없음 | pending | idle(아무것도 하지 않는 상태) |
  | userId가 들어옴    | pending | fetching(실제 요청 중)        |
  | projects 가져옴    | success | idle                          |

<br/>

## (2) `useQueries`에서 의존 쿼리 사용하기

```jsx
const usersMessages = useQueries({
  queries: userIds
    ? userIds.map((id) => ({
        queryKey: ["messages", id],
        queryFn: () => getMessagesByUsers(id),
      }))
    : [], // 아직 userIds가 없으면 빈 배열 반환 (아무 쿼리도 실행되지 않음)
});
```

- ⚠️ 의존쿼리는 순차적으로 실행되는 요청으로 느릴 수 있음 → 가능하면 api를 개선하는 것을 권장
