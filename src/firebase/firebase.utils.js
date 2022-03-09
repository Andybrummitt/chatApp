import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcky_TCCN33EqXiT7QUVBvvRAXckTmpCA",
  authDomain: "crwn-db-59954.firebaseapp.com",
  projectId: "crwn-db-59954",
  storageBucket: "crwn-db-59954.appspot.com",
  messagingSenderId: "696534080159",
  appId: "1:696534080159:web:87986b9bc4cbb7252360aa",
  measurementId: "G-9GF8D22ZXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);