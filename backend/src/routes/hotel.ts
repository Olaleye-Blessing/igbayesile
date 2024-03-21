import express from 'express';

import * as hotelController from '@/controllers/hotel';
import { upload } from '@/middlewares/multer';
import { protect } from '@/controllers/auth';
import { restrictTo } from '@/middlewares/auth';

const router = express.Router();

router
  .route('/')
  .post(
    protect,
    restrictTo('manager'),
    upload.array('images', 5),
    hotelController.createHotel,
  );

export default router;
