// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}