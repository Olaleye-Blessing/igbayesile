import { v2 as cloudinary } from 'cloudinary';
import AppError from '@/utils/AppError';
import catchAsync from '@/utils/catchAsync';
import Room from '@/models/room';
import Hotel from '@/models/hotel';

export const createRoom = catchAsync(async (req, res, next) => {
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
    return next(new AppError('Duplicate room in the same hotel', 400));

  req.body.country = hotel.country;
  req.body.state = hotel.state;
  req.body.city = hotel.city;

  // TODO: Learn about possible errors that could happen from cloudinary
  const imagesUrls = imagesFiles.map((image) => {
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataURI = 'data:' + image.mimetype + ';base64,' + b64;
    return cloudinary.uploader.upload(dataURI, {
      folder: 'hotels_images/room_images',
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
