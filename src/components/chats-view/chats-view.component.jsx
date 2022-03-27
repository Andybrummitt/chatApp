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

const ChatsView = ({ user, openChatWindow }) => {
  const { displayName: clientUsername } = user;
  const [chats, setChats] = useState([]);
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
              setChats((prevChats) => [...prevChats, chat.data()]);
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
      {chats.length > 0 ? (
        <ul>
          {chats.map((chat, index) => (
            <UserProfile
              openChatWindow={openChatWindow}
              lastMessage={chat.lastMessage}
              chatUsers={chat.users}
              clientUser={user}
              searchedUserData={searchedUserData}
              key={index}
            />
          ))}
        </ul>
      ) : (
        <p>No chats available</p>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  closeChatWindow: () => dispatch(closeChatWindow()),
  openChatWindow: (otherUser) => dispatch(openChatWindow(otherUser)),
});

export default connect(null, mapDispatchToProps)(ChatsView);
