# TanStack Query 연습 문제 프로젝트

TanStack Query의 핵심 개념을 복습할 수 있는 3가지 예제 문제가 준비되어 있습니다.

## 시작하기

1. 의존성 설치:
```bash
cd practice
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:3000` 접속

## 문제 목록

### 문제 1: 기본 쿼리와 상태 처리
- **파일**: `src/problems/Problem1.tsx`
- **개념**: useQuery, 로딩/에러/성공 상태 처리
- **목표**: 사용자 목록을 조회하고 각 상태에 맞는 UI 표시

### 문제 2: 뮤테이션과 쿼리 무효화
- **파일**: `src/problems/Problem2.tsx`  
- **개념**: useMutation, useQueryClient, 쿼리 무효화
- **목표**: 새 사용자 추가 후 목록 자동 갱신

### 문제 3: 쿼리 키와 의존성 쿼리
- **파일**: `src/problems/Problem3.tsx`
- **개념**: 복합 쿼리 키, 의존성 쿼리, enabled 옵션
- **목표**: 선택된 사용자의 게시글을 조건부로 조회

## 문제 해결 순서

1. 각 문제 파일의 TODO 주석을 확인하세요
2. 필요한 TanStack Query 훅들을 import 하세요
3. 요구사항에 맞게 쿼리/뮤테이션을 구현하세요
4. 브라우저에서 동작을 확인하세요

## 참고 자료

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- 프로젝트 루트의 `docs/` 폴더에 있는 한국어 정리 문서들