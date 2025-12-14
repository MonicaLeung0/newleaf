// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:"AIzaSyBRm0wMPenemuySTLWJm0FHQH4JaejQn8s",
  authDomain: "newleaf-ca19f.firebaseapp.com",
  projectId: "newleaf-ca19f",
  storageBucket: "newleaf-ca19f.firebasestorage.app",
  messagingSenderId: "81640098190",
  appId: "1:81640098190:web:062723de757e2eea62fcdf",
};
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// can use this for the firebase config if you need to 
// NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBRm0wMPenemuySTLWJm0FHQH4JaejQn8s"
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="newleaf-ca19f.firebaseapp.com"
// NEXT_PUBLIC_FIREBASE_PROJECT_ID="newleaf-ca19f"
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="newleaf-ca19f.firebasestorage.app"
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="81640098190"
// NEXT_PUBLIC_FIREBASE_APP_ID="1:81640098190:web:062723de757e2eea62fcdf"