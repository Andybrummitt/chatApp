import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { db } from "../../firebase/firebase-utils/firebase.auth.utils";
import { sendMessage } from "../../firebase/firebase-utils/firebase.chats.utils";
import { closeChatWindow } from "../../redux/chat/chat.actions";
import "./chat-window.styles.scss";

const ChatWindow = ({ otherUser, clientUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  let unsubscribe;

  useEffect(() => {
    getMessages(clientUser, otherUser);
    return () => unsubscribe();
  }, []);

  const getMessages = async (clientUser, otherUser) => {
    const { uid: clientUserUid } = clientUser;
    const { uid: otherUserUid } = otherUser;
    const chatId =
      clientUserUid > otherUserUid
        ? `${clientUserUid}${otherUserUid}`
        : `${otherUserUid}${clientUserUid}`;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      let newMessages = querySnapshot.docChanges();
      newMessages.forEach((newMessage) => {
        setChatMessages((chatMessages) => [
          ...chatMessages,
          newMessage.doc.data(),
        ]);
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(clientUser, otherUser, newMessage);
    setNewMessage("");
    //scroll to bottom
    //ref on most recent then scroll into view
  };

  return (
    <div className="chat-window-container">
      <p>Chatting with {otherUser.username}</p>
      <div className="messages-container">
        {chatMessages.map((message, index) => {
          return (
            <li key={index}>
              <p>{message.message}</p>
              <span>{message.from}</span>
              <p>{message.createdAt.toDate().toString()}</p>
            </li>
          );
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
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
