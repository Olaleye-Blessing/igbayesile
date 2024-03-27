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
}
