# Queries

> Query는 비동기 데이터 소스를 선언적으로 구독하는 방식<br/>
> 주로 서버에서 데이터를 가져오는 `GET` 또는 `POST` 요청 처리

## (1) useQuery()

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
