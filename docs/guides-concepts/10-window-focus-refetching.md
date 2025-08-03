# Window Focus Refetching

> 사용자가 앱 화면을 벗어났다가 다시 돌아왔을 때 데이터가 오래된 값이면(`staleTime`이 지난 상태이면) 자동으로 다시 가져오는 기능
> `refetchOnWindowFocus` 기본값은 `true`

<br/>

## (1) `refetchOnWindowFocus` 비활성화하기

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

## (2) 커스텀 포커스 이벤트 - `focusManager.setEventListener()`

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

## (3) 포커스 상태 수동 제어 - `focusManager`

```jsx
import { focusManager } from "@tanstack/react-query";

// 수동으로 "포커스 됨" 상태로 설정
focusManager.setFocused(true);

// 기본 체크 방식으로 다시 되돌리기
focusManager.setFocused(undefined);
```
