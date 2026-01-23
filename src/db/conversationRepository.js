let database = {};

let createConversationInsert = {};
let getConversationByUuidAndOwnerUuidSelect = {};
let getConversationsByOwnerUuidSelect = {};
let updatedAtConversationUpdate = {};

export const setup = (db) => {
  database = db;

  createConversationInsert = database.prepare(
    'INSERT INTO conversations (uuid, owner_uuid, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
  );

  getConversationByUuidAndOwnerUuidSelect = database.prepare(
    'SELECT * FROM conversations WHERE uuid = ? AND owner_uuid = ?'
  );

  getConversationsByOwnerUuidSelect = database.prepare(
    'SELECT * FROM conversations WHERE owner_uuid = ? ORDER BY updated_at DESC'
  );

  updatedAtConversationUpdate = database.prepare(
    'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE uuid = ?'
  );
};

export const insertConversation = (uuid, ownerUuid, title) =>
  createConversationInsert.run(uuid, ownerUuid, title, Date.now(), Date.now());

export const findConversationByUuidAndOwnerUuid = (uuid, ownerUuid) =>
  getConversationByUuidAndOwnerUuidSelect.get(uuid, ownerUuid);

export const findAllConversationsByOwnerUuid = (ownerUuid) =>
  getConversationsByOwnerUuidSelect.all(ownerUuid);

export const updateUpdatedAtConversation = (uuid) =>
  updatedAtConversationUpdate.run(uuid);
