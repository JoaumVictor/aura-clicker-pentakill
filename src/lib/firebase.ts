import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7P0lbPbcNYuoXs2PD9uW1QThG4PNxjvw",
  authDomain: "iniciativa-pentakill.firebaseapp.com",
  projectId: "iniciativa-pentakill",
  storageBucket: "iniciativa-pentakill.firebasestorage.app",
  messagingSenderId: "531458701999",
  appId: "1:531458701999:web:0dca34f4e1e485cecdb25a",
  measurementId: "G-YPFQ116N0J"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);