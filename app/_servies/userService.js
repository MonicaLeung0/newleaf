"use client";

import { db } from "../utils/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

/**
 * Update the user's profile in Firebase Auth + Firestore
 */
export async function updateUserProfile(user, data) {
  if (!user) throw new Error("User not logged in");

  const { displayName, bio, city, photoURL } = data;

  // 1) Update Firebase Auth
  await updateProfile(user, {
    displayName: displayName || user.displayName,
    photoURL: photoURL || user.photoURL,
  });

  // 2) Update Firestore
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    await updateDoc(userRef, {
      displayName,
      bio,
      city,
      photoURL,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(userRef, {
      displayName,
      bio,
      city,
      photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
