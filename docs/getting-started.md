# Getting Started

## Tanstack Query 개요

### (1) Tanstack Query란?

비동기 상태 관리 라이브러리, 리액트 앱에서 서버 상태를 가져오고, 캐싱하고, 동기화하고, 업데이트 하는 과정을 단순하게 만들어준다.

<br/>

### (2) Tanstack Query의 이점

- 데이터 캐싱
- 백그라운드에서 자동 새로고침
- 중복 요청 방지
- 오류/로딩/성공 상태 자동 처리
- 서버 데이터와 UI 동기화 쉬움

<br/>

### (3) Tanstack Query 주요 개념

| useQuery()          | 서버에서 데이터를 가져오는 훅                     |
| ------------------- | ------------------------------------------------- |
| useMutation()       | 데이터를 수정/추가/삭제할 때 사용하는 훅          |
| QueryClient         | 쿼리들을 관리하는 중심 객체(앱 전체에서 1개 사용) |
| QueryClientProvider | 리액트 앱에 QueryClient를 제공하는 Provider       |

<br/>

### (4) Tanstack Query 기본 예제

1. `queryClient` & `persister` 초기화

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
});
```

- `gcTime` : 리액트 쿼리 캐시가 얼만큼의 시간 후에 가비지 컬렉션이 될지 설정함.
- `persister` : 데이터를 localStorage에 저장할 수 있도록 함

<br/>

2. `PersistQueryClientProvider`

```jsx
<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
  ...
</PersistQueryClientProvider>
```

- `QueryClientProvider` 대신 사용하여 캐시를 `localStorage`에 저장 가능하게 함

<br/>

3. `ReactQueryDevTools`

```jsx
function App() {
  const [postId, setPostId] = React.useState(-1)

  return (
    <PersistQueryClientProvider ...>
      {postId > -1 ? <Post ... /> : <Posts ... />}
      <ReactQueryDevtools initialIsOpen />
    </PersistQueryClientProvider>
  )
}
```
