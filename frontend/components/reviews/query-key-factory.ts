type Type = "hotel" | "room";

export const reviewsKeys = {
  base: (type: Type) => ["reviews", `${type}s`],
  // lists: (type: Type, page: number, id: string) => [
  //   ...reviewsKeys.base(type),
  //   { list: type, page, id },
  // ],
  // hotel: (page: number, id: string) => reviewsKeys.lists("hotel", page, id),
  // room: (page: number, id: string) => reviewsKeys.lists("room", page, id),
  lists: (type: Type, id: string) => [
    ...reviewsKeys.base(type),
    { list: type, id },
  ],
  hotel: (id: string) => reviewsKeys.lists("hotel", id),
  room: (id: string) => reviewsKeys.lists("room", id),
};
