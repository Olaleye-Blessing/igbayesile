import { IHotel } from '@/interfaces/hotel';
import AppError from '@/utils/AppError';
import mongoose, { model, Schema } from 'mongoose';

const hotelSchema = new Schema<IHotel>(
  {
    name: {
      type: String,
      required: [true, 'Provide your hotel name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Provide a short description for your hotel'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Provide the country your hotel is located at'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Provide the state your hotel is located at'],
      trim: true,
    },
    city: String,
    location_description: {
      type: String,
      required: [
        true,
        "Provide a short description about your hotel's location",
      ],
      trim: true,
    },
    amenities: [String],
    images: {
      type: [String],
      validate: {
        validator: function (images: string[]) {
          return images.length >= 3;
        },
        message: 'Provide at least 3 hotel pictures',
      },
    },
    manager: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    avgRoomPrice: {
      type: Number,
      default: 0,
      set: (val: number) => Math.round(val * 100) / 100,
    },
    totalRooms: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
      set: (val: number) => Math.round(val * 10) / 10,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

hotelSchema.index(
  { name: 1, country: 1, state: 1, city: 1, manager: 1 },
  { unique: true },
);

hotelSchema.virtual('rooms', {
  ref: 'Room',
  foreignField: 'hotel',
  localField: '_id',
});

// @ts-expect-error Unknow types
hotelSchema.post('save', function (error, doc, next) {
  // Duplicate is handled here so as to provide a better error message
  if (error.name === 'MongoServerError' && error.code === 11000) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values = error.keyValue as any;
    const msg =
      `Duplicate hotel name, ${values.name}, in the same location ${values.city}-${values.state}-${values.country}, by the same manager.`.replace(
        /\snull-/g,
        ' ',
      );
    return next(new AppError(msg, 400));
  }

  return next();
});

const Hotel = model('Hotel', hotelSchema);

export default Hotel;
