// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD76F6ep9LQ--nm60kpLIsdIaX-8Ss7tKU",
  authDomain: "hackmoldemo2.firebaseapp.com",
  projectId: "hackmoldemo2",
  storageBucket: "hackmoldemo2.appspot.com",
  messagingSenderId: "942612640001",
  appId: "1:942612640001:web:2329a152d23183132feb00",
  measurementId: "G-HB065D2L29",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
