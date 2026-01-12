import { generateToken, regenerateToken } from '../core/tokenService.js';

export const login = (req, res) => {
  const { username, password } = req.body;

  const newToken = generateToken(username, password);

  return res.json({ token: newToken });
};

export const refreshToken = (req, res) => {
  const { userToken } = req;

  const newToken = regenerateToken(userToken);

  return res.json({ token: newToken });
};
