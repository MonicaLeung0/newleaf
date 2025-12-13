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
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "../utils/firebase";

/**
 * Add a new post to Firebase
 * @param {Object} postData - Post data object
 * @param {Array<string>} postData.imgarray - Array of image URLs
 * @param {string} postData.title - Post title
 * @param {string} postData.content - Post content
 * @param {string} postData.publisher - Publisher user ID or name
 * @param {string} userId - User ID who created the post
 * @returns {Promise<string>} - Document ID of the created post
 */
export async function addPost(postData, userId) {
  try {
    // Validate that userId is provided
    if (!userId) {
      throw new Error("User ID is required to create a post");
    }

    // Ensure publisherId always matches the userId parameter
    // This prevents any potential mismatch or override
    // publisherId is always set to the userId parameter, never from postData
    const docRef = await addDoc(collection(db, "posts"), {
      imgarray: postData.imgarray || [],
      title: postData.title || "",
      content: postData.content || "",
      publisher: postData.publisher || userId,
      publisherId: userId, // Always use the userId parameter - ensures userId === publisherId
      petId: postData.petId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: [],
      likesCount: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
}

/**
 * Get all posts
 * @returns {Promise<Array>} - Array of post objects with IDs
 */
export async function getAllPosts() {
  try {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
}

/**
 * Get posts by a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of post objects with IDs
 */
export async function getPostsByUserId(userId) {
  try {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      if (postData.publisherId === userId) {
        posts.push({
          id: doc.id,
          ...postData,
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
}

/**
 * Get a single post by ID
 * @param {string} postId - Post document ID
 * @returns {Promise<Object>} - Post object with ID
 */
export async function getPostById(postId) {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      return {
        id: postDoc.id,
        ...postDoc.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting post:", error);
    throw error;
  }
}

/**
 * Update a post
 * @param {string} postId - Post document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export async function updatePost(postId, updates) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

/**
 * Delete a post
 * @param {string} postId - Post document ID
 * @returns {Promise<void>}
 */
export async function deletePost(postId) {
  try {
    await deleteDoc(doc(db, "posts", postId));
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

/**
 * Check if a post is liked by a user
 * @param {string} postId - Post document ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export async function isPostLiked(postId, userId) {
  try {
    if (!userId) return false;
    
    const likedRef = collection(db, "users", userId, "liked");
    const q = query(likedRef, where("postId", "==", postId));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if post is liked:", error);
    return false;
  }
}

/**
 * Like a post
 * @param {string} postId - Post document ID
 * @param {string} userId - User ID who is liking the post
 * @returns {Promise<void>}
 */
export async function likePost(postId, userId) {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }

    const postData = postDoc.data();
    
    // Check if already liked by checking user's liked collection
    const isLiked = await isPostLiked(postId, userId);
    
    if (isLiked) {
      // Unlike: remove from user's liked collection and post's likes array
      const likedRef = collection(db, "users", userId, "liked");
      const q = query(likedRef, where("postId", "==", postId));
      const querySnapshot = await getDocs(q);
      
      // Delete all liked documents for this post
      const deletePromises = querySnapshot.docs.map((likedDoc) =>
        deleteDoc(doc(db, "users", userId, "liked", likedDoc.id))
      );
      await Promise.all(deletePromises);

      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        likesCount: Math.max(0, (postData.likesCount || 0) - 1),
      });
    } else {
      // Like: add to user's liked collection and post's likes array
      await addDoc(collection(db, "users", userId, "liked"), {
        postId: postId,
        createdAt: serverTimestamp(),
      });

      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        likesCount: (postData.likesCount || 0) + 1,
      });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}

