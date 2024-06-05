import { IRoom } from "@ui/interfaces/room";

export type ITableRoom = Pick<
  IRoom,
  "_id" | "name" | "images" | "price" | "amenities"
>;
