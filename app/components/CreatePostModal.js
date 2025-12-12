"use client";
import { useState } from "react";

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState("");

  if (!isOpen) return null; // Don't render anything if modal is closed

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Create a Post</h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something with the community..."
          style={{
            width: "100%",
            height: "120px",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
            resize: "none",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#eee",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              background: "#4CAF50",
              color: "white",
              border: "none",
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
