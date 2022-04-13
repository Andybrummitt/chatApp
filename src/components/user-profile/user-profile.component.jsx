import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { ThemeContext } from "../../App";
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

  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    let isMounted = true;
    if (lastMessage) {
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

  const messageDisplay = (msg) => {
    if(msg.length <= 15) return msg;
    return msg.substring(0,12).concat('...');
  } 

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
          <img
            className="profile-image"
            src={defaultProfileImage}
            alt="profile-image"
          />
        <div className="user-data">
          <p className="username">
            {chatUserData.username
              ? chatUserData.username
              : searchedUserData.username
              ? searchedUserData.username
              : null}
          </p>
        {lastMessage && (
          <p
            className={`${
              lastMessage.unread && lastMessage.from !== clientUser.displayName
                ? "unread"
                : ""
            } last-message ${darkMode ? 'dark' : ''}`}
          >
            {`${lastMessage.from === clientUser.displayName ? 'You:' : ''} ${messageDisplay(lastMessage.message)}`}
          </p>
        )}
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  openChatWindow: (user) => dispatch(openChatWindow(user)),
});

export default connect(null, mapDispatchToProps)(UserProfile);
