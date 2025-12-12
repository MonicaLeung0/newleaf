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
} from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // GitHub Sign-in
  const gitHubSignIn = () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };


  // Google Sign-in
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  //  Email/Password Sign-up

  const emailSignUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };


  // Email/Password Sign-in
  const emailSignIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };


  // Logout
  const firebaseSignOut = () => {
    return signOut(auth);
  };

  
  // Auth Listener

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []); // IMPORTANT: no dependency on "user"

  return (
    <AuthContext.Provider
      value={{
        user,
        gitHubSignIn,
        googleSignIn,
        emailSignUp,
        emailSignIn,
        firebaseSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
