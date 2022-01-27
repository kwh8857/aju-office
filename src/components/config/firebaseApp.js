import firebaseApp from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1fsk0l0ksJl9lDpHY0XLnL3MCHXQLRlE",
  authDomain: "ajoo-office.firebaseapp.com",
  projectId: "ajoo-office",
  storageBucket: "ajoo-office.appspot.com",
  messagingSenderId: "547492296181",
  appId: "1:547492296181:web:594f4009a3a17822e59cbc",
  measurementId: "G-73MKY5EZRK",
};

// Initialize Firebase

firebaseApp.initializeApp(firebaseConfig);

// firebaseApp.initializeApp(firebaseConfig);

export default firebaseApp;
