## Performance & Request Waterfalls

> 데이터 페칭 라이브러리를 사용할 때 리퀘스트 워터폴(`Request Waterfalls`)를 피하는 방법

### Request Waterfall(요청 워터폴)

한 리소스에 대한 요청이 끝나야 다음 요청이 시작되는 상황

직렬 요청이 쌓이면 네트워크 지연(latency) x 왕복 횟수만큼 성능 저하 발생

### 리액트 쿼리에서 발생하는 워터폴 패턴

### **(1) 단일 컴포넌트 직렬 쿼리(Dependent Query)**

한 컴포넌트 안에서 먼저 한 쿼리를 실행한 뒤 그 결과에 따라 다른 쿼리를 실행하는 경우

```jsx
const { data: user } = useQuery({
  queryKey: ["user", email],
  queryFn: getUserByEmail,
});

const userId = user?.id;

// userId 값이 있을 때 프로젝트 가져오기
const { data: projects } = useQuery({
  queryKey: ["projects", userId],
  queryFn: getProjectsByUser,
  enabled: !!userId,
});
```

**⇒ 워터폴 해결하는 방법**

1. 단일 API로 재구성하기 `getProjectsByUserEmail`
2. 서버에서 병합 처리(Server Components / BFF)

### **(2) Suspense를 사용할 때 직렬 쿼리**

`useSuspenseQuery`는 데이터가 캐시에 없으면 `throw Promise`를 발생시켜 `Suspense` 경계로 제어를 넘겨버린다. 이 때 리액트는 데이터가 준비가 안되었다고 판단해 렌더 과정을 멈추고 `fallback ui`를 표시한다.

```jsx
function App () {
  // 아래 쿼리들은 직렬로 실행되므로 서버에 여러 번 왕복 요청 발생
  const usersQuery = useSuspenseQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const teamsQuery = useSuspenseQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const projectsQuery = useSuspenseQuery({ queryKey: ['projects'], queryFn: fetchProjects })

  // Suspense가 걸려 있기 때문에,
  // 모든 쿼리가 끝날 때까지 아무 데이터도 렌더링되지 않음
  ...
}
```

- 일반 `useQuery`를 사용하면 쿼리들이 병렬 실행되지만
- 같은 컴포넌트 안에서 `useSuspenseQuery`를 여러 번 호출하면, 첫 번째 훅이 `Suspend`되는 순간 렌더가 중단되어 나머지 훅들이 실행되지 못해 워터폴이 발생한다.

⇒ `useSuspenseQueries`를 사용하면 해결(여러 쿼리를 병렬 실행)

```jsx
const [users, teams, projects] = useSuspenseQueries({
  queries: [
    { queryKey: ["users"], queryFn: fetchUsers },
    { queryKey: ["teams"], queryFn: fetchTeams },
    { queryKey: ["projects"], queryFn: fetchProjects },
  ],
});
```

### **(3) 중첩 컴포넌트 워터폴**

부모와 자식 컴포넌트가 각각 쿼리를 가지고 있고 **부모 쿼리가 끝난 후에 자식 컴포넌트를 렌더링 하는 경우**

```jsx
function Article({ id }) {
  const { data: article } = useQuery({
    queryKey: ["article", id],
    queryFn: getArticleById,
  });

  return (
    <>
      <ArticleHeader article={article} />
      <Comments id={id} /> {/* Comments 쿼리는 Article 끝나야 실행 */}
    </>
  );
}

function Comments({ id }) {
  return useQuery({
    queryKey: ["comments", id],
    queryFn: getCommentsByArticleId,
  });
}
```

**⇒ 1) 부모 컴포넌트로 쿼리 끌어올려서 데이터 prop으로 전달하기**

```jsx
function Article({ id }) {
  const { data: article } = useQuery({
    queryKey: ["article", id],
    queryFn: getArticleById,
  });
  const { data: comments } = useQuery({
    queryKey: ["comments", id],
    queryFn: getCommentsByArticleId,
  });

  return (
    <>
      <ArticleHeader article={article} />
      <Comments comments={comments} />
    </>
  );
}
```

**⇒ 2) 또는 `prefetch`로 캐싱하기**

```jsx
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticleById,
  })

  // Prefetch - 결과는 안 쓰고 캐시에만 저장
  useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
    notifyOnChangeProps: [], // rerender 방지 최적화
  })

  ...
}
```

