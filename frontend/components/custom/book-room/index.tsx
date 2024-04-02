import { Users } from 'lucide-react';
import { FormField } from '@/components/custom/form-field';
import { Button } from '@/components/ui/button';
import { IRoomDetail } from '@/interfaces/room';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithRange } from '@/components/custom/date-picker/date-range-picker';
import { useBookroom } from './hook';

interface BookRoomProps {
  room: IRoomDetail;
}

const fromDate = new Date();

export default function BookRoom({ room }: BookRoomProps) {
  const bookRoomHook = useBookroom({ room });

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
          {...bookRoomHook.bookingDates}
          handleSetDate={(dates) => bookRoomHook.setBookingDates(dates)}
          options={{
            fromDate,
            disabled: bookRoomHook.bookedDates,
          }}
          triggerClassName="w-full"
        />
      </div>
      <div className="flex items-center justify-betweem flex-wrap">
        <div className="flex items-center justify-start mr-4">
          <Checkbox
            id={`${room._id}-breakfast`}
            className="mr-1"
            checked={bookRoomHook.includeBreakfast}
            onCheckedChange={(val) =>
              bookRoomHook.setIncludeBreakfast(val as boolean)
            }
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
          name: 'bookNumberOfGuests',
          type: 'number',
          max: room.maxNumOfGuests,
          min: 1,
          value: bookRoomHook.userGuests,
          onChange: (e) => bookRoomHook.setUserGuests(Number(e.target.value)),
        }}
        className="mt-4"
        label="Number of guests"
      />
      <div className="mt-4 mb-6">
        <p>
          Total price:{' '}
          <span className="font-semibold">${bookRoomHook.totalCost}</span> for{' '}
          <span className="font-semibold">
            {bookRoomHook.totalDays}{' '}
            {bookRoomHook.totalDays === 1 ? 'day' : 'days'}
          </span>
        </p>
      </div>
      <Button
        className="w-full mt-auto"
        type="button"
        onClick={bookRoomHook.bookRoom}
      >
        Book Room
      </Button>
    </>
  );
}
