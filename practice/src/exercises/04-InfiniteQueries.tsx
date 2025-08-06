import React from 'react';
// TODO: useInfiniteQuery와 필요한 타입들을 import 하세요
// import { useInfiniteQuery } from '@tanstack/react-query';
// import { fetchPosts, Post } from '../api/users';

const InfiniteQueries: React.FC = () => {
  // TODO: useInfiniteQuery를 사용하여 무한 스크롤 포스트 목록을 구현하세요
  // 힌트: queryKey는 ['posts']를 사용하세요
  // 힌트: queryFn에서 pageParam을 사용하여 페이지를 전달하세요
  // 힌트: getNextPageParam을 사용하여 다음 페이지 번호를 반환하세요

  // const {
  //   data,
  //   isLoading,
  //   isError,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage
  // } = useInfiniteQuery({
  //   queryKey: ['posts'],
  //   queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
  //   getNextPageParam: (lastPage) => lastPage.nextPage,
  //   initialPageParam: 1
  // });

  // TODO: "더 보기" 버튼 클릭 시 fetchNextPage를 실행하는 함수를 작성하세요
  const handleLoadMore = () => {
    // fetchNextPage();
  };

  // TODO: 로딩 상태 처리
  // if (isLoading) {
  //   return <div style={{ textAlign: 'center', padding: '20px' }}>포스트를 불러오는 중...</div>;
  // }

  // TODO: 에러 상태 처리
  // if (isError) {
  //   return (
  //     <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
  //       에러가 발생했습니다: {error?.message}
  //     </div>
  //   );
  // }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>📱 소셜 미디어 피드</h2>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        무한 스크롤을 구현하여 포스트를 페이지별로 불러와보세요!
      </p>

      {/* TODO: 포스트 목록을 렌더링하세요 */}
      {/* 힌트: data?.pages를 사용하여 모든 페이지의 데이터에 접근할 수 있습니다 */}
      {/* 힌트: flatMap을 사용하여 모든 페이지의 포스트를 하나의 배열로 만들 수 있습니다 */}
      
      <div style={{ marginBottom: '30px' }}>
        {/* {data?.pages.flatMap(page => page.posts).map((post: Post) => (
          <div 
            key={post.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '15px',
              backgroundColor: '#fafafa'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>{post.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#666' }}>
                <span>❤️ {post.likes}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <p style={{ margin: 0, lineHeight: '1.6', color: '#555' }}>{post.body}</p>
          </div>
        ))} */}
        
        {/* 연습용 임시 데이터 */}
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '15px',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>예시 포스트</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#666' }}>
              <span>❤️ 42</span>
              <span>2024-01-15</span>
            </div>
          </div>
          <p style={{ margin: 0, lineHeight: '1.6', color: '#555' }}>
            useInfiniteQuery를 구현하면 실제 데이터가 여기에 표시됩니다.
          </p>
        </div>
      </div>

      {/* TODO: 더 보기 버튼을 구현하세요 */}
      {/* 힌트: hasNextPage가 true일 때만 버튼을 표시하세요 */}
      {/* 힌트: isFetchingNextPage일 때는 로딩 상태를 표시하세요 */}
      
      <div style={{ textAlign: 'center' }}>
        {/* {hasNextPage && (
          <button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            style={{
              padding: '12px 24px',
              backgroundColor: isFetchingNextPage ? '#ccc' : '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: isFetchingNextPage ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {isFetchingNextPage ? '로딩 중...' : '더 보기'}
          </button>
        )} */}
        
        {/* 연습용 임시 버튼 */}
        <button
          onClick={handleLoadMore}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          더 보기 (구현 필요)
        </button>
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e8f4f8',
        borderRadius: '8px',
        border: '1px solid #b3d9e6'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>💡 구현 가이드</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#004499' }}>
          <li>useInfiniteQuery의 queryFn에서 pageParam을 받아 페이지 번호로 사용하세요</li>
          <li>getNextPageParam에서 다음 페이지가 있는지 확인하고 페이지 번호를 반환하세요</li>
          <li>data.pages.flatMap()을 사용해 모든 페이지의 데이터를 하나로 합치세요</li>
          <li>hasNextPage로 더 보기 버튼의 표시 여부를 결정하세요</li>
          <li>isFetchingNextPage로 추가 로딩 상태를 표시하세요</li>
        </ul>
      </div>
    </div>
  );
};

export default InfiniteQueries;