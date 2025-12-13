"use client";

import { useState } from "react";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import ProtectedRoute from "../components/ProtectedRoute";

export default function CommunityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Alice (Pet Owner)",
      content: "My rescue dog finally learned a new trick today!",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      user: "Brandon (Shelter Volunteer)",
      content: "New kittens available at the shelter ❤️🐾",
      timestamp: "4 hours ago",
    },
  ]);

  const addPost = (content) => {
    const newPost = {
      id: posts.length + 1,
      user: "You",
      content,
      timestamp: "Just now",
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
  };

  return (
    <ProtectedRoute>
      <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "1rem" }}>Community Feed</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "0.75rem 1rem",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "1.5rem",
          }}
        >
          Create Post
        </button>

        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={addPost}
        />

        {posts.map((post) => (
          <PostCard
            key={post.id}
            user={post.user}
            content={post.content}
            timestamp={post.timestamp}
          />
        ))}
      </div>
    </ProtectedRoute>
  );
}
