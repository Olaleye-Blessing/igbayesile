import { FilterQuery, Model } from 'mongoose';
import { IReview } from '@/interfaces/review';
import Hotel from '@/models/hotel';
import Review from '@/models/review';
import Room from '@/models/room';
import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';
import { filterObj } from '@/utils/filter-obj';
import * as factory from '@/controllers/factory';
import { RequestHandler } from 'express';
import Booking from '@/models/booking';

export const setReviewFilters: RequestHandler = (req, res, next) => {
  const qParams = { ...req.params };
  const filter: FilterQuery<IReview> = {};

  if (qParams.roomId) {
    filter.targetId = qParams.roomId;
    filter.type = 'room';

    delete qParams.roomId;
  } else if (qParams.hotelId) {
    filter.targetId = qParams.hotelId;
    filter.type = 'hotel';

    delete qParams.hotelId;
  }

  req.query = {
    ...req.query,
    ...filter,
  };

  next();
};

export const getReviews = factory.findAll(Review);

export const createReview = catchAsync(async (req, res, next) => {
  const reviewType = req.body.type;

  if (!reviewType)
    return next(
      new AppError(`Provide the type of this review: hotel or room`, 400),
    );

  if (reviewType !== 'hotel' && reviewType !== 'room')
    return next(new AppError(`Type can only be hotel or room`, 400));

  const targetId =
    req.body.targetId ||
    (reviewType === 'hotel' ? req.params.hotelId : req.params.roomId);

  if (!targetId)
    return next(
      new AppError(`Provide the ${reviewType} ID of this review`, 400),
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model: Model<any, any> = reviewType === 'hotel' ? Hotel : Room;
  let query = model.findById(targetId);

  if (reviewType === 'hotel') {
    query = query.select('_id manager');
  } else {
    query = query.populate({ path: 'hotel', select: 'manager' });
  }

  const result = await query;

  if (!result)
    return next(new AppError(`This ${reviewType} doesn't exist`, 400));

  const user = req.user!._id;

  const isOwner =
    reviewType === 'hotel'
      ? result.manager.toString() === user.toString()
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result.hotel as any).manager.toString() === user.toString();

  if (isOwner) {
    const message =
      reviewType === 'hotel'
        ? `You can't leave a review on personal hotels`
        : `You can't leave reviews on rooms of your hotel`;

    return next(new AppError(message, 400));
  }

  req.body.targetId = targetId;
  req.body.user = user;

  const body = filterObj<IReview>(req.body, [
    'content',
    'rating',
    'type',
    'targetId',
    'user',
    'booking',
  ]);

  const review = await Review.create(body);

  await Booking.findByIdAndUpdate(
    req.body.booking,
    { $push: { reviews: review._id } },
    { runValidators: false },
  );

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});
