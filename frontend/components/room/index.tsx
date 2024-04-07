/* eslint-disable @next/next/no-img-element */
import { IRoomDetail } from "@/interfaces/room";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import AutoPlayImages from "../custom/carousel/auto-play-images";
import Link from "next/link";
import BookRoom from "../custom/book-room";
import Amenity from "@/components/amenities/amenity";

interface RoomProps {
  room: IRoomDetail;
  className?: string;
  hotelId: string;
}

export default function Room({ room, hotelId, className = "" }: RoomProps) {
  return (
    <div className={cn("cardboard p-3 flex flex-col", className)}>
      <header>
        <h3>{room.name}</h3>
        <p className="text-gray-500 max-h-40 overflow-auto mb-4">
          {room.description}
        </p>
      </header>
      <AutoPlayImages
        images={room.images}
        nextClassName="right-0"
        prevClassName="left-0"
      />
      <>
        {room.amenities.length === 0 ? (
          <p className="error mt-4">No Amenity</p>
        ) : (
          <ul className="amenities mt-4 grid gap-4 grid-cols-[repeat(auto-fill,minmax(8rem,_1fr))]">
            {room.amenities.map((amenity) => (
              <p key={amenity._id} className="flex items-center justify-start">
                <Amenity amenity={amenity} />
              </p>
            ))}
          </ul>
        )}
      </>
      <BookRoom room={room} />
      <Link
        href={`/rooms/room/?roomId=${room._id}&hotelId=${hotelId}`}
        className={buttonVariants({
          variant: "secondary",
          className: "w-full mt-2",
        })}
      >
        View Detail
      </Link>
    </div>
  );
}
