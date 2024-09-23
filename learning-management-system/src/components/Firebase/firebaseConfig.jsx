import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBUqiEdDbsGt4R_bYnSkA_RdP9dZLhBe3o",
  authDomain: "learning-6ff71.firebaseapp.com",
  projectId: "learning-6ff71",
  storageBucket: "learning-6ff71.appspot.com",
  messagingSenderId: "660943001972",
  appId: "1:660943001972:web:ec78f9565a6674638bf421"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};