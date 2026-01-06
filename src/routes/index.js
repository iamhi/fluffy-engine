import { Router } from 'express';
import * as homeController from '../controllers/homeController.js';
// import { asyncHandler } from '../middlewares/asyncHandler.js';
// import { ollamaChatRequest, validate } from '../middlewares/validators.js';

const router = Router();

router.get('/', homeController.home);

/*
router.post(
  '/chat',
  ollamaChatRequest,
  validate,
  asyncHandler(OllamaController.chat)
);
*/

export default router;
