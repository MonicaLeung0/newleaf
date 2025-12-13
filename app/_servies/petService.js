"use client";

import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../utils/firebase";

/**
 * Save image URL to Firebase
 * @param {string} imageUrl - Image URL to save
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
async function saveImageToFirebase(imageUrl, userId) {
  try {
    await addDoc(collection(db, "users", userId, "images"), {
      imageUrl: imageUrl,
      createdAt: serverTimestamp()
    });
    console.log("Image saved to Firebase DB!");
  } catch (error) {
    console.error("Error saving image to Firebase:", error);
    throw error;
  }
}

/**
 * Add a new pet to Firebase
 * @param {Object} petData - Pet data object
 * @param {string} petData.name - Pet name
 * @param {string} petData.type - Pet type (Dog, Cat, etc.)
 * @param {string} petData.age - Pet age
 * @param {string} petData.image - Pet image URL
 * @param {string} userId - User ID who owns the pet
 * @returns {Promise<string>} - Document ID of the created pet
 */
export async function addPet(petData, userId) {
  try {
    // Save image to Firebase if provided
    if (petData.image && petData.image !== "/pet-placeholder.png") {
      await saveImageToFirebase(petData.image, userId);
    }

    const docRef = await addDoc(collection(db, "users", userId, "pets"), {
      name: petData.name,
      type: petData.type,
      age: petData.age,
      image: petData.image || "/pet-placeholder.png",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding pet:", error);
    throw error;
  }
}

/**
 * Get all pets for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of pet objects with IDs
 */
export async function getPetsByUserId(userId) {
  try {
    const q = query(
      collection(db, "users", userId, "pets"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const pets = [];
    
    querySnapshot.forEach((doc) => {
      pets.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return pets;
  } catch (error) {
    console.error("Error getting pets:", error);
    throw error;
  }
}


/**
 * Update a pet
 * @param {string} petId - Pet document ID
 * @param {string} userId - User ID who owns the pet
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export async function updatePet(petId, userId, updates) {
  try {
    if (updates.image && updates.image !== "/pet-placeholder.jpg") {
      await saveImageToFirebase(updates.image, userId);
    }

    const petRef = doc(db, "users", userId, "pets", petId);
    await updateDoc(petRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating pet:", error);
    throw error;
  }
}

/**
 * Delete a pet
 * @param {string} petId - Pet document ID
 * @param {string} userId - User ID who owns the pet
 * @returns {Promise<void>}
 */
export async function deletePet(petId, userId) {
  try {
    await deleteDoc(doc(db, "users", userId, "pets", petId));
  } catch (error) {
    console.error("Error deleting pet:", error);
    throw error;
  }
}

/**
 * Get a single pet by ID
 * @param {string} petId - Pet document ID
 * @param {string} userId - User ID who owns the pet
 * @returns {Promise<Object>} - Pet object with ID
 */
export async function getPetById(petId, userId) {
  try {
    const petRef = doc(db, "users", userId, "pets", petId);
    const petDoc = await getDoc(petRef);
    
    if (petDoc.exists()) {
      return {
        id: petDoc.id,
        ...petDoc.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting pet:", error);
    throw error;
  }
}


