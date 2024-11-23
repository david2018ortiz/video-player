// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDm1M2TIaggB9umG0YVATlMIklgRZjth3I",
    authDomain: "myspace-wd7v0n.firebaseapp.com",
    projectId: "myspace-wd7v0n",
    storageBucket: "myspace-wd7v0n.firebasestorage.app",
    messagingSenderId: "153832243332",
    appId: "1:153832243332:web:0f102233ee0b3007ccc2d1"
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
