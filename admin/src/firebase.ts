// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0gjmY8Oh4inT9y6bfQZRpBrgffmwQIzo",
  authDomain: "university-management-d5f4e.firebaseapp.com",
  projectId: "university-management-d5f4e",
  storageBucket: "university-management-d5f4e.appspot.com",
  messagingSenderId: "247811223664",
  appId: "1:247811223664:web:ae060681f38c4dcce284b5",
  measurementId: "G-TP98G66E2F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
