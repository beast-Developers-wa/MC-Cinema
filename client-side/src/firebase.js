import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuhY8GC-1IOQaIXfbbDCn65VxirQjIQOQ",
  authDomain: "reactoauth-81a73.firebaseapp.com",
  projectId: "reactoauth-81a73",
  storageBucket: "reactoauth-81a73.appspot.com", 
  messagingSenderId: "377132608051",
  appId: "1:377132608051:web:27700759038f8fde555146"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
