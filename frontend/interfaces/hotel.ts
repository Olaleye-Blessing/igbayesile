import { IAmenity } from "./amenity";
import { IUser } from "./user";

export interface IHotel {
  name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  location_description: string;
  amenities: IAmenity[];
  images: string[];
  manager: string;
  staff?: string;
  _id: string;
  avgRoomPrice: number;
  totalRooms: number;
  ratings: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFullHotel extends Omit<IHotel, "manager"> {
  manager: Omit<IUser, "role"> & { role: "manager" };
}
