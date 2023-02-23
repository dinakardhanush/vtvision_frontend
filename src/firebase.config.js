// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPFsaTSPBr2nuBCo5SbxL8-utemYCPdMY",
  authDomain: "hackmoldemo.firebaseapp.com",
  projectId: "hackmoldemo",
  storageBucket: "hackmoldemo.appspot.com",
  messagingSenderId: "548348965494",
  appId: "1:548348965494:web:021bfbd9830d1018e2a557",
  measurementId: "G-SLL4BBGGWZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
