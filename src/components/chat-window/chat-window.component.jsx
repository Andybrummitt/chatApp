import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { ThemeContext } from "../../App";
import { db } from "../../firebase/firebase-utils/firebase.auth.utils";
import { sendMessage } from "../../firebase/firebase-utils/firebase.chats.utils";
import { closeChatWindow } from "../../redux/chat/chat.actions";
import ChatMessage from "../chat-message/chat-message";
import "./chat-window.styles.scss";

const ChatWindow = ({ otherUser, clientUser, closeChatWindow }) => {
  const { darkMode } = useContext(ThemeContext);

  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const inputRef = useRef(null);

  const { uid: clientUserUid } = clientUser;
  const { uid: otherUserUid } = otherUser;
  const chatId =
    clientUserUid > otherUserUid
      ? `${clientUserUid}${otherUserUid}`
      : `${otherUserUid}${clientUserUid}`;

  let unsubscribe;
  let isMounted;

  useEffect(() => {
    isMounted = true;
    getMessages();
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    //  FIX UI ON LAST MESSAGE AND FOCUS SEND MESSAGE INPUT FIELD
    if (chatMessages.length > 0) {
      const lastMessage = document.querySelector(
        ".messages-container"
      ).lastElementChild;
      lastMessage.scrollIntoView();
    }
    inputRef.current.focus();
  }, [chatMessages]);

  const getMessages = async () => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    try {
      //  LISTEN FOR NEW MESSAGES
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          let newMessages = querySnapshot.docChanges();
          newMessages.reverse().forEach(async (newMessage) => {
            //  SET MESSAGE STATE
            if (isMounted && newMessage.type === "added") {
              setChatMessages((chatMessages) => [
                ...chatMessages,
                newMessage.doc.data(),
              ]);
            }
            //  SET UNREAD IN DATABASE TO FALSE IF CHAT OPEN (HAS READ)
            if (newMessage.doc.data().from === otherUser.username) {
              const chatRef = doc(db, "chats", chatId);
              await setDoc(
                chatRef,
                {
                  lastMessage: {
                    unread: false,
                  },
                },
                { merge: true }
              );
            }
          });
        },
        (err) => setError(err)
      );
    } catch (err) {
      setError(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(newMessage.length < 1) return;
    try {
      sendMessage(clientUser, otherUser, chatId, newMessage);
    } catch (err) {
      setError(err);
    }
    setNewMessage("");
  };

  return (
    <div className="chat-window">
      <button className="back-to-chats-button" onClick={closeChatWindow}>
        <FontAwesomeIcon
          icon={faArrowLeft}
        />
        <span>Back to chats</span>
      </button>
      {error && <p className="error-message">{error.message}</p>}
      <p className="chat-title">Chatting with {otherUser.username}</p>
      <div className={`chat-window-container ${darkMode ? "dark" : ""}`}>
        <div className="messages-container">
          {chatMessages.map((message, index, arr) => {
            //  GET DATE OF CURRENT MESSAGE
            const currMessageDate = message.createdAt
              .toDate()
              .toLocaleDateString();
            //  IF NO PREV MESSAGES DISPLAY CURRENT DATE
            if (index === 0) {
              return (
                <React.Fragment key={uuidv4()}>
                  <p className="date">{currMessageDate}</p>
                  <ChatMessage message={message} />
                </React.Fragment>
              );
            }
            if (index !== 0) {
              const prevMessage = arr[index - 1];
              const prevDate = prevMessage.createdAt
                .toDate()
                .toLocaleDateString();
              //  IF PREV MESSAGES BUT DATE CHANGED RETURN NEW DATE AND MESSAGE
              if (prevDate !== currMessageDate) {
                return (
                  <React.Fragment key={uuidv4()}>
                    <p className="date">{currMessageDate}</p>
                    <ChatMessage message={message} />
                  </React.Fragment>
                );
              }
              //  ELSE ONLY RETURN MESSAGE
              else return <ChatMessage message={message} key={uuidv4()} />;
            }
          })}
        </div>
        <form onSubmit={handleSubmit}>
          <TextareaAutosize
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            maxRows={2}
            aria-label="maximum height"
            ref={inputRef}
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={300}
          />
          <button type="submit">Send</button>
        </form>
      </div>
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
