import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { findUserByUsername, insertUser } from '../db/userRepository.js';
import { generateToken } from './tokenService.js';

const saltRounds = 10;

export const createUser = (username, password) => {
  const uuid = uuidv4();
  const hashPassword = bcrypt.hashSync(password, saltRounds);

  try {
    const { uuid: savedUuid, username: savedUsername } = insertUser(
      uuid,
      username,
      hashPassword
    );

    return { uuid: savedUuid, username: savedUsername };
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      if (error.message.includes('username')) {
        const invalidUsernameError = new Error('Invalid username provided');

        invalidUsernameError.username = username;

        throw invalidUsernameError;
      }

      if (error.message.includes('publicId')) {
        return createUser(username, password);
      }
    }

    console.error('Unforeseen database error during user creation:', error);

    throw error;
  }
};

export const readUser = (usernameToFind) => {
  const { uuid, username } = findUserByUsername(usernameToFind);

  return { uuid, username };
};

export const loginUser = (username, password) => {
  const existingUser = findUserByUsername(username);

  if (bcrypt.compareSync(password, existingUser.password)) {
    return generateToken(existingUser.username, existingUser.uuid);
  }

  const error = new Error('Invalid login');

  error.username = username;

  throw error;
};
