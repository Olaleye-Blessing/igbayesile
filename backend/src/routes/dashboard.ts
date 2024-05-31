import express from 'express';
import { protect } from '@/middlewares/auth';
import * as dashboardController from '@/controllers/dashboard';

const router = express.Router();

router.use(protect);

router.get(
  '/hotels',
  dashboardController.setFilters,
  dashboardController.getHotels,
);

export default router;
