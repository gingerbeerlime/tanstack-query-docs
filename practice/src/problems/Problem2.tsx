import React, { useState } from 'react'
// TODO: 필요한 TanStack Query 훅들을 import 하세요
// import { ???, ??? } from '@tanstack/react-query'
import { fetchUsers, createUser, User } from '../api/users'

/**
 * 문제 2: 뮤테이션과 쿼리 무효화
 * 
 * 요구사항:
 * 1. 사용자 목록을 조회하는 쿼리를 작성하세요 (Problem1과 동일)
 * 2. 새 사용자를 추가하는 뮤테이션을 작성하세요
 * 3. 뮤테이션 성공 시 사용자 목록 쿼리를 무효화하여 최신 데이터를 다시 가져오도록 하세요
 * 4. 뮤테이션 진행 중일 때 "추가 중..." 버튼 비활성화 처리를 하세요
 * 5. 뮤테이션 성공/실패 시 적절한 메시지를 표시하세요
 * 
 * 힌트:
 * - useQuery와 useMutation 훅을 사용하세요
 * - useQueryClient 훅을 사용하여 queryClient.invalidateQueries()로 쿼리를 무효화하세요
 * - 쿼리 키는 ['users']를 사용하세요
 * - mutate 함수와 isPending, isSuccess, isError 상태를 활용하세요
 */

const Problem2: React.FC = () => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    city: ''
  })

  // TODO: 사용자 목록을 가져오는 쿼리 작성

  // TODO: QueryClient 인스턴스 가져오기 (useQueryClient 사용)

  // TODO: 새 사용자를 추가하는 뮤테이션 작성
  // 성공 시 쿼리 무효화 처리 포함

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 입력값 검증
    if (!newUser.name || !newUser.email || !newUser.city) {
      alert('모든 필드를 입력해주세요')
      return
    }

    // TODO: 뮤테이션 실행
    
    // 성공 시 폼 초기화
    setNewUser({ name: '', email: '', city: '' })
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h4>새 사용자 추가</h4>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="이름"
            value={newUser.name}
            onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="email"
            placeholder="이메일"
            value={newUser.email}
            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="도시"
            value={newUser.city}
            onChange={(e) => setNewUser(prev => ({ ...prev, city: e.target.value }))}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button 
            type="submit"
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            // TODO: 뮤테이션 진행 중일 때 비활성화 처리
          >
            추가
          </button>
        </form>
        
        {/* TODO: 뮤테이션 상태에 따른 메시지 표시 */}
      </div>

      <div>
        <h4>사용자 목록</h4>
        {/* TODO: 사용자 목록 표시 (Problem1과 유사) */}
        <p>🚧 TODO: useQuery와 useMutation을 사용하여 사용자 목록 조회 및 추가 기능을 구현하세요</p>
      </div>
    </div>
  )
}

export default Problem2