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
  where,
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

    const docRef = await addDoc(collection(db, "pets"), {
      name: petData.name,
      type: petData.type,
      age: petData.age,
      image: petData.image || "/pet-placeholder.png",
      ownerId: userId,
      waitingForAdoption: false,
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
      collection(db, "pets"),
      where("ownerId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const pets = [];
    
    querySnapshot.forEach((doc) => {
      pets.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    // Sort by createdAt in descending order (newest first)
    pets.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return bTime - aTime;
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

    const petRef = doc(db, "pets", petId);
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
    await deleteDoc(doc(db, "pets", petId));
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
    const petRef = doc(db, "pets", petId);
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

/**
 * Get all pets waiting for adoption
 * @returns {Promise<Array>} - Array of pet objects with IDs
 */
export async function getPetsWaitingForAdoption() {
  try {
    const q = query(
      collection(db, "pets"),
      where("waitingForAdoption", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    const pets = [];
    
    querySnapshot.forEach((doc) => {
      pets.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    // Sort by createdAt in descending order (newest first)
    pets.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return bTime - aTime;
    });
    
    return pets;
  } catch (error) {
    console.error("Error getting pets waiting for adoption:", error);
    throw error;
  }
}

/**
 * Transfer pet ownership (accept adoption)
 * Creates a copy of the pet with the new owner and deletes the original
 * @param {string} petId - Pet document ID
 * @param {string} newOwnerId - New owner user ID
 * @returns {Promise<void>}
 */
export async function transferPetOwnership(petId, newOwnerId) {
  try {
    const petRef = doc(db, "pets", petId);

    await updateDoc(petRef, {
      ownerId: newOwnerId,
      waitingForAdoption: false,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error transferring pet ownership:", error);
    throw error;
  }
}
/**
 * Create an adoption request
 * @param {string} petId - Pet document ID
 * @param {string} requesterId - User ID requesting adoption
 * @returns {Promise<string>} - Request document ID
 */
export async function createAdoptionRequest(petId, requesterId) {
  try {
    // Get pet to get ownerId
    const petRef = doc(db, "pets", petId);
    const petDoc = await getDoc(petRef);
    
    if (!petDoc.exists()) {
      throw new Error("Pet not found");
    }
    
    const petData = petDoc.data();
    
    const docRef = await addDoc(collection(db, "adoptionRequests"), {
      petId: petId,
      requesterId: requesterId,
      ownerId: petData.ownerId, // Store owner ID for easier security rule checking
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating adoption request:", error);
    throw error;
  }
}

/**
 * Get adoption requests for a pet
 * @param {string} petId - Pet document ID
 * @param {string} ownerId - Optional owner ID to improve query security
 * @returns {Promise<Array>} - Array of adoption request objects
 */
export async function getAdoptionRequestsByPetId(petId, ownerId = null) {
  try {
    let q;
    
    // If ownerId is provided, query by both petId and ownerId for better security rule matching
    if (ownerId) {
      q = query(
        collection(db, "adoptionRequests"),
        where("petId", "==", petId),
        where("ownerId", "==", ownerId),
        where("status", "==", "pending")
      );
    } else {
      q = query(
        collection(db, "adoptionRequests"),
        where("petId", "==", petId),
        where("status", "==", "pending")
      );
    }
    
    const querySnapshot = await getDocs(q);
    const requests = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return requests;
  } catch (error) {
    console.error("Error getting adoption requests:", error);
    throw error;
  }
}

/**
 * Get adoption requests by requester
 * @param {string} requesterId - User ID who made the request
 * @returns {Promise<Array>} - Array of adoption request objects
 */
export async function getAdoptionRequestsByRequesterId(requesterId) {
  try {
    const q = query(
      collection(db, "adoptionRequests"),
      where("requesterId", "==", requesterId)
    );
    
    const querySnapshot = await getDocs(q);
    const requests = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return requests;
  } catch (error) {
    console.error("Error getting adoption requests:", error);
    throw error;
  }
}

/**
 * Check if a user has requested adoption for a specific pet
 * @param {string} petId - Pet document ID
 * @param {string} requesterId - User ID who made the request
 * @returns {Promise<boolean>} - True if user has a pending request
 */
export async function hasAdoptionRequest(petId, requesterId) {
  try {
    const q = query(
      collection(db, "adoptionRequests"),
      where("petId", "==", petId),
      where("requesterId", "==", requesterId),
      where("status", "==", "pending")
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking adoption request:", error);
    return false;
  }
}

/**
 * Accept an adoption request and transfer ownership
 * Creates a copy of the pet with the new owner and deletes the original
 * @param {string} requestId - Adoption request document ID
 * @param {string} petId - Pet document ID
 * @param {string} newOwnerId - New owner user ID
 * @param {string} currentUserId - Current owner user ID (for verification)
 * @returns {Promise<void>}
 */
export async function acceptAdoptionRequest(requestId, petId, newOwnerId, currentUserId) {
  try {
    // 1️⃣ Verify the adoption request exists and matches
    const requestRef = doc(db, "adoptionRequests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      throw new Error("Adoption request not found");
    }

    const requestData = requestSnap.data();

    // Verify request matches the pet and requester
    if (requestData.petId !== petId) {
      throw new Error("Adoption request does not match the pet");
    }

    if (requestData.requesterId !== newOwnerId) {
      throw new Error("Adoption request does not match the requester");
    }

    if (requestData.status !== "pending") {
      throw new Error("Adoption request is not pending");
    }

    // 2️⃣ Verify pet ownership
    const petRef = doc(db, "pets", petId);
    const petSnap = await getDoc(petRef);

    if (!petSnap.exists()) {
      throw new Error("Pet not found");
    }

    const petData = petSnap.data();

    if (petData.ownerId !== currentUserId) {
      throw new Error("You are not the owner of this pet");
    }

    // Verify the request's ownerId matches the pet's ownerId
    if (requestData.ownerId !== currentUserId) {
      throw new Error("Adoption request owner does not match pet owner");
    }

    // 3️⃣ Reject all other pending requests for this pet
    const q = query(
      collection(db, "adoptionRequests"),
      where("petId", "==", petId),
      where("status", "==", "pending")
    );

    const snapshot = await getDocs(q);

    const rejectPromises = snapshot.docs
      .filter((doc) => doc.id !== requestId)
      .map((doc) =>
        updateDoc(doc.ref, {
          status: "rejected",
          updatedAt: serverTimestamp(),
        })
      );

    if (rejectPromises.length > 0) {
      await Promise.all(rejectPromises);
    }

    // 4️⃣ Accept the selected request
    await updateDoc(requestRef, {
      status: "accepted",
      updatedAt: serverTimestamp(),
    });

    // 5️⃣ Transfer ownership by creating a copy and deleting the original
    await transferPetOwnership(petId, newOwnerId);

  } catch (error) {
    console.error("Error accepting adoption request:", error.message);
    throw error;
  }
}



/**
 * Reject an adoption request
 * @param {string} requestId - Adoption request document ID
 * @returns {Promise<void>}
 */
export async function rejectAdoptionRequest(requestId) {
  try {
    const requestRef = doc(db, "adoptionRequests", requestId);
    await updateDoc(requestRef, {
      status: "rejected",
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error rejecting adoption request:", error);
    throw error;
  }
}


