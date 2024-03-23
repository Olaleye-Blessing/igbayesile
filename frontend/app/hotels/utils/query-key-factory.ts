export const hotelsKeys = {
  base: ["hotels"],
  new: () => [...hotelsKeys.base],
  hotel: (hotel: string) => [...hotelsKeys.base, { hotel }],
};
