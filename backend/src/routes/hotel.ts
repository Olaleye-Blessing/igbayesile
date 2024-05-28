import express from 'express';

import * as hotelController from '@/controllers/hotel';
import roomRouter from './room';
import reviewRouter from './review';
import { protect, restrictTo } from '@/middlewares/auth';
import { imgsUpload } from '@/middlewares/multer';
import { validateData } from '@/utils/validate-data';
import * as hotelSchema from '@/schemas/hotel';

const router = express.Router();

router.use('/:hotelId/rooms', roomRouter);
router.use('/:hotelId/reviews', reviewRouter);

router.get(
  '/top-rated',
  hotelController.getTopRated,
  hotelController.getHotels,
);

router
  .route('/')
  .get(hotelController.setHotelsFilter, hotelController.getHotels)
  .post(
    protect,
    restrictTo('manager'),
    imgsUpload.array('images', 5),
    (req, _, next) => {
      // This is needed to validate the images files in the hotel schema
      req.body.images = req.files;
      next();
    },
    validateData({ schema: hotelSchema.BaseSchema }),
    hotelController.createHotel,
  );

router.route('/:id').get(hotelController.getHotel);
// TODO: Decide if this route should be directed to the staffs route like so -> router.use("/:hotelId/staffs")
router.patch(
  '/:id/invitation/:token',
  protect,
  restrictTo('staff'),
  hotelController.assignStaff,
);

router.patch(
  '/:id/staff',
  protect,
  restrictTo('manager'),
  validateData({ schema: hotelSchema.changeStaffSchema }),
  hotelController.changeStaff,
);

router.delete(
  '/:id/staff',
  protect,
  restrictTo('manager'),
  hotelController.removeStaff,
);

export default router;
