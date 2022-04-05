import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase/firebase-utils/firebase.auth.utils";
import { closeChatWindow, openChatWindow } from "../../redux/chat/chat.actions";
import SearchUsername from "../search-username/search-username.component";
import UserProfile from "../user-profile/user-profile.component";
import "./chats-view.styles.scss";

const ChatsView = ({ user, chatOpen, otherUser }) => {
  const { displayName: clientUsername } = user;
  const [chats, setChats] = useState([]);
  const [searchedUserData, setSearchedUserData] = useState({
    username: "",
    uid: null,
  });

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
            //  IF CHAT HAS MESSAGES
            if (snapshot.size > 0) {
              setChats((prevChats) => {
                let chatUsers = [];
                const newChats = [...prevChats, chat.data()]
                  //  SORT IN ORDER OF LASTEST MESSAGE
                  .sort(
                    (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt
                  )
                  //  FILTER TO 1 CHAT BY EACH USER
                  .filter((chat) => {
                    if (!chatUsers.includes(JSON.stringify(chat.users))) {
                      chatUsers.push(JSON.stringify(chat.users));
                      return chat;
                    }
                  });
                //  SET CHATS STATE
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
    <div className={`${chatOpen && "shrink"} chats-container`}>
      {!chatOpen && (
        <SearchUsername user={user} setSearchedUserData={setSearchedUserData} />
      )}
      {!chatOpen && searchedUserData.username && (
        <UserProfile
          searchedUserData={searchedUserData}
          openChatWindow={openChatWindow}
        />
      )}
      <ul>
        {chats
          .filter((chat) => !chat.users.includes(otherUser.username))
          .map((chat) => {
            return (
              <UserProfile
                lastMessage={chat.lastMessage}
                chatUsers={chat.users}
                clientUser={user}
                searchedUserData={searchedUserData}
                key={uuidv4()}
              />
            );
          })}
      </ul>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  closeChatWindow: () => dispatch(closeChatWindow()),
  openChatWindow: (otherUser) => dispatch(openChatWindow(otherUser)),
});

const mapStateToProps = (state) => ({
  otherUser: state.chat.otherUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatsView);
