import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD1QaslooGKy64eyaTS8cPZrPeMnbguFjU",
  authDomain: "moneyforge-e9195.firebaseapp.com",
  projectId: "moneyforge-e9195",
  storageBucket: "moneyforge-e9195.firebasestorage.app",
  messagingSenderId: "667553593880",
  appId: "1:667553593880:web:1182c4dfe245b976dee16d",
  measurementId: "G-WDW3YWXLK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth
export const auth = getAuth(app);