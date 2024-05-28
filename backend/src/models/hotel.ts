import crypto from 'crypto';
import { IHotel } from '@/interfaces/hotel';
import AppError from '@/utils/AppError';
import mongoose, { Model, model, Schema } from 'mongoose';

interface IHotelMethods {}

interface HotelModel extends Model<IHotel, object, IHotelMethods> {
  setStaffInvitationToken(id: string): {
    invitationToken: string;
    staffInvitation: IHotel['staffInvitation'];
  };
}

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
    amenities: {
      type: [{ type: mongoose.Schema.ObjectId, ref: 'Amenity' }],
      validate: {
        validator: (amenities: string[]) => amenities.length >= 3,
        message: 'Provide at least 3 amenities',
      },
    },
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
    staff: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    staffInvitation: {
      token: {
        type: String,
        default: null,
      },
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null,
      },
      expires: {
        type: Date,
        default: null,
      },
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
    timestamps: true,
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

hotelSchema.static('setStaffInvitationToken', function (id: string) {
  const invitationToken = crypto.randomBytes(32).toString('hex');
  const token = crypto
    .createHash('sha256')
    .update(invitationToken)
    .digest('hex');
  const oneDay = 1000 * 60 * 60 * 24;

  return {
    invitationToken,
    staffInvitation: {
      token,
      id,
      expires: new Date(Date.now() + 7 * oneDay + 1000 * 5), // add extra 3 seconds
    },
  };
});

const Hotel = model<IHotel, HotelModel>('Hotel', hotelSchema);

export default Hotel;
