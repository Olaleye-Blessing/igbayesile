import express from 'express';
import * as dashHotelController from '@/controllers/dashboard/hotel';
import dashRoomRouter from './room';

const router = express.Router();

router.use('/:hotelId/rooms', dashRoomRouter);

router.get('/', dashHotelController.setFilters, dashHotelController.getHotels);

export default router;
