# Query Keys

> `queryKey`는 리액트 쿼리가 데이터를 캐시하고 구분하는 기준<br/> > `queryKey` 기반으로 캐싱, 리페칭, 쿼리 구독/공유 를 자동으로 처리

<br/>

## (1) Query Key 기본 규칙

- `queryKey`는 무조건 배열이어야 함
- 배열 안에는 문자열, 숫자, 객체 등을 넣을 수 있음
- 내부 요소들은 `JSON.stringify()`로 직렬화 가능한 값이어야 함
- 데이터를 유일하게 식별할 수 있어야 함

<br/>

## (2) Query Key 사용법

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

## (3) Query Key 사용시 주의 사항

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
