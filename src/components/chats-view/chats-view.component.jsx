import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { db } from "../../firebase/firebase-utils/firebase.auth.utils";
import { closeChatWindow, openChatWindow } from "../../redux/chat/chat.actions";
import SearchUsername from "../search-username/search-username.component";
import UserProfile from "../user-profile/user-profile.component";
import { v4 as uuidv4 } from 'uuid';

const ChatsView = ({ user }) => {
  const { displayName: clientUsername } = user;
  const [ chats, setChats ] = useState([])
  const [searchedUserData, setSearchedUserData] = useState({username: '', uid: null});

  useEffect(() => {
    const chatsQuery = query(
      collection(db, "chats"),
      where("users", "array-contains-any", [clientUsername])
    );

    //LISTENING FOR UPDATES ON DOCUMENTS WITH USERNAME IN DOCUMENT FIELD
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      querySnapshot.forEach((chat) => {
        getDocs(collection(db, "chats", chat.id, "messages")).then(
          (snapshot) => {
            if (snapshot.size > 0) {
              setChats((prevChats) => {
                const newChats = [...prevChats, chat.data()].sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt)
                return newChats;
              });
            }
          }
        );
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <div>
      <SearchUsername user={user} setSearchedUserData={setSearchedUserData} />
      {searchedUserData.username && (
        <UserProfile
          searchedUserData={searchedUserData}
          openChatWindow={openChatWindow}
        />
      )}
        <ul>
          {chats.map((chat) => {
            return (
            <UserProfile
              lastMessage={chat.lastMessage}
              chatUsers={chat.users}
              clientUser={user}
              searchedUserData={searchedUserData}
              key={uuidv4()}
            /> 
          )})
          }
          
        </ul>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  closeChatWindow: () => dispatch(closeChatWindow()),
  openChatWindow: (otherUser) => dispatch(openChatWindow(otherUser)),
});

export default connect(null, mapDispatchToProps)(ChatsView);
