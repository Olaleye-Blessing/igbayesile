import express from 'express';
import * as dashboardController from '@/controllers/dashboard';

const router = express.Router();

router.get('/', dashboardController.setFilters, dashboardController.getHotels);

export default router;
