import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { db } from "../../firebase/firebase-utils/firebase.auth.utils";
import { sendMessage } from "../../firebase/firebase-utils/firebase.chats.utils";
import { closeChatWindow } from "../../redux/chat/chat.actions";
import ChatMessage from "../chat-message/chat-message";
import "./chat-window.styles.scss";

const ChatWindow = ({ otherUser, clientUser, closeChatWindow }) => {
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const { uid: clientUserUid, displayName: clientUsername } = clientUser;
  const { uid: otherUserUid, username: otherUsername } = otherUser;
  const chatId =
    clientUserUid > otherUserUid
      ? `${clientUserUid}${otherUserUid}`
      : `${otherUserUid}${clientUserUid}`;

  let unsubscribe;

  useEffect(() => {
    getMessages();
    return () => unsubscribe();
  }, []);

  const getMessages = async () => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt"),
      limit(50)
    );
    try {
      //  LISTEN FOR NEW MESSAGES
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        let newMessages = querySnapshot.docChanges();
        newMessages.forEach((newMessage) => {
          //  SET UNREAD IN DATABASE TO FALSE IF CHAT OPEN (HAS READ)
          if (newMessage.doc.data().from === otherUser.username) {
            const chatRef = doc(db, "chats", chatId);
            setDoc(
              chatRef,
              {
                lastMessage: {
                  unread: false,
                },
              },
              { merge: true }
            );
          }
          //  SET MESSAGE STATE
          setChatMessages((chatMessages) => [
            ...chatMessages,
            newMessage.doc.data(),
          ]);
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(clientUser, otherUser, chatId, newMessage);
    setNewMessage("");
    //scroll to bottom
    //ref on most recent then scroll into view
  };

  return (
    <div className="chat-window-container">
      <FontAwesomeIcon icon={faArrowLeft} onClick={closeChatWindow} size="2x" />
      <p>Chatting with {otherUser.username}</p>
      <div className="messages-container">
        {chatMessages.map((message, index) => (
          <ChatMessage message={message} key={index} />
        ))}
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
