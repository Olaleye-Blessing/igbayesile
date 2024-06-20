import { IAmenity } from "./amenity";
import { IBooking } from "./booking";
import { IHotel } from "./hotel";

export interface IRoom {
  _id: string;
  name: string;
  description: string;
  location_description: string;
  images: string[];
  numberOfBeds: number;
  price: number;
  maxNumOfGuests: number;
  numOfBathrooms: number;
  hotel: string;
  amenities: IAmenity[];
  country: string;
  state: string;
  city: string;
  ratings: number;
  totalReviews: number;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoomDetail extends Omit<IRoom, "hotel"> {
  // hotel: Pick<IHotel, "_id" | "name">;
  hotel: Pick<IHotel, "_id" | "manager">;
  bookings: Pick<IBooking, "checkIn" | "checkOut">[];
}
