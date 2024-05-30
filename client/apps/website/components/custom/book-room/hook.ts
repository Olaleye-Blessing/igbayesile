import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  areIntervalsOverlapping,
  differenceInDays,
  eachDayOfInterval,
} from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IRoomDetail } from "@ui/interfaces/room";

// TODO: Enable manager to specify breakfast cost.
const breakFastPrice = 20;

const dayInMs = 24 * 60 * 60 * 1000;

export const useBookroom = ({ room }: { room: IRoomDetail }) => {
  const router = useRouter();
  const [bookingDates, setBookingDates] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const [userGuests, setUserGuests] = useState(1);

  let totalDays = 0;

  if (bookingDates?.from && bookingDates?.to)
    totalDays = differenceInDays(bookingDates.to, bookingDates.from);

  let totalCost = room.price * totalDays;

  if (includeBreakfast) totalCost += breakFastPrice * totalDays;

  const bookedDates = room.bookings
    ?.map((booking) =>
      eachDayOfInterval({
        start: new Date(booking.checkIn).getTime() - dayInMs * 1,
        end: new Date(booking.checkOut).getTime() - dayInMs * 1,
      }),
    )
    .flat();

  const bookRoom = () => {
    if (!bookingDates || !bookingDates.from || !bookingDates.to)
      return toast.error("Set check in and check out date");

    if (datesisOverlapping({ room, bookingDates }))
      return toast.error(
        "Some of the dates you want to book are overlapping.\n Select new dates.",
      );

    if (userGuests === 0)
      return toast.error(
        "Provide the number of guests that will stay in this room",
      );

    if (userGuests > room.maxNumOfGuests)
      return toast.error("Maximum number of guests exceded!");

    const searchParams = new URLSearchParams();
    searchParams.set("roomId", room._id);
    searchParams.set("breakfast", String(includeBreakfast));
    // Replace with breakfast price
    if (includeBreakfast) searchParams.set("breakfastPrice", String(20));
    searchParams.set("checkIn", bookingDates.from.toString());
    searchParams.set("checkOut", bookingDates.to.toString());
    searchParams.set("userGuests", String(userGuests));
    searchParams.set("city", room.city);
    searchParams.set("state", room.state);
    searchParams.set("country", room.country);

    router.push(`/bookings/new?${searchParams.toString()}`);
  };

  return {
    bookingDates,
    setBookingDates,
    bookedDates,
    includeBreakfast,
    setIncludeBreakfast,
    userGuests,
    setUserGuests,
    totalCost,
    totalDays,
    bookRoom,
  };
};

function datesisOverlapping({
  room,
  bookingDates,
}: {
  room: IRoomDetail;
  bookingDates: DateRange;
}) {
  const bookedDates =
    room.bookings.map((booking) => ({
      start: booking.checkIn,
      end: booking.checkOut,
    })) || [];

  if (bookedDates.length === 0) return false;

  const overlapped = bookedDates.some((date) =>
    areIntervalsOverlapping(
      { ...date },
      { start: bookingDates.from!, end: bookingDates.to! },
    ),
  );

  return overlapped;
}
