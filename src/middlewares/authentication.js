import { getUserDetails } from '../core/tokenService.js';

// TODO: Implement cookies

export const authenticated = (req, res, next) => {
  const token = getTokenFromRequest(req);

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
  let authHeader = req.get('Authorization');

  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      authHeader = authHeader.split(' ')[1].trim();
    }

    return authHeader;
  }

  const { token } = req.body || {};

  if (token) {
    return token;
  }

  return;
};
