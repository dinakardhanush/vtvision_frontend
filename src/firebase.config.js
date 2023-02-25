// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAG9si0wUT-E6SR38hIrAzAH9yEPL7lohI",
  authDomain: "hackmoldemo4.firebaseapp.com",
  databaseURL:
    "https://hackmoldemo4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hackmoldemo4",
  storageBucket: "hackmoldemo4.appspot.com",
  messagingSenderId: "1001495613522",
  appId: "1:1001495613522:web:1e0b460831e277ae574f8b",
  measurementId: "G-SC8HBW13PB",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
