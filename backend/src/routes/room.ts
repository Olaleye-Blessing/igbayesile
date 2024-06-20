// hotels/:hotelId/rooms/:roomId
import express from 'express';

import * as roomController from '@/controllers/room';
import { protect, restrictTo } from '@/middlewares/auth';
import { imgsUpload } from '@/middlewares/multer';
import { upload } from '@/middlewares/multer';
import bookingRouter from './booking';
import reviewRouter from './review';
import { validateData } from '@/utils/validate-data';
import * as roomSchema from '@/schemas/room';

const router = express.Router({ mergeParams: true });

router.use('/:roomId/bookings', bookingRouter);
router.use('/:roomId/reviews', reviewRouter);

router.get(
  '/best-deal',
  roomController.getCheapestRooms,
  roomController.getRooms,
);

router
  .route('/')
  .get(roomController.setRoomsFilter, roomController.getRooms)
  .post(
    protect,
    restrictTo('manager'),
    imgsUpload.array('images', 5),
    (req, _, next) => {
      // This is needed to validate the data in the hotel schema
      req.body.images = req.files;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!req.body.hotel) req.body.hotel = (req.params as any).hotelId;

      next();
    },
    validateData({ schema: roomSchema.BaseSchema }),
    roomController.createRoom,
  );

router.route('/:roomId').get(roomController.getRoom);

router.use(protect);

router
  .route('/:roomId')
  .patch(restrictTo('manager'), upload.none(), roomController.updateRoom)
  .delete(roomController.deleteRoom);

export default router;
