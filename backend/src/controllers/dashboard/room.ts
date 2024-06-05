import { RequestHandler } from 'express';
import * as factory from '../factory';
import Room from '@/models/room';

export const setFilters: RequestHandler = async (req, res, next) => {
  req.query.hotel = req.params.hotelId;
  next();
};

export const getRooms = factory.findAll({
  model: Room,
});
