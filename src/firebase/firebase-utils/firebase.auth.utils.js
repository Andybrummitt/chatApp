import { getAnalytics } from "firebase/analytics";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import firebaseConfig from "../firebase.config";

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore();
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export const auth = getAuth();

export const handleGoogleSignIn = () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      setDoc(doc(db, "users", user.uid), {
        chats: {},
      });
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
      setDoc(doc(db, "users", user.uid), {
        chats: {},
      });
      return user;
    })
    .catch((error) => {
      return error;
    });
};

export const storeUsernameInDbAndUpdateProfile = async (user, username) => {
  if (user instanceof Error) {
    throw new Error(user.message);
  }
  return setDoc(doc(db, "usernames", username), {
    uid: user.uid,
  })
    .then(() =>
      updateProfile(auth.currentUser, {
        displayName: username,
      })
    )
    .then(() => user);
};

export const handleSignIn = (email, password) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const handleSignOut = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {})
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

export const checkUserNameLinked = async (user) => {
  const { uid: userUid } = user;
  const q = query(collection(db, "usernames"), where("uid", "==", userUid));
  return getDocs(q)
    .then((snapshot) => (snapshot.docs.length > 0 ? true : false))
    .catch((err) => err);
};

export const deleteAccount = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return deleteUser(user)
    .then(async () => {
      await deleteDoc(doc(db, "usernames", user.displayName));
      return;
    })
    .catch((error) => {
      throw error;
    });
};
