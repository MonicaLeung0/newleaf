"use client";

import { useUserAuth } from "@/app/utils/auth-context";
import { useState } from "react";

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const { emailSignUp } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await emailSignUp(email, password);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-green-pale/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-pink-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border-2 border-pink-medium">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-pink-red hover:text-pink-medium transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-pink-red text-center mb-2">
          Sign up
        </h2>
        
        {/* Description */}
        <p className="text-pink-medium text-sm text-center mb-6">
          Welcome to the NewLeaf!
        </p>

        {error && (
          <p className="text-pink-red text-sm text-center mb-4 font-medium">{error}</p>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full bg-white border-2 border-pink-medium text-pink-red placeholder-pink-medium/60 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-medium focus:border-pink-red transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-white border-2 border-pink-medium text-pink-red placeholder-pink-medium/60 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-medium focus:border-pink-red transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-red text-white font-medium py-3 px-4 rounded-lg hover:bg-pink-dark transition-colors shadow-md"
          >
            Continue
          </button>
        </form>

        {/* Login Link */}
        <p className="text-pink-dark text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            onClick={() => {
              setError("");
              onSwitchToLogin();
            }}
            className="text-pink-red hover:text-pink-medium underline transition-colors font-medium"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

