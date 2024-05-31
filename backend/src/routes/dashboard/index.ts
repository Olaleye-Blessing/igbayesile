import express from 'express';
import { protect } from '@/middlewares/auth';
import hotelRouter from './hotel';

const router = express.Router();

router.use(protect);

router.use('/hotels', hotelRouter);

export default router;
