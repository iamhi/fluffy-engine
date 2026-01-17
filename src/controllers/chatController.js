import {
  getConversations,
  getMessagesForConversation,
  sendMessage,
} from '../core/chatService.js';

export const chat = async (req, res) => {
  const { userDetails, body } = req;
  const { conversationUuid, message } = body;

  const answer = sendMessage(userDetails, conversationUuid, message);

  return res.json({ answer });
};

export const messages = (req, res) => {
  const { userDetails, body } = req;
  const { conversationUuid } = body;

  const messages = getMessagesForConversation(userDetails, conversationUuid);

  return res.json({ messages });
};

export const conversations = (req, res) => {
  const { userDetails } = req;

  const conversations = getConversations(userDetails);

  return res.json({ conversations });
};
