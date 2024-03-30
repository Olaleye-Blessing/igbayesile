import Loading from "@/app/loading";
import Room from "@/components/room";
import { useIGBQuery } from "@/hooks/use-igb-query";
import { TPaginatedFetch } from "@/interfaces/fetch";
import { IRoomDetail } from "@/interfaces/room";

interface RoomsProps {
  hotelId: string;
}

export default function Rooms({ hotelId }: RoomsProps) {
  const { data, error } = useIGBQuery<
    TPaginatedFetch<{ rooms: IRoomDetail[] }>
  >({
    // TODO: Update this limit when there is a hook for pagination
    url: `/hotels/${hotelId}/rooms?limit=100`,
    options: {
      queryKey: ["hotels", { hotel: hotelId }, "rooms"],
    },
  });

  return (
    <>
      {data ? (
        <>
          {data.rooms.length === 0 ? (
            <p>No rooms yet</p>
          ) : (
            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(22rem,_1fr))]">
              {data.rooms.map((room) => (
                <Room key={room._id} room={room} hotelId={hotelId} />
              ))}
            </ul>
          )}
        </>
      ) : error ? (
        <p className="error">{error.message}</p>
      ) : (
        <Loading />
      )}
    </>
  );
}
