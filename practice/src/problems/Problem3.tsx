import React, { useState } from 'react'
// TODO: 필요한 TanStack Query 훅들을 import 하세요
// import { ??? } from '@tanstack/react-query'
import { fetchUsers, fetchUserPosts, User, Post } from '../api/users'

/**
 * 문제 3: 쿼리 키와 의존성 쿼리
 * 
 * 요구사항:
 * 1. 사용자 목록을 조회하는 쿼리를 작성하세요
 * 2. 사용자를 선택할 수 있는 드롭다운을 만드세요
 * 3. 선택된 사용자의 게시글을 조회하는 의존성 쿼리를 작성하세요
 * 4. 사용자가 선택되지 않았을 때는 게시글 쿼리가 실행되지 않도록 하세요
 * 5. 각 쿼리에 적절한 쿼리 키를 설정하세요 (['users'], ['posts', userId])
 * 6. 선택된 사용자가 바뀔 때마다 해당 사용자의 게시글이 자동으로 조회되도록 하세요
 * 
 * 힌트:
 * - 사용자 목록: ['users'] 키 사용
 * - 게시글 목록: ['posts', userId] 키 사용 (userId가 포함된 복합 키)
 * - enabled 옵션을 사용하여 조건부로 쿼리 실행
 * - selectedUserId 상태가 있을 때만 게시글 쿼리가 실행되도록 하세요
 */

const Problem3: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  // TODO: 사용자 목록을 가져오는 쿼리 작성

  // TODO: 선택된 사용자의 게시글을 가져오는 의존성 쿼리 작성
  // selectedUserId가 있을 때만 실행되도록 enabled 옵션 사용

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value ? parseInt(e.target.value) : null
    setSelectedUserId(userId)
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h4>사용자 선택</h4>
        <select 
          value={selectedUserId || ''} 
          onChange={handleUserSelect}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '150px' }}
        >
          <option value="">사용자를 선택하세요</option>
          {/* TODO: 사용자 목록을 옵션으로 표시 */}
        </select>
      </div>

      {selectedUserId && (
        <div>
          <h4>선택된 사용자의 게시글</h4>
          {/* TODO: 선택된 사용자의 게시글 목록 표시 */}
          {/* 로딩, 에러, 성공 상태 모두 처리 */}
        </div>
      )}

      {!selectedUserId && (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          사용자를 선택하면 해당 사용자의 게시글을 볼 수 있습니다.
        </p>
      )}

      <p>🚧 TODO: 사용자 목록 쿼리와 의존성 게시글 쿼리를 구현하세요</p>
    </div>
  )
}

export default Problem3