import AmentiyWithIcon from "@/components/amentiy-with-icon";
import BookRoom from "@/components/custom/book-room";
import AutoPlayImages from "@/components/custom/carousel/auto-play-images";
import { Button, buttonVariants } from "@/components/ui/button";
import { IUserBooking } from "@/interfaces/booking";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Item from "./item";
import { Clock, Clock10, HandCoins, Terminal, Users } from "lucide-react";
import { convertDateToLocale } from "@/utils/convert-date-to-locale";
import { formatCurrency } from "@/utils/format-currency";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIGBInstance } from "@/hooks/use-igb-instance";
import toast from "react-hot-toast";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";

interface BookingProps {
  booking: IUserBooking;
}

interface IContinuePayment {
  status: string;
  data: {
    authorization_url: string;
  };
}

export default function Booking({ booking }: BookingProps) {
  const { igbInstance } = useIGBInstance();
  const continuePayment = async () => {
    if (booking.status === "paid")
      return toast.success("This booking has been paid for", {
        id: `booking-paid-${booking._id}`,
      });

    const toastId = `cont-payment-${booking._id}`;

    toast.loading("Checking status...", { id: toastId });

    try {
      const { data } = await igbInstance().patch<IContinuePayment>(
        `/bookings/${booking._id}/continue-payment`,
        {},
      );

      window.location.href = data.data.authorization_url;
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
    }
  };

  return (
    <div className={cn("cardboard p-3 flex flex-col")}>
      <header className="flex items-center justify-between">
        <h3>{booking.room.name}</h3>
        <span
          className={`text-sm rounded-sm px-[0.4rem] py-[0.15rem] pb-1 ${booking.status === "paid" ? "bg-green-200 text-green-800" : booking.status === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"}`}
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
      <div className="flex items-center justify-start">
        {booking.status !== "paid" && (
          <Alert variant="destructive" className="bg-red-100">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Note!</AlertTitle>
            <AlertDescription>
              <p className="mr-2">
                This room will not be reserved until you pay,{" "}
                <Button
                  className="p-0"
                  variant="link"
                  type="button"
                  onClick={continuePayment}
                >
                  Continue Payment
                </Button>
                .
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <section className="h-full flex flex-col mt-2">
        <header>
          <h3 className="text-lg">Current Room Details</h3>
        </header>
        <p className="text-gray-500 max-h-40 overflow-auto mb-4">
          {booking.room.description}
        </p>
        <AutoPlayImages
          images={booking.room.images}
          nextClassName="right-0"
          prevClassName="left-0"
        />
        <>
          {booking.room.amenities.length === 0 ? (
            <p className="error mt-4">No Amenity</p>
          ) : (
            <ul className="amenities mt-4 grid gap-4 grid-cols-[repeat(auto-fill,minmax(8rem,_1fr))]">
              {booking.room.amenities.map((amenity) => (
                <AmentiyWithIcon key={amenity} amenity={amenity} />
              ))}
            </ul>
          )}
        </>
        <BookRoom room={booking.room} />
        <Link
          href={`/rooms/room/?roomId=${booking.room._id}&hotelId=${booking.room.hotel}`}
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
