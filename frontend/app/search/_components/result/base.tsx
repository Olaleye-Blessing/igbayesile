/* eslint-disable @next/next/no-img-element */
import { IHotel } from "@/interfaces/hotel";
import { IRoom } from "@/interfaces/room";
import { Star } from "lucide-react";
import React from "react";
import Location from "./location";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import useSearchParameters from "@/hooks/use-search-parameters";

interface IHotelResult {
  type: "hotels";
  data: IHotel;
}

interface IRoomResult {
  type: "rooms";
  data: IRoom;
}

type BaseProps = IHotelResult | IRoomResult;

export default function Base({ type, data }: BaseProps) {
  const searchParams = useSearchParameters();
  const updateLocation = ({ type, value }: { type: string; value: string }) => {
    let options: { [key: string]: string } = { country: data.country };

    if (type === "state") {
      options.state = value;
    } else if (type === "city") {
      options.state = data.state;
      options.city = value;
    }

    searchParams.updateParams(options, "push");
  };

  const itemPageHref =
    type === "hotels"
      ? `/hotels/${data._id}`
      : `/hotels/${(data.hotel as any)._id}/rooms/${data._id}`;

  return (
    <li
      className="cardboard px-3 py-4 mb-4 last:mb-0 lg:flex lg:items-start lg:justify-between"
      style={{ overflowAnchor: "none" }}
    >
      <div className="w-full sm:flex sm:items-start sm:justify-start lg:flex-1 lg:mr-2">
        <figure className="flex items-center justify-center overflow-hidden rounded-md sm:max-w-72 sm:mr-1 md:mr-2 xl:mr-4">
          <img alt="" src={data.images[0]} className="" />
        </figure>
        <div className="flex-1 w-full">
          <h3 className="flex items-start justify-start flex-col">
            <span className="flex items-center justify-start">
              <>{data.name}</>
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Star key={index} className="w-3 h-3 fill-yellow-400" />
                ))}
              </>
            </span>
            <span className="text-sm text-gray-500 -mt-1 font-normal">
              {type === "rooms" ? (
                <>Hotel name</>
              ) : (
                <>
                  {data.totalRooms} {data.totalRooms === 1 ? "room" : "rooms"}
                </>
              )}
            </span>
          </h3>
          <div className="flex items-center justify-start flex-wrap w-full">
            {data.city && (
              <Location
                updateLocation={updateLocation}
                type="city"
                text={data.city}
              />
            )}
            {data.state && (
              <Location
                updateLocation={updateLocation}
                type="state"
                text={data.state}
              />
            )}
            {data.country && (
              <Location
                updateLocation={updateLocation}
                type="country"
                text={data.country}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center flex-wrap [&>*]:mb-2 mt-2 lg:flex-col lg:items-end lg:max-w-40 lg:mt-0 lg:self-stretch">
        <div className="flex items-center justify-start mr-1">
          <div className="text-right mr-1">
            <p className="text-sm">Good</p>
            <p className="text-xs -mt-1">
              <span>{data.totalReviews}</span>
              <span className=""> reviews</span>
            </p>
          </div>
          <p className="w-8 h-8 rounded-full flex items-center justify-center text-center font-bold bg-primary text-sm text-white">
            {data.ratings}
          </p>
        </div>
        <p className="mr-1">
          {type === "rooms" ? (
            <>
              <span className="font-bold text-lg">${data.price}</span>
              <span>/</span>
              <span className="text-sm text-gray-500">24hrs</span>
            </>
          ) : (
            <>
              <span>Avg: </span>
              <span className="font-bold text-lg">${data.avgRoomPrice}</span>
            </>
          )}
        </p>
        {type === "rooms" && (
          <div className="flex items-center justify-start flex-wrap [&>*]:mr-2 lg:justify-end lg:[&>*]:mr-0 lg:[&>*]:ml-2">
            <p>
              <span className="font-bold">Guests: </span>
              {data.maxNumOfGuests}
            </p>
            <p>
              <span className="font-bold">Beds: </span>
              {data.numberOfBeds}
            </p>
            <p>
              <span className="font-bold">Bathrooms: </span>
              {data.numOfBathrooms}
            </p>
          </div>
        )}
        <Link
          href={itemPageHref}
          type="button"
          className={buttonVariants({
            variant: "default",
            className: "px-2 py-1 text-sm lg:mt-auto",
          })}
        >
          View Detail
        </Link>
      </div>
    </li>
  );
}
