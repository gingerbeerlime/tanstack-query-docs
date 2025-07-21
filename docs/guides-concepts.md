# Guide & Concepts

## Important Defaults

> Tanstack Query의 기본 동작 이해하기

1. `useQuery`, `useInfiniteQuery`는 기본적으로 캐시된 데이터를 오래된 것으로 간주한다.
   1. 기본적으로 캐시 데이터는 오래된 상태로 간주해 새롭게 마운트되거나 앱이 포커스되면 자동으로 refetch를 트리거한다.
   2. 이 동작을 변경하려면 `staleTime` 옵션을 설정해야 한다.
      1. ex) `staleTime = 2*60*1000` 이면 2분동안 혹은 쿼리가 수동으로 무효화될 때까지 어떤 종료의 refetch도 일어나지 않고 캐시에서 데이터를 읽는다.
2. “stale”한 쿼리는 다음 상황에서 자동으로 refetch를 트리거 한다.
   1. 해당 쿼리 인스턴스가 새로 마운트될 때
   2. 윈도우/앱이 다시 포커스 될 때
   3. 네트워크가 다시 연결될 때
3. 쿼리는 선택적으로 `refetchInterval`로 구성해 `staleTime`과 별개로 정해진 시간마다 강제로 refetch를 트리거할 수 있다.
4. 사용되지 않는 쿼리 인스턴스는 “비활성” 상태로 전환된다.
   1. 기본적으로 5분 뒤 가비지 컬렉션, 이를 변경하려면 `gcTime` 값 변경
5. 쿼리가 실패할 경우 기본적으로 3번 재시도
6. 구조적 공유(Structural Sharing)기능으로 렌더링 성능 최적화

   1. 리액트 쿼리는 기본적으로 구조적으로 같은 데이터는 같은 참조를 유지한다

      ⇒ 불필요한 리렌더링을 막기 위해 기존 객체를 재사용하는 방식

      ⇒ `useMemo`, `useCallback`, `React.memo` 등의 최적화가 정확하게 작동한다.

---

## Queries

> Query는 비동기 데이터 소스를 선언적으로 구독하는 방식<br/>
> 주로 서버에서 데이터를 가져오는 `GET` 또는 `POST` 요청 처리

### (1) useQuery()

- `useQuery()` 훅을 사용할 때 `queryKey`, `queryFn` 2가지 값을 필수로 전달해야 함.

  - `queryKey` : 쿼리를 고유하게 식별하는 키. 캐싱, 리페칭, 공유 등에 활용되는 핵심 키
  - `queryFn` : 데이터를 받아오는 비동기 함수(Promise 반환)

  ```jsx
  const result = useQuery({
    queryKey: ["todos"], // 고유 쿼리 키
    queryFn: fetchTodoList, // 데이터를 받아오는 비동기 함수
  });
  ```

- `useQuery()`가 반환하는 결과 구조

  ```jsx
  const {
    data,        // 쿼리 성공 시 응답 데이터
    error,       // 쿼리 실패 시 에러 객체
    isPending,   // 로딩 중일 때 true
    isError,     // 에러가 발생했을 때 true
    isSuccess,   // 성공적으로 데이터를 받았을 때 true
    isFetching,  // 현재 백그라운드에서 데이터를 가져오는 중인지 여부
    status,
    fetchStatus,
    ...
  } = useQuery(...)

  ```

- `isPending` → `isError` → `isSuccess` 순서대로 체크해 UI 구성하는 것이 일반적
- 따라서 `Boolean`값 이외에 `status(화면에 보이는 내용 상태)`, `fetchStatus(네트워크 요청 상태)`도 제공하여 다양한 상태 처리 가능

  | 상태 조합                                      | 설명                        |
  | ---------------------------------------------- | --------------------------- |
  | `status: 'success'`, `fetchStatus: 'idle'`     | 요청 완료 후 대기 중 (정상) |
  | `status: 'success'`, `fetchStatus: 'fetching'` | 데이터는 있지만, 리페칭 중  |
  | `status: 'pending'`, `fetchStatus: 'fetching'` | 처음 마운트되고 요청 중     |
  | `status: 'pending'`, `fetchStatus: 'paused'`   | 네트워크 없음 등으로 중지   |

