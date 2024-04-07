import { Types } from 'mongoose';

export interface IRoom {
  _id: Types.ObjectId;
  name: string;
  description: string;
  location_description: string;
  images: string[];
  numberOfBeds: number;
  price: number;
  maxNumOfGuests: number;
  numOfBathrooms: number;
  hotel: Types.ObjectId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  amenities: any[];
  country: string;
  state: string;
  city: string;
  ratings: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}
