import React from 'react'
import Problem1 from './problems/Problem1'
import Problem2 from './problems/Problem2'
import Problem3 from './problems/Problem3'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>TanStack Query 연습 문제</h1>
      <p>각 문제를 단계별로 해결해보세요!</p>
      
      <div style={{ marginBottom: '40px' }}>
        <h2>문제 1: 기본 쿼리와 상태 처리</h2>
        <Problem1 />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>문제 2: 뮤테이션과 쿼리 무효화</h2>
        <Problem2 />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>문제 3: 쿼리 키와 의존성 쿼리</h2>
        <Problem3 />
      </div>
    </div>
  )
}

export default App