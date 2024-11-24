import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importa Firebase Authentication

const firebaseConfig = {
  apiKey: "AIzaSyDm1M2TIaggB9umG0YVATlMIklgRZjth3I",
  authDomain: "myspace-wd7v0n.firebaseapp.com",
  projectId: "myspace-wd7v0n",
  storageBucket: "myspace-wd7v0n.appspot.com", // Ajusta el dominio de storage si es incorrecto
  messagingSenderId: "153832243332",
  appId: "1:153832243332:web:0f102233ee0b3007ccc2d1",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app); // Inicializa Firebase Authentication
