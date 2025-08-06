import React, { useState } from 'react';
// TODO: useQuery, useQueryClient와 필요한 타입들을 import 하세요
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { fetchUserProfile, fetchUserBasicInfo, UserProfile } from '../api/users';

const InitialQueryData: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  // TODO: useQueryClient를 사용하여 쿼리 클라이언트에 접근하세요
  // const queryClient = useQueryClient();

  // TODO: 빠른 기본 정보를 미리 로드하는 함수를 작성하세요
  const preloadUserBasicInfo = async (userId: number) => {
    // 힌트: fetchUserBasicInfo를 호출하여 기본 정보를 가져오세요
    // 힌트: queryClient.setQueryData를 사용하여 상세 정보 쿼리의 초기 데이터로 설정하세요
    
    // try {
    //   const basicInfo = await fetchUserBasicInfo(userId);
    //   queryClient.setQueryData(['userProfile', userId], {
    //     ...basicInfo,
    //     email: 'Loading...',
    //     bio: 'Loading...',
    //     followers: 0,
    //     following: 0,
    //     joinedAt: 'Loading...'
    //   });
    // } catch (error) {
    //   console.error('기본 정보 로드 실패:', error);
    // }
  };

  // TODO: 사용자 상세 프로필을 조회하는 쿼리를 작성하세요
  // 힌트: enabled 옵션을 사용하여 selectedUserId가 있을 때만 실행하세요
  // 힌트: initialData 옵션을 사용하여 캐시된 기본 정보를 초기 데이터로 활용하세요

  // const {
  //   data: userProfile,
  //   isLoading,
  //   isError,
  //   error,
  //   isFetching
  // } = useQuery({
  //   queryKey: ['userProfile', selectedUserId],
  //   queryFn: () => fetchUserProfile(selectedUserId!),
  //   enabled: selectedUserId !== null,
  //   initialData: () => {
  //     // 캐시에서 기본 정보가 있다면 사용
  //     return queryClient.getQueryData(['userProfile', selectedUserId]);
  //   }
  // });

  const users = [
    { id: 1, name: '김철수' },
    { id: 2, name: '이영희' },
    { id: 3, name: '박민수' },
    { id: 4, name: '최지영' }
  ];

  const handleUserSelect = async (userId: number) => {
    // TODO: 사용자 선택 시 기본 정보를 미리 로드하고 선택된 사용자를 설정하세요
    // await preloadUserBasicInfo(userId);
    setSelectedUserId(userId);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>👤 사용자 프로필 뷰어</h2>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        사용자를 선택하면 빠른 기본 정보를 먼저 보여주고, 상세 정보를 점진적으로 로드합니다.
      </p>

      {/* 사용자 선택 버튼들 */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => handleUserSelect(user.id)}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedUserId === user.id ? '#007acc' : '#f0f0f0',
              color: selectedUserId === user.id ? 'white' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: selectedUserId === user.id ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            {user.name} 선택
          </button>
        ))}
      </div>

      {/* 프로필 표시 영역 */}
      {selectedUserId ? (
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '30px',
          backgroundColor: '#fafafa'
        }}>
          {/* TODO: 로딩 상태와 에러 상태를 처리하세요 */}
          {/* {isError && (
            <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
              에러가 발생했습니다: {error?.message}
            </div>
          )} */}

          {/* TODO: 사용자 프로필 정보를 표시하세요 */}
          {/* {userProfile && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    marginRight: '20px',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '24px', color: '#333' }}>
                    {userProfile.name}
                    {isFetching && <span style={{ fontSize: '14px', color: '#666', marginLeft: '10px' }}>🔄</span>}
                  </h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>{userProfile.email}</p>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ lineHeight: '1.6', color: '#555', fontSize: '16px' }}>
                  {userProfile.bio}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007acc' }}>
                    {userProfile.followers?.toLocaleString() || 0}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>팔로워</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007acc' }}>
                    {userProfile.following?.toLocaleString() || 0}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>팔로잉</div>
                </div>
              </div>

              <div style={{ fontSize: '14px', color: '#888' }}>
                가입일: {userProfile.joinedAt ? new Date(userProfile.joinedAt).toLocaleDateString() : 'Loading...'}
              </div>
            </div>
          )} */}

          {/* 연습용 임시 프로필 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#ddd',
                marginRight: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px'
              }}>
                👤
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '24px', color: '#333' }}>
                  예시 사용자
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>example@email.com</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ lineHeight: '1.6', color: '#555', fontSize: '16px' }}>
                useQuery와 initialData를 구현하면 실제 사용자 프로필이 여기에 표시됩니다.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007acc' }}>0</div>
                <div style={{ fontSize: '14px', color: '#666' }}>팔로워</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007acc' }}>0</div>
                <div style={{ fontSize: '14px', color: '#666' }}>팔로잉</div>
              </div>
            </div>

            <div style={{ fontSize: '14px', color: '#888' }}>
              가입일: 구현 필요
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666',
          fontSize: '18px'
        }}>
          위에서 사용자를 선택해주세요
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e8f4f8',
        borderRadius: '8px',
        border: '1px solid #b3d9e6'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>💡 구현 가이드</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#004499' }}>
          <li>fetchUserBasicInfo로 빠른 기본 정보를 먼저 가져오세요</li>
          <li>queryClient.setQueryData로 상세 쿼리의 초기 데이터를 설정하세요</li>
          <li>useQuery의 initialData 옵션을 사용해 캐시된 데이터를 활용하세요</li>
          <li>enabled 옵션으로 사용자 선택 시에만 상세 정보를 조회하세요</li>
          <li>isFetching으로 백그라운드 업데이트 상태를 표시하세요</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffeaa7'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#856404' }}>🎯 실무 활용</h4>
        <p style={{ margin: 0, color: '#856404', fontSize: '14px', lineHeight: '1.5' }}>
          사용자 프로필, 상품 상세 페이지 등에서 기본 정보를 먼저 보여주고 
          상세 정보를 점진적으로 로드하여 사용자 경험을 향상시킬 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default InitialQueryData;