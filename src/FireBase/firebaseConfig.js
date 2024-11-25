import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBZWCJaY6OltuwMVdW6hQhPAScefpSrpy0",
  authDomain: "proval-10ef6.firebaseapp.com",
  projectId: "proval-10ef6",
  storageBucket: "proval-10ef6.appspot.com",
  messagingSenderId: "855057002382",
  appId: "1:855057002382:web:154764fd753d67af66bedf",
  measurementId: "G-JF2RCE07QQ"
};
const app = initializeApp(firebaseConfig);

export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const auth = getAuth(app);