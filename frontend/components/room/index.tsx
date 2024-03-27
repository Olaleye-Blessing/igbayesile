/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { IRoom } from "@/interfaces/room";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AmentiyWithIcon from "@/components/amentiy-with-icon";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/custom/date-picker/date-range-picker";
import AutoPlayImages from "../custom/carousel/auto-play-images";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import { FormField } from "../custom/form-field";

interface RoomProps {
  room: IRoom;
  className?: string;
}

// TODO: Enable manager to specify breakfast cost.
const breakFastPrice = 20;

export default function Room({ room, className = "" }: RoomProps) {
  const router = useRouter();
  const [bookedDates, setBookedDates] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: new Date(2022, 0, 20),
  });
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const [userGuests, setUserGuests] = useState(1);

  let totalDays = 0;

  if (bookedDates?.from && bookedDates?.to)
    totalDays = differenceInDays(bookedDates.to, bookedDates.from);

  let totalCost = room.price * totalDays;

  if (includeBreakfast) totalCost += breakFastPrice * totalDays;

  const bookRoom = () => {
    if (!bookedDates || !bookedDates.from || !bookedDates.to)
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
    searchParams.set("checkIn", bookedDates.from.toISOString());
    searchParams.set("checkOut", bookedDates.to.toISOString());
    searchParams.set("userGuests", String(userGuests));
    searchParams.set("city", room.city);
    searchParams.set("state", room.state);
    searchParams.set("country", room.country);

    router.push(`/bookings/new?${searchParams.toString()}`);
  };

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
              <AmentiyWithIcon key={amenity} amenity={amenity} />
            ))}
          </ul>
        )}
      </>
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
          {...bookedDates}
          handleSetDate={(dates) => setBookedDates(dates)}
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
    </div>
  );
}
