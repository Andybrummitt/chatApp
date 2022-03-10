import firebase from 'firebase/compat/app'; 
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDw2nLDZ7cIF5fL5_031wJaSU6w4vmbYZo",
  authDomain: "chatapp-5471a.firebaseapp.com",
  projectId: "chatapp-5471a",
  storageBucket: "chatapp-5471a.appspot.com",
  messagingSenderId: "559217520926",
  appId: "1:559217520926:web:885e6277abeffe34ed190f",
  measurementId: "G-JBDS03KWS7"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export const auth = getAuth();

export const handleGoogleSignIn = () => {
  return signInWithPopup(auth, provider)
  .then((result) => {
      const user = result.user;
      return user;
  }).catch((error) => {
      return error;
  });

}

