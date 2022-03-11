import { getAnalytics } from "firebase/analytics";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDw2nLDZ7cIF5fL5_031wJaSU6w4vmbYZo",
  authDomain: "chatapp-5471a.firebaseapp.com",
  projectId: "chatapp-5471a",
  storageBucket: "chatapp-5471a.appspot.com",
  messagingSenderId: "559217520926",
  appId: "1:559217520926:web:885e6277abeffe34ed190f",
  measurementId: "G-JBDS03KWS7",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export const auth = getAuth();

export const handleGoogleSignIn = () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      const user = result.user;
      return user;
    })
    .catch((error) => {
      return error;
    });
};

export const storeUserInDb = async (email, password) => {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      return error;
    });
};

export const storeUsernameInDb = async (user, username) => {
  if( user instanceof Error){
    throw new Error(user.message);
  }
  await setDoc(doc(db, "usernames", username), {
    uid: user.uid,
  });
};

export const handleSignIn = (email, password) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      return error;
    });
};

export const handleSignOut = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
    })
    .catch((error) => {
      return error;
    });
};

export const checkUserNameAvailable = async (username) => {
  const usernameRef = doc(db, "usernames", username);
  const usernameSnap = await getDoc(usernameRef);
  if (usernameSnap.exists()) {
    return false;
  } else {
    return true;
  }
};
