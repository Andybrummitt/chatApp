import { collection, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "./firebase.auth.utils";

export const getUserFromDb = async (searchedUsername) => {
    const usernameRef = doc(db, "usernames", searchedUsername);
    const usernameSnap = await getDoc(usernameRef);
    if (usernameSnap.exists()) {
        return usernameSnap.data();
      } else {
        return new Error('User does not exist')
      }
}

export const createNewChat = async (clientUser, searchedUserUid) => {
    const { uid: userUid } = clientUser;
    console.log(clientUser, searchedUserUid)
    const clientUserQuery = query(collection(db, "users"), where("uid", "==", userUid));
    const searchedUserQuery = query(collection(db, "users"), where("uid", "==", searchedUserUid))
    //find uid from username typed in 
    //create chat with this user and username typed in 
    //handle errors
}