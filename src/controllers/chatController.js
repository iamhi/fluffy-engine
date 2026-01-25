import {
  getConversations,
  getMessagesForConversation,
  sendMessage,
} from '../core/chatService.js';

export const chat = async (req, res) => {
  const { userDetails, body } = req;
  const { conversationUuid, message } = body;

  const result = await sendMessage(userDetails, conversationUuid, message);

  return res.json({ ...result, success: true });
};

export const messages = (req, res) => {
  const { userDetails, params } = req;
  const { conversationUuid } = params;

  const messages = getMessagesForConversation(userDetails, conversationUuid);

  return res.json({ messages, success: true });
};

export const conversations = (req, res) => {
  const { userDetails } = req;

  const conversations = getConversations(userDetails);

  return res.json({ conversations, success: true });
};
