import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCBZxFNlHoDu3ML2SGHj94jk_oxAGCaLUM",
  authDomain: "barberia-app-bf19d.firebaseapp.com",
  projectId: "barberia-app-bf19d",
  storageBucket: "barberia-app-bf19d.firebasestorage.app",
  messagingSenderId: "366817008665",
  appId: "1:366817008665:web:8bc1a48d32bd20e1225e88"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);