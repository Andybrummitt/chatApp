import { addDoc, collection, doc, DocumentReference, getDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "./firebase.auth.utils";

export const getUserFromDb = async (searchedUsername) => {
    const usernameRef = doc(db, "usernames", searchedUsername);
    try {
        const usernameSnap = await getDoc(usernameRef);
        if (usernameSnap.exists()) {
            return usernameSnap.data();
          } else {
            return new Error('User does not exist')
          }
    }
    catch(err){
        return err;
    }
}

export const sendMessage = async (clientUser, otherUser, message) => {
    const { uid: clientUserUid, displayName: clientUsername } = clientUser;
    const { uid: otherUserUid, username: otherUsername } = otherUser;
    const chatId = clientUserUid > otherUserUid ? `${clientUserUid}${otherUserUid}` : `${otherUserUid}${clientUserUid}`;
    const messageObj = {
        message,
        from: clientUsername,
        to: otherUsername,
        createdAt: Timestamp.fromDate(new Date())
    }
    addDoc(collection(db, "chats", chatId, "messages"), messageObj)
}