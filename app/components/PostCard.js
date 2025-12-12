export default function PostCard({ user, content, timestamp }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "1.25rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "1rem",
        border: "1px solid #eee",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
        {user || "Anonymous User"}
      </div>

      <div style={{ fontSize: "0.95rem", color: "#333", marginBottom: "0.5rem" }}>
        {content || "This is a placeholder post content."}
      </div>

      <div style={{ fontSize: "0.8rem", color: "#888" }}>
        {timestamp || "Just now"}
      </div>
    </div>
  );
}
