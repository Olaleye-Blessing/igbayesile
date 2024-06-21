/* eslint-disable @next/next/no-img-element */
import { IHotel } from "@ui/interfaces/hotel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ui/components/ui/carousel";
import Link from "next/link";
import { buttonVariants } from "@ui/components/ui/button";

interface HotelsProps {
  data: IHotel[];
}

export default function Hotels({ data }: HotelsProps) {
  return (
    <Carousel>
      <CarouselContent className="">
        {data.map((hotel) => {
          return (
            <CarouselItem key={hotel._id} className="sm:basis-1/2 xl:basis-1/3">
              <div className="cardboard h-full sm:flex sm:flex-col">
                <figure className="w-full h-64 overflow-hidden rounded-md rounded-b-none sm:flex-shrink-0">
                  <img
                    src={hotel.images[0]}
                    alt=""
                    className="w-full h-full overflow-hidden rounded-md rounded-b-none"
                  />
                </figure>
                <div className="p-4 sm:h-full sm:flex sm:flex-col">
                  <h3>{hotel.name}</h3>
                  <p className="">
                    {hotel.city}, {hotel.state}, {hotel.country}
                  </p>
                  <div className="flex items-center justify-between flex-wrap mt-4">
                    <div className="flex items-center justify-start">
                      <p className="text-right font-bold text-gray-500 text-xs mr-1">
                        <span>{hotel.totalReviews}</span>{" "}
                        <span>
                          {hotel.totalReviews === 1 ? "review" : "reviews"}
                        </span>
                      </p>
                      <p className="w-8 h-8 rounded-full flex items-center justify-center text-center font-bold bg-primary text-sm text-white">
                        {hotel.ratings}
                      </p>
                    </div>
                    <p>
                      <span className="text-right font-bold text-gray-500">
                        10
                      </span>{" "}
                      <span className="text-sm">rooms</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-12">
                    <p>
                      <span>Average room price:</span>{" "}
                      <span className="font-semibold text-gray-500 text-lg">
                        {hotel.avgRoomPrice}
                      </span>
                    </p>
                    <Link
                      href={`/hotels/${hotel._id}`}
                      className={buttonVariants({
                        variant: "default",
                      })}
                    >
                      View Hotel
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselNext className="right-0 sm:-right-4 lg:-right-8" />
      <CarouselPrevious className="left-0 sm:-left-4 lg:-left-8" />
    </Carousel>
  );
}
