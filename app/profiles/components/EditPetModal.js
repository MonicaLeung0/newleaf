"use client";

import { useState, useEffect, useRef } from "react";
import { uploadToCloudinary } from "@/app/utils/cloudinary";
import { updatePet } from "@/app/_servies/petService";
import { useUserAuth } from "@/app/utils/auth-context";

export default function EditPetModal({ isOpen, onClose, pet, onSave }) {
  const { user } = useUserAuth();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // Load existing pet values
  useEffect(() => {
    if (isOpen && pet) {
      const safeImage =
        pet.image && pet.image.trim() !== ""
          ? pet.image
          : "/pet-placeholder.png";

      setName(pet.name || "");
      setType(pet.type || "");
      setAge(pet.age || "");
      setImage(safeImage);
      setPreview(safeImage);
      setError("");
    }
  }, [isOpen, pet]);

  // Upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setImage(uploadedUrl);
      setPreview(uploadedUrl);
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || !pet) return;

    setSaving(true);
    setError("");

    try {
      await updatePet(pet.id, user.uid, {
        name: name.trim(),
        type: type.trim(),
        age: age.trim(),
        image,
      });

      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update pet.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/20 backdrop-blur-sm overflow-y-auto py-10">
      {/* Background overlay */}
      <div
        className="absolute inset-0 pointer-events-auto"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-pink-white p-8 rounded-2xl w-full max-w-lg shadow-xl border-2 border-green-medium max-h-[90vh] overflow-y-auto pointer-events-auto">
        <h2 className="text-3xl font-bold text-green-dark text-center mb-4">
          Edit {pet.name}
        </h2>

        {/* Image Preview */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-40 h-40 rounded-xl overflow-hidden border-4 border-green-light shadow-md">
            <img src={preview || "pet-placeholder.png"} alt="Pet Preview" className="w-full h-full object-cover" />
          </div>

          <button
            type="button"
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

          {uploading && (
            <p className="text-green-medium text-sm mt-1">Uploading...</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            placeholder="Pet Name"
            className="w-full border-2 border-green-medium px-4 py-2 rounded-lg bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Type (Dog, Cat, Horse...)"
            className="w-full border-2 border-green-medium px-4 py-2 rounded-lg bg-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />

          <input
            type="number"
            min="0"
            placeholder="Age"
            className="w-full border-2 border-green-medium px-4 py-2 rounded-lg bg-white"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
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
