const execute = (database) => {
  console.log(
    'Database - Migrationg - changelog_1.1 - Creating conversation table'
  );

  database.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      owner_uuid TEXT NOT NULL,
      title TEXT NOT NULL
    )
`);

  console.log(
    'Database - Migrationg - changelog_1.2 - Creating messages table'
  );

  database.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      conversation_uuid TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL
    )
`);
};

export default { execute };
