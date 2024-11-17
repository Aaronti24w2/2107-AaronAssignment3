// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApebJkcUvpSvSVyW4VTa4Ncv7erwEIEDg",
  authDomain: "aaronassignment3.firebaseapp.com",
  projectId: "aaronassignment3",
  storageBucket: "aaronassignment3.firebasestorage.app",
  messagingSenderId: "54493845741",
  appId: "1:54493845741:web:e46c08ef513a9c0e6694e4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
