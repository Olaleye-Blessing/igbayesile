import { Handler, RequestHandler } from 'express';
import * as factory from '../factory';
import Room from '@/models/room';
import catchAsync from '@/utils/catchAsync';
import AppError from '@/utils/AppError';

export const setFilters: RequestHandler = async (req, res, next) => {
  req.query.hotel = req.params.hotelId;
  next();
};

export const getRooms = factory.findAll({
  model: Room,
});

export const updateRoomVisibility: Handler = async (req, res, next) => {
  const { hidden } = req.body;

  if (hidden === undefined)
    return next(new AppError('Provide hidden state', 400));

  req.body = { hidden };

  next();
};

export const updateRoom = catchAsync(async (req, res) => {
  const user = req.user!;

  const room = await Room.findByIdAndUpdate(req.params.roomId, req.body, {
    new: true,
  }).populate({
    path: 'hotel',
    match: {
      _id: req.params.hotelId,
      ...(user.role === 'staff' ? { staff: user._id } : { manager: user._id }),
    },
    select: '_id',
  });

  return res.status(200).json({ status: 'success', data: { room } });
});
