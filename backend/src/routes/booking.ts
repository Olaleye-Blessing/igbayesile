import { protect } from '@/controllers/auth';
import * as bookingController from '@/controllers/booking';
import { initializePayStack, verifyPayment } from '@/controllers/payment';
import express from 'express';

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .post(
    bookingController.setPaymentParams,
    initializePayStack,
    bookingController.createBooking,
  );

router.post(
  '/verify-payment',
  verifyPayment,
  bookingController.confirmBookingPayment,
);

export default router;