<aside>
💡

**`notifyOnChangeProps`**
어떤 속성(prop)이 바뀌었을 때만 리렌더를 트리거할지 지정하는 옵션

- 기본적으로 `useQuery`는 반환 객체(`data`, `error`, `isFetching` …) 중 하나라도 변경되면 컴포넌트가 리렌더링된다.
- `notifyOnChangeProps: [’data’]` 로 지정하면 `data`가 변경될 때만 리렌더가 발생하도록 설정할 수 있다.
- `notifyOnChangeProps: []` 로 지정하면 이 `useQuery` 훅은 리렌더를 트리거 하지 않는다. `prefetch` 용도로만 훅을 사용할 때 최적화용 옵션으로 사용할 수 있다.
</aside>

### **(4) 코드 스플리팅 + 쿼리**

**코드 스플리팅?** JS 코드를 여러 번들로 나눠 필요한 시점에만 불러오는 기법

- 초기 로딩은 빨라지지만 잘못 쓰면 워터폴 문제가 발생할 수 있다

```jsx
const GraphFeedItem = React.lazy(() => import("./GraphFeedItem"));

function Feed() {
  const { data } = useQuery({ queryKey: ["feed"], queryFn: getFeed });
  return data.map((feedItem) =>
    feedItem.type === "GRAPH" ? (
      <GraphFeedItem feedItem={feedItem} />
    ) : (
      <StandardFeedItem feedItem={feedItem} />
    )
  );
}
```

- 첫 페이지 로드의 경우 최소 5번의 네트워크 왕복이 필요함

```markdown
1.  |-> 마크업
2.  |-> JS for <Feed>
3.      |-> getFeed()
4.        |-> JS for <GraphFeedItem>
5.          |-> getGraphDataById()
```

**⇒ 1) 부모 컴포넌트에서 조건부 사전 페칭(쿼리 호이스팅)**

- `useEffect`나 이벤트 핸들러에서 `prefetchQuery` 사용
- `prefetchQuery`의 `staleTime`은 `prefetch`가 캐시를 신선하다고 보고 다시 요청할지 말지만 결정함. `useQuery` 리페치 여부는 해당 훅의 `staleTime` 규칙을 따름.

```jsx
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function Feed() {
  const qc = useQueryClient();
  const { data: feed = [], isPending } = useQuery({
    queryKey: ["feed"],
    queryFn: getFeed,
  });

  // 렌더 밖(useEffect)에서 그래프 데이터 프리패치
  useEffect(() => {
    feed.forEach(({ type, id }) => {
      if (type !== "GRAPH") return;
      qc.prefetchQuery({
        queryKey: ["graph", id],
        queryFn: () => getGraphDataById(id),
        staleTime: 60_000, // 60초동안 데이터를 신선한 것으로 간주
      });
    });
  }, [qc, feed]);

  if (isPending) return "Loading feed...";

  return feed.map((item) =>
    item.type === "GRAPH" ? (
      <GraphFeedItem key={item.id} item={item} />
    ) : (
      <StandardFeedItem key={item.id} item={item} />
    )
  );
}
```

⇒ 2) 더 나은 대안은 **서버 컴포넌트** 사용하기

### ✨ 요약

`Request Waterfall`은 주로 아래와 같은 상황에서 쉽게 발생한다

- 부모/자식으로 쿼리가 갈라져 의존할 때(dependent query)
- 컴포넌트 전환 중 쿼리가 중첩될 때
- 코드 스플리팅된 컴포넌트에서 쿼리를 실행할 때

모든 워터폴을 없앨 필요는 없지만 고비용의 워터폴은 최적화하는 것이 좋다

- 가능하면 병렬화(`useSuspenseQueries`, `useQuery` 병렬 실행)
- 자식 컴포넌트 쿼리 의존성 줄이기 → 부모로 끌어올리거나 API 병합
- 사전 페칭(`prefetch`) → 렌더 바깥(`useEffect`/라우터 프리패치/hover/in-view)에서 트리거하고 소비자 훅의 `staleTime`도 맞춰 즉시 리패치를 방지.
- 서버 활용 → SSR/스트리밍/서버 컴포넌트로 워터폴을 서버로 옮겨 클라이언트 지연을 줄임.
