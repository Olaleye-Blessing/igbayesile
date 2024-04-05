import { getMe } from '@/controllers/user';
import { protect } from '@/middlewares/auth';
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello' });
});

router.use(protect);

router.route('/me').get(getMe);

export default router;
