"use client";

import { useState, useEffect, useRef } from "react";
import { uploadToCloudinary } from "../utils/cloudinary";
import { addPost, updatePost } from "../_servies/postService";
import { getPetsByUserId } from "../_servies/petService";
import { useUserAuth } from "../utils/auth-context";

export default function CreatePostModal({ isOpen, onClose, onSubmit, editPost = null }) {
  const { user } = useUserAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [loadingPets, setLoadingPets] = useState(false);

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load user's pets when modal opens
  useEffect(() => {
    const loadPets = async () => {
      if (!isOpen || !user) {
        setPets([]);
        return;
      }

      try {
        setLoadingPets(true);
        const userPets = await getPetsByUserId(user.uid);
        setPets(userPets);
      } catch (error) {
        console.error("Error loading pets:", error);
      } finally {
        setLoadingPets(false);
      }
    };

    loadPets();
  }, [isOpen, user]);

  // Load post data when editing
  useEffect(() => {
    if (isOpen && editPost) {
      setTitle(editPost.title || "");
      setContent(editPost.content || "");
      setImages(editPost.imgarray || []);
      setPreviews(editPost.imgarray || []);
      setSelectedPetId(editPost.petId || "");
    } else if (!isOpen) {
      setTitle("");
      setContent("");
      setImages([]);
      setPreviews([]);
      setSelectedPetId("");
      setUploadError("");
      setSaveError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, editPost]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Handle file selection and upload to Cloudinary
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    // Validate file types
    const invalidFiles = selectedFiles.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      setUploadError("Please select only image files");
      return;
    }

    // Validate file sizes (max 10MB each)
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setUploadError("File size must be less than 10MB per image");
      return;
    }

    // Limit to 5 images
    if (images.length + selectedFiles.length > 5) {
      setUploadError("Maximum 5 images allowed");
      return;
    }

    // Create previews
    const newPreviews = [];
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === selectedFiles.length) {
          setPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Upload to Cloudinary
    setUploading(true);
    setUploadError("");

    try {
      const uploadPromises = selectedFiles.map((file) =>
        uploadToCloudinary(file)
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload images");
      // Remove previews if upload failed
      setPreviews((prev) => prev.slice(0, prev.length - selectedFiles.length));
    } finally {
      setUploading(false);
    }
  };

  // Remove an image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setSaveError("You must be logged in to create a post");
      return;
    }

    if (!title.trim() && !content.trim()) {
      setSaveError("Please provide a title or content");
      return;
    }

    // If editing, verify user owns the post
    if (editPost && editPost.publisherId !== user.uid) {
      setSaveError("You can only edit your own posts");
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        imgarray: images,
        publisher: user.displayName || user.email || "Anonymous",
        ...(selectedPetId && { petId: selectedPetId }),
      };

      if (editPost) {
        // Update existing post
        await updatePost(editPost.id, postData);
        
        // Call the onSubmit callback with updated post data
        onSubmit({
          id: editPost.id,
          ...postData,
          publisherId: user.uid,
          petId: selectedPetId || editPost.petId || null,
          likes: editPost.likes || [],
          likesCount: editPost.likesCount || 0,
        });
      } else {
        // Create new post
        // userId (user.uid) will be set as publisherId in the service
        // This ensures userId === publisherId
        const postId = await addPost(postData, user.uid);

        // Call the onSubmit callback with the post data and ID
        onSubmit({
          id: postId,
          ...postData,
          publisherId: user.uid, // Always matches the userId passed to addPost
          likes: [],
          likesCount: 0,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving post:", error);
      setSaveError(error.message || `Failed to ${editPost ? "update" : "create"} post`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div
        ref={modalRef}
        className="relative bg-pink-white rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-xl border-2 border-green-medium max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-green-dark mb-4 text-center">
          {editPost ? "Edit Post" : "Create a Post"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Post Title (optional)"
            className="w-full border-2 border-green-medium px-3 py-2 rounded-lg bg-white placeholder:text-green-light text-green-medium"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Content Textarea */}
          <textarea
            placeholder="What's on your mind?"
            className="w-full border-2 border-green-medium px-3 py-2 rounded-lg bg-white placeholder:text-green-light text-green-medium min-h-[120px] resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          {/* Pet Selection */}
          {pets.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-dark">
                Featured Animal (optional)
              </label>
              <select
                className="w-full border-2 border-green-medium px-3 py-2 rounded-lg bg-white text-green-medium"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
              >
                <option value="">None</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-dark">
              Images (up to 5)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading || images.length >= 5}
              className="w-full text-sm text-pink-red file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-dark file:text-white hover:file:bg-green-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {uploading && (
              <p className="text-sm text-green-medium">Uploading images...</p>
            )}
            {uploadError && (
              <p className="text-sm text-pink-red">{uploadError}</p>
            )}
            {images.length > 0 && !uploading && (
              <p className="text-sm text-green-dark">
                ✓ {images.length} image(s) uploaded successfully
              </p>
            )}
          </div>

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-green-light"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-pink-red text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-dark"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {saveError && (
            <p className="text-sm text-pink-red text-center">{saveError}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-green-dark text-white py-3 rounded-lg hover:bg-green-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (editPost ? "Updating Post..." : "Creating Post...") : (editPost ? "Update Post" : "Create Post")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
