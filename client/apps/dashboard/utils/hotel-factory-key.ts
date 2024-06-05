export const HotelQueryKeys = {
  base: ["hotels"] as const,
  hotel: (hotel: string) => [...HotelQueryKeys.base, { hotel }],
};
