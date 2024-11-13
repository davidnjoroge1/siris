import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// Import the functions you need from the SDKs you need
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkhwyn5x5dIImodqfijzyIzJYQKXKK1Mo",
  authDomain: "siris-music-57b7a.firebaseapp.com",
  databaseURL: "https://siris-music-57b7a-default-rtdb.firebaseio.com",
  projectId: "siris-music-57b7a",
  storageBucket: "siris-music-57b7a.firebasestorage.app",
  messagingSenderId: "689983760974",
  appId: "1:689983760974:web:dad46744052ef8ba2a311f",
  measurementId: "G-6YWKSDZ8KD"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);