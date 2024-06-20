import { HotelQueryKeys } from "@dashboard/utils/hotel-factory-key";

export const RoomQueryKeys = {
  base: (hotel: string) => [...HotelQueryKeys.hotel(hotel), "rooms"],
  rooms: (hotel: string, searchParams = "") => {
    const key: any = [...RoomQueryKeys.base(hotel)];
    if (searchParams) key.push({ searchParams });

    return key;
  },
  room: ({ hotel, room }: { hotel: string; room: string }) => [
    ...RoomQueryKeys.rooms(hotel),
    { room },
  ],
};
