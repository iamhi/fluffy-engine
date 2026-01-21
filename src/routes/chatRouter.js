import { Router } from 'express';
import { chatRequest, validate } from '../middlewares/validators.js';
import {
  chat,
  conversations,
  messages,
} from '../controllers/chatController.js';
import { authenticated } from '../middlewares/authentication.js';

const router = Router();

router.post('/', chatRequest, validate, authenticated, chat);

router.get('/conversations', authenticated, conversations);

router.get(
  '/conversations/:conversationUuid/messages',
  authenticated,
  messages
);

export default router;
