import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { db } from "../../firebase/firebase-utils/firebase.auth.utils";
import { closeChatWindow, openChatWindow } from "../../redux/chat/chat.actions";
import SearchUsername from "../search-username/search-username.component";
import UserProfile from "../user-profile/user-profile.component";

const ChatsView = ({ user, openChatWindow }) => {
  const { displayName: clientUsername } = user;
  const [chats, setChats] = useState([]);
  const [searchedUserData, setSearchedUserData] = useState();

  let unsubscribe;

  useEffect(() => {
    (async () => await getChats())();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  const getChats = async () => {
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains-any", [clientUsername])
    );
    try {
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        let newChats = querySnapshot.docChanges();
        newChats.forEach((newChat) => {
          setChats((chats) => [...chats, newChat.doc.data()
          ]);
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <p>Logged in as {user.displayName}</p>
      <SearchUsername user={user} setSearchedUserData={setSearchedUserData} />
      {searchedUserData && (
        <UserProfile
          searchedUserData={searchedUserData}
          openChatWindow={openChatWindow}
        />
      )}
      {chats ? <ul>{chats.map((chat, index) => <li key={index}>{JSON.stringify(chat)}</li>)}
      </ul> : <p>No chats available</p>}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  closeChatWindow: () => dispatch(closeChatWindow()),
  openChatWindow: (otherUser) => dispatch(openChatWindow(otherUser)),
});

export default connect(null, mapDispatchToProps)(ChatsView);
