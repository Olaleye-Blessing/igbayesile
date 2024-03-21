import { IHotel } from '@/interfaces/hotel';
import mongoose, { model, Schema } from 'mongoose';

const hotelSchema = new Schema<IHotel>({
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
    required: [true, "Provide a short description about your hotel's location"],
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
});

const Hotel = model('Hotel', hotelSchema);

export default Hotel;
