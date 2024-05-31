import Hotel from '@/models/hotel';
import { RequestHandler } from 'express';
import { findAll } from '../factory';

export const setFilters: RequestHandler = async (req, res, next) => {
  const user = req.user!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = user._id as any;
  if (user.role === 'staff') {
    req.query.staff = userId;
  } else {
    req.query.manager = userId;
  }

  next();
};

export const getHotels = findAll({
  model: Hotel,
  populateOpts: [{ path: 'manager' }, { path: 'staff' }],
});
