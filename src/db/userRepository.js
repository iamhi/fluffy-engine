let database = {};

let createUserInsert = {};
let getUserByUuidSelect = {};
let getUserByUsernameSelect = {};

export const setup = (db) => {
  database = db;

  createUserInsert = database.prepare(
    'INSERT INTO users (uuid, username, password) VALUES (?, ?, ?)'
  );

  getUserByUuidSelect = database.prepare('SELECT * FROM users WHERE uuid = ?');

  getUserByUsernameSelect = database.prepare(
    'SELECT * FROM users WHERE username = ?'
  );
};

export const insertUser = (uuid, username, password) =>
  createUserInsert.run(uuid, username, password);

export const findUserByUuid = (uuid) => getUserByUuidSelect.get(uuid);

export const findUserByUsername = (username) =>
  getUserByUsernameSelect.get(username);
