// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBovVDZ0YcUJtQo3Uh1xeX7n_qIvXfv1pc",
  authDomain: "question-90dfd.firebaseapp.com",
  projectId: "question-90dfd",
  storageBucket: "question-90dfd.firebasestorage.app",
  messagingSenderId: "799882785135",
  appId: "1:799882785135:web:5dc575852328698977789a",
  measurementId: "G-750Z294LYY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
