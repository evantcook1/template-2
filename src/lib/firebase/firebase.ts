import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtxamzNf8jFBQURTZiVAo0CORlJLO2Nkc",
  authDomain: "meal-mentor-a72c8.firebaseapp.com",
  projectId: "meal-mentor-a72c8",
  storageBucket: "meal-mentor-a72c8.firebasestorage.app",
  messagingSenderId: "72941029647",
  appId: "1:72941029647:web:38c6d09cc1256c648a567a"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
