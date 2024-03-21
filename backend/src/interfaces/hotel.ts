import { Types } from 'mongoose';

export interface IHotel {
  _id: Types.ObjectId;
  name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  location_description: string;
  amenities: string[];
  images: string[];
  manager: Types.ObjectId;
}
