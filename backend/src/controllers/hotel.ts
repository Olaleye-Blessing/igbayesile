import { FilterQuery } from 'mongoose';
import { RequestHandler } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import catchAsync from '@/utils/catchAsync';
import Hotel from '@/models/hotel';
import AppError from '@/utils/AppError';
import { IHotel } from '@/interfaces/hotel';
import * as factory from '@/controllers/factory';
import { redisClient } from '@/databases/redis';

export const setHotelsFilter: RequestHandler = (req, _res, next) => {
  const qParams = { ...req.query };
  const filter: FilterQuery<IHotel> = {};

  if (qParams.name) filter.name = { $regex: qParams.name, $options: 'i' };

  if (qParams.amenities) {
    filter.amenities = { $all: (qParams.amenities as string).split(',') };
    // filter.amenities = { $in: (qParams.amenities as string).split(',') };
  }

  req.query = { ...req.query, ...filter };

  req.query.igbayesile = {
    ...((req.query.igbayesile as object) || {}),
    filterNumKeys: ['avgRoomPrice', 'totalRooms', 'ratings', 'totalReviews'],
  };

  next();
};

export const getHotels = factory.findAll({
  model: Hotel,
  populateOpts: [{ path: 'amenities' }],
});

export const getTopRated: RequestHandler = async (req, res, next) => {
  req.query.sort = '-ratings,-totalReviews,createdAt';
  req.query.limit = '1';

  req.factory = {
    ...req.factory,
    cache: {
      maxAge: 1 * 60 * 60,
      // TODO: Make use of s-max-age when you learn about proxy
      directives: ['public', 'must-revalidate'],
    },
  };

  next();
};

export const getHotel = catchAsync(async (req, res, next) => {
  let hotel: string | null | IHotel = await redisClient.get(
    `hotel:${req.params.id}`,
  );

  if (hotel)
    return res.status(200).json({
      and: 'a',
      status: 'success',
      data: { hotel: JSON.parse(hotel) },
    });

  hotel = await Hotel.findById(req.params.id)
    .populate('manager')
    .populate('amenities');

  if (!hotel) return next(new AppError('This hotel does not exist', 404));

  await redisClient.set(`hotel:${req.params.id}`, JSON.stringify(hotel));

  return res.status(200).json({
    status: 'success',
    data: { hotel },
  });
});

export const createHotel = catchAsync(async (req, res, next) => {
  if (req.body.amenities < 3)
    return next(new AppError('Provide at least 3 amenities', 400));

  const imagesFiles = req.files as Express.Multer.File[];

  // Checking here so as not to waste time uploading
  if (imagesFiles.length < 3)
    return next(new AppError('Provide at least 3 hotel pictures', 400));

  if (
    await Hotel.exists({
      name: req.body.name,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      manager: req.body.manager,
    })
  )
    return next(
      new AppError(
        `Duplicate hotel name, ${req.body.name}, in the same location ${req.body.city}-${req.body.state}-${req.body.country}, by the same manager.`,
        422,
      ),
    );

  // TODO: Learn about possible errors that could happen from cloudinary
  const imagesUrls = imagesFiles.map((image) => {
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataURI = 'data:' + image.mimetype + ';base64,' + b64;
    return cloudinary.uploader.upload(dataURI, {
      folder: 'hotels_images',
    });
  });

  const results = await Promise.all(imagesUrls);

  const body = {
    ...req.body,
    images: results.map((img) => img.secure_url),
    manager: req.user!._id,
  };

  const hotel = await Hotel.create(body);

  return res.status(201).json({
    status: 'success',
    data: { hotel },
  });
});
