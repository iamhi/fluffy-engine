import { Router } from 'express';
import * as homeController from '../controllers/homeController.js';
import authenticationRouter from './authenticationRouter.js';

const router = Router();

router.get('/', homeController.home);

router.use('/auth', authenticationRouter);

export default router;
