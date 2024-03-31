import { FilterQuery } from 'mongoose';
import { RequestHandler } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import catchAsync from '@/utils/catchAsync';
import Hotel from '@/models/hotel';
import AppError from '@/utils/AppError';
import { IHotel } from '@/interfaces/hotel';
import * as factory from '@/controllers/factory';

export const setHotelsFilter: RequestHandler = (req, _res, next) => {
  const qParams = { ...req.query };
  const filter: FilterQuery<IHotel> = {};

  if (qParams.name) filter.name = { $regex: qParams.name, $options: 'i' };

  if (qParams.amenities) {
    const regExp: RegExp[] = [];
    (qParams.amenities as string).split(',').forEach((amenity) => {
      regExp.push(new RegExp(amenity, 'i'));
    });

    filter.amenities = { $all: regExp };
    // filter.amenities = { $in: regExp };
  }

  req.query = { ...req.query, ...filter };

  req.query.igbayesile = {
    ...((req.query.igbayesile as object) || {}),
    filterNumKeys: ['avgRoomPrice', 'totalRooms', 'ratings', 'totalReviews'],
  };

  next();
};

export const getHotels = factory.findAll(Hotel);

export const getHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id).populate('manager');

  if (!hotel) return next(new AppError('This hotel does not exist', 404));

  return res.status(200).json({
    status: 'success',
    data: { hotel },
  });
});

export const createHotel = catchAsync(async (req, res, next) => {
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
        400,
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
