import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuA50IAOHumiKwBMzZ0VF6kxBAULOHr_s",
  authDomain: "inventory-management-8e2f8.firebaseapp.com",
  projectId: "inventory-management-8e2f8",
  storageBucket: "inventory-management-8e2f8.appspot.com",
  messagingSenderId: "1017130168573",
  appId: "1:1017130168573:web:bbf3f5bcfc721a4bf10e94",
  measurementId: "G-YQ80M1TWLB",
};

// Initialize Firebase
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const firestore = getFirestore(firebase_app);

// Initialize Analytics (only on client-side)
export const initializeAnalytics = () => {
  if (typeof window !== "undefined") {
    const { getAnalytics } = require("firebase/analytics");
    return getAnalytics(firebase_app);
  }
  return null;
};

// Export Firestore functions
export {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
