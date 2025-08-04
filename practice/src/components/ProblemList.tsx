import React from 'react'

const problems = [
  {
    id: 1,
    title: '기본 쿼리와 상태 처리',
    description: 'fetchUsers API를 사용하여 사용자 목록을 조회하고 로딩/에러 상태를 처리해보세요.',
    requirements: [
      'fetchUsers API를 사용하여 사용자 목록을 조회하는 쿼리를 작성하세요',
      '로딩 상태일 때 "사용자 목록을 불러오는 중..." 메시지를 표시하세요',
      '에러 상태일 때 에러 메시지를 빨간색으로 표시하세요',
      '성공 시 사용자 목록을 표 형태로 표시하세요 (이름, 이메일, 도시)',
      '쿼리 키는 [\'users\']를 사용하세요'
    ],
    hints: [
      'useQuery 훅을 사용하세요',
      'queryKey와 queryFn을 올바르게 설정하세요',
      'isLoading, isError, error, data 상태를 활용하세요'
    ]
  },
  {
    id: 2,
    title: '뮤테이션과 쿼리 무효화',
    description: '새로운 사용자를 추가하고 사용자 목록을 자동으로 업데이트해보세요.',
    requirements: [
      'addUser API를 사용하여 새 사용자를 추가하는 뮤테이션을 작성하세요',
      '사용자 추가 성공 시 users 쿼리를 무효화하여 목록을 새로고침하세요',
      '뮤테이션 로딩 상태를 표시하세요',
      '성공/실패 메시지를 표시하세요'
    ],
    hints: [
      'useMutation 훅을 사용하세요',
      'queryClient.invalidateQueries를 사용하여 쿼리를 무효화하세요',
      'onSuccess 콜백을 활용하세요'
    ]
  },
  {
    id: 3,
    title: '쿼리 키와 의존성 쿼리',
    description: '선택된 사용자의 상세 정보를 조회하는 의존성 쿼리를 구현해보세요.',
    requirements: [
      '사용자 목록에서 사용자를 선택할 수 있는 드롭다운을 만드세요',
      '선택된 사용자의 ID를 사용하여 상세 정보를 조회하세요',
      '사용자가 선택되지 않았을 때는 쿼리를 실행하지 마세요',
      '쿼리 키에 사용자 ID를 포함하세요'
    ],
    hints: [
      'enabled 옵션을 사용하여 조건부 쿼리를 구현하세요',
      '쿼리 키를 동적으로 변경하세요',
      'select 태그를 사용하여 사용자 선택 UI를 만드세요'
    ]
  }
]

const ProblemList: React.FC = () => {
  return (
    <div style={{ padding: '30px' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>📚 TanStack Query 연습 문제</h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          각 문제를 차례대로 해결하면서 TanStack Query의 핵심 개념들을 익혀보세요!
        </p>
      </div>

      {problems.map((problem) => (
        <div
          key={problem.id}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            backgroundColor: '#fafafa',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              color: '#007acc', 
              fontSize: '24px', 
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ 
                backgroundColor: '#007acc',
                color: 'white',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {problem.id}
              </span>
              {problem.title}
            </h3>
            <p style={{ 
              color: '#555', 
              fontSize: '16px', 
              lineHeight: '1.6',
              marginLeft: '42px'
            }}>
              {problem.description}
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              color: '#333', 
              fontSize: '18px', 
              marginBottom: '12px',
              marginLeft: '42px'
            }}>
              📋 요구사항
            </h4>
            <ul style={{ 
              marginLeft: '60px', 
              color: '#444',
              lineHeight: '1.8'
            }}>
              {problem.requirements.map((req, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ 
              color: '#333', 
              fontSize: '18px', 
              marginBottom: '12px',
              marginLeft: '42px'
            }}>
              💡 힌트
            </h4>
            <ul style={{ 
              marginLeft: '60px', 
              color: '#666',
              lineHeight: '1.8'
            }}>
              {problem.hints.map((hint, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <div style={{
        backgroundColor: '#e8f4f8',
        border: '1px solid #b3d9e6',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#0066cc', marginBottom: '10px' }}>🚀 시작하기</h3>
        <p style={{ color: '#004499', lineHeight: '1.6' }}>
          문제를 다 읽었다면 <strong>"💻 구현하기"</strong> 탭으로 이동해서 코드를 작성해보세요!<br/>
          각 문제는 독립적으로 해결할 수 있지만, 순서대로 풀어보시는 것을 권장합니다.
        </p>
      </div>
    </div>
  )
}

export default ProblemList