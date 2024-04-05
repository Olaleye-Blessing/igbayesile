import * as reviewController from '@/controllers/review';
import { protect } from '@/middlewares/auth';
import express from 'express';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.setReviewFilters, reviewController.getReviews)
  .post(protect, reviewController.createReview);

export default router;
