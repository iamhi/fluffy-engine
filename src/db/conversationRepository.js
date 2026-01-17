let database = {};

let createConversationInsert = {};
let getConversationByUuidAndOwnerUuidSelect = {};
let getConversationsByOwnerUuidSelect = {};

export const setup = (db) => {
  database = db;

  createConversationInsert = database.prepare(
    'INSERT INTO conversations (uuid, owner_uuid, title) VALUES (?, ?, ?)'
  );

  getConversationByUuidAndOwnerUuidSelect = database.prepare(
    'SELECT * FROM conversations WHERE uuid = ? AND owner_uuid = ?'
  );

  getConversationsByOwnerUuidSelect = database.prepare(
    'SELECT * FROM conversations WHERE owner_uuid = ?'
  );
};

export const insertConversation = (uuid, ownerUuid, title) =>
  createConversationInsert.run(uuid, ownerUuid, title);

export const findConversationByUuidAndOwnerUuid = (uuid, ownerUuid) =>
  getConversationByUuidAndOwnerUuidSelect.get(uuid, ownerUuid);

export const findAllConversationsByOwnerUuid = (ownerUuid) =>
  getConversationsByOwnerUuidSelect.all(ownerUuid);
