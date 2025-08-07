import React from "react";
import { type Post } from "../api/users";

const PostCard = ({ post }: { post: Post }) => {
  return (
    <div style={{ marginBottom: "30px" }}>
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "15px",
          backgroundColor: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h3 style={{ margin: 0, color: "#333", fontSize: "18px" }}>
            {post.title}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            <span>❤️ {post.likes}</span>
            <span>{post.createdAt?.slice(0, 10)}</span>
          </div>
        </div>
        <p style={{ margin: 0, lineHeight: "1.6", color: "#555" }}>
          {post.body}
        </p>
      </div>
    </div>
  );
};

export default React.memo(PostCard);
