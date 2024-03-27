import { useIGBQuery } from "@/hooks/use-igb-query";
import { RoomsQueryKey } from "../_utils/query-key-factory";
import { IRoomDetail } from "@/interfaces/room";
import Loading from "@/app/loading";
import AutoPlayImages from "@/components/custom/carousel/auto-play-images";
import { MapPin } from "lucide-react";
import AmentiyWithIcon from "@/components/amentiy-with-icon";
import BookRoom from "@/components/custom/book-room";
import "./index.css";

interface MainProps {
  roomId: string;
}

export default function Main({ roomId }: MainProps) {
  const { data, error } = useIGBQuery<{ room: IRoomDetail }>({
    url: `/rooms/${roomId}`,
    options: {
      queryKey: RoomsQueryKey.room(roomId),
    },
  });

  return (
    <>
      {data ? (
        <div className="room mb-8 pt-4 lg:flex lg:items-start lg:justify-between">
          <div className="">
            <header className="">
              <h1 className="mb-2">{data.room.name}</h1>
            </header>
            <section className="space-y-2">
              <AutoPlayImages
                images={data.room.images}
                nextClassName="right-0 xl:-right-12"
                prevClassName="left-0 xl:-left-12"
                className="max-w-[97%] mx-auto"
              />
              <p className="flex items-center justify-start">
                <span>
                  <MapPin className="text-blue-700 w-8 h-8" />
                </span>
                <span className="font-bold">
                  {`${data.room.city || "-"}, ${data.room.state}, ${data.room.country}`.replace(
                    /^-,/,
                    "",
                  )}
                </span>
              </p>
              <div>
                <p className="font-bold">Location Description</p>
                <p>{data.room.location_description}</p>
              </div>
              <div>
                <p className="font-bold">Room Description</p>
                <p>{data.room.description}</p>
              </div>
            </section>
            <section className="mt-4">
              <h3 className="font-bold text-base">Amenities</h3>
              {data.room.amenities.length === 0 ? (
                <p>No Amenity</p>
              ) : (
                <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                  {data.room.amenities.map((amenity) => (
                    <AmentiyWithIcon key={amenity} amenity={amenity} />
                  ))}
                </ul>
              )}
            </section>
            <section className="mt-4 w-full lg:hidden">
              <header className="">
                <h2 className="">Book this room</h2>
              </header>
              <div className="room_book">
                <BookRoom room={data.room} />
              </div>
            </section>
            <section className="mt-4">
              <header>
                <h2>Reviews</h2>
              </header>
              <p>Coming soon....</p>
            </section>
          </div>
          <section className="cardboard hidden p-4 lg:block lg:sticky lg:top-4 lg:right-4 lg:max-w-80 lg:flex-shrink-0">
            <header>
              <h2>Book this room</h2>
            </header>
            <BookRoom room={data.room} />
          </section>
        </div>
      ) : error ? (
        <p className="error">{error.message}</p>
      ) : (
        <Loading />
      )}
    </>
  );
}
