import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAjte1TZFVbR1Kes1kv020bD4xwpLoTlkc",
    authDomain: "chatting-app-f1fec.firebaseapp.com",
    projectId: "chatting-app-f1fec",
    storageBucket: "chatting-app-f1fec.appspot.com",
    messagingSenderId: "752859544514",
    appId: "1:752859544514:web:2071fa58594a73d415745b"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();