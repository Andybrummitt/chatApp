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
    console.log(err);
  }
};