---

## Query Keys

> `queryKey`는 리액트 쿼리가 데이터를 캐시하고 구분하는 기준<br/> > `queryKey` 기반으로 캐싱, 리페칭, 쿼리 구독/공유 를 자동으로 처리

<br/>

### (1) Query Key 기본 규칙

- `queryKey`는 무조건 배열이어야 함
- 배열 안에는 문자열, 숫자, 객체 등을 넣을 수 있음
- 내부 요소들은 `JSON.stringify()`로 직렬화 가능한 값이어야 함
- 데이터를 유일하게 식별할 수 있어야 함

<br/>

### (2) Query Key 사용법

- 고정 `queryKey`

```jsx
// 예: 전체 todos 리스트
useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

// 예: 전체 todos 리스트
useQuery({ queryKey: ["todos", "today"], queryFn: fetchTodos });
```

<br/>

- 동적 `queryKey`

```jsx
// todo ID로 특정 todo 가져오기
useQuery({ queryKey: ['todo', 5], queryFn: () => fetchTodoById(5) })

// preview 모드가 있는 todo
useQuery({ queryKey: ['todo', 5, { preview: true }], queryFn: ... })

// 완료된 todos 목록
useQuery({ queryKey: ['todos', { type: 'done' }], queryFn: ... })
```

<br/>

### (3) Query Key 사용시 주의 사항

- 객체 속성 순서는 무시됨

```jsx
useQuery({ queryKey: ['todos', { page, status }], ... })
useQuery({ queryKey: ['todos', { status, page }], ... }) // ✅ 동일하게 취급됨
```

<br/>

- 배열 순서는 중요함

```jsx
useQuery({ queryKey: ['todos', status, page], ... })
useQuery({ queryKey: ['todos', page, status], ... }) // ❌ 서로 다른 쿼리로 인식됨
```

- 쿼리 함수가 **의존하는 모든 값**은 `queryKey`에 포함되어야함

```jsx
function Todos({ todoId }) {
  useQuery({
    queryKey: ["todos", todoId], // ✅ todoId가 key에 포함됨
    queryFn: () => fetchTodoById(todoId),
  });
}
// => 캐시가 todoId별로 분리됨
// => todoId가 바뀌면 리페칭
```

---

## Query Functions

> 쿼리 함수는 `Promise`를 반환하는 어떤 함수든 사용할 수 있다.

- 성공 시 : `Promise.resolve(data)`
- 실패 시: `throw` 또는 `Promise.reject()`

<br/>

### (1) 쿼리 함수 작성법

```jsx
// 기본
useQuery({ queryKey: ["todos"], queryFn: fetchAllTodos });

// 파라미터 직접 전달
useQuery({ queryKey: ["todos", todoId], queryFn: () => fetchTodoById(todoId) });

// async-await
useQuery({
  queryKey: ["todos", todoId],
  queryFn: async () => {
    const data = await fetchTodoById(todoId);
    return data;
  },
});
```

- `queryKey`를 통해 `queryFn`에 파라미터 전달하기

  ```jsx
  function Todos({ status, page }) {
    return useQuery({
      queryKey: ["todos", { status, page }],
      queryFn: fetchTodoList,
    });
  }

  function fetchTodoList({ queryKey }) {
    const [_key, { status, page }] = queryKey;
    return fetch(`/api/todos?status=${status}&page=${page}`).then((res) =>
      res.json()
    );
  }
  ```

### (2) 에러 처리

- 반드시 `throw` 하거나 `Promise.reject()` 처리해야 에러 상태로 인식됨

