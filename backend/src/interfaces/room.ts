import { Types } from 'mongoose';

export interface IHotel {
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
}
