// hotels/:hotelId/rooms/:roomId
import express from 'express';

import * as roomController from '@/controllers/room';
import { protect } from '@/controllers/auth';
import { restrictTo } from '@/middlewares/auth';
import { upload } from '@/middlewares/multer';
import bookingRouter from './booking';
import reviewRouter from './review';

const router = express.Router({ mergeParams: true });

router.use('/:roomId/bookings', bookingRouter);
router.use('/:roomId/reviews', reviewRouter);

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
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

export default router;
