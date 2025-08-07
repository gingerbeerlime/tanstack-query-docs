import { Ref } from "react";

type LoadMoreButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  loadMoreRef: Ref<HTMLDivElement>;
};

const LoadMoreButton = ({
  onClick,
  isLoading,
  loadMoreRef,
}: LoadMoreButtonProps) => {
  return (
    <div style={{ textAlign: "center" }} ref={loadMoreRef}>
      <button
        onClick={onClick}
        style={{
          padding: "12px 24px",
          backgroundColor: "#007acc",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        disabled={isLoading}
        aria-label="더 많은 게시글 불러오기"
        aria-busy={isLoading}
      >
        {isLoading ? "로딩중..." : "더보기"}
      </button>
    </div>
  );
};

export default LoadMoreButton;
