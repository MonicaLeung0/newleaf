"use client";

import { useUserAuth } from "../utils/auth-context";

export default function PostCard({ post, onEdit, onDelete }) {
  const { user } = useUserAuth();
  
  if (!post) return null;

  // Check if current user is the post owner
  const isOwner = user && post.publisherId === user.uid;

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
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="text-green-dark font-medium">
          {post.likesCount || 0} {post.likesCount === 1 ? "like" : "likes"}
        </span>
      </div>
    </div>
  );
}
