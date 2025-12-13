
"use client";

import { useUserAuth } from "./utils/auth-context";
import { useState } from "react";
import LoginModal from "./auth/components/LoginModal";
import SignupModal from "./auth/components/SignupModal";
import { ImageUpload } from "./components/imgUpload";

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
      <div className="min-h-screen flex items-center justify-center bg-landing">

      {user ? (
        <div className="p-10 w-full max-w-4xl bg-pink-white">
          <h1 className="text-3xl font-bold mb-6 text-green-dark">Welcome to the App</h1>
          <p className="mb-6 text-gray-700">Logged in as: {user.email || user.displayName}</p>
          
          {/* Image Upload Component */}
          {/* <div className="mb-6">
            <ImageUpload />
          </div> */}
          
          <button
            onClick={handleLogout}
            className="bg-pink-medium text-white px-4 py-2 rounded-lg hover:bg-pink-dark transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-pink-white/80 backdrop-blur-sm rounded-2xl py-20 w-full max-w-2xl mx-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] border-2 border-green-medium">


          <h1 className="text-4xl font-bold mb-4 text-center text-green-dark">Welcome to NewLeaf!</h1>
          <p className="text-xl mb-8 text-center text-pink-red">Come and join us</p>
          <button
            onClick={() => {
              setModalMode("login");
              setIsModalOpen(true);
            }}
            className="bg-green-dark text-white font-medium py-3 px-8 rounded-lg hover:bg-green-medium transition-colors shadow-md"
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