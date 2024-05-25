import { IBaseHotel } from '@/schemas/hotel';
import { Types } from 'mongoose';

export interface IHotel extends Omit<IBaseHotel, 'images' | 'amenities'> {
  _id: Types.ObjectId;
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
