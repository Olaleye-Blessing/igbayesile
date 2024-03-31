import { Types } from 'mongoose';

export interface IBooking {
  _id: Types.ObjectId;
  status: 'pending' | 'paid';
  userId: Types.ObjectId;
  roomId: Types.ObjectId;
  guests: number;
  paymentReference: string;
  paymentAccessCode?: string;
  paymentId?: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}
