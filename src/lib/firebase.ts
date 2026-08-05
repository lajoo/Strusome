import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase configuration initialized with project defaults
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForStorageLookup",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "app-storage.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "app-storage-project",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "app-storage-project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:1234567890"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const storage = getStorage(app);
