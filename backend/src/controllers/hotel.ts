import { v2 as cloudinary } from 'cloudinary';
import catchAsync from '@/utils/catchAsync';
import Hotel from '@/models/hotel';
import AppError from '@/utils/AppError';
import { IAuthUserReq } from '@/types/request';

export const getHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id)
    .populate('rooms')
    .populate('manager');

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
    manager: (req as IAuthUserReq).user._id,
  };

  const hotel = await Hotel.create(body);

  return res.status(201).json({
    status: 'success',
    data: { hotel },
  });
});
