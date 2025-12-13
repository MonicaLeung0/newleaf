"use client";

import Link from "next/link";
import { useUserAuth } from "@/app/utils/auth-context";
import { useState } from "react";
import LoginModal from "@/app/auth/components/LoginModal";
import SignupModal from "@/app/auth/components/SignupModal";

export default function Navbar() {
  const { user, firebaseSignOut } = useUserAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("login");
  const [menuOpen, setMenuOpen] = useState(false);

  const openLogin = () => {
    setModalMode("login");
    setIsModalOpen(true);
  };

  const openSignup = () => {
    setModalMode("signup");
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    await firebaseSignOut();
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full bg-pink-white border-b-2 border-green-lighter px-6 py-4 shadow-sm flex justify-between items-center">
        
        {/* LEFT — Logo */}
        <Link href="/" className="text-3xl font-bold text-green-dark">
          NewLeaf
        </Link>

        {/* CENTER (hidden on mobile) */}
        <div className="hidden md:flex gap-8 text-green-dark font-medium">
          <Link href="/community" className="hover:text-green-medium transition-colors">
            Community
          </Link>
          <Link href="/adoption" className="hover:text-green-medium transition-colors">
            Adoption
          </Link>
          <Link href="/profiles" className="hover:text-green-medium transition-colors">
            Profiles
          </Link>
        </div>

        {/* RIGHT — Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={openLogin}
                className="px-4 py-2 bg-green-dark text-white rounded-lg hover:bg-green-medium transition"
              >
                Log in
              </button>
              <button
                onClick={openSignup}
                className="px-4 py-2 bg-pink-medium text-white rounded-lg hover:bg-pink-dark transition"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              {/* Email */}
              <span className="text-green-dark font-medium truncate max-w-[150px]">
                {user.email || user.displayName}
              </span>

              {/* Profile Picture (fallback initial) */}
              <div className="w-10 h-10 rounded-full border-2 border-green-medium bg-pink-white flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-green-dark font-bold">
                    {user.email ? user.email[0].toUpperCase() : "?"}
                  </span>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-pink-dark text-white rounded-lg hover:bg-pink-medium transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-green-dark text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="md:hidden bg-pink-white border-b border-green-light px-6 py-4 space-y-4 shadow-sm">
          <Link href="/community" className="block text-lg" onClick={() => setMenuOpen(false)}>
            Community
          </Link>
          <Link href="/adoption" className="block text-lg" onClick={() => setMenuOpen(false)}>
            Adoption
          </Link>
          <Link href="/profiles" className="block text-lg" onClick={() => setMenuOpen(false)}>
            Profiles
          </Link>

          <hr className="border-green-light" />

          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-green-medium bg-white flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-green-dark font-bold">
                      {user.email[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-green-dark font-medium break-all">
                  {user.email}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-pink-dark text-white py-2 rounded-lg mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={openLogin} className="w-full bg-green-dark text-white py-2 rounded-lg">
                Log in
              </button>
              <button onClick={openSignup} className="w-full bg-pink-medium text-white py-2 rounded-lg">
                Sign up
              </button>
            </>
          )}
        </div>
      )}

      {/* AUTH MODALS */}
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
    </>
  );
}
