import { Types } from 'mongoose';
import { IRoom } from './room';

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
  rooms?: IRoom[];
  avgRoomPrice: number;
  totalRooms: number;
  ratings: number;
  totalReviews: number;
}
