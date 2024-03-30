import { IRoom } from '@/interfaces/room';
import mongoose, { Model, model, Schema } from 'mongoose';
import Hotel from './hotel';

interface RoomModel extends Model<IRoom, object> {
  calcAvgHotelRoomsPrice(hotelId: string): void;
}

const roomSchema = new Schema<IRoom>(
  {
    name: {
      type: String,
      required: [true, 'Provide your room name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Provide a short description for your room'],
      trim: true,
    },
    location_description: {
      type: String,
      required: [true, 'Provide a description of your room'],
      trim: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (images: string[]) {
          return images.length >= 3;
        },
        message: 'Provide at least 3 room pictures',
      },
    },
    numberOfBeds: {
      type: Number,
      required: [true, 'Provide the number of beds this room has'],
      validate: {
        validator: (num: number) => num > 0,
        message: 'Room must have at least 1 bed',
      },
    },
    price: {
      type: Number,
      required: [true, 'Provide room cost'],
      validate: {
        validator: (num: number) => num > 0,
        message: 'Provide the cost of this room',
      },
    },
    maxNumOfGuests: {
      type: Number,
      required: [
        true,
        'Provide the maximum number of people that can sleep in this room',
      ],
      validate: {
        validator: (num: number) => num > 0,
        message:
          'Provide the maximum number of people that can sleep in this room',
      },
    },
    numOfBathrooms: {
      type: Number,
      default: 1,
      validate: {
        validator: (num: number) => num > 0,
        message: 'Your room must have a bathroom.',
      },
    },
    amenities: [String],
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hotel',
      required: [true, 'Please provide the hotel this room belongs to'],
    },
    // This is derived from the parent hotel.
    country: String,
    state: String,
    city: String,
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

roomSchema.virtual('bookings', {
  ref: 'Booking',
  foreignField: 'roomId',
  localField: '_id',
});

roomSchema.pre(/^find/, function (next) {
  // @ts-expect-error This is correct
  this.populate({
    path: 'hotel',
    select: 'name manager',
    // populate: {
    //   path: ""
    // }
  });

  next();
});

// roomSchema.pre('findOne', function (next) {
//   this.populate({
//     path: 'bookings',
//     select: 'checkIn checkOut',
//   });

//   next();
// });

roomSchema.pre(/^find/, function (next) {
  // @ts-expect-error This is correct
  this.populate({
    path: 'bookings',
    select: 'checkIn checkOut',
  });

  next();
});

roomSchema.static('calcAvgHotelRoomsPrice', async function (hotelId: string) {
  let [stat] = await this.aggregate([
    { $match: { hotel: hotelId } },
    {
      $group: {
        _id: '$hotel',
        avgRoomPrice: { $avg: '$price' },
        totalRooms: { $sum: 1 },
      },
    },
  ]);

  // This happens when all rooms are deleted
  if (!stat) {
    stat = {
      avgRoomPrice: 0,
      totalRooms: 0,
    };
  }

  await Hotel.findByIdAndUpdate(hotelId, stat);
});

roomSchema.post('save', function () {
  // @ts-expect-error Valid
  this.constructor.calcAvgHotelRoomsPrice(this.hotel);
});

// findOneAndUpdate
// findOneAndDelete
roomSchema.pre(/^findOneAnd/, async function (next) {
  // this._update is the list of fields that wants to get updated
  // @ts-expect-error Valid
  const updates = this._update;
  if (!Object.keys(updates).includes('price')) return next();

  // @ts-expect-error Valid
  const roomToUpdate = await this.model.findOne(this.getQuery());

  // @ts-expect-error Valid
  this.roomToUpdate = roomToUpdate;

  next();
});

roomSchema.post(/^findOneAnd/, function () {
  // @ts-expect-error Valid
  const { roomToUpdate } = this;

  if (!Boolean(roomToUpdate)) return;

  roomToUpdate.constructor.calcAvgHotelRoomsPrice(roomToUpdate.hotel._id);
});

const Room = model<IRoom, RoomModel>('Room', roomSchema);

export default Room;
