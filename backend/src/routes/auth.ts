import express from 'express';

import * as authController from '@/controllers/auth';
import { justLoggedIn, protect } from '@/middlewares/auth';
import { imgsUpload } from '@/middlewares/multer';
import { validateData } from '@/utils/validate-data';
import * as authSchema from '@/schemas/auth';

const router = express.Router();

router.post(
  '/signup',
  validateData({ schema: authSchema.signUpShema }),
  authController.signup,
);
router.post(
  '/login',
  validateData({ schema: authSchema.loginShema }),
  authController.login,
);
router.post('/refresh-token', authController.refreshAuthToken);
router.post('/logout', authController.logout);
router.post(
  '/forgot-password',
  validateData({ schema: authSchema.forgotPwdSchema }),
  authController.forgotPassword,
);
router.post(
  '/reset-password/:token',
  validateData({ schema: authSchema.resetPwdSchema }),
  authController.resetPassword,
);

router.use(protect);

router.patch(
  '/me/update-password',
  validateData({ schema: authSchema.updatePwdShema }),
  authController.updatePassword,
);
router.post('/me/login', authController.loginMe, authController.login);
router.patch(
  '/me/email',
  justLoggedIn,
  validateData({ schema: authSchema.updateEmailSchema }),
  authController.updateEmail,
);
router.patch(
  '/me/avatar',
  imgsUpload.single('avatar'),
  validateData({ schema: authSchema.updateAvatarSchema, path: 'file' }),
  authController.updateAvatar,
);
router.delete('/me/avatar', authController.deleteAvatar);

export default router;
