import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase.auth.utils";

export const getUserFromDb = async (searchedUsername) => {
  const usernameRef = doc(db, "usernames", searchedUsername);
  try {
    const usernameSnap = await getDoc(usernameRef);
    if (usernameSnap.exists()) {
      return usernameSnap.data();
    } else {
      return new Error("User does not exist");
    }
  } catch (err) {
    return err;
  }
};

export const createChatRoom = async (chatId, clientUsername, otherUsername) => {
    try {
        const docRef = await doc(db, "chats", chatId)
        setDoc(docRef, {
            users: [clientUsername, otherUsername]
        })
    }
    catch(err) {
        console.log(err)
    }
};

export const sendMessage = async (clientUser, otherUser, chatId, message) => {
  const { displayName: clientUsername } = clientUser;
  const { username: otherUsername } = otherUser;
  const messageObj = {
    message,
    from: clientUsername,
    to: otherUsername,
    createdAt: Timestamp.fromDate(new Date()),
  };
  try {
    await addDoc(collection(db, "chats", chatId, "messages"), messageObj);
    const chatRef = doc(db, "chats", chatId)
    await updateDoc(chatRef, {
      lastMessage: messageObj
    })
  } catch (err) {
    console.log(err);
  }
};
