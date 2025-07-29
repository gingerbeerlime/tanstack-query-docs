# Parallel Queries(병렬 쿼리)

> 여러 개의 쿼리를 동시에 실행해서 데이터를 동시에 받아오는 방식
> ⇒ 데이터 로딩 시간을 줄이고 앱 성능 최적화

<br/>

## (1) 수동 병렬 쿼리

- 쿼리 개수가 고정되어있다면, useQuery를 여러번 작성

```jsx
funtion App() {
 const usesQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
 const teamsQuery = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
 const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
}
```

- ⇒ 3개의 쿼리는 동시에 실행되며 users, teams, projects 데이터를 동시에 가져오게 됨
- 응답시간은 3개의 쿼리 중 가장 오래 걸린 응답시간만큼 소요됨

<br/>

> ⚠️**`Suspense` 모드에서는 사용하지 말 것**<br/> > `useQuery`가 내부에서 `Promise`를 `throw`하면서 첫 번째 쿼리가 컴포넌트를 멈춰버림. 나머지 쿼리들은 실행되지 않음<br/>
> → `useSuspenseQueries` 훅 - 여러 `Suspense` 쿼리를 병렬로 실행할 수 있게 도와주는 헬퍼 함수

<br/>

## (2) 동적 병렬 쿼리 - `useQueries`

- 쿼리 개수가 동적으로 바뀌는 경우 → `useQueries` 훅 사용

```jsx
function App({ users }) {
  const userQueries = useQueries({
    // users 배열 길이만큼 쿼리를 자동으로 만들어서 병렬 실행
    queries: users.map((user) => {
      return {
        queryKey: ["user", user.id],
        queryFn: () => fetchUserById(user.id),
      };
    }),
  });
}
```
