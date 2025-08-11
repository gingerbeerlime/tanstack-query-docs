import React, { useState } from "react";
import BasicQuery from "./exercises/01-BasicQuery";
import MutationAndInvalidation from "./exercises/02-MutationAndInvalidation";
import DependentQueries from "./exercises/03-DependentQueries";
import InfiniteQueries from "./exercises/04-InfiniteQueries";
import InitialQueryData from "./exercises/05-InitialQueryData";
import OptimisticUpdates from "./exercises/06-OptimisticUpdates";
import LikeOptimisticUpdate from "./exercises/07-LikeOptimisticUpdate";

const exercises = [
  { 
    id: 1, 
    title: "기본 쿼리와 상태 처리", 
    component: BasicQuery,
    description: "TanStack Query의 useQuery 훅을 사용하여 기본적인 데이터 페칭을 구현합니다.",
    concepts: ["useQuery", "로딩 상태", "에러 핸들링", "쿼리 키"]
  },
  {
    id: 2,
    title: "뮤테이션과 쿼리 무효화",
    component: MutationAndInvalidation,
    description: "데이터를 수정하고 관련 쿼리를 자동으로 업데이트하는 방법을 학습합니다.",
    concepts: ["useMutation", "쿼리 무효화", "onSuccess 콜백", "데이터 동기화"]
  },
  { 
    id: 3, 
    title: "쿼리 키와 의존성 쿼리", 
    component: DependentQueries,
    description: "동적 쿼리 키와 조건부 쿼리 실행을 통한 의존성 관리를 구현합니다.",
    concepts: ["동적 쿼리 키", "조건부 쿼리", "enabled 옵션", "의존성 관리"]
  },
  {
    id: 4,
    title: "무한 스크롤과 페이지네이션",
    component: InfiniteQueries,
    description: "소셜 미디어 피드처럼 무한 스크롤을 구현하여 대용량 데이터를 효율적으로 처리합니다.",
    concepts: ["useInfiniteQuery", "페이지네이션", "getNextPageParam", "무한 스크롤"]
  },
  {
    id: 5,
    title: "초기 데이터와 점진적 로딩",
    component: InitialQueryData,
    description: "빠른 기본 정보를 먼저 보여주고 상세 정보를 점진적으로 로드하여 UX를 개선합니다.",
    concepts: ["initialData", "setQueryData", "점진적 로딩", "캐시 활용"]
  },
  {
    id: 6,
    title: "낙관적 업데이트",
    component: OptimisticUpdates,
    description: "댓글 추가 시 즉시 UI에 반영하고, 실패 시 롤백하는 낙관적 업데이트를 구현합니다.",
    concepts: ["onMutate", "캐시 업데이트", "롤백 처리", "낙관적 UI"]
  },
  {
    id: 7,
    title: "좋아요 토글 최적화",
    component: LikeOptimisticUpdate,
    description: "게시글 좋아요를 즉시 반영하고, 여러 게시글을 동시에 처리할 수 있는 고급 낙관적 업데이트를 구현합니다.",
    concepts: ["mutationKey", "독립적 처리", "useMutationState", "부분 업데이트"]
  }
];

function App() {
  const [selectedExercise, setSelectedExercise] = useState<number>(1);

  const CurrentExerciseComponent =
    exercises.find((e) => e.id === selectedExercise)?.component || BasicQuery;

  const currentExercise = exercises.find((e) => e.id === selectedExercise);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        TanStack Query 연습 예제
      </h1>
      
      <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 120px)" }}>
        {/* 왼쪽 사이드바 - 예제 목록 */}
        <div style={{ 
          width: "400px", 
          flexShrink: 0,
          overflowY: "auto",
          paddingRight: "10px"
        }}>
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise.id)}
              style={{
                border: selectedExercise === exercise.id ? "2px solid #007acc" : "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "15px",
                backgroundColor: selectedExercise === exercise.id ? "#e8f4f8" : "#fafafa",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: selectedExercise === exercise.id ? "0 4px 12px rgba(0,122,204,0.2)" : "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px' 
              }}>
                <span style={{ 
                  backgroundColor: selectedExercise === exercise.id ? '#007acc' : '#666',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {exercise.id}
                </span>
                <h3 style={{ 
                  color: selectedExercise === exercise.id ? '#007acc' : '#333', 
                  fontSize: '16px', 
                  margin: 0,
                  fontWeight: 'bold'
                }}>
                  {exercise.title}
                </h3>
              </div>
              
              <p style={{ 
                color: '#666', 
                fontSize: '14px', 
                lineHeight: '1.4',
                margin: '0 0 12px 0'
              }}>
                {exercise.description}
              </p>
              
              <div style={{ marginTop: '12px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#888', 
                  marginBottom: '6px',
                  fontWeight: 'bold'
                }}>
                  핵심 개념:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {exercise.concepts.map((concept, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: selectedExercise === exercise.id ? '#007acc' : '#ddd',
                        color: selectedExercise === exercise.id ? 'white' : '#666',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 오른쪽 구현 영역 */}
        <div style={{ 
          flex: 1,
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          backgroundColor: "#fafafa",
          display: "flex",
          flexDirection: "column"
        }}>
          <div
            style={{
              backgroundColor: "#007acc",
              color: "white",
              padding: "15px 25px",
              borderRadius: "12px 12px 0 0",
              fontSize: "18px",
              fontWeight: "bold",
              flexShrink: 0
            }}
          >
            예제 {selectedExercise}: {currentExercise?.title}
          </div>

          <div style={{ 
            padding: "25px", 
            flex: 1,
            overflowY: "auto"
          }}>
            <CurrentExerciseComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
