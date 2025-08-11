import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useMutationState,
} from "@tanstack/react-query";

// 게시글 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  author: string;
  createdAt: string;
}

type PostSummary = {
  postId: Post["id"];
  currentLiked: Post["isLiked"];
};

// Mock API 함수들
const fetchPosts = async (): Promise<Post[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [
    {
      id: 1,
      title: "React Query 마스터하기",
      content:
        "낙관적 업데이트를 활용하면 사용자 경험을 크게 개선할 수 있습니다.",
      likeCount: 24,
      isLiked: false,
      author: "개발자A",
      createdAt: "2024-01-15T09:00:00Z",
    },
    {
      id: 2,
      title: "TypeScript 실전 가이드",
      content: "타입 시스템을 활용하여 더 안전한 코드를 작성해보세요.",
      likeCount: 18,
      isLiked: true,
      author: "개발자B",
      createdAt: "2024-01-14T14:30:00Z",
    },
    {
      id: 3,
      title: "프론트엔드 성능 최적화",
      content: "로딩 속도를 개선하는 다양한 기법들을 소개합니다.",
      likeCount: 31,
      isLiked: false,
      author: "개발자C",
      createdAt: "2024-01-13T16:45:00Z",
    },
  ];
};

const toggleLike = async ({
  postId,
  currentLiked,
}: PostSummary): Promise<{
  postId: number;
  isLiked: boolean;
  likeCount: number;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // 20% 확률로 실패하는 API 시뮬레이션
  if (Math.random() > 0.8) {
    throw new Error("좋아요 처리에 실패했습니다. 네트워크를 확인해주세요.");
  }

  // 서버에서 좋아요 상태 토글 후 반환
  return {
    postId,
    isLiked: !currentLiked,
    likeCount: currentLiked
      ? Math.max(0, Math.floor(Math.random() * 50))
      : Math.floor(Math.random() * 50) + 1,
  };
};

/**
 * 문제 7: 좋아요 토글 낙관적 업데이트
 *
 * 요구사항:
 * 1. 게시글 목록을 조회하는 쿼리를 구현하세요 - [v]
 * 2. 좋아요 버튼 클릭 시 즉시 UI에 반영하세요 (좋아요 수 ±1, 하트 색상 변경)
 * 3. 서버 요청 실패 시 이전 상태로 롤백하세요
 * 4. 여러 게시글의 좋아요를 동시에 눌러도 각각 독립적으로 처리되어야 합니다
 * 5. 좋아요 처리 중인 게시글은 시각적으로 표시하세요 (버튼 비활성화, 로딩 표시)
 *
 * 구현 방식:
 * - onMutate에서 해당 게시글만 낙관적으로 업데이트
 * - onError에서 해당 게시글만 롤백
 * - mutationKey를 사용하여 게시글별 독립적 처리
 *
 * 힌트:
 * - queryClient.setQueryData로 배열의 특정 항목만 업데이트
 * - context에 postId와 이전 상태 저장
 * - useMutationState로 특정 게시글의 mutation 상태 조회 가능
 */

const LikeOptimisticUpdate: React.FC = () => {
  // TODO: queryClient 가져오기
  const queryClient = useQueryClient();

  // TODO: 게시글 목록 조회 쿼리 구현
  // 힌트: queryKey는 ["posts"], queryFn은 fetchPosts 사용
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  // TODO: 좋아요 토글 뮤테이션 구현
  // 힌트: mutationKey에 postId 포함하여 게시글별 독립적 처리
  const toggleLikeMutation = useMutation({
    mutationFn: toggleLike,
    mutationKey: ["posts", "toggleLike"],
    onMutate: async ({ postId, currentLiked }: PostSummary) => {
      // 이전 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      // 이전 쿼리값 저장
      const prevPosts = queryClient.getQueryData<Post[]>(["posts"]);
      // 낙관적 값 업데이트
      queryClient.setQueryData<Post[]>(["posts"], (old = []) =>
        old.map((item) => {
          if (item.id === postId) {
            return {
              ...item,
              isLiked: !currentLiked,
              likeCount: currentLiked ? item.likeCount - 1 : item.likeCount + 1,
            };
          } else {
            return item;
          }
        })
      );
      // context 반환
      return { prevPosts };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["posts"], context?.prevPosts);
    },
    onSuccess: ({ postId, isLiked, likeCount }) => {
      queryClient.setQueryData<Post[]>(["posts"], (old = []) =>
        old.map((p) => (p.id === postId ? { ...p, isLiked, likeCount } : p))
      );
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // TODO: 특정 게시글의 좋아요 처리 상태를 확인하는 함수 구현
  // 힌트: useMutationState 활용하여 해당 postId의 mutation 상태 조회
  const pendingLikes = useMutationState({
    filters: { mutationKey: ["posts", "toggleLike"], status: "pending" },
    select: (m) => m.state.variables as PostSummary | undefined,
  });

  const isPostLikeLoading = (postId: number): boolean => {
    return pendingLikes.some((v) => v?.postId === postId);
  };

  const handleLikeToggle = (post: Post) => {
    toggleLikeMutation.mutate({
      postId: post.id,
      currentLiked: post.isLiked,
    });
  };

  if (isLoading) return <div>게시글을 불러오는 중...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h3>게시글 목록 (좋아요 낙관적 업데이트)</h3>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", color: "#495057" }}>
          💡 테스트 방법
        </h4>
        <ul style={{ margin: 0, paddingLeft: "20px", color: "#6c757d" }}>
          <li>여러 게시글의 좋아요 버튼을 빠르게 클릭해보세요</li>
          <li>20% 확률로 실패하므로 실패 시 롤백을 확인해보세요</li>
          <li>좋아요 처리 중 버튼 상태 변화를 관찰해보세요</li>
        </ul>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {posts.map((post) => {
          const isLoading = isPostLikeLoading(post.id);

          return (
            <div
              key={post.id}
              style={{
                border: "1px solid #e9ecef",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {/* 게시글 헤더 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      color: "#212529",
                      fontSize: "18px",
                    }}
                  >
                    {post.title}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      color: "#6c757d",
                      fontSize: "14px",
                    }}
                  >
                    <span>👤 {post.author}</span>
                    <span>
                      📅 {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </div>
              </div>

              {/* 게시글 내용 */}
              <p
                style={{
                  color: "#495057",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                  fontSize: "15px",
                }}
              >
                {post.content}
              </p>

              {/* 좋아요 섹션 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "15px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => handleLikeToggle(post)}
                    disabled={isLoading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: post.isLiked ? "#ff6b6b" : "#f8f9fa",
                      color: post.isLiked ? "white" : "#495057",
                      border: post.isLiked
                        ? "1px solid #ff6b6b"
                        : "1px solid #dee2e6",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>
                      {post.isLiked ? "❤️" : "🤍"}
                    </span>
                    {isLoading
                      ? "처리중..."
                      : post.isLiked
                      ? "좋아요"
                      : "좋아요"}
                  </button>

                  <span
                    style={{
                      color: "#6c757d",
                      fontSize: "14px",
                      minWidth: "60px",
                    }}
                  >
                    {post.likeCount}개
                  </span>
                </div>

                {/* 로딩 상태 표시 */}
                {isLoading && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#007bff",
                      fontSize: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        border: "2px solid #e3f2fd",
                        borderTop: "2px solid #007bff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <span>좋아요 처리 중...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {posts.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#6c757d",
            padding: "40px",
            fontSize: "16px",
          }}
        >
          게시글이 없습니다.
        </div>
      )}

      {/* CSS 애니메이션 */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LikeOptimisticUpdate;
