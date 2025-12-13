"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../utils/firebase.js";

export function ImageUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setFile(selectedFile);
      setError("");
      setSuccess("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // Storage path
      const imageRef = ref(
        storage,
        `public/images/${Date.now()}-${file.name}`
      );

      // Upload to Firebase Storage
      await uploadBytes(imageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(imageRef);

      // Save URL to Firestore
      await addDoc(collection(db, "public/images"), {
        imageUrl: downloadURL,
        name: file.name,
        createdAt: new Date(),
      });

      setSuccess("Image uploaded and saved to DB!");
      setFile(null);
      setPreview(null);
      
      // Reset file input
      const fileInput = document.getElementById("imageInput");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border-2 border-pink-medium">
      <h3 className="text-xl font-semibold text-green-dark mb-4">Upload Image</h3>
      
      {/* File Input */}
      <div className="mb-4">
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-pink-red file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-dark file:text-white hover:file:bg-green-medium transition-colors"
          disabled={uploading}
        />
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-pink-medium"
          />
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-green-dark text-white font-medium py-3 px-4 rounded-lg hover:bg-green-medium transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {/* Error Message */}
      {error && (
        <p className="mt-4 text-pink-red text-sm text-center font-medium">{error}</p>
      )}

      {/* Success Message */}
      {success && (
        <p className="mt-4 text-green-dark text-sm text-center font-medium">{success}</p>
      )}
    </div>
  );
}

// Also export the function for backward compatibility
export async function uploadImage(file) {
  if (!file) {
    throw new Error("Please select an image");
  }

  // Storage path
  const imageRef = ref(
    storage,
    `public/images/${Date.now()}-${file.name}`
  );

  // Upload
  await uploadBytes(imageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(imageRef);

  // Save URL to Firestore
  await addDoc(collection(db, "public/images"), {
    imageUrl: downloadURL,
    name: file.name,
    createdAt: new Date()
  });

  return downloadURL;
}
