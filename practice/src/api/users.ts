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
  createdAt?: string;
  likes?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  joinedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  nextPage?: number;
  hasMore: boolean;
}

let mockUserList: User[] = [
  { id: 1, name: "김철수", email: "kim@example.com", city: "서울" },
  { id: 2, name: "이영희", email: "lee@example.com", city: "부산" },
  { id: 3, name: "박민수", email: "park@example.com", city: "대구" },
  { id: 4, name: "최지영", email: "choi@example.com", city: "인천" },
];

// 사용자 목록 조회 (시뮬레이션)
export const fetchUsers = async (): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연

  // 10% 확률로 에러 발생
  if (Math.random() < 0.1) {
    throw new Error("사용자 데이터를 불러오는데 실패했습니다");
  }

  return mockUserList;
};

// 새 사용자 추가 (시뮬레이션)
export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // 0.8초 지연

  // 15% 확률로 에러 발생
  if (Math.random() < 0.15) {
    throw new Error("사용자 생성에 실패했습니다");
  }

  // 새 사용자 객체를 먼저 생성
  const newUser: User = {
    id: Date.now(),
    ...userData,
  };

  mockUserList = mockUserList.concat(newUser);

  return newUser;
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

// 무한 스크롤을 위한 포스트 목록 조회 (페이지네이션)
const mockPosts: Post[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  userId: Math.floor(Math.random() * 4) + 1,
  title: `게시글 제목 ${index + 1}`,
  body: `이것은 ${
    index + 1
  }번째 게시글의 내용입니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  createdAt: new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
  likes: Math.floor(Math.random() * 100),
}));

export const fetchPosts = async (
  page: number = 1,
  limit: number = 10
): Promise<PostsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // 0.8초 지연

  // 5% 확률로 에러 발생
  if (Math.random() < 0.05) {
    throw new Error("게시글을 불러오는데 실패했습니다");
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const posts = mockPosts.slice(startIndex, endIndex);

  return {
    posts,
    nextPage: endIndex < mockPosts.length ? page + 1 : undefined,
    hasMore: endIndex < mockPosts.length,
  };
};

// 사용자 프로필 상세 조회 (캐시 및 초기 데이터 예제용)
const mockUserProfiles: UserProfile[] = [
  {
    id: 1,
    name: "김철수",
    email: "kim@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "프론트엔드 개발자입니다. React와 TypeScript를 좋아합니다.",
    followers: 1250,
    following: 345,
    joinedAt: "2022-03-15",
  },
  {
    id: 2,
    name: "이영희",
    email: "lee@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b1e8?w=150&h=150&fit=crop&crop=face",
    bio: "백엔드 개발자이자 시스템 아키텍트입니다. 클린 코드와 테스트를 중시합니다.",
    followers: 2100,
    following: 180,
    joinedAt: "2021-11-08",
  },
  {
    id: 3,
    name: "박민수",
    email: "park@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "풀스택 개발자입니다. 새로운 기술을 배우는 것을 즐깁니다.",
    followers: 890,
    following: 425,
    joinedAt: "2023-01-20",
  },
  {
    id: 4,
    name: "최지영",
    email: "choi@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "UI/UX 디자이너입니다. 사용자 경험을 개선하는 일에 열정적입니다.",
    followers: 1680,
    following: 290,
    joinedAt: "2022-07-12",
  },
];

export const fetchUserProfile = async (
  userId: number
): Promise<UserProfile> => {
  await new Promise((resolve) => setTimeout(resolve, 1200)); // 1.2초 지연 (느린 API 시뮬레이션)

  // 8% 확률로 에러 발생
  if (Math.random() < 0.08) {
    throw new Error("사용자 프로필을 불러오는데 실패했습니다");
  }

  const profile = mockUserProfiles.find((p) => p.id === userId);
  if (!profile) {
    throw new Error("존재하지 않는 사용자입니다");
  }

  return profile;
};

// 빠른 사용자 기본 정보 조회 (초기 데이터용)
export const fetchUsersBasicInfo = async (): Promise<
  Pick<UserProfile, "id" | "name" | "avatar">[]
> => {
  await new Promise((resolve) => setTimeout(resolve, 200)); // 0.2초 지연 (빠른 API)

  const profiles = mockUserProfiles.map((profile) => ({
    id: profile.id,
    name: profile.name,
    avatar: profile.avatar,
  }));
  if (!profiles) {
    throw new Error("존재하지 않는 사용자입니다");
  }

  return profiles;
};
