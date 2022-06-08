import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCxfdoD6K7jhjbOzwX109mgLJCMXipwvG4",
  authDomain: "react-real-estate-app-9ecaa.firebaseapp.com",
  projectId: "react-real-estate-app-9ecaa",
  storageBucket: "react-real-estate-app-9ecaa.appspot.com",
  messagingSenderId: "724797759373",
  appId: "1:724797759373:web:14b2e26b47ad095357a7c4",
};

initializeApp(firebaseConfig);

export const db = getFirestore();
