import { regenerateToken } from '../core/tokenService.js';
import { loginUser } from '../core/userService.js';

export const login = (req, res) => {
  const { username, password } = req.body;

  const newToken = loginUser(username, password);

  return res.json({ token: newToken });
};

export const refreshToken = (req, res) => {
  const { userToken } = req;

  const newToken = regenerateToken(userToken);

  return res.json({ token: newToken });
};
