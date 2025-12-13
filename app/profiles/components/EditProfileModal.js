"use client";

import { useState, useEffect, useRef } from "react";
import { uploadToCloudinary } from "@/app/utils/cloudinary";
import { updateUserProfile } from "@/app/_servies/userService";
import { useUserAuth } from "@/app/utils/auth-context";

export default function EditProfileModal({ isOpen, onClose }) {
  const { user } = useUserAuth();
  
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // Load existing profile when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
      setBio("");
      setCity("");
      setPreview(user.photoURL || "");
      setError("");
    }
  }, [isOpen, user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setPhotoURL(uploadedUrl);
      setPreview(uploadedUrl);
    } catch (err) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");

    try {
      await updateUserProfile(user, {
        displayName,
        bio,
        city,
        photoURL,
      });

      onClose();
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-pink-white p-8 rounded-2xl w-full max-w-lg shadow-2xl border-2 border-green-medium">
        <h2 className="text-3xl font-bold text-green-dark text-center mb-4">
          Edit Profile
        </h2>

        {/* Profile Image Preview */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-light shadow-md">
            <img
              src={preview || "/avatar-placeholder.png"}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <button
            onClick={() => fileInputRef.current.click()}
            className="mt-3 bg-green-dark text-white px-4 py-2 text-sm rounded-lg hover:bg-green-medium transition"
          >
            Change Image
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {uploading && <p className="text-green-medium mt-2 text-sm">Uploading...</p>}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border-2 border-green-medium px-4 py-2 rounded-lg bg-white"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          {/* Bio */}
          <textarea
            placeholder="Bio (optional)"
            className="w-full border-2 border-green-medium px-4 py-2 rounded-lg bg-white h-24"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>

          {/* City */}
          <input
            type="text"
            placeholder="City (optional)"
            className="w-full border-2 border-green-medium px-4 py-2 rounded-lg bg-white"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          {error && <p className="text-pink-red text-center">{error}</p>}

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full bg-green-dark text-white py-3 rounded-lg hover:bg-green-medium transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
