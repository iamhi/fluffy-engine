import { getUserDetails } from '../core/tokenService.js';

// TODO: Implement cookies

export const authenticated = (req, res, next) => {
  const token = getTokenFromRequest(req);

  console.warn({ token });

  if (token === null) {
    const error = new Error('Invalid token');

    error.token = token;

    throw error;
  }

  const userDetails = getUserDetails(token);

  req.userDetails = userDetails;
  req.userToken = token;

  next();
};

const getTokenFromRequest = (req) => {
  const authHeader = req.get('Authorization');

  if (authHeader) {
    return authHeader;
  }

  const { token } = req.body || {};

  if (token) {
    return token;
  }

  return;
};
