const execute = (database) => {
  console.log('Database - Migrationg - changelog_0 - Creating users table');
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
`);
};

export default { execute };
