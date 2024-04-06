import express from 'express';

import * as authController from '@/controllers/auth';
import { protect } from '@/middlewares/auth';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshAuthToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.use(protect);

router.patch('/me/update-password', authController.updatePassword);

export default router;
