# Background Fetching Indicators

> 백그라운드에서 새로고침 중임을 표시하고 싶을 때 `isFetching` 활용

- 데이터가 이미 한 번 불러와진 뒤, 백그라운드에서 다시 자동으로 데이터를 리페칭하는 중일 경우
- ⇒ `status : 'success'` 로 유지되며 `isFetching`은 `true`
- 앱 전체에서 모든 쿼리 중에 하나라도 새로 고침 중일 때 "전체 로딩 인디케이터"를 표시하고 싶다면 `useIsFetching()` 훅 사용

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
