import { RequestHandler } from 'express';
import * as factory from './factory';
import User from '@/models/user';
import { sleep } from '@/utils/sleep';
import { envData } from '@/configs/env-data';

export const setStaffsFilter: RequestHandler = async (req, _res, next) => {
  const name = req.query.name;
  req.query = { role: 'staff' };

  if (name) req.query = { ...req.query, name: { $regex: name, $options: 'i' } };

  if (envData.NODE_ENV === 'development') await sleep(1_500);

  next();
};

export const getStaffs = factory.findAll({ model: User });
