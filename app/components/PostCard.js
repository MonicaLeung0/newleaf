"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../utils/auth-context";
import { likePost, isPostLiked } from "../_servies/postService";

export default function PostCard({ post, onEdit, onDelete, onLike }) {
  const { user } = useUserAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  
  if (!post) return null;

  // Check if current user is the post owner
  const isOwner = user && post.publisherId === user.uid;
  // Only non-owners can like
  const canLike = user && !isOwner;

  // Check if post is liked when component mounts or user changes
  useEffect(() => {
    const checkLiked = async () => {
      if (user && post.id) {
        const liked = await isPostLiked(post.id, user.uid);
        setIsLiked(liked);
      }
    };
    checkLiked();
  }, [user, post.id]);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    
    // If timestamp is a Firestore Timestamp
    if (timestamp.toDate) {
      const date = timestamp.toDate();
      const now = new Date();
      const diff = now - date;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      
      return date.toLocaleDateString();
    }
    
    return "Just now";
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(post.id);
    }
  };

  return (
    <div className="bg-pink-white rounded-2xl p-6 mb-4 shadow-md border-2 border-green-light">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-semibold text-green-dark text-lg">
            {post.publisher || "Anonymous User"}
          </div>
          <div className="text-sm text-gray-500">
            {formatTimestamp(post.createdAt)}
          </div>
        </div>
        
        {/* Edit/Delete buttons - only show if user is owner */}
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(post)}
              className="px-3 py-1 text-sm bg-green-medium text-white rounded-lg hover:bg-green-dark transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm bg-pink-red text-white rounded-lg hover:bg-pink-dark transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="text-xl font-bold text-green-dark mb-2">
          {post.title}
        </h3>
      )}

      {/* Content */}
      {post.content && (
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Images */}
      {post.imgarray && post.imgarray.length > 0 && (
        <div className={`grid gap-2 mb-4 ${
          post.imgarray.length === 1 
            ? "grid-cols-1" 
            : post.imgarray.length === 2 
            ? "grid-cols-2" 
            : "grid-cols-2 sm:grid-cols-3"
        }`}>
          {post.imgarray.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`Post image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg border-2 border-green-light"
            />
          ))}
        </div>
      )}

      {/* Footer - Likes */}
      <div className="flex items-center gap-3 text-sm">
        {canLike && (
          <button
            onClick={async () => {
              if (liking) return;
              setLiking(true);
              try {
                await likePost(post.id, user.uid);
                setIsLiked(!isLiked);
                // Refresh posts to update like count
                if (onLike) {
                  await onLike();
                }
              } catch (error) {
                console.error("Error toggling like:", error);
              } finally {
                setLiking(false);
              }
            }}
            disabled={liking}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
              isLiked
                ? "bg-pink-red text-white hover:bg-pink-dark"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{isLiked ? "Liked" : "Like"}</span>
          </button>
        )}
        <span className="text-green-dark font-medium">
          {post.likesCount || 0} {post.likesCount === 1 ? "like" : "likes"}
        </span>
      </div>
    </div>
  );
}
