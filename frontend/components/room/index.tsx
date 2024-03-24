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

interface RoomProps {
  room: IRoom;
  className?: string;
}

// TODO: Enable manager to specify breakfast cost.
const breakFastPrice = 20;

export default function Room({ room, className = "" }: RoomProps) {
  const [bookedDates, setBookedDates] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: new Date(2022, 0, 20),
  });
  const [includeBreakfast, setIncludeBreakfast] = useState(false);

  let totalDays = 0;

  if (bookedDates?.from && bookedDates?.to)
    totalDays = differenceInDays(bookedDates.to, bookedDates.from);

  let totalCost = room.price * totalDays;

  if (includeBreakfast) totalCost += breakFastPrice * totalDays;

  return (
    <div className={cn("cardboard p-3", className)}>
      <header>
        <h3>{room.name}</h3>
        <p className="text-gray-500">{room.description}</p>
      </header>
      <figure className="rounded-md overflow-hidden">
        <img src={room.images[0]} alt="" />
      </figure>
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
      <div className="flex items-center justify-start">
        <Checkbox
          id={`${room._id}-breakfast`}
          className="mr-1"
          checked={includeBreakfast}
          onCheckedChange={(val) => setIncludeBreakfast(val as boolean)}
        />
        <Label htmlFor={`${room._id}-breakfast`}>Include breakfast</Label>
      </div>
      <div className="mt-4">
        <p>
          Total price: <span className="font-semibold">${totalCost}</span> for{" "}
          <span className="font-semibold">
            {totalDays} {totalDays === 1 ? "day" : "days"}
          </span>
        </p>
      </div>
      <Button className="w-full mt-6">Book Room</Button>
    </div>
  );
}
