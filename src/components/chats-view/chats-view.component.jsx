import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase/firebase-utils/firebase.auth.utils";
import { sendWelcomeMessage } from "../../firebase/firebase-utils/firebase.chats.utils";
import { closeChatWindow, openChatWindow } from "../../redux/chat/chat.actions";
import SearchUsername from "../search-username/search-username.component";
import UserProfile from "../user-profile/user-profile.component";
import "./chats-view.styles.scss";

const ChatsView = ({ user, chatOpen }) => {
  const { displayName: clientUsername } = user;
  const [chats, setChats] = useState([]);
  const [usernameFromSearch, setUsernameFromSearch] = useState("");
  const [searchedUserData, setSearchedUserData] = useState({
    username: "",
    uid: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const chatsQuery = query(
      collection(db, "chats"),
      where("users", "array-contains-any", [clientUsername])
    );

    //LISTENING FOR UPDATES ON DOCUMENTS WITH USERNAME IN DOCUMENT FIELD
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      querySnapshot.forEach((chat) => {
        getDocs(collection(db, "chats", chat.id, "messages"))
          .then((snapshot) => {
            let chatIds = [];
            //  IF CHAT HAS MESSAGES
            if (snapshot.size > 0) {
              const { id } = chat;
              const newChatObj = { ...chat.data(), id };
              setChats((prevChats) => {
                const newChats = [...prevChats, newChatObj]
                  //  SORT IN ORDER OF LAST MESSAGE
                  .sort(
                    (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt
                  )
                  //  FILTER TO 1 CHAT BY EACH USER
                  .filter((chat) => {
                    if (!chatIds.includes(chat.id)) {
                      chatIds.push(chat.id);
                      return chat;
                    }
                  });
                setError("");
                //  SET CHATS STATE
                return newChats;
              });
            }
          })
          .catch((error) => setError(error));
      });
    });

    //  CALL WELCOME FUNCTION (MESSAGE FROM DEV)
    if (chats.length < 1) {
      sendWelcomeMessage(user).catch((err) => {
        setError(err);
      });
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const searchedUserNotInChats = (searchedUserDataName) => {
    let notInChats = true;
    chats.forEach((chat) => {
      if (chat.users.includes(searchedUserDataName)) {
        notInChats = false;
      }
    });
    return notInChats;
  };

  return (
    <div className={`${chatOpen ? "shrink" : ""} chats-container`}>
      {!chatOpen && (
        <SearchUsername
          user={user}
          setSearchedUserData={setSearchedUserData}
          usernameFromSearch={usernameFromSearch}
          setUsernameFromSearch={setUsernameFromSearch}
        />
      )}
      {/* IF USER IS SEARCHED AND IS NOT ALREADY IN CHATS LIST RETURN SEARCHED USER PROFILE */}
      {!chatOpen &&
      searchedUserData.username &&
      searchedUserNotInChats(searchedUserData.username) ? (
        <UserProfile
          searchedUserData={searchedUserData}
          openChatWindow={openChatWindow}
        />
      ) : null}
      {chats.length > 0 && <h2 className="chats-title">Chats</h2>}
      <ul>
        {error && <p className="error-message">{error.message}</p>}
        {chats
          .filter((chat) => {
            //  IF USERNAME IS SEARCHED
            if (usernameFromSearch) {
              //  GET OTHER USERNAME
              const otherUsername = [...chat.users].filter(
                (name) => name !== user.displayName
              )[0];
              const regex = new RegExp(usernameFromSearch, "gm");
              //  IF THE SEARCH MATCHES OTHER USERNAME RETURN THE CHAT TO DISPLAY USER PROFILE
              if (otherUsername.match(regex)) {
                return chat;
              }
              //  IF NOT THEN RETURN NOTHING
              else {
                return;
              }
              //  IF USERNAME IS NOT SEARCHED JUST RETURN CHAT
            } else {
              return chat;
            }
          })
          .map((chat) => {
            return (
              <li key={uuidv4()}>
                <UserProfile
                  lastMessage={chat.lastMessage}
                  chatUsers={chat.users}
                  clientUser={user}
                  searchedUserData={searchedUserData}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  closeChatWindow: () => dispatch(closeChatWindow()),
  openChatWindow: (otherUser) => dispatch(openChatWindow(otherUser)),
});

const mapStateToProps = (state) => ({
  otherUser: state.chat.otherUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatsView);
