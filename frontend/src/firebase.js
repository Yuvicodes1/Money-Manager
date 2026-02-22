// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);