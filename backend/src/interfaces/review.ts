import { Types } from 'mongoose';

export interface IReview {
  _id: Types.ObjectId;
  content: string;
  rating: number;
  user: Types.ObjectId;
  type: 'hotel' | 'room';
  targetId: string;
  createdAt: Date;
  updatedAt: Date;
  booking?: Types.ObjectId;
}
