/* eslint-disable @next/next/no-img-element */
import { useIGBQuery } from "@/hooks/use-igb-query";
import Loading from "@/app/loading";
import { IFullHotel } from "@/interfaces/hotel";
import { hotelsKeys } from "../../utils/query-key-factory";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Room from "@/components/room";
import AmentiyWithIcon from "@/components/amentiy-with-icon";

interface MainProps {
  hotelId: string;
}

export default function Main({ hotelId }: MainProps) {
  const { data, error } = useIGBQuery<{ hotel: IFullHotel }>({
    url: `/hotels/${hotelId}`,
    options: {
      queryKey: hotelsKeys.hotel(hotelId),
    },
  });

  return (
    <>
      {data?.hotel ? (
        <>
          <header className="pt-4">
            <h1 className="mb-2">{data.hotel.name}</h1>
          </header>
          <section className="space-y-2">
            <figure className="flex items-center justify-center max-h-[30rem] overflow-hidden rounded-md">
              <img
                src={data.hotel.images[0]}
                className="w-full h-full rounded-md"
                alt={``}
                loading="eager"
              />
            </figure>
            <p className="flex items-center justify-start">
              <span>
                <MapPin className="text-blue-700 w-8 h-8" />
              </span>
              <span className="font-bold">
                {`${data.hotel.city || "-"}, ${data.hotel.state}, ${data.hotel.country}`.replace(
                  /^-,/,
                  "",
                )}
              </span>
            </p>
            <div>
              <p className="font-bold">Location Description</p>
              <p>{data.hotel.location_description}</p>
            </div>
            <div>
              <p className="font-bold">Hotel Description</p>
              <p>{data.hotel.description}</p>
            </div>
          </section>
          <section className="mt-4">
            <h3 className="font-bold text-base">Amenities</h3>
            {data.hotel.amenities.length === 0 ? (
              <p>No Amenity</p>
            ) : (
              <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {data.hotel.amenities.map((amenity) => (
                  <AmentiyWithIcon key={amenity} amenity={amenity} />
                ))}
              </ul>
            )}
          </section>
          <section className="mt-3">
            <h3 className="text-base">Owner</h3>
            <div className="flex items-center justify-start">
              <Avatar className="mr-2">
                {/* TODO: Replace this with the manager avatar */}
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {data.hotel.manager.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p>{data.hotel.manager.name}</p>
                {/* TODO: Enable managers to add bio */}
                <p>No bio yet</p>
              </div>
            </div>
          </section>
          <section className="mt-3">
            <h3 className="text-base mb-2">Hotel Images</h3>
            <ul className="sm:grid sm:gap-4 sm:grid-cols-[repeat(auto-fill,minmax(18.75rem,_1fr))]">
              {data.hotel.images.map((img) => (
                <li
                  key={img}
                  className="w-full mb-3 rounded-md overflow-hidden sm:mb-0 sm:max-w-[25rem]"
                >
                  <figure>
                    <img src={img} alt="" />
                  </figure>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-base mt-4">Rooms</h3>
            {data.hotel.rooms.length > 0 && (
              <p className="mb-2">
                These are the rooms available in this hotel
              </p>
            )}
            {data.hotel.rooms.length === 0 ? (
              <p>No rooms yet</p>
            ) : (
              <ul className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(22rem,_1fr))]">
                {data.hotel.rooms.map((room) => (
                  <Room key={room._id} room={room} />
                ))}
              </ul>
            )}
          </section>
        </>
      ) : error ? (
        <p className="error">{error.message}</p>
      ) : (
        <Loading />
      )}
    </>
  );
}
