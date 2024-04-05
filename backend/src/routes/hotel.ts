import express from 'express';

import * as hotelController from '@/controllers/hotel';
import roomRouter from './room';
import reviewRouter from './review';
import { protect, restrictTo } from '@/middlewares/auth';
import { imgsUpload } from '@/middlewares/multer';

const router = express.Router();

router.use('/:hotelId/rooms', roomRouter);
router.use('/:hotelId/reviews', reviewRouter);

router
  .route('/')
  .get(hotelController.setHotelsFilter, hotelController.getHotels)
  .post(
    protect,
    restrictTo('manager'),
    imgsUpload.array('images', 5),
    hotelController.createHotel,
  );

router.route('/:id').get(hotelController.getHotel);

export default router;
