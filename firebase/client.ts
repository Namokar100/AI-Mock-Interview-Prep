import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJLvCJFUcJpH2XpBpgKd1MXT3jpLN_cUk",
  authDomain: "ai-interview-prep-34b8a.firebaseapp.com",
  projectId: "ai-interview-prep-34b8a",
  storageBucket: "ai-interview-prep-34b8a.firebasestorage.app",
  messagingSenderId: "882466045539",
  appId: "1:882466045539:web:d5814090841f8705f18256",
  measurementId: "G-1P2KZJEB0J"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});


