import { v4 as uuidv4 } from 'uuid';
import {
  findAllConversationsByOwnerUuid,
  findConversationByUuidAndOwnerUuid,
  insertConversation,
} from '../db/conversationRepository.js';
import {
  findMessagesByConversationUuid,
  insertMessage,
} from '../db/messageRepository.js';

const USER_ROLE = 'user';
const ASSISTANT_ROLE = 'assistant';

const entityMessageToDto = ({ uuid, conversation_uuid, role, content }) => ({
  uuid,
  conversationUuid: conversation_uuid,
  role,
  content,
});

const entityConversationToDto = ({ uuid, title, owner_uuid }) => ({
  uuid,
  title,
  ownerUuid: owner_uuid,
});

const createConversation = (userDetails, message) => {
  console.warn('Title generation not yet implemented');

  const uuid = uuidv4();
  const title = 'Placeholder title';
  const ownerUuid = userDetails.uuid;

  const { lastInsertRowid } = insertConversation(uuid, ownerUuid, title);

  return {
    uuid,
    title,
    ownerUuid,
    id: lastInsertRowid,
  };
};

const processMessages = (messages) => {
  const uuid = uuidv4();

  // 1. llm tool calling operator
  // 2. get tool calling responses
  // do 1 and 2 for max X more tool calls
  // 3. use llm summarizer operator from tools responses, user message history and user's prompt

  return {
    uuid,
    role: ASSISTANT_ROLE,
    content: 'Wow that is awesome',
  };
};

export const getConversations = (userDetails) => {
  return findAllConversationsByOwnerUuid(userDetails.uuid).map(
    entityConversationToDto
  );
};

export const getMessagesForConversation = (userDetails, conversationId) => {
  const conversation = findConversationByUuidAndOwnerUuid(
    conversationId,
    userDetails.uuid
  );

  if (!conversation) {
    const error = new Error(`Unable to find with id: ${conversationId}`);

    error.conversationId = conversationId;

    throw error;
  }

  return findMessagesByConversationUuid(conversation.uuid).map(
    entityMessageToDto
  );
};

export const sendMessage = (userDetails, conversationId, message) => {
  let conversation = {};

  if (!conversationId) {
    conversation = createConversation(userDetails, message);
  } else {
    conversation = findConversationByUuidAndOwnerUuid(
      conversationId,
      userDetails.uuid
    );
  }

  if (!conversation) {
    const error = new Error(
      `Unable to find or create conversation with id: ${conversationId}`
    );

    error.conversationId = conversationId;

    throw error;
  }

  const historyMessages = findMessagesByConversationUuid(conversation.uuid);

  const userMessageUuid = uuidv4();

  insertMessage(userMessageUuid, conversation.uuid, USER_ROLE, message);

  const messagesForLlm = [
    ...historyMessages,
    { role: USER_ROLE, content: message },
  ];

  const answerMessage = processMessages(messagesForLlm);

  insertMessage(
    answerMessage.uuid,
    conversation.uuid,
    answerMessage.role,
    answerMessage.content
  );

  return {
    uuid: answerMessage.uuid,
    conversationUuid: conversation.uuid,
    role: answerMessage.role,
    content: answerMessage.content,
  };
};
