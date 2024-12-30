// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4Wo9XC4C1brDjNIDq6a7t3C_zlgG55-k",
  authDomain: "ham-staking-dapp.firebaseapp.com",
  projectId: "ham-staking-dapp",
  storageBucket: "ham-staking-dapp.firebasestorage.app",
  messagingSenderId: "568157796242",
  appId: "1:568157796242:web:3b036a02007f7f86e2b34b",
  measurementId: "G-SNKJ8QN3WE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
