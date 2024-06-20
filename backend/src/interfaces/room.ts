import { IBaseRoom } from '@/schemas/room';
import { Types } from 'mongoose';

export interface IRoom extends Omit<IBaseRoom, 'images' | 'amenities' | 'hotel'> {
  _id: Types.ObjectId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  amenities: any[];
  images: string[];
  hotel: Types.ObjectId;
  country: string;
  state: string;
  city: string;
  ratings: number;
  totalReviews: number;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}
