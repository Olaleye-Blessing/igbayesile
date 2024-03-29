import { IRoomDetail } from "./room";
import { IUser } from "./user";

export interface IHotel {
  name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  location_description: string;
  amenities: string[];
  images: string[];
  manager: string;
  _id: string;
  avgRoomPrice: number;
  totalRooms: number;
  ratings: number;
  totalReviews: number;
}

export interface IFullHotel extends Omit<IHotel, "manager"> {
  manager: Omit<IUser, "role"> & { role: "manager" };
  rooms: IRoomDetail[];
}