```jsx
const { error } = useQuery({
  queryKey: ["todos", todoId],
  queryFn: async () => {
    if (somethingGoesWrong) {
      throw new Error("문제가 발생했어요!");
    }

    if (somethingElseWrong) {
      return Promise.reject(new Error("다른 문제도 발생했어요!"));
    }

    return data;
  },
});
```

> ⚠️ fetch를 사용할 떄는 기본적으로 404, 500 같은 상태 코드에서 에러를 throw 하지 않기 때문에 직접 검사하고 throw 해야 함. axios는 자동으로 throw 해줌

<br/>

### (3) QueryFunctionContext\*\*

- 쿼리 함수에 자동으로 전달되는 `context` 객체

  | 항목       | 설명                                           |
  | ---------- | ---------------------------------------------- |
  | `queryKey` | 쿼리 키 배열                                   |
  | `client`   | QueryClient 인스턴스                           |
  | `signal`   | `AbortSignal` – 쿼리 취소용                    |
  | `meta`     | 쿼리에 부여된 메타데이터 (`queryOptions.meta`) |

  ```jsx
  function fetchData({ queryKey, signal, meta }) {
    // signal: 요청 취소할 때 사용 가능
    return fetch("/api", { signal }).then((res) => res.json());
  }
  ```

---

## Query Options

> `queryOptions()`는 `queryKey`, `queryFn`, 기타 옵션들을 하나의 함수로 묶어 재사용할 수 있도록 도와주는 헬퍼 함수

<br/>

### (1) Query Options 사용법

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

### (2) Query Options를 사용할 때의 이점

- **타입 안정성** : queryKey와 queryFn이 한 곳에 정의되어 타입이 자동 추론됨
- **재사용성** : 여러 쿼리 훅(useQuery, useQueries, prefetch…)에서 옵션을 중복 작성할 필요 없음 → 유지보수 편리

<br/>

### (3) Query Options 오버라이드 가능

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
- `select`는 오직 `status === ‘success’` 일 때만 실행
- `select` 안에서 에러가 발생하면 해당 쿼리는 실패 상태가 됨

(+) `useInfiniteQuery`를 위한 `infiniteQueryOptions` 별도 헬퍼 존재

---

## 네트워크 모드

> Tanstack Query는 네트워크 연결 상태에 따라 Query, Mutation이 어떻게 동작할지 제어할 수 있는 3가지 `networkMode` 설정을 제공한다.

<br/>

(1) `online`(기본값)

- **온라인일 때만 요청 실행**
- Query가 실행 중일 때 네트워크가 끊기면 상태는 그대로 유지됨
- `fetchStatus`를 활용해 네트워크 요청 실행 상태 확인 가능
  - `fetching` : 실제 요청을 보내는 중
  - `paused` : 네트워크 연결이 끊겨 멈춘 상태 (⚠️`pending` 이면서 `fetchStatus: paused` 일 수 있음)
  - `idle`: 아무것도 하지 않는 상태
- 네트워크가 끊긴 상태에서 요청이 재시도 중이면 재시도는 일시 중지(`paused`)되며, 연결이 복구되면 자동으로 재개됨(`refetchOnReconnet` 옵션 설정과 별개로 작동)

<br/>

(2) `always`

- **항상 요청 실행**
- 네트워크 연결 상태와 관계없이 무조건 Query 실행
- 다음과 같은 경우에 적합
  - `queryFn`에서 네트워크 요청 없이 `Promise.resolve()`만 반환하는 경우
  - `AsyncStorage`나 캐시에서 데이터만 읽어오는 경우
- 요청 실패하면 바로 `error` 상태로 진입

<br/>

(3) `offlineFirst`

- **오프라인 우선 방식**
- 첫 번째 요청은 시도하지만, 실패하면 재시도는 오프라인 상태에서 멈춤
- 다음과 같은 경우에 적합
  - PWA처럼 서비스 워커나 브라우저의 HTTP 캐시를 사용하는 경우
  - 캐시 히트 시에는 성공하지만, 캐시 미스 시에는 실패 → 이 때 재시도는 일시 중지됨
  - ⇒ 최대한 캐시로 처리하고 네트워크 요청은 온라인일 때만 하고싶은 경우

