export const RoomsQueryKey = {
  base: ["rooms"],
  room: (roomId: string) => [RoomsQueryKey.base, { roomId }],
};
