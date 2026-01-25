import { v4 as uuidv4 } from 'uuid';
import {
  findAllConversationsByOwnerUuid,
  findConversationByUuidAndOwnerUuid,
  insertConversation,
  updateUpdatedAtConversation,
} from '../db/conversationRepository.js';
import {
  findMessagesByConversationUuid,
  insertMessage,
} from '../db/messageRepository.js';
import { executeAgent as executeTitleAgent } from './agents/titleAgent.js';

const USER_ROLE = 'user';
const ASSISTANT_ROLE = 'assistant';

const entityMessageToDto = ({
  uuid,
  conversation_uuid,
  role,
  content,
  created_at,
}) => ({
  uuid,
  conversationUuid: conversation_uuid,
  role,
  content,
  createdAt: created_at,
});

const entityConversationToDto = ({
  uuid,
  title,
  owner_uuid,
  created_at,
  updated_at,
}) => ({
  uuid,
  title,
  ownerUuid: owner_uuid,
  createdAt: created_at,
  updatedAt: updated_at,
});

const createConversation = async (userDetails, message) => {
  const uuid = uuidv4();
  const title = await executeTitleAgent(message);
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
    createdAt: Date.now(),
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

export const sendMessage = async (userDetails, conversationId, message) => {
  let conversation = {};
  let newConversation = false;

  if (!conversationId) {
    conversation = await createConversation(userDetails, message);
    newConversation = true;
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

  updateUpdatedAtConversation(conversation.uuid);

  const answer = {
    uuid: answerMessage.uuid,
    conversationUuid: conversation.uuid,
    role: answerMessage.role,
    content: answerMessage.content,
    createdAt: answerMessage.createdAt,
  };

  if (newConversation) {
    return {
      answer,
      conversation,
    };
  }

  return {
    answer,
  };
};
