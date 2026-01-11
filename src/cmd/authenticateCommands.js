import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { createUser, readUser } from '../core/userService.js';
import { database } from '../db/shared.js';
import { setup as setupUserRepository } from '../db/userRepository.js';

setupUserRepository(database);

const argv = yargs(hideBin(process.argv))
  .option('command', {
    alias: 'c',
    type: 'string',
    description: 'Select the command that you want to execute',
  })
  .option('username', {
    alias: 'u',
    type: 'string',
    description: 'Username argument to the command',
  })
  .option('password', {
    alias: 'p',
    type: 'string',
    description: 'Password argument to the command',
  })
  .help()
  .alias('help', 'h').argv;

const { command, username, password } = argv;

switch (command) {
  case 'register': {
    createUser(username, password);
    break;
  }
  case 'findbyusername': {
    const user = readUser(username);

    console.log(
      `Found user with uuid: ${user.uuid} and username: ${user.username}`
    );

    break;
  }
}
