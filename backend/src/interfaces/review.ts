import { Types } from 'mongoose';

export interface IReview {
  _id: Types.ObjectId;
  content: string;
  rating: number;
  userId: Types.ObjectId;
  type: 'hotel' | 'room';
  targetId: string;
}
