import AmentiyWithIcon from "@/components/amentiy-with-icon";
import BookRoom from "@/components/custom/book-room";
import AutoPlayImages from "@/components/custom/carousel/auto-play-images";
import { buttonVariants } from "@/components/ui/button";
import { IUserBooking } from "@/interfaces/booking";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Item from "./item";
import { Clock, Clock10, HandCoins, Users } from "lucide-react";
import { convertDateToLocale } from "@/utils/convert-date-to-locale";
import { formatCurrency } from "@/utils/format-currency";

interface BookingProps {
  booking: IUserBooking;
}

export default function Booking({ booking }: BookingProps) {
  return (
    <div className={cn("cardboard p-3 flex flex-col")}>
      <header className="flex items-center justify-between">
        <h3>{booking.roomId.name}</h3>
        <span
          className={`text-sm rounded-lg px-[0.2rem] py-[0.1rem] pb-1 ${booking.status === "paid" ? "bg-green-200 text-green-800" : booking.status === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}
        >
          {booking.status}
        </span>
      </header>
      <div className="flex items-center justify-start flex-wrap [&>p]:mr-3 [&>p]:mb-1">
        <Item Icon={Users} label="Total Guests" value={booking.guests} />
        <Item
          Icon={HandCoins}
          label="Total Cost"
          value={formatCurrency({ amount: booking.totalCost / 100 })}
        />
        <Item
          Icon={Clock}
          label="Check In"
          value={convertDateToLocale({
            date: booking.checkIn,
          })}
        />
        <Item
          Icon={Clock10}
          label="Check Out"
          value={convertDateToLocale({
            date: booking.checkOut,
          })}
        />
      </div>
      <section className="h-full flex flex-col mt-4">
        <header>
          <h3 className="text-lg">Current Room Details</h3>
        </header>
        <p className="text-gray-500 max-h-40 overflow-auto mb-4">
          {booking.roomId.description}
        </p>
        <AutoPlayImages
          images={booking.roomId.images}
          nextClassName="right-0"
          prevClassName="left-0"
        />
        <>
          {booking.roomId.amenities.length === 0 ? (
            <p className="error mt-4">No Amenity</p>
          ) : (
            <ul className="amenities mt-4 grid gap-4 grid-cols-[repeat(auto-fill,minmax(8rem,_1fr))]">
              {booking.roomId.amenities.map((amenity) => (
                <AmentiyWithIcon key={amenity} amenity={amenity} />
              ))}
            </ul>
          )}
        </>
        <BookRoom room={booking.roomId} />
        <Link
          href={`/rooms/room/?roomId=${booking.roomId._id}&hotelId=${booking.roomId.hotel}`}
          className={buttonVariants({
            variant: "secondary",
            className: "w-full mt-2",
          })}
        >
          View Detail
        </Link>
      </section>
    </div>
  );
}
