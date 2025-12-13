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

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex gap-6 text-green-dark font-medium">
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

        {/* DESKTOP AUTH / USER AREA */}
        {!user ? (
          <div className="hidden md:flex gap-3">
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
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <span className="font-medium text-green-dark">{user.email}</span>

            {/* Avatar */}
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-green-medium"
            />

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-pink-dark text-white rounded-lg hover:bg-pink-medium transition"
            >
              Logout
            </button>
          </div>
        )}

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          className="md:hidden text-green-dark text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU — SLIDE DOWN */}
      <div
        className={`md:hidden bg-pink-white border-b-2 border-green-lighter shadow-sm overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[400px] py-4" : "max-h-0 py-0"
        }`}
      >
        <div className="flex flex-col text-green-dark gap-4 px-6">

          {/* LINKS */}
          <Link href="/community" onClick={() => setMenuOpen(false)}>
            Community
          </Link>
          <Link href="/adoption" onClick={() => setMenuOpen(false)}>
            Adoption
          </Link>
          <Link href="/profiles" onClick={() => setMenuOpen(false)}>
            Profiles
          </Link>

          <hr className="border-green-lighter my-2" />

          {/* AUTH SECTION */}
          {!user ? (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openLogin();
                }}
                className="w-full bg-green-dark text-white py-2 rounded-lg"
              >
                Log in
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  openSignup();
                }}
                className="w-full bg-pink-medium text-white py-2 rounded-lg"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              {/* USER DETAILS */}
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border border-green-medium"
                />
                <span>{user.email}</span>
              </div>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full bg-pink-dark text-white py-2 rounded-lg mt-3"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* MODALS */}
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
