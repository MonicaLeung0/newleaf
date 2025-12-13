"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import { getAllPosts, deletePost } from "../_servies/postService";

export default function CommunityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load posts from Firebase when component mounts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (err) {
        console.error("Error loading posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Refresh posts list
  const refreshPosts = async () => {
    try {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    } catch (err) {
      console.error("Error refreshing posts:", err);
    }
  };

  // Handle post creation/update
  const handlePostSubmit = async (postData) => {
    await refreshPosts();
  };

  // Handle edit
  const handleEdit = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      await refreshPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  return (
    <ProtectedRoute>
      <div className="p-10 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-dark">
            Community Feed
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-dark text-white rounded-lg hover:bg-green-medium transition shadow-md"
          >
            + Create Post
          </button>
        </div>

        <CreatePostModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handlePostSubmit}
          editPost={editingPost}
        />

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-green-medium">Loading posts...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-8">
            <p className="text-pink-red">{error}</p>
          </div>
        )}

        {/* Posts list */}
        {!loading && !error && (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-green-medium text-lg">
                  No posts yet. Be the first to share something!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
