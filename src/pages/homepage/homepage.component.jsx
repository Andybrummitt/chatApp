import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ChatWindow from "../../components/chat-window/chat-window.component";
import ChatsView from "../../components/chats-view/chats-view.component";
import SearchUsername from "../../components/search-username/search-username.component";
import UserProfile from "../../components/user-profile/user-profile.component";
import { handleSignOut } from "../../firebase/firebase-utils/firebase.auth.utils";
import { closeChatWindow, openChatWindow } from "../../redux/chat/chat.actions";
import "./homepage.styles.scss";

const HomePage = ({ user, chatOpen }) => {

  return (
    <div className="homepage-container">
      {chatOpen ? (
        <ChatWindow />
      ) : (
        <>
          <ChatsView user={user} />
        </>
      )}

      <button className="sign-out" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  chatOpen: state.chat.chatOpen,
});

const mapDispatchToProps = (dispatch) => ({
  closeChatWindow: () => dispatch(closeChatWindow()),
  openChatWindow: (otherUser) => dispatch(openChatWindow(otherUser)),
});


export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
