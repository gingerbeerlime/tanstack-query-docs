// Mock API functions for practice
export interface User {
  id: number;
  name: string;
  email: string;
  city: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// 사용자 목록 조회 (시뮬레이션)
export const fetchUsers = async (): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연

  // 10% 확률로 에러 발생
  if (Math.random() < 0.1) {
    throw new Error("사용자 데이터를 불러오는데 실패했습니다");
  }

  return [
    { id: 1, name: "김철수", email: "kim@example.com", city: "서울" },
    { id: 2, name: "이영희", email: "lee@example.com", city: "부산" },
    { id: 3, name: "박민수", email: "park@example.com", city: "대구" },
    { id: 4, name: "최지영", email: "choi@example.com", city: "인천" },
  ];
};

// 새 사용자 추가 (시뮬레이션)
export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // 0.8초 지연

  // 15% 확률로 에러 발생
  if (Math.random() < 0.15) {
    throw new Error("사용자 생성에 실패했습니다");
  }

  return {
    id: Date.now(), // 간단한 ID 생성
    ...userData,
  };
};

// 특정 사용자의 게시글 조회 (시뮬레이션)
export const fetchUserPosts = async (userId: number): Promise<Post[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600)); // 0.6초 지연

  // 사용자가 없는 경우 에러
  if (userId > 4) {
    throw new Error("존재하지 않는 사용자입니다");
  }

  const posts: Post[] = [
    { id: 1, userId: 1, title: "첫 번째 게시글", body: "안녕하세요!" },
    {
      id: 2,
      userId: 1,
      title: "두 번째 게시글",
      body: "TanStack Query 공부 중입니다.",
    },
    {
      id: 3,
      userId: 2,
      title: "리액트 공부",
      body: "리액트는 정말 재미있어요.",
    },
    {
      id: 4,
      userId: 3,
      title: "타입스크립트 팁",
      body: "타입스크립트 사용법을 공유합니다.",
    },
  ];

  return posts.filter((post) => post.userId === userId);
};
