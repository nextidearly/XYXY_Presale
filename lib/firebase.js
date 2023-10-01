// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPWeXQuXYIz5KTdMUqbzEk--2HkC8kFfk",
  authDomain: "xyxy-a7440.firebaseapp.com",
  projectId: "xyxy-a7440",
  storageBucket: "xyxy-a7440.appspot.com",
  messagingSenderId: "310046695798",
  appId: "1:310046695798:web:b14c774fe29ae808e5da57",
  measurementId: "G-BTTERCT1MY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
// const analytics = getAnalytics(app);