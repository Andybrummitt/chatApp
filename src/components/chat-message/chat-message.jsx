import React from "react";
import { connect } from "react-redux";

const ChatMessage = ({ message, clientUser }) => {
  const client = message.from === clientUser.displayName ? true : false;
  const date = message.createdAt.toDate();
  const timeString = `${date.getUTCHours()}:${date.getUTCMinutes()}`;
  return (
    <div className={`${client && "client-message"} message-data-container`}>
      <div className="message-container">
        <span>{!client && message.from}</span>
        <span className="message">{message.message}</span>
      </div>
      <span>{timeString}</span>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUser: state.user.user,
});

export default connect(mapStateToProps)(ChatMessage);
