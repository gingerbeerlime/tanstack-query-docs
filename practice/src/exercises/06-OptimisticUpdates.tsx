import React, { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

// 댓글 타입 정의
interface Comment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
  isOptimistic?: boolean;
}

// Mock API 함수들
const fetchComments = async (): Promise<Comment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: 1,
      text: "첫 번째 댓글입니다!",
      author: "사용자A",
      createdAt: "2024-01-01T10:00:00Z",
    },
    {
      id: 2,
      text: "좋은 글이네요.",
      author: "사용자B",
      createdAt: "2024-01-01T10:30:00Z",
    },
  ];
};

const addComment = async (commentText: string): Promise<Comment> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 30% 확률로 실패하는 API 시뮬레이션
  if (Math.random() > 0.7) {
    throw new Error("댓글 추가에 실패했습니다. 다시 시도해주세요.");
  }

  return {
    id: Date.now(),
    text: commentText,
    author: "현재 사용자",
    createdAt: new Date().toISOString(),
  };
};

/**
 * 문제 6: 낙관적 업데이트 (Optimistic Updates)
 *
 * 요구사항:
 * 1. 댓글 목록을 조회하는 쿼리를 구현하세요
 * 2. 댓글 추가 시 즉시 UI에 표시하세요 (낙관적 업데이트)
 * 3. 추가 중인 댓글은 회색 배경과 "추가 중..." 텍스트로 표시하세요
 * 4. 서버 요청 실패 시 추가된 댓글을 제거하고 에러 메시지를 표시하세요
 * 5. 성공 시 실제 서버 데이터로 교체하세요
 *
 * 구현 방식:
 * - useMutation의 onMutate에서 캐시를 낙관적으로 업데이트
 * - onError에서 실패 시 롤백 처리
 * - onSettled에서 최종 동기화
 *
 * 힌트:
 * - queryClient.cancelQueries로 기존 쿼리 취소
 * - queryClient.getQueryData로 이전 데이터 백업
 * - queryClient.setQueryData로 캐시 업데이트
 * - context를 통해 롤백 데이터 전달
 */

const OptimisticUpdates: React.FC = () => {
  const [newComment, setNewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // TODO: queryClient 가져오기
  const queryClient = useQueryClient();

  // TODO: 댓글 목록 조회 쿼리 구현
  // 힌트: queryKey는 ["comments"], queryFn은 fetchComments 사용
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
  });

  // TODO: 댓글 추가 뮤테이션 구현 (낙관적 업데이트 포함)
  // 힌트: useMutation 사용하고 onMutate, onError, onSettled 구현
  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onMutate: async (commentText: string) => {
      setErrorMessage("");
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      const previousComments = queryClient.getQueryData<Comment[]>([
        "comments",
      ]);

      const tempId = Date.now() * -1;
      const optimisticComment: Comment = {
        id: tempId,
        text: commentText,
        author: "현재 사용자",
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      queryClient.setQueryData<Comment[]>(["comments"], (old = []) => [
        ...old,
        optimisticComment,
      ]);

      return { previousComments, tempId };
    },
    onError: (error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData<Comment[]>(
          ["comments"],
          context.previousComments
        );
      }
      setErrorMessage(error?.message || "알 수 없는 오류가 발생했습니다.");
    },
    onSuccess: (serverComment, _variables, context) => {
      if (context?.tempId !== null) {
        queryClient.setQueryData<Comment[]>(["comments"], (old = []) =>
          old.map((c) => (c.id === context.tempId ? serverComment : c))
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
      setNewComment("");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["comments"] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addCommentMutation.mutate(newComment.trim());
  };

  if (isLoading) return <div>댓글을 불러오는 중...</div>;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "600px",
      }}
    >
      <h3>댓글 목록 (낙관적 업데이트)</h3>

      {/* 에러 메시지 */}
      {errorMessage && (
        <div
          style={{
            color: "red",
            backgroundColor: "#ffebee",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* 댓글 목록 */}
      <div style={{ marginBottom: "20px" }}>
        {comments.map((comment, index) => {
          // TODO: 현재 추가 중인 댓글인지 확인하는 로직 구현
          const isPending =
            addCommentMutation.isPending && comment?.isOptimistic;

          return (
            <div
              key={comment.id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                padding: "10px",
                marginBottom: "8px",
                backgroundColor: isPending ? "#f5f5f5" : "white",
                opacity: isPending ? 0.7 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <strong>{comment.author}</strong>
                <small style={{ color: "#666" }}>
                  {new Date(comment.createdAt).toLocaleString("ko-KR")}
                </small>
              </div>
              <div>
                {comment.text}
                {isPending && (
                  <span style={{ color: "#999", marginLeft: "10px" }}>
                    (추가 중...)
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {comments.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#666",
              padding: "20px",
            }}
          >
            아직 댓글이 없습니다.
          </div>
        )}
      </div>

      {/* 댓글 추가 폼 */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              resize: "vertical",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim() || addCommentMutation.isPending}
          style={{
            backgroundColor: addCommentMutation.isPending ? "#ccc" : "#007bff",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: addCommentMutation.isPending ? "not-allowed" : "pointer",
          }}
        >
          {addCommentMutation.isPending ? "댓글 추가 중..." : "댓글 추가"}
        </button>
      </form>

      {/* 상태 정보 (디버깅용) */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <strong>상태:</strong>{" "}
        {addCommentMutation.isPending ? "추가 중" : "대기 중"} |
        <strong> 댓글 수:</strong> {comments.length}개
        {addCommentMutation.isPending && (
          <span>
            {" "}
            | <strong>추가 중인 댓글:</strong> "{addCommentMutation.variables}"
          </span>
        )}
      </div>
    </div>
  );
};

export default OptimisticUpdates;
