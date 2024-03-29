import { IUser } from "./user";

export interface IReview {
  _id: string;
  content: string;
  rating: number;
  userId: Pick<IUser, "_id" | "name" | "role">;
  type: "hotel" | "room";
  targetId: string;
}
