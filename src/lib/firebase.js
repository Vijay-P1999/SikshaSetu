import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBiROxJkIRDk-8MbhAoPTHrJ4i_YL6_MM4",
    authDomain: "sikshasetu-74d83.firebaseapp.com",
    projectId: "sikshasetu-74d83",
    storageBucket: "sikshasetu-74d83.firebasestorage.app",
    messagingSenderId: "7307662262",
    appId: "1:7307662262:web:38ffd70f098ad627cf2717",
    measurementId: "G-LWHTXZQQZ3"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };



