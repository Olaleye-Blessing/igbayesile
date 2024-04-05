import { Types } from 'mongoose';

export interface IBooking {
  _id: Types.ObjectId;
  status: 'pending' | 'paid';
  user: Types.ObjectId;
  room: Types.ObjectId;
  guests: number;
  paymentReference: string;
  paymentAccessCode?: string;
  paymentId?: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  reviews?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
