import express from 'express';

import * as hotelController from '@/controllers/hotel';
import roomRouter from './room';
import { upload } from '@/middlewares/multer';
import { protect } from '@/controllers/auth';
import { restrictTo } from '@/middlewares/auth';

const router = express.Router();

router.use('/:hotelId/rooms', roomRouter);

router
  .route('/')
  .post(
    protect,
    restrictTo('manager'),
    upload.array('images', 5),
    hotelController.createHotel,
  );

router.route('/:id').get(hotelController.getHotel);

export default router;
