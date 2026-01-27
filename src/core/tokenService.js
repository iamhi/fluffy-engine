import { promises as fs } from 'fs';
import {
  scryptSync,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const expirationTime = 1000 * 60 * 60 * 24 * 8;

const existingTokens = {};

const persistInterval = 1000 * 60 * 3;
const persistFilePath = './tokenstore';
const salt = 'something-salty-something-static';
let tokensLoaded = false;

const startUp = () => {
  if (tokensLoaded) {
    return;
  }

  tokensLoaded = true;

  const secretKey =
    process.env.TOKEN_STORE_SECRET_KEY || 'do-not-be-lazy-boiii';
  const key = scryptSync(secretKey, salt, 32);
  const algorithm = 'aes-256-gcm';

  setInterval(persistExistingTokens(algorithm, key), persistInterval);
  loadExistingTokens(algorithm, key);
};

const persistExistingTokens = (algorithm, key) => async () => {
  const jsonData = JSON.stringify(existingTokens);
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(jsonData, 'utf8', 'hex');

  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  const payload = JSON.stringify({
    iv: iv.toString('hex'),
    authTag,
    data: encrypted,
  });

  const tempPath = `${persistFilePath}.tmp`;

  await fs.writeFile(tempPath, payload);

  await fs.rename(tempPath, persistFilePath);
};

const loadExistingTokens = async (algorithm, key) => {
  try {
    const raw = await fs.readFile(persistFilePath, 'utf8');
    const { iv, authTag, data } = JSON.parse(raw);

    const decipher = createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(data, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (err) {
    if (err.code === 'ENOENT') return {};

    throw new Error(
      'Decryption failed: Integrity check failed or invalid key.'
    );
  }
};

export const generateToken = (username, userUuid) => {
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
  const userDetails = getUserDetails(token);

  delete existingTokens[token];

  return generateToken(userDetails.username, userDetails.uuid);
};

export const getUserDetails = (token) => {
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

setInterval(
  () => {
    const tokenHandlers = Object.values(existingTokens);

    tokenHandlers.forEach((tokenHandler) => {
      if (tokenHandler.expiresAt > Date.now()) {
        delete existingTokens[tokenHandler.uuid];
      }
    });
  },
  1000 * 60 * 10
);

startUp();
