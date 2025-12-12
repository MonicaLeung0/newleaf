
"use client";

import { useUserAuth } from "./utils/auth-context";
import { useState } from "react";
import LoginModal from "./auth/components/LoginModal";
import SignupModal from "./auth/components/SignupModal";

export default function Home() {
  const { user, firebaseSignOut } = useUserAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("login"); // "login" or "signup"

  const handleLogout = async () => {
    try {
      await firebaseSignOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="p-10">
      {user ? (
        <div>
          <h1 className="text-3xl font-bold mb-6">Welcome to the App</h1>
          <p className="mb-3">Logged in as: {user.email || user.displayName}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-4xl font-bold mb-4 text-center">Welcome to NewLeaf</h1>
          <p className="text-xl mb-8 text-center text-gray-600">Come and join us</p>
          <button
            onClick={() => {
              setModalMode("login");
              setIsModalOpen(true);
            }}
            className="bg-white text-[#1a1a1a] font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Log in
          </button>
        </div>
      )}

      {/* Auth Modals */}
      {isModalOpen && (
        <>
          <LoginModal
            isOpen={modalMode === "login"}
            onClose={() => setIsModalOpen(false)}
            onSwitchToSignup={() => setModalMode("signup")}
          />
          <SignupModal
            isOpen={modalMode === "signup"}
            onClose={() => setIsModalOpen(false)}
            onSwitchToLogin={() => setModalMode("login")}
          />
        </>
      )}
    </div>
  );
}