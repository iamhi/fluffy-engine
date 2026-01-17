let database = {};

let createMessageInsert = {};
let getMessagesByConversationUuidSelect = {};

export const setup = (db) => {
  database = db;

  createMessageInsert = database.prepare(
    'INSERT INTO messages (uuid, conversation_uuid, role, content) VALUES (?, ?, ?, ?)'
  );

  getMessagesByConversationUuidSelect = database.prepare(
    'SELECT * FROM messages WHERE conversation_uuid = ?'
  );
};

export const insertMessage = (uuid, conversationUuid, role, content) =>
  createMessageInsert.run(uuid, conversationUuid, role, content);

export const findMessagesByConversationUuid = (conversationUuid) =>
  getMessagesByConversationUuidSelect.all(conversationUuid);
