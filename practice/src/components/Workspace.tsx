import React, { useState } from "react";
import BasicQuery from "../exercises/01-BasicQuery";
import MutationAndInvalidation from "../exercises/02-MutationAndInvalidation";
import DependentQueries from "../exercises/03-DependentQueries";

const exercises = [
  { id: 1, title: "기본 쿼리와 상태 처리", component: BasicQuery },
  {
    id: 2,
    title: "뮤테이션과 쿼리 무효화",
    component: MutationAndInvalidation,
  },
  { id: 3, title: "쿼리 키와 의존성 쿼리", component: DependentQueries },
];

const Workspace: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<number>(1);

  const CurrentExerciseComponent =
    exercises.find((e) => e.id === selectedExercise)?.component || BasicQuery;

  return (
    <div style={{ padding: "30px", height: "100%" }}>
      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{ color: "#333", marginBottom: "20px", textAlign: "center" }}
        >
          💻 구현 워크스페이스
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise.id)}
              style={{
                padding: "10px 20px",
                border:
                  selectedExercise === exercise.id
                    ? "2px solid #007acc"
                    : "2px solid #ddd",
                backgroundColor:
                  selectedExercise === exercise.id ? "#e8f4f8" : "white",
                color: selectedExercise === exercise.id ? "#007acc" : "#666",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight:
                  selectedExercise === exercise.id ? "bold" : "normal",
                transition: "all 0.3s ease",
              }}
            >
              예제 {exercise.id}: {exercise.title}
            </button>
          ))}
        </div>

        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <h4
            style={{ color: "#856404", marginBottom: "8px", fontSize: "16px" }}
          >
            📝 작업 안내
          </h4>
          <p style={{ color: "#856404", margin: 0, lineHeight: "1.5" }}>
            선택한 예제의 코드를 직접 수정하면서 TanStack Query를 익혀보세요. 각
            파일의 TODO 주석을 참고하여 단계별로 구현해보세요!
          </p>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          backgroundColor: "#fafafa",
          minHeight: "400px",
        }}
      >
        <div
          style={{
            backgroundColor: "#007acc",
            color: "white",
            padding: "15px 25px",
            borderRadius: "12px 12px 0 0",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          예제 {selectedExercise}:{" "}
          {exercises.find((e) => e.id === selectedExercise)?.title}
        </div>

        <div style={{ padding: "25px" }}>
          <CurrentExerciseComponent />
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#d4edda",
          border: "1px solid #c3e6cb",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ color: "#155724", marginBottom: "8px" }}>🎯 개발 팁</h4>
        <ul style={{ color: "#155724", margin: 0, paddingLeft: "20px" }}>
          <li>
            브라우저 개발자 도구의 Network 탭을 열어서 API 호출을 확인해보세요
          </li>
          <li>
            React Query DevTools를 사용하면 쿼리 상태를 더 쉽게 디버깅할 수
            있습니다
          </li>
          <li>코드가 작동하지 않으면 콘솔에서 에러 메시지를 확인해보세요</li>
        </ul>
      </div>
    </div>
  );
};

export default Workspace;
