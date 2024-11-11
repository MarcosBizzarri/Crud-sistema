import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsifhzawjgGPSG5Yrz9fFUhxqU39pnpPI",
  authDomain: "sistema-de-cadastro-bizzarri.firebaseapp.com",
  projectId: "sistema-de-cadastro-bizzarri",
  storageBucket: "sistema-de-cadastro-bizzarri.firebasestorage.app",
  messagingSenderId: "82352575312",
  appId: "1:82352575312:web:a7ca9cb813598033141255"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
