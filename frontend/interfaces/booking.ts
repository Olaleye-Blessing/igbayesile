import { IRoomDetail } from "./room";

export interface IBooking {
  _id: string;
  status: "pending" | "paid";
  userId: string;
  roomId: string;
  // payment_reference: string
  // payment_id: string
  guests: number;
  checkIn: string;
  checkOut: string;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserBooking extends Omit<IBooking, "roomId"> {
  roomId: IRoomDetail;
  paymentReference: string;
  totalCost: number;
}
