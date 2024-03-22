import mongoose, { model, Schema } from 'mongoose';

const roomSchema = new Schema({
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
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'Please provide the hotel this room belongs to'],
  },
});

const Room = model('Room', roomSchema);

export default Room;
