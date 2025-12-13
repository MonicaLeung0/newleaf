//protected (requires login)
"use client";

import ProtectedRoute from "../components/ProtectedRoute";

export default function ProfilesPage() {
  return (
    <ProtectedRoute>
      <div className="p-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-green-dark mb-4">
          Your Profile
        </h1>
        <p className="text-gray-700">
          Profile features coming soon...
        </p>
      </div>
    </ProtectedRoute>
  );
}