import catchAsync from '@/utils/catchAsync';
import {
  IPayStackInitParams,
  IPayStackVerifySuccessRes,
} from '@/interfaces/paystack';
import AppError from '@/utils/AppError';
import Room from '@/models/room';
import { areIntervalsOverlapping, differenceInDays } from 'date-fns';
import Booking from '@/models/booking';
import { RequestHandler } from 'express';
import { FilterQuery } from 'mongoose';
import { IBooking } from '@/interfaces/booking';
import * as factory from './factory';
import { dateWithoutTimezone } from '@/utils/date-without-timezone';

export const setBookingsFilter: RequestHandler = (req, res, next) => {
  const filter: FilterQuery<IBooking> = {};
  filter.user = req.user!._id;
  filter.fields = '-paymentAccessCode,-paymentId';

  req.query = { ...req.query, ...filter };

  next();
};

export const getBookings = factory.findAll({
  model: Booking,
  populateOpts: [{ path: 'room', select: '-bookings' }, { path: 'reviews' }],
});

export const setPaymentParams = catchAsync(async (req, res, next) => {
  let { checkIn, checkOut } = req.body;
  if (!checkIn || !checkOut)
    return next(new AppError('Provide check in and check out dates', 400));

  checkIn = dateWithoutTimezone(new Date(checkIn));
  checkOut = dateWithoutTimezone(new Date(checkOut));

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const currentDate = dateWithoutTimezone(now);

  if (checkIn < currentDate || checkOut < currentDate)
    return next(new AppError("You can't select dates in the past", 422));

  // TODO: use zod to validate date
  const totalDays = differenceInDays(checkOut, checkIn);

  if (totalDays <= 0) return next(new AppError('Invalid stay days', 422));

  const roomId = req.params.roomId;

  if (!roomId) return next(new AppError('Provide the booking room', 400));

  const room = await Room.findById(roomId).populate({
    path: 'bookings',
    select: 'checkIn checkOut',
  });

  if (!room) return next(new AppError('Room not found', 422));

  if (
    datesisOverlapping({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bookings: (room as any).bookings as IBooking[],
      checkIn,
      checkOut,
    })
  )
    return next(
      new AppError(
        'Some of the dates are overlapping. Select another dates range',
        422,
      ),
    );

  const amount = room.price * Number(totalDays) * 100; // in kobo

  const payment: IPayStackInitParams = {
    amount,
    email: req.user!.email,
    callback_url:
      process.env.NODE_ENV === 'production'
        ? `${req.protocol}:://${req.get('host')}`
        : 'http://localhost:3000' + `/bookings/confirm?roomid=${roomId}`,
    metadata: {
      custom_fields: [
        {
          display_name: 'Room ID',
          variable_name: 'roomID',
          value: room.id,
        },
        {
          display_name: 'Room Price',
          variable_name: 'roomPrice',
          value: room.price,
        },
        {
          display_name: 'User ID',
          variable_name: 'userID',
          value: req.user!._id,
        },
      ],
    },
  };

  req.body = {
    ...req.body,
    checkIn,
    checkOut,
    room: roomId,
    totalCost: amount,
  };

  // TODO: Extend express req to have user and payment.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).payment = payment;

  next();
});

export const createBooking = catchAsync(async (req, res) => {
  // TODO: Extend express request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentInit = (req as any).payment_init;

  req.body = {
    ...req.body,
    status: 'pending',
    user: req.user!._id,
    room: req.params.roomId,
    paymentReference: paymentInit.reference,
    paymentAccessCode: paymentInit.access_code,
  };

  const booking = await Booking.create(req.body);

  return res.status(200).json({
    status: 'success',
    data: {
      booking,
      authorization_url: paymentInit.authorization_url,
    },
  });
});

export const confirmBookingPayment = catchAsync(async (req, res, next) => {
  // TODO: Extend express request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentVerification = (req as any)
    .payment_verification as IPayStackVerifySuccessRes;

  const user = req.user!._id;
  const room = req.params.roomId;
  const paymentReference = paymentVerification.data.reference;

  const filter = { user, room, paymentReference };
  const paymentStatus = paymentVerification.data.status;
  const update = {
    status: paymentStatus === 'success' ? 'paid' : paymentStatus,
    paymentId: paymentVerification.data.id,
  };

  const booking = await Booking.findOneAndUpdate(filter, update, {
    runValidators: false,
    new: true,
  });

  if (!booking) return next(new AppError('This booking does not exits', 404));

  booking.paymentAccessCode = undefined;
  booking.paymentId = undefined;

  return res.status(200).json({
    status: 'success',
    data: {
      booking,
      status:
        paymentStatus === 'success'
          ? 'Payment received'
          : `Payment status: ${paymentStatus}`,
    },
  });
});

export const continuePayment = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    user: req.user!._id,
  });

  if (!booking) return next(new AppError('This booking does not exist', 404));

  if (booking.status === 'paid')
    return next(new AppError('This booking has been paid for', 409));

  return res.status(200).json({
    status: 'success',
    data: {
      authorization_url: `https://checkout.paystack.com/${booking.paymentAccessCode}`,
    },
  });
});

function datesisOverlapping({
  bookings,
  checkIn,
  checkOut,
}: {
  bookings: IBooking[];
  checkIn: string | Date;
  checkOut: string | Date;
}) {
  const bookedDates =
    bookings.map((booking) => ({
      start: booking.checkIn,
      end: booking.checkOut,
    })) || [];

  if (bookedDates.length === 0) return false;

  const overlapped = bookedDates.some((date) =>
    areIntervalsOverlapping(
      { ...date },
      { start: checkIn, end: checkOut },
      { inclusive: true },
    ),
  );

  return overlapped;
}
