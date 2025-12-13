"use client";

/**
 * Upload image to Cloudinary
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function uploadToCloudinary(file) {
  if (!file) throw new Error("No file provided");

  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File size must be less than 10MB");
  }

  const formData = new FormData();
  formData.append("file", file);

  // ✅ THIS must be your UPLOAD PRESET
  formData.append("upload_preset", "web_unsigned");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dwe48umwd/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Cloudinary error:", data);
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url;
}
