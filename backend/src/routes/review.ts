import { protect } from '@/controllers/auth';
import * as reviewController from '@/controllers/review';
import express from 'express';

const router = express.Router({ mergeParams: true });

router.route('/').post(protect, reviewController.createReview);

export default router;
