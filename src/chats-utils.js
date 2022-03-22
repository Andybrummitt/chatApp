export const getChatId = (clientUser, otherUser) => {
  const { uid: clientUserUid } = clientUser;
  const { uid: otherUserUid } = otherUser;
  const chatId =
    clientUserUid > otherUserUid
      ? `${clientUserUid}${otherUserUid}`
      : `${otherUserUid}${clientUserUid}`;
  return chatId;
};


