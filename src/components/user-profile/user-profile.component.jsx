import React, { useEffect, useState } from "react";
import defaultProfileImage from "../../assets/default-profile-image.png";
import { getUserFromDb } from "../../firebase/firebase-utils/firebase.chats.utils";
import "./user-profile.styles.scss";

const UserProfile = ({
  searchedUserData,
  openChatWindow,
  lastMessage,
  chatUsers,
  clientUser
}) => {
  const [error, setError] = useState("");
  const [chatUserData, setChatUserData] = useState({username: '', uid: ''});

  useEffect(() => {
    if (lastMessage) {
      //  IF OPENED FROM CHATS VIEW SET SEARCHEDUSERDATA AFTER DB QUERY
      const username = chatUsers.filter(
        (user) => user !== clientUser.displayName
      )[0];
      getUserFromDb(username)
        .then((userdata) => {
          setChatUserData({ ...userdata, username });
        })
        .catch((err) => setError(err));
    }
  }, []);

  return (
    <div
      className="user-profile-container"
      onClick={() => {
        chatUserData.username ? openChatWindow(chatUserData) : openChatWindow(searchedUserData)
      }}
    >
      <div className="profile-data">
      <p className="error-message">{error.message}</p>
        <img
          className="profile-image"
          src={defaultProfileImage}
          alt="profile-image"
        />
        <p>{chatUserData.username ? chatUserData.username : searchedUserData.username ? searchedUserData.username : null}</p>
      </div>
    </div>
  );
};

export default UserProfile;
