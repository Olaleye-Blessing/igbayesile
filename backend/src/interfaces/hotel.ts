import { Types } from 'mongoose';

export interface IHotel {
  _id: Types.ObjectId;
  name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  location_description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  amenities: any[];
  images: string[];
  manager: Types.ObjectId;
  avgRoomPrice: number;
  totalRooms: number;
  ratings: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}
