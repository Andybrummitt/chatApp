import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import defaultProfileImage from "../../assets/default-profile-image.png";
import { getUserFromDb } from "../../firebase/firebase-utils/firebase.chats.utils";
import { openChatWindow } from "../../redux/chat/chat.actions";
import "./user-profile.styles.scss";

const UserProfile = ({
  searchedUserData,
  openChatWindow,
  lastMessage,
  chatUsers,
  clientUser,
}) => {
  const [error, setError] = useState("");
  const [chatUserData, setChatUserData] = useState({ username: "", uid: "" });

  useEffect(() => {
    let isMounted = true;
    if (lastMessage) {
      console.log(lastMessage.from, clientUser.displayName);
      //  IF OPENED FROM CHATS VIEW SET SEARCHEDUSERDATA AFTER DB QUERY
      const username = chatUsers.filter(
        (user) => user !== clientUser.displayName
      )[0];
      getUserFromDb(username)
        .then((userdata) => {
          if (isMounted) {
            setChatUserData({ ...userdata, username });
          }
        })
        .catch((err) => setError(err));
    }
    return () => (isMounted = false);
  }, []);

  return (
    <div
      className="user-profile-container"
      onClick={() =>
        chatUserData.username
          ? openChatWindow(chatUserData)
          : openChatWindow(searchedUserData)
      }
    >
      <div className="profile-data">
        <p className="error-message">{error.message}</p>
        <div className="user-data">
          <img
            className="profile-image"
            src={defaultProfileImage}
            alt="profile-image"
          />
          <p>
            {chatUserData.username
              ? chatUserData.username
              : searchedUserData.username
              ? searchedUserData.username
              : null}
          </p>
        </div>
        {lastMessage && (
          <p
            className={`${
              lastMessage.unread && lastMessage.from !== clientUser.displayName
                ? "unread"
                : ""
            } last-message`}
          >
            {lastMessage.message}
          </p>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  openChatWindow: (user) => dispatch(openChatWindow(user)),
});

export default connect(null, mapDispatchToProps)(UserProfile);
