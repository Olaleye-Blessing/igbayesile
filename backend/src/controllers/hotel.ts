import { FilterQuery } from 'mongoose';
import { RequestHandler } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import catchAsync from '@/utils/catchAsync';
import Hotel from '@/models/hotel';
import AppError from '@/utils/AppError';
import { IHotel } from '@/interfaces/hotel';
import * as factory from '@/controllers/factory';
import { redisClient } from '@/databases/redis';
import User from '@/models/user';
import { sendEmail } from '@/utils/email';
import { envData } from '@/configs/env-data';
import { sleep } from '@/utils/sleep';

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

  const imagesFiles = req.files as Express.Multer.File[];

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

  const staffId = body.staff;

  delete body.staff;

  let invitationToken = '';

  if (staffId) {
    const invitationData = Hotel.setStaffInvitationToken(staffId)!;
    body.staffInvitation = invitationData.staffInvitation;
    invitationToken = invitationData.invitationToken;
  }

  const hotel = await Hotel.create(body);

  if (!staffId) {
    return res.status(201).json({
      status: 'success',
      data: { hotel },
    });
  }

  const staff = await User.findById(staffId).select('+email');

  if (!staff) {
    return res.status(201).json({
      status: 'success',
      data: {
        hotel,
        message: {
          status: 'failed',
          data: 'The staff you invited no longer exists! Go to the hotel edit page and inivite a new staff!',
        },
      },
    });
  }

  let inviteUrl = '';
  const invitePath = `/hotels/${hotel._id}/invitation?token=${invitationToken}`;

  if (envData.NODE_ENV === 'production') {
    inviteUrl = `${envData.FRONTEND_URL}${invitePath}`;
  } else {
    inviteUrl = `${req.protocol}:://${req.get('host')}${invitePath}`;
  }

  const managerName = req.user!.name;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseData: any = { hotel };

  if (envData.NODE_ENV === 'production') {
    const { error } = await sendEmail({
      type: 'noreply',
      to: [staff.email],
      subject: `[Igbayesile] ${managerName.replace(/\s/g, '_')} has invited you to manage the ${body.name} hotel`,
      html: `<div>
      <p>${managerName} has invited you to manage the ${body.name} hotel on Igbayesile. Head over to <a href="${inviteUrl}">${inviteUrl}</a> to check out the hotel.</p>
      <p>This invitation will expire in 7 days.</p>
    </div>`,
    });

    responseData.message = {
      status: error ? 'failed' : 'success',
      data: error
        ? 'Unable to send invitation request to your staff.  Go to the hotel edit page and re-inivite a the staff!'
        : 'Invitation has been sent your staff.',
    };
  } else if (envData.NODE_ENV === 'development') {
    responseData.message = {
      status: 'success',
      data: 'Invitation has been sent your staff.',
    };
    responseData.inviteUrl = inviteUrl;
  }

  if (envData.NODE_ENV === 'development') await sleep(1000);

  return res.status(201).json({
    status: 'success',
    data: responseData,
  });
});
