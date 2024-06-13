import { RequestHandler } from 'express';
import { FilterQuery, Types } from 'mongoose';
import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';
import Room from '@/models/room';
import Hotel from '@/models/hotel';
import { IRoom } from '@/interfaces/room';
import * as factory from '@/controllers/factory';
import Booking from '@/models/booking';
import { filterObj } from '@/utils/filter-obj';
import { uploadCloudinaryAssest } from '@/utils/cloudinary';

export const setRoomsFilter: RequestHandler = (req, _res, next) => {
  const filter: FilterQuery<IRoom> = {};

  if (req.query.name) filter.name = { $regex: req.query.name, $options: 'i' };
  if (req.params.hotelId) req.query.hotel = req.params.hotelId;

  if (req.query.amenities) {
    filter.amenities = { $all: (req.query.amenities as string).split(',') };
    // filter.amenities = { $in: (req.query.amenities as string).split(',') };
  }

  req.query = { ...req.query, ...filter };

  req.query.igbayesile = {
    ...((req.query.igbayesile as object) || {}),
    filterNumKeys: [
      'numberOfBeds',
      'price',
      'maxNumOfGuests',
      'numOfBathrooms',
      'ratings',
    ],
  };

  next();
};

export const getRooms = factory.findAll({
  model: Room,
  populateOpts: [
    { path: 'hotel', select: 'name manager' },
    { path: 'bookings', select: 'checkIn checkOut' },
  ],
});

export const getCheapestRooms: RequestHandler = async (req, res, next) => {
  req.query.sort = '-price,-ratings,-reviews,createdAt';
  req.query.limit = '5';

  next();
};

export const getRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.roomId)
    .populate({
      path: 'bookings',
      select: 'checkIn checkOut',
    })
    .populate({
      path: 'hotel',
      select: 'manager',
    });

  if (!room) return next(new AppError('This room does not exist', 404));

  return res.status(200).json({
    status: 'success',
    data: { room },
  });
});

export const createRoom = catchAsync(async (req, res, next) => {
  if (req.body.amenities < 3)
    return next(new AppError('Provide at least 3 amenities', 400));

  const imagesFiles = req.files as Express.Multer.File[];

  // Checking here so as not to waste time uploading
  if (imagesFiles.length < 3)
    return next(new AppError('Provide at least 3 hotel pictures', 400));

  if (!req.body.hotel) req.body.hotel = req.params.hotelId;
  // Also check not to waste time uploading images
  if (!req.body.hotel)
    return next(new AppError('Provide the hotel this room belong to', 400));

  const hotel = await Hotel.findById(req.body.hotel);

  if (!hotel) return next(new AppError('This hotel does not exist.', 400));

  if (
    await Room.exists({
      name: req.body.name,
      hotel: req.body.hotel || req.params.hotelId,
    })
  )
    return next(new AppError('Duplicate room in the same hotel', 422));

  req.body.country = hotel.country;
  req.body.state = hotel.state;
  req.body.city = hotel.city;

  // TODO: Learn about possible errors that could happen from cloudinary
  const imagesUrls = imagesFiles.map((image) => {
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataURI = 'data:' + image.mimetype + ';base64,' + b64;
    return uploadCloudinaryAssest({
      uri: dataURI,
      options: {
        folder: 'hotels_images/room_images',
      },
    });
  });

  const results = await Promise.all(imagesUrls);

  req.body.images = results.map((img) => img.secure_url);

  const room = await Room.create(req.body);

  return res.status(201).json({
    status: 'success',
    data: {
      room,
    },
  });
});

export const updateRoom = catchAsync(async (req, res, next) => {
  const roomId = req.params.roomId;

  let room = await Room.findById(roomId)
    .populate({
      path: 'hotel',
      match: { manager: new Types.ObjectId(req.user!._id) },
      select: 'manager',
    })
    .populate({
      path: 'bookings',
      select: 'checkIn checkOut',
    });

  if (!room) return next(new AppError('This hotel does not exist', 404));

  const activeRoomBookings = await Booking.find({
    room: roomId,
    status: 'paid',
    checkOut: { $gt: new Date() },
  });

  if (activeRoomBookings.length)
    return next(
      new AppError(
        `Unable to Update Room: This room has existing paid bookings and cannot be updated at this time.`,
        422,
      ),
    );

  const body = filterObj({ ...req.body } as IRoom, [
    'name',
    'description',
    'location_description',
    'numberOfBeds',
    'price',
    'maxNumOfGuests',
    'numOfBathrooms',
    'amenities',
  ]);

  Object.keys(body).forEach((key) => {
    // @ts-expect-error correct
    room[key] = body[key];
  });

  room = await room.save({ validateBeforeSave: true });

  return res.status(200).json({
    status: 'success',
    data: { room },
  });
});

export const deleteRoom = catchAsync(async (req, res) => {
  await Room.findByIdAndDelete(req.params.roomId);

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
