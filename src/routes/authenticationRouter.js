import { Router } from 'express';
import {
  loginRequest,
  refreshTokenRequest,
  validate,
} from '../middlewares/validators.js';
import {
  login,
  refreshToken,
} from '../controllers/authenticationController.js';

const router = Router();

router.post('/login', loginRequest, validate, login);

router.post('/token', refreshTokenRequest, validate, refreshToken);

export default router;
