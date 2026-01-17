import { Router } from 'express';
import * as homeController from '../controllers/homeController.js';
import authenticationRouter from './authenticationRouter.js';
import chatRouter from './chatRouter.js';

const router = Router();

router.get('/', homeController.home);

router.use('/auth', authenticationRouter);
router.use('/chat', chatRouter);

export default router;
