// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO0DCMxGdQoAZNcpnVULK4nyNXO5MYoJs",
  authDomain: "inventory-management-471c4.firebaseapp.com",
  projectId: "inventory-management-471c4",
  storageBucket: "inventory-management-471c4.appspot.com",
  messagingSenderId: "179094133189",
  appId: "1:179094133189:web:032e952e222969e9fc13ac",
  measurementId: "G-5YCEFT43MP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };