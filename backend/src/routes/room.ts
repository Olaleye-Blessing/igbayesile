// hotels/:hotelId/rooms/:roomId
import express from 'express';

import * as roomController from '@/controllers/room';
import { protect, restrictTo } from '@/middlewares/auth';
import { upload } from '@/middlewares/multer';
import bookingRouter from './booking';
import reviewRouter from './review';

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
    upload.array('images', 5),
    roomController.createRoom,
  );

router.route('/:roomId').get(roomController.getRoom);

router.use(protect);

router
  .route('/:roomId')
  .patch(restrictTo('manager'), upload.none(), roomController.updateRoom)
  .delete(roomController.deleteRoom);

export default router;
