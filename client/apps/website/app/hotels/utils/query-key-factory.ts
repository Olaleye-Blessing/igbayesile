export const hotelsKeys = {
  base: ["hotels"],
  new: () => [...hotelsKeys.base],
  hotel: (hotel: string) => [...hotelsKeys.base, { hotel }],
  rooms: (hotel: string) => [...hotelsKeys.hotel(hotel), "rooms"],
  room: ({ hotel, room }: { hotel: string; room: string }) => [
    ...hotelsKeys.hotel(hotel),
    "rooms",
    { room },
  ],
};
