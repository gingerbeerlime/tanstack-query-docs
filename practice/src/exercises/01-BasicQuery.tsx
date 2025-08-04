import React from "react";
// TODO: 필요한 TanStack Query 훅들을 import 하세요
import { useQuery } from "@tanstack/react-query";
import { fetchUsers, User } from "../api/users";

/**
 * 문제 1: 기본 쿼리와 로딩/에러 상태 처리
 *
 * 요구사항:
 * 1. fetchUsers API를 사용하여 사용자 목록을 조회하는 쿼리를 작성하세요
 * 2. 로딩 상태일 때 "사용자 목록을 불러오는 중..." 메시지를 표시하세요
 * 3. 에러 상태일 때 에러 메시지를 빨간색으로 표시하세요
 * 4. 성공 시 사용자 목록을 표 형태로 표시하세요 (이름, 이메일, 도시)
 * 5. 쿼리 키는 ['users']를 사용하세요
 *
 * 힌트:
 * - useQuery 훅을 사용하세요
 * - queryKey와 queryFn을 올바르게 설정하세요
 * - isLoading, isError, error, data 상태를 활용하세요
 */

const BasicQuery: React.FC = () => {
  // TODO: 여기에 useQuery를 사용하여 사용자 데이터를 가져오는 코드를 작성하세요
  const { data, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // TODO: 로딩 상태 처리
  if (isLoading) return <div>사용자 목록을 불러오는 중...</div>;
  // TODO: 에러 상태 처리
  if (isError)
    return (
      <div style={{ color: "red" }}>
        {error.message ?? "에러가 발생했습니다."}
      </div>
    );
  // TODO: 성공 시 데이터 표시
  else {
    return (
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>사용자 목록</h3>
        {/* 여기에 로딩/에러/성공 상태에 따른 UI를 구현하세요 */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #dee2e6",
              }}
            >
              <th>이름</th>
              <th>이메일</th>
              <th>거주지</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, index) => (
                <tr
                  key={item.id || index}
                  style={{
                    borderBottom: "1px solid #e9ecef",
                    textAlign: "center",
                  }}
                >
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.city}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default BasicQuery;
