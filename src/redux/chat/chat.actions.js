export const openChatWindow = (payload) => ({
  type: "OPEN_CHAT_WINDOW",
  payload,
});

export const closeChatWindow = (payload) => ({
  type: "CLOSE_CHAT_WINDOW",
  payload,
});
