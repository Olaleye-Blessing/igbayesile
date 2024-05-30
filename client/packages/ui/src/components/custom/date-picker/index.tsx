"use client";

import { MouseEvent, ReactNode, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import { Calendar, CalendarProps } from "@ui/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { ActiveModifiers } from "react-day-picker";

interface DatePickerProps {
  calendar: CalendarProps;
  emptyPlaceolder?: ReactNode;
  className?: string;
}

export function DatePicker({
  calendar,
  emptyPlaceolder = <span>Pick a date</span>,
  className,
}: DatePickerProps) {
  const { selected: date } = calendar;
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[20rem] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date as Date, "PPP") : <>{emptyPlaceolder}</>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          // mode="single"
          // selected={date}
          // onSelect={setDate}
          // initialFocus

          {...calendar}
          onDayClick={(
            day: Date,
            activeModifiers: ActiveModifiers,
            e: MouseEvent,
          ) => {
            calendar.onDayClick?.(day, activeModifiers, e);
            setOpen(false);
          }}
          defaultMonth={new Date(date as any)}
        />
      </PopoverContent>
    </Popover>
  );
}
