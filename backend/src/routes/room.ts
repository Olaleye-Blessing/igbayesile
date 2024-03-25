// hotels/:hotelId/rooms/:roomId
import express from 'express';

import * as roomController from '@/controllers/room';
import { protect } from '@/controllers/auth';
import { restrictTo } from '@/middlewares/auth';
import { upload } from '@/middlewares/multer';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(roomController.setRoomsFilter, roomController.getRooms)
  .post(
    protect,
    restrictTo('manager'),
    upload.array('images', 5),
    roomController.createRoom,
  );

export default router;
