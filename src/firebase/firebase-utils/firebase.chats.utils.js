import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase.auth.utils";

export const getUserFromDb = async (searchedUsername) => {
  const usernameRef = doc(db, "usernames", searchedUsername);
  try {
    const usernameSnap = await getDoc(usernameRef);
    if (usernameSnap.exists()) {
      return usernameSnap.data();
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    throw err;
  }
};

export const sendWelcomeMessage = async (clientUser) => {
  //  GET DEVELOPER ID FROM USERS
  const developerRef = doc(db, 'usernames', 'Andy')
  setDoc(developerRef, {username: 'Andy', uid: 'Andy'});
  const developerSnapshot = await getDoc(developerRef)
  const developerId = developerSnapshot.id;
  const { uid: clientUserUid } = clientUser;
  //  CREATE CHAT ID AND MESSAGE DATA
  const chatId =
    clientUserUid > developerId
      ? `${clientUserUid}${developerId}`
      : `${developerId}${clientUserUid}`;
  const users = [clientUser.displayName, 'Andy'].sort((a,b) => b - a);

  const message = `Welcome ${clientUser.displayName}, I am the developer of Chatty. Thank you for taking the time to check out the app, I hope you enjoy it!`

  //  CREATE MESSAGE OBJ
  const messageObj = {
    message,
    from: 'Andy',
    to: clientUser.displayName,
    createdAt: Timestamp.fromDate(new Date()),
    unread: true
  }
  //  SEND MESSAGE TO DB 
  try {
    const docRef = await doc(db, "chats", chatId);
    const docSnap = await getDoc(docRef);
    if(!docSnap.exists()) {
      await addDoc(collection(db, "chats", chatId, "messages"), messageObj);
      setDoc(docRef, {
        users,
        lastMessage: messageObj,
      });
    }
  } catch (err) {
     throw err;
  }
}

export const sendMessage = async (clientUser, otherUser, chatId, message) => {
  const { displayName: clientUsername } = clientUser;
  const { username: otherUsername } = otherUser;
  const users = [clientUsername, otherUsername].sort((a,b) => b - a);

  const messageObj = {
    message,
    from: clientUsername,
    to: otherUsername,
    createdAt: Timestamp.fromDate(new Date()),
    unread: true
  };
  try {
    const docRef = await doc(db, "chats", chatId);
    await addDoc(collection(db, "chats", chatId, "messages"), messageObj);
    setDoc(docRef, {
      users,
      lastMessage: messageObj,
    });
  } catch (err) {
     throw err;
  }
};
