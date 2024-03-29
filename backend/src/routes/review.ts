import { protect } from '@/controllers/auth';
import * as reviewController from '@/controllers/review';
import express from 'express';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.setReviewFilters, reviewController.getReviews)
  .post(protect, reviewController.createReview);

export default router;
