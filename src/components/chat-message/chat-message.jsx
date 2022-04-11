import React, { useEffect } from "react";
import { connect } from "react-redux";

const ChatMessage = ({ message, clientUser }) => {
  const client = message.from === clientUser.displayName ? true : false;
  const dateAndTime = message.createdAt.toDate().toLocaleString().split(",");
  const date = dateAndTime[0];
  const time = dateAndTime[1].slice(0, 6);

  return (
    <div className={`${client && "client-message"} message-data-container`}>
      <div className="message-container">
        <span className="message">{message.message}</span>
      </div>
      <span>{time}</span>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUser: state.user.user,
});

export default connect(mapStateToProps)(ChatMessage);
