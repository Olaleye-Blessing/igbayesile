import { IReview } from "./review";
import { IRoomDetail } from "./room";

export interface IBooking {
  _id: string;
  status: "pending" | "paid";
  user: string;
  room: string;
  // payment_reference: string
  // payment_id: string
  guests: number;
  checkIn: string;
  checkOut: string;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserBooking extends Omit<IBooking, "room"> {
  room: Omit<IRoomDetail, "hotel"> & { hotel: string };
  paymentReference: string;
  totalCost: number;
  reviews: IReview[];
}
