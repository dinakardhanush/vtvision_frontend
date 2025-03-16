// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6Gv9a-8uBrq3PtLDKKst-ELXwjEEHGy0",
  authDomain: "vtvision-ea388.firebaseapp.com",
  databaseURL: "https://vtvision-ea388-default-rtdb.firebaseio.com",
  projectId: "vtvision-ea388",
  storageBucket: "vtvision-ea388.firebasestorage.app",
  messagingSenderId: "285668670092",
  appId: "1:285668670092:web:678cdf29db43daee3e19a9",
  measurementId: "G-EN9B3G3W1Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
