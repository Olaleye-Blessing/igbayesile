import express from 'express';
import * as staffController from '@/controllers/staff';
import { protect, restrictTo } from '@/middlewares/auth';

const router = express.Router();

router.use(protect, restrictTo('manager'));

router.get('/', staffController.setStaffsFilter, staffController.getStaffs);

export default router;
