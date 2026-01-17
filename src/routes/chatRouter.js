import { Router } from 'express';
import {
  messagesRequest,
  chatRequest,
  validate,
} from '../middlewares/validators.js';
import {
  chat,
  conversations,
  messages,
} from '../controllers/chatController.js';
import { authenticated } from '../middlewares/authentication.js';

const router = Router();

router.post('/', chatRequest, validate, authenticated, chat);

router.post('/messages', messagesRequest, validate, authenticated, messages);

router.get('/conversations', authenticated, conversations);

export default router;
