const execute = (database) => {
  console.log(
    'Database - Migrationg - changelog_2.1 - Adding created_at to conversations'
  );

  try {
    database.prepare(`SELECT created_at FROM conversations LIMIT 0`).get();

    console.log(`[created_at] already exists in [conversations]`);
  } catch (error) {
    if (error.message.includes('no such column')) {
      database.exec(`ALTER TABLE conversations ADD COLUMN created_at DATETIME`);

      database.exec(
        `UPDATE conversations SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL`
      );

      console.log(`Successfully added [created_at] to [conversations]`);
    } else {
      console.error(`Unable to add [created_at] to [conversations]`);
      throw error;
    }
  }

  console.log(
    'Database - Migrationg - changelog_2.2 - Adding created_at to messages'
  );

  try {
    database.prepare(`SELECT created_at FROM messages LIMIT 0`).run();

    console.log(`[created_at] already exists in [messages]`);
  } catch (error) {
    if (error.message.includes('no such column')) {
      database.exec(`ALTER TABLE messages ADD COLUMN created_at DATETIME`);

      database.exec(
        `UPDATE messages SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL`
      );

      console.log(`Successfully added [created_at] to [messages]`);
    } else {
      console.error(`Unable to add [created_at] to [messages]`);
      throw error;
    }
  }

  console.log(
    'Database - Migrationg - changelog_2.3 - Adding ignored to messages'
  );

  try {
    database.prepare(`SELECT ignored FROM messages LIMIT 0`).run();

    console.log(`[ignored] already exists in [messages]`);
  } catch (error) {
    if (error.message.includes('no such column')) {
      database.exec(
        `ALTER TABLE messages ADD COLUMN ignored INTEGER DEFAULT 0`
      );
      console.log(`Successfully added [ignored] to [messages]`);
    } else {
      console.error(`Unable to add [ignored] to [messages]`);
      throw error;
    }
  }

  console.log(
    'Database - Migrationg - changelog_2.4 - Adding updated_at to conversations'
  );

  try {
    database.prepare(`SELECT updated_at FROM conversations LIMIT 0`).get();

    console.log(`[updated_at] already exists in [conversations]`);
  } catch (error) {
    if (error.message.includes('no such column')) {
      database.exec(`ALTER TABLE conversations ADD COLUMN updated_at DATETIME`);

      database.exec(
        `UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL`
      );

      console.log(`Successfully added [updated_at] to [conversations]`);
    } else {
      console.error(`Unable to add [updated_at] to [conversations]`);
      throw error;
    }
  }
};

export default { execute };
