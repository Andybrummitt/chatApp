import { useContext } from "react";
import { connect } from "react-redux";
import { ThemeContext } from "../../App";
import ChatWindow from "../../components/chat-window/chat-window.component";
import ChatsView from "../../components/chats-view/chats-view.component";
import { closeChatWindow, openChatWindow } from "../../redux/chat/chat.actions";
import "./homepage.styles.scss";

const HomePage = ({ user, chatOpen }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`homepage-container ${darkMode ? "dark" : ""}`}>
      {chatOpen ? (
        <ChatWindow />
      ) : (
        <ChatsView user={user} chatOpen={chatOpen} />
      )}
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
