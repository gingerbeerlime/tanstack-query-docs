import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers, User } from "../api/users";

/**
 * Problem1 개선된 버전
 *
 * 개선사항:
 * 1. 조건부 렌더링 구조 개선 (불필요한 else 제거)
 * 2. 에러 타입 안전성 향상
 * 3. 접근성 개선 (테이블 헤더)
 * 4. 스타일 일관성 향상
 * 5. 빈 데이터 상태 처리
 */

const Problem1Improved: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // 조건부 렌더링을 일관된 컨테이너 내에서 처리
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>사용자 목록</h3>

      {isLoading && (
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          사용자 목록을 불러오는 중...
        </div>
      )}

      {isError && (
        <div
          style={{
            color: "red",
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#fee",
            borderRadius: "4px",
            border: "1px solid #fcc",
          }}
        >
          ❌ {error instanceof Error ? error.message : "에러가 발생했습니다."}
        </div>
      )}

      {data && data.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#666",
            fontStyle: "italic",
          }}
        >
          📭 등록된 사용자가 없습니다.
        </div>
      )}

      {data && data.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
          role="table"
          aria-label="사용자 목록 테이블"
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #dee2e6",
              }}
            >
              <th style={{ padding: "12px 8px", textAlign: "left" }}>이름</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>이메일</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>거주지</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: "1px solid #e9ecef",
                }}
              >
                <td style={{ padding: "12px 8px" }}>{user.name}</td>
                <td style={{ padding: "12px 8px" }}>{user.email}</td>
                <td style={{ padding: "12px 8px" }}>{user.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Problem1Improved;
