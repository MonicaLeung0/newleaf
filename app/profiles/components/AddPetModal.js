"use client";

import { useState, useEffect, useRef } from "react";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { addPet } from "../../_servies/petService";
import { useUserAuth } from "../../utils/auth-context";

export default function AddPetModal({ isOpen, onClose, onSubmit }) {
  const { user } = useUserAuth();
  const [name, setName] = useState("");
  const [type, setType] = useState("Dog");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Reset form each time modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setType("Dog");
      setAge("");
      setImage("");
      setPreview("");
      setUploadError("");
      setSaveError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Handle file selection and upload to Cloudinary
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);

    // Upload to Cloudinary
    setUploading(true);
    setUploadError("");

    try {
      const imageUrl = await uploadToCloudinary(selectedFile);
      setImage(imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
      setPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setSaveError("You must be logged in to add a pet");
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const petData = {
        name: name.trim(),
        type,
        age: age.trim(),
        image: image.trim() || "/pet-placeholder.png",
      };

      // Add pet to Firebase using petService
      const petId = await addPet(petData, user.uid);

      // Call the onSubmit callback with the pet data and ID
      onSubmit({
        id: petId,
        ...petData,
      });

      onClose();
    } catch (error) {
      console.error("Error adding pet:", error);
      setSaveError(error.message || "Failed to add pet");
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
        className="relative bg-pink-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl border-2 border-green-medium"
      >
        <h2 className="text-3xl font-bold text-green-dark mb-4 text-center">
          Add a New Pet
        </h2>

        {/* Preview */}
        {preview ? (
          <div className="w-full h-40 rounded-lg overflow-hidden mb-4 shadow-md border border-green-light">
            <img src={preview} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-40 rounded-lg bg-green-pale opacity-70 flex items-center justify-center text-green-medium mb-4 border border-green-light">
            No Image Preview
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Pet Name"
            className="w-full border-2 border-green-medium px-3 py-2 rounded-lg bg-white placeholder:text-green-light text-green-medium"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <select
            className="w-full border-2 border-green-medium px-3 py-2 rounded-lg bg-white placeholder:text-green-medium text-green-medium"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Dog</option>
            <option>Cat</option>
            <option>Rabbit</option>
            <option>Bird</option>
            <option>Other</option>
          </select>

          <input
            type="number"
            placeholder="Age (years)"
            className="w-full border-2 border-green-medium px-3 py-2 rounded-lg placeholder:text-green-light bg-white text-green-medium"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="0"
            max="50"
            required
          />

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-dark">
              Pet Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full text-sm text-pink-red file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-dark file:text-white hover:file:bg-green-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {uploading && (
              <p className="text-sm text-green-medium">Uploading image...</p>
            )}
            {uploadError && (
              <p className="text-sm text-pink-red">{uploadError}</p>
            )}
            {image && !uploading && (
              <p className="text-sm text-green-dark">✓ Image uploaded successfully</p>
            )}
          </div>

          {saveError && (
            <p className="text-sm text-pink-red text-center">{saveError}</p>
          )}

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full bg-green-dark text-white py-3 rounded-lg hover:bg-green-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Adding Pet..." : "Add Pet"}
          </button>
        </form>
      </div>
    </div>
  );
}
