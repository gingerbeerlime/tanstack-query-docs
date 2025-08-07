import React, { useMemo, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/users";
import PostCard from "../components/PostCard";
import LoadMoreButton from "../components/LoadMoreButton";

const InfiniteQueries: React.FC = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, status, error, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, 10),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const allPosts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data?.pages]
  );

  const hasMore = useMemo(
    () => data?.pages && data.pages[data.pages.length - 1].hasMore,
    [data?.pages]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.8 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isFetchingNextPage, fetchNextPage]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>
        📱 소셜 미디어 피드
      </h2>
      <p style={{ marginBottom: "30px", color: "#666" }}>
        무한 스크롤을 구현하여 포스트를 페이지별로 불러와보세요!
      </p>

      {isFetchingNextPage && <div>로딩중입니다...</div>}

      {status === "error" && (
        <div>{error.message || "포스트 목록을 불러오는데 실패했습니다."}</div>
      )}

      {allPosts.length > 0 &&
        allPosts.map((post) => <PostCard post={post} key={post.id} />)}

      {hasMore && (
        <LoadMoreButton
          loadMoreRef={loadMoreRef}
          onClick={handleLoadMore}
          isLoading={isFetchingNextPage}
        />
      )}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#e8f4f8",
          borderRadius: "8px",
          border: "1px solid #b3d9e6",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", color: "#0066cc" }}>
          💡 구현 가이드
        </h4>
        <ul style={{ margin: 0, paddingLeft: "20px", color: "#004499" }}>
          <li>
            useInfiniteQuery의 queryFn에서 pageParam을 받아 페이지 번호로
            사용하세요
          </li>
          <li>
            getNextPageParam에서 다음 페이지가 있는지 확인하고 페이지 번호를
            반환하세요
          </li>
          <li>
            data.pages.flatMap()을 사용해 모든 페이지의 데이터를 하나로 합치세요
          </li>
          <li>hasNextPage로 더 보기 버튼의 표시 여부를 결정하세요</li>
          <li>isFetchingNextPage로 추가 로딩 상태를 표시하세요</li>
        </ul>
      </div>
    </div>
  );
};

export default InfiniteQueries;
