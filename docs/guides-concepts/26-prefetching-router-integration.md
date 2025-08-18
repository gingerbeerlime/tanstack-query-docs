## Prefetching & Router Integration

> 특정 데이터가 필요할 것이라고 예상할 수 있는 경우, 사전 페칭(`prefetching`)을 통해 캐시에 미리 해당 데이터를 채워 넣어 빠른 사용자 경험을 제공할 수 있다

### (1) prefetchQuery

```jsx
await queryClient.prefetchQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  staleTime: 5000, // 5초 동안 캐시 신선
});
```

- `prefetchQuery`의 `staleTime`은 `prefetch`가 캐시를 신선하다고 보고 다시 요청할지 말지만 결정. `useQuery` 리페치 여부는 해당 훅의 `staleTime` 규칙을 따름.

### (2) prefetchInfiniteQuery

```jsx
await queryClient.prefetchInfiniteQuery({
  queryKey: ["projects"],
  queryFn: fetchProjects,
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  pages: 3, // 첫 3페이지까지 미리 가져오기
});
```

> ⚠️`prefetchQuery/prefetchInfiniteQuery`는 `Promise<void>`만 반환한다.<br/>
> 반환된 데이터가 필요하다면 `fetchQuery`를 사용해야 한다.

<br/>

### (3) 패턴별 사전 페칭

- 사용자가 버튼에 마우스를 호버했을 때
- 컴포넌트가 렌더링되기 전에
- 라우터 전환 시점에

#### 이벤트 핸들러에서

사용자가 마우스를 올리거나 포커스를 줄 때 미리 페칭 → 클릭 시 즉시 데이터 표시 가능

```jsx
function showDetailsButton() {
  const queryClient = useQueryClient();
  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["details"],
      queryFn: getDetails,
      staleTime: 60000, // 1분 캐시
    });
  };

  return (
    <button onMouseEnter={prefetch} onFocus={prefetch}>
      Show Details
    </button>
  );
}
```

- `staleTime: 60000` : 60초동안 데이터가 신선한 것으로 간주하기 때문에 60초 동안은 다시 마우스에 호버하거나 포커스를 줘도 `prefetchQuery`가 실행되지 않는다.

<br/>

#### 컴포넌트 생명 주기에서

부모 컴포넌트에서 미리 페칭해 자식 컴포넌트의 워터폴 방지

```jsx
function Article({ id }) {
  const { data: articleData, isPending } = useQuery({
    queryKey: ["article", id],
    queryFn: getArticleById,
  });

  // Prefetch - 결과는 안 쓰고 캐시에만 저장
  useQuery({
    queryKey: ["article-comments", id],
    queryFn: getArticleCommentsById,
    notifyOnChangeProps: [], // rerender 방지 최적화
  });

  if (isPending) return "Loading article...";

  return (
    <>
      <ArticleHeader articleData={articleData} />
      <ArticleBody articleData={articleData} />
      <Comments id={id} /> // 즉시 데이터를 보여줄 수 있음
    </>
  );
}
```

⇒ `article`과 `comments`가 병렬 실행됨

<br/>

#### Suspense와 함께

- `Suspense`에서는 `useQuery`를 `prefetch` 용도로 쓰면 렌더링이 막히거나 리렌더를 유발할 수 있음 → `usePrefetchQuery` 사용하면 서스펜드 없이 미리 캐싱만 해둘 수 있음

```jsx
function ArticleLayout({ id }) {
  usePrefetchQuery({
    queryKey: ["comments", id],
    queryFn: getComments,
  });

  return (
    <Suspense fallback="Loading...">
      <Article id={id} />
    </Suspense>
  );
}
```

<br/>

### (4) 라우터 통합

라우터 전환 시 해당 라우터에 필요한 데이터를 미리 선언 & 페칭

```jsx
const articleRoute = new Route({
  path: "article",
  loader: async ({ context: { queryClient } }) => {
    // 댓글은 ASAP (렌더링 블록 X)
    queryClient.prefetchQuery({
      queryKey: ["comments"],
      queryFn: fetchComments,
    });
    // 본문은 끝날 때까지 렌더링 차단
    await queryClient.prefetchQuery({
      queryKey: ["article"],
      queryFn: fetchArticle,
    });
  },
  component: () => {
    const article = useQuery({ queryKey: ["article"], queryFn: fetchArticle });
    const comments = useQuery({
      queryKey: ["comments"],
      queryFn: fetchComments,
    });
    return <ArticlePage article={article} comments={comments} />;
  },
});
```

- 컴포넌트의 `useQuery`와 `loader`의 `prefetchQuery`가 동일한 `queryKey/queryFn`을 써야 캐시를 공유한다.
- `comments` 쿼리는 렌더링을 막지 않고 `articles` 쿼리는 데이터를 다 불러올 때까지 렌더링을 일시정지
- **즉시 리페치 억제** : 기본 `staleTime`이 `0`이라면 마운트 시 백그라운드 리페치가 곧바로 작동할 수 있으므로 **컴포넌트/loader** 양쪽에 `staleTime`을 맞추거나 `defaultOptions.queries.staleTime`으로 전역 설정하는 것을 고려

<br/>

### (5) prefetchQuery랑 useQuery로 프리페칭하는 것의 차이

- **`prefetchQuery`**: 훅이 아니라 **임퍼러티브(바로 호출/await 가능)** 하게 캐시에만 채워둠. **구독자(옵저버)를 만들지 않기 때문에 리렌더 없음**, 포커스/리커넥트 같은 `refetch` 트리거에도 관여하지 않음. `staleTime`은 **이 프리페치 호출이 네트워크를 칠지 말지만** 결정(캐시에 신선하면 스킵). 또한 이 `staleTime`은 **useQuery에는 적용되지 않음**. 소비자가 나타나지 않으면 gcTime 후 GC 대상.
- **`useQuery` + `notifyOnChangeProps: []`**: 컴포넌트 안에서 **구독자를 실제로 생성**하지만, **리렌더 알림만 무시**(빈 배열이라 어떤 prop 변화에도 리렌더 X). 그래도 쿼리는 **마운트된 상태**라 포커스/리커넥트 시(조건 충족 시) **리패치가 돌고 캐시는 갱신**됩니다. 또한 관찰 중인 쿼리는 GC되지 않습니다.
- 사용 패턴

  - **라우터/이벤트/효과에서 미리 채워두고 싶다** → `prefetchQuery` (렌더와 독립, `await` 가능, 중복 `prefetch` 방지 위해 `staleTime` 권장)
  - **컴포넌트가 “현재 화면에선 안 쓰지만 관찰은 하고 싶다”**(예: 포커스 복귀 시 최신화) → `useQuery({ notifyOnChangeProps: [] })` (UI는 안 흔들고 캐시만 최신 유지).

  <br/>

### ✨ 요약

- 사용자 액션 예측 시점에 `prefetch`(버튼 `hover`, `focus`)
- 부모 컴포넌트에서 사전 페칭 → 자식 컴포넌트 워터폴 방지
- `Suspense` 전용 훅 사용(`usePrefetchQuery`)
- 조건부 사전 페칭
- 라우터와 통합
