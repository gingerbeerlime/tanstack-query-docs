import React, { useState } from "react";
import ExerciseList from "./components/ExerciseList";
import Workspace from "./components/Workspace";

function App() {
  const [activeTab, setActiveTab] = useState<"exercises" | "workspace">(
    "exercises"
  );

  const tabStyle = (isActive: boolean) => ({
    padding: "12px 24px",
    border: "none",
    backgroundColor: isActive ? "#007acc" : "#f0f0f0",
    color: isActive ? "white" : "#333",
    cursor: "pointer",
    borderRadius: "8px 8px 0 0",
    fontSize: "16px",
    fontWeight: isActive ? "bold" : "normal",
  });

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

      <div style={{ marginBottom: "20px" }}>
        <button
          style={tabStyle(activeTab === "exercises")}
          onClick={() => setActiveTab("exercises")}
        >
          📚 예제 보기
        </button>
        <button
          style={tabStyle(activeTab === "workspace")}
          onClick={() => setActiveTab("workspace")}
        >
          💻 구현하기
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "0 8px 8px 8px",
          backgroundColor: "white",
          minHeight: "600px",
        }}
      >
        {activeTab === "exercises" ? <ExerciseList /> : <Workspace />}
      </div>
    </div>
  );
}

export default App;
