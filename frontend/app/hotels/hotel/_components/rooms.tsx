import Paginated from "@/components/paginated";
import { usePagination } from "@/components/paginated/use-pagination";
import Room from "@/components/room";
import { IRoomDetail } from "@/interfaces/room";
import { hotelsKeys } from "../../utils/query-key-factory";

interface RoomsProps {
  hotelId: string;
}

export default function Rooms({ hotelId }: RoomsProps) {
  const {
    result,
    loadMore,
    totalData: totalRooms,
  } = usePagination<IRoomDetail>({
    url: `/hotels/${hotelId}/rooms?limit=100`,
    options: {
      queryKey: hotelsKeys.rooms(hotelId),
      refetchOnMount: false,
    },
  });

  return (
    <>
      <Paginated loadMore={loadMore} result={result} data={totalRooms}>
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(22rem,_1fr))]">
          {totalRooms.map((room) => (
            <Room key={room._id} room={room} hotelId={hotelId} />
          ))}
        </ul>
      </Paginated>
    </>
  );
}
