import { HotelQueryKeys } from "@dashboard/utils/hotel-factory-key";

export const RoomQueryKeys = {
  base: (hotel: string) => [...HotelQueryKeys.hotel(hotel), "rooms"],
  rooms: (hotel: string, searchParams = "") => {
    if (searchParams)
      return [...RoomQueryKeys.base(hotel), "rooms", { searchParams }];

    return [...RoomQueryKeys.base(hotel), "rooms"];
  },
  room: ({ hotel, room }: { hotel: string; room: string }) => [
    ...RoomQueryKeys.rooms(hotel),
    { room },
  ],
};
