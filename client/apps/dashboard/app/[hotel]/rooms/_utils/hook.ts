import { useIGBInstance } from "@dashboard/hooks/use-igb-instance";
import { handleIgbayesileAPIError } from "@dashboard/utils/handle-igbayesile-api-error";
import { useMutation } from "@tanstack/react-query";
import { IRoom, IRoomDetail } from "@ui/interfaces/room";

type IUpdateRoomBody = Partial<Pick<IRoom, "hidden">>;
type IUpdatedRoom = Omit<IRoomDetail, "bookings">;

export const useRooms = () => {
  const { igbInstance } = useIGBInstance();

  const updateRoom = useMutation({
    mutationFn: async (payload: {
      room: IRoom;
      body: IUpdateRoomBody;
      path: string;
    }) => {
      try {
        const res = await igbInstance().patch<{ data: { room: IUpdatedRoom } }>(
          `/hotels/${payload.room.hotel}/rooms/${payload.room._id}/${payload.path}`,
          payload.body,
        );

        return res.data.data.room;
      } catch (error) {
        throw new Error(handleIgbayesileAPIError(error));
      }
    },
  });

  return { updateRoom };
};
