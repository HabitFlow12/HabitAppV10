// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrvPwcVb8mOE_L8Gg6BACrFICC3lEOjNA",
  authDomain: "habitflow-8bfa6.firebaseapp.com",
  projectId: "habitflow-8bfa6",
  storageBucket: "habitflow-8bfa6.firebasestorage.app",
  messagingSenderId: "995458956103",
  appId: "1:995458956103:web:ac711a30f4782c56b6ea62",
  measurementId: "G-M28R3JN5XB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;