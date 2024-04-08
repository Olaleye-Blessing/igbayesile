import AutoPlayImages from "@/components/custom/carousel/auto-play-images";
import RatingsReviewBadge from "@/components/rating-review-badge";
import { buttonVariants } from "@/components/ui/button";
import { IHotel } from "@/interfaces/hotel";
import { CircleDollarSign } from "lucide-react";
import Link from "next/link";

export default function Hotel({ hotel }: { hotel: IHotel }) {
  return (
    <div className="relative">
      <AutoPlayImages
        images={hotel.images}
        className="overflow-hidden md:max-h-[30rem]"
        imgContClassName="max-h-none h-full [&>img]:h-full  overflow-hidden [&>img]:overflow-hidden [&>img]:rounded-md"
        nextClassName="hidden"
        prevClassName="hidden"
      />
      <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-30 dark:bg-opacity-30 text-black dark:text-white p-4 flex flex-col justify-end">
        <h3>{hotel.name}</h3>
        <div className="flex items-center justify-start">
          <p>{hotel.country}</p>
          <span className="w-2 h-2 mx-1 bg-foreground rounded-full" />
          <p>{hotel.state}</p>
          <span className="w-2 h-2 mx-1 bg-foreground rounded-full" />
          <p>{hotel.city}</p>
        </div>
        <p className="flex items-center justify-start [&>.short-label]:text-secondary-foreground">
          <RatingsReviewBadge
            reviews={hotel.totalReviews}
            ratings={hotel.ratings}
          />
        </p>
        <p className="flex items-center justify-start my-2">
          <span className="material-symbols-outlined text-yellow-500 mr-1">
            bedroom_child
          </span>
          <span>Total Rooms:</span>
          <span>{hotel.totalRooms}</span>
        </p>
        <p className="flex items-center justify-start">
          <span>
            <CircleDollarSign className="w-6 h-5 text-green-600 mr-1" />
          </span>
          <span>Average room price:</span>
          <span>{hotel.avgRoomPrice}</span>
        </p>
        <Link
          href={`/hotels/hotel/?hotelId=${hotel._id}`}
          className={buttonVariants({
            className: "ml-auto mt-4 block",
          })}
        >
          View Detail
        </Link>
      </div>
    </div>
  );
}
