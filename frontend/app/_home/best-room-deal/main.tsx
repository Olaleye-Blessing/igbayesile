/* eslint-disable @next/next/no-img-element */
"use client";

import Fetching from "@/components/custom/fetching";
import { useIGBQuery } from "@/hooks/use-igb-query";
import { IRoom } from "@/interfaces/room";
import { IPaginatedResult } from "@/types/paginate";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BedDouble, LucideIcon, ShowerHead, Users } from "lucide-react";

export default function Main() {
  const result = useIGBQuery<IPaginatedResult<IRoom>>({
    url: "/rooms/best-deal",
    options: {
      queryKey: ["rooms", { sort: "-price" }],
    },
  });

  const rooms = result.data?.results || [];

  return (
    <Fetching result={result}>
      <Carousel>
        <CarouselContent className="">
          {rooms.map((room) => (
            <CarouselItem key={room._id} className="sm:basis-1/2 lg:basis-1/3">
              <div className="cardboard h-full sm:flex sm:flex-col">
                <figure className="w-full h-64 overflow-hidden rounded-md rounded-b-none sm:flex-shrink-0">
                  <img
                    src={room.images[0]}
                    alt=""
                    className="w-full h-full overflow-hidden rounded-md rounded-b-none"
                  />
                </figure>
                <div className="p-4 sm:h-full sm:flex sm:flex-col">
                  <h3>{room.name}</h3>
                  <p className="">
                    {room.state}, {room.country}
                  </p>
                  <div className="flex items-center justify-start flex-wrap my-2 mb-8 md:mb-10 lg:mb-12">
                    <ShortLabel
                      Icon={Users}
                      content={`${room.maxNumOfGuests} guests`}
                      className="text-green-500"
                    />
                    <ShortLabel
                      Icon={BedDouble}
                      content={`${room.numberOfBeds} beds`}
                      className="text-purple-500"
                    />
                    <ShortLabel
                      Icon={ShowerHead}
                      content={`${room.numOfBathrooms} bathrooms`}
                      className="text-pink-500"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="mr-1">
                      <span className="font-bold text-lg">${room.price}</span>
                      <span>/</span>
                      <span className="text-sm text-gray-500">24hrs</span>
                    </p>
                    <Link
                      href={`/rooms/room/?roomId=${room._id}&hotelId=${room.hotel}`}
                      className={buttonVariants({
                        variant: "default",
                      })}
                    >
                      View Room
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="right-0 sm:-right-4 lg:-right-8" />
        <CarouselPrevious className="left-0 sm:-left-4 lg:-left-8" />
      </Carousel>
    </Fetching>
  );
}

interface ShortLabelProps {
  Icon: LucideIcon;
  content: string;
  className?: string;
}

function ShortLabel({ Icon, content, className }: ShortLabelProps) {
  return (
    <div className="flex items-center justify-start mr-3 last:mr-0">
      <span className="mr-1">
        <Icon className={`w-6 h-6 ${className}`} />
      </span>
      <span className="text-sm">{content}</span>
    </div>
  );
}
