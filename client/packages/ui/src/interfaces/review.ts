import { IUser } from "./user";

export interface IReview {
  _id: string;
  content: string;
  rating: number;
  user: Pick<IUser, "_id" | "name" | "role" | "avatar">;
  type: "hotel" | "room";
  targetId: string;
  createdAt: Date;
  updatedAt: Date;
}
