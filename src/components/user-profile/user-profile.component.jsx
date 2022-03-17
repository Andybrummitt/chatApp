import React, { useEffect } from "react";
import { createNewChat } from "../../firebase/firebase-utils/firebase.chats.utils";
import Button from "../button/button.component";

const UserProfile = ({ searchedUserData, openChatWindow }) => {



  return (
    <div className="user-profile">
      <h3>User Profile: {searchedUserData.username}</h3>
      <Button type="button" children="Chat" onClick={() => openChatWindow(searchedUserData)} />
    </div>
  );
};

export default UserProfile;
