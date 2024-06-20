import { IRoom, IRoomDetail } from "@ui/interfaces/room";

export interface RoomFormData
  extends Omit<
    IRoom,
    | "images"
    | "_id"
    | "hotel"
    | "amenities"
    | "createdAt"
    | "ratings"
    | "totalReviews"
    | "updatedAt"
    | "hidden"
  > {
  images: File[];
  amenities: string[];
}

export type TNewFormProps = {
  type?: "new";
  room?: never;
};

export type TEditFormProps = {
  type?: "edit";
  room: IRoomDetail;
};
