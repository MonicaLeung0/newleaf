"use client";

import { useState, useEffect, useRef } from "react";

export default function AddPetModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Dog");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const modalRef = useRef(null);

  // Reset form each time modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setType("Dog");
      setAge("");
      setImage("");
      setPreview("");
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Live preview
  const handleImageChange = (value) => {
    setImage(value);
    setPreview(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      name: name.trim(),
      type,
      age: age.trim(),
      image: image.trim() || "/pet-placeholder.png",
    });

    onClose();
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
            className="w-full border-2 border-green-medium px-3 py-2 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <select
            className="w-full border-2 border-green-medium px-3 py-2 rounded-lg bg-white"
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
            className="w-full border-2 border-green-medium px-3 py-2 rounded-lg"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="0"
            max="50"
            required
          />

          <input
            type="text"
            placeholder="Image URL (optional)"
            className="w-full border-2 border-green-medium px-3 py-2 rounded-lg"
            value={image}
            onChange={(e) => handleImageChange(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-dark text-white py-3 rounded-lg hover:bg-green-medium transition"
          >
            Add Pet
          </button>
        </form>
      </div>
    </div>
  );
}
