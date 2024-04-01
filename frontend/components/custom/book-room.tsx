import { Users } from "lucide-react";
import { FormField } from "@/components/custom/form-field";
import { Button } from "@/components/ui/button";
import { IRoomDetail } from "@/interfaces/room";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/custom/date-picker/date-range-picker";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { differenceInDays, eachDayOfInterval } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BookRoomProps {
  room: IRoomDetail;
}

// TODO: Enable manager to specify breakfast cost.
const breakFastPrice = 20;

const fromDate = new Date();

const dayInMs = 24 * 60 * 60 * 1000;

export default function BookRoom({ room }: BookRoomProps) {
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

  const bookRoom = () => {
    if (!bookingDates || !bookingDates.from || !bookingDates.to)
      return toast.error("Set check in and check out date");

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

  const bookedDates = room.bookings
    ?.map((booking) =>
      eachDayOfInterval({
        start: new Date(booking.checkIn).getTime() - dayInMs * 1,
        end: new Date(booking.checkOut).getTime() - dayInMs * 1,
      }),
    )
    .flat();

  return (
    <>
      <div className="mt-2 flex items-center justify-between flex-wrap">
        <p className="mb-1">
          <span>Room Price: </span>
          <span className="font-bold text-lg">${room.price}</span>
          <span className="text-sm text-gray-500">/24hrs</span>
        </p>
        <p className="flex items-start justify-start mb-1">
          <div className="flex flex-col">
            <span>Breakfast Price: </span>
            <span className="text-sm text-gray-500 block -mt-2">optional</span>
          </div>
          {/* TODO: Update backend model to include breakfast */}
          <span className="font-bold text-lg">$20</span>
        </p>
      </div>
      <div className="my-4">
        <Label htmlFor="duration">
          Select the days you will spend in this room
        </Label>
        <DatePickerWithRange
          {...bookingDates}
          handleSetDate={(dates) => setBookingDates(dates)}
          options={{
            fromDate,
            disabled: bookedDates,
          }}
          triggerClassName="w-full"
        />
      </div>
      <div className="flex items-center justify-betweem flex-wrap">
        <div className="flex items-center justify-start mr-4">
          <Checkbox
            id={`${room._id}-breakfast`}
            className="mr-1"
            checked={includeBreakfast}
            onCheckedChange={(val) => setIncludeBreakfast(val as boolean)}
          />
          <Label htmlFor={`${room._id}-breakfast`}>Include breakfast</Label>
        </div>
        <p className="flex items-center justify-start">
          <span className="mr-1">
            <Users className="w-4 h-4" />
          </span>
          <span className="mr-0.5">Max number of guests: </span>
          <span className="short-label text-base">{room.maxNumOfGuests}</span>
        </p>
      </div>
      <FormField
        input={{
          name: "bookNumberOfGuests",
          type: "number",
          max: room.maxNumOfGuests,
          min: 1,
          value: userGuests,
          onChange: (e) => setUserGuests(Number(e.target.value)),
        }}
        className="mt-4"
        label="Number of guests"
      />
      <div className="mt-4 mb-6">
        <p>
          Total price: <span className="font-semibold">${totalCost}</span> for{" "}
          <span className="font-semibold">
            {totalDays} {totalDays === 1 ? "day" : "days"}
          </span>
        </p>
      </div>
      <Button className="w-full mt-auto" type="button" onClick={bookRoom}>
        Book Room
      </Button>
    </>
  );
}