---

## Parallel Queries(병렬 쿼리)

> 여러 개의 쿼리를 동시에 실행해서 데이터를 동시에 받아오는 방식
> ⇒ 데이터 로딩 시간을 줄이고 앱 성능 최적화

<br/>

### (1) 수동 병렬 쿼리

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

### (2) 동적 병렬 쿼리 - `useQueries`

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

---

## Dependent Queries(의존 쿼리)

> 앞에 실행된 쿼리의 결과가 있어야만 실행되는 쿼리

<br/>

### (1) 의존 쿼리 사용법 - `enabled`

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

- 🔁 상태 변화 흐름

  |                    | status  | fetchStatus                   |
  | ------------------ | ------- | ----------------------------- |
  | userId가 아직 없음 | pending | idle(아무것도 하지 않는 상태) |
  | userId가 들어옴    | pending | fetching(실제 요청 중)        |
  | projects 가져옴    | success | idle                          |

<br/>

### (2) `useQueries`에서 의존 쿼리 사용하기

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

- ⚠️ 의존쿼리는 순차적으로 실행되는 요청으로 느릴 수 있음 → 가능하면 api를 개선하는 것을 권장

---

## Background Fetching Indicators

> 백그라운드에서 새로고침 중임을 표시하고 싶을 때 `isFetching` 활용

- 데이터가 이미 한 번 불러와진 뒤, 백그라운드에서 다시 자동으로 데이터를 리페칭하는 중일 경우
- ⇒ `status : ‘success’` 로 유지되며 `isFetching`은 `true`
- 앱 전체에서 모든 쿼리 중에 하나라도 새로 고침 중일 때 “전체 로딩 인디케이터”를 표시하고 싶다면 `useIsFetching()` 훅 사용

  ```jsx
  import { useIsFetching } from "@tanstack/react-query";

  function GlobalLoadingIndicator() {
    // fetch 중인 쿼리 개수를 반환
    const isFetching = useIsFetching();

    return isFetching ? (
      <div>쿼리들이 백그라운드에서 새로고침 중...</div>
    ) : null;
  }
  ```

---

## Window Focus Refetching

> 사용자가 앱 화면을 벗어났다가 다시 돌아왔을 때 데이터가 오래된 값이면(`staleTime`이 지난 상태이면) 자동으로 다시 가져오는 기능
> `refetchOnWindowFocus` 기본값은 `true`

<br/>

### (1) `refetchOnWindowFocus` 비활성화하기

- 앱 전체에서 비활성화

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 🔴 자동 새로고침 끄기
    },
  },
});
```

<br/>

- 쿼리 개별적으로 비활성화

```jsx
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  refetchOnWindowFocus: false, // 이 쿼리만 새로고침 비활성화
});
```

<br/>

### (2) 커스텀 포커스 이벤트 - `focusManager.setEventListener()`

```jsx
// 브라우저가 화면이 다시 보이게 되었는지 체크함
focusManager.setEventListener((handleFocus) => {
  if (typeof window !== "undefined" && window.addEventListener) {
    const visibilitychangeHandler = () => {
      handleFocus(document.visibilityState === "visible");
    };
    window.addEventListener("visibilitychange", visibilitychangeHandler, false);

    return () => {
      window.removeEventListener("visibilitychange", visibilitychangeHandler);
    };
  }
});
```

> 리액트 네이티브에서는 `AppState` 모듈 사용해 앱 활성화 상태 감지

<br/>

### (3) 포커스 상태 수동 제어 - `focusManager`\*\*

```jsx
import { focusManager } from "@tanstack/react-query";

// 수동으로 "포커스 됨" 상태로 설정
focusManager.setFocused(true);

// 기본 체크 방식으로 다시 되돌리기
focusManager.setFocused(undefined);
```
