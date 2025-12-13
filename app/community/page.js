"use client";

import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";

export default function CommunityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  return (
    <ProtectedRoute>
      <div className="p-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-green-dark">
          Community Feed
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-dark text-white rounded-lg hover:bg-green-medium"
        >
          Create Post
        </button>

        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => {}}
        />

        <p className="text-gray-600 mt-6">Posts coming soon...</p>
      </div>
    </ProtectedRoute>
  );
}
