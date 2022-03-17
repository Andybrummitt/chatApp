import React from "react";
import { connect } from "react-redux";
import { closeChatWindow } from "../../redux/chat/chat.actions";
import "./chat-window.styles.scss";

const ChatWindow = ({ otherUser, clientUser }) => {
  //get messages from firestore
  //add close window button that dispatches action
  //style component

  return (
    <div className="chat-window-container">
      <p>Chatting with {otherUser.username}</p>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUser: state.user.user,
  otherUser: state.chat.otherUser,
});

const mapDispatchToProps = (dispatch) => ({
  closeChatWindow: () => dispatch(closeChatWindow()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);
