import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const expirationTime = 1000 * 60 * 60 * 24 * 8;

const existingTokens = {};

export const generateToken = (username, userUuid) => {
  // TODO: make a JWT token
  const tokenHandler = {
    username,
    userUuid,
    expiresAt: Date.now() + expirationTime,
    uuid: uuidv4(),
  };

  existingTokens[tokenHandler.uuid] = tokenHandler;

  return tokenHandler.uuid;
};

export const regenerateToken = (token) => {
  // 1. getUserDetails()
  // 2. generateTonen()
  const userDetails = getUserDetails(token);

  delete existingTokens[token];

  return generateToken(userDetails.username, userDetails.uuid);
};

export const getUserDetails = (token) => {
  // Decode the token
  // Validate
  // if invalid throw authentication error
  const tokenHandler = existingTokens[token];

  if (tokenHandler && tokenHandler.expiresAt > Date.now()) {
    return { username: tokenHandler.username, uuid: tokenHandler.userUuid };
  }

  if (tokenHandler) {
    delete existingTokens[token];
  }

  const error = new Error('Invalid token');

  error.token = token;

  throw error;
};

export const invalidateToken = (token) => {
  delete existingTokens[token];
};
