import { Router } from 'express';
import {
  loginRequest,
  refreshTokenRequest,
  validate,
} from '../middlewares/validators.js';
import {
  login,
  refreshToken,
  whoami,
} from '../controllers/authenticationController.js';
import { authenticated } from '../middlewares/authentication.js';

const router = Router();

router.post('/login', loginRequest, validate, login);

router.post(
  '/token',
  refreshTokenRequest,
  validate,
  authenticated,
  refreshToken
);

router.get('/whoami', authenticated, whoami);

export default router;
