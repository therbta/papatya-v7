// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDEUlEbRH7aBLE1zYe3v5LX2Hl8dzrvKYU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "software-802.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "software-802",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "software-802.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "319606435977",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:319606435977:web:51d0019b6974cc514ad658",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-D5MV71ZT97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics (only in production)
let analytics;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}
export { analytics };

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Only connect to emulators if not already connected
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    // Emulators already connected or not available
    console.log('Firebase emulators not available or already connected');
  }
}

export default app;
