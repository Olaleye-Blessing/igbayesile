import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelsKeys } from "@website/app/hotels/utils/query-key-factory";
import { API_BASE_URL } from "@website/constants/backend";
import { useIGBInstance } from "@website/hooks/use-igb-instance";
import { IRoom } from "@ui/interfaces/room";
import { RoomsQueryKey } from "@website/app/hotels/[hotel]/rooms/[room]/_utils/query-key-factory";

export const useRoomForm = () => {
  const queryClient = useQueryClient();

  const { igbInstance } = useIGBInstance();

  const createOrEditRoom = useMutation({
    mutationFn: async ({
      data,
      type,
      roomId,
    }: {
      data: FormData;
      hotelId: string;
      type: "new" | "edit";
      roomId?: string;
    }) => {
      try {
        let url = `${API_BASE_URL}/rooms`;
        if (type === "edit") url += `/${roomId}`;

        let result = await igbInstance()[type === "new" ? "post" : "patch"]<{
          data: { room: IRoom };
        }>(url, data, { withCredentials: true });

        return result.data.data.room;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (room, variables) => {
      if (variables.type === "edit") {
        queryClient.setQueryData(RoomsQueryKey.room(variables.roomId!), {
          room,
        });
        queryClient.invalidateQueries({
          queryKey: hotelsKeys.rooms(variables.hotelId),
        });
      }
    },
  });

  return { createOrEditRoom };
};
