import express from 'express';
import { dashboardOnly, protect } from '@/middlewares/auth';
import hotelRouter from './hotel';
import roomRouter from './room';

const router = express.Router();

router.use(protect, dashboardOnly);

router.use('/hotels', hotelRouter);
router.use('/rooms', roomRouter);

export default router;
