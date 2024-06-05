import express from 'express';
import * as dashRoomController from '@/controllers/dashboard/room';

const router = express.Router({ mergeParams: true });

router.get('/', dashRoomController.setFilters, dashRoomController.getRooms);

export default router;
