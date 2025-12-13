"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth, db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase Auth user
  const [userProfile, setUserProfile] = useState(null); // Firestore user profile
  const [loading, setLoading] = useState(true); // Global loading state

  // Load Firestore profile
  const loadUserProfile = async (uid) => {
    if (!uid) {
      setUserProfile(null);
      return;
    }

    const authUser = auth.currentUser; // safer than using React state

    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      setUserProfile(snap.data());
    } else {
      // Auto-create profile if missing
      const newProfile = {
        displayName: authUser?.displayName || "",
        photoURL: authUser?.photoURL || "",
        coverPhotoURL: "",
        bio: "",
        city: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(userRef, newProfile);
      setUserProfile(newProfile);
    }
  };

  // Allow UI to refresh profile manually
  const refreshUserProfile = async () => {
    if (auth.currentUser?.uid) {
      await loadUserProfile(auth.currentUser.uid);
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.uid) {
        await loadUserProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update Firestore + Firebase Auth profile
  const updateUserProfile = async (uid, updates) => {
    if (!uid) return;

    // Update Firestore
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    // Sync Firebase Auth fields
    if (updates.displayName || updates.photoURL) {
      await updateProfile(auth.currentUser, {
        displayName: updates.displayName || auth.currentUser.displayName,
        photoURL: updates.photoURL || auth.currentUser.photoURL,
      });
    }

    // Reload into state
    await loadUserProfile(uid);
  };

  // Auth actions
  const gitHubSignIn = () => signInWithPopup(auth, new GithubAuthProvider());
  const googleSignIn = () => signInWithPopup(auth, new GoogleAuthProvider());
  const emailSignUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);
  const emailSignIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const firebaseSignOut = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        googleSignIn,
        gitHubSignIn,
        emailSignUp,
        emailSignIn,
        firebaseSignOut,
        updateUserProfile,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(AuthContext);
