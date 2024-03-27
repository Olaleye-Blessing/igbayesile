"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode, useState } from "react";

interface DatePickerWithRangeProps {
  from?: Date;
  to?: Date;
  className?: string;
  handleSetDate: (range: DateRange | undefined) => void;
  triggerClassName?: string;
  emptyMsg?: ReactNode;
  options?: CalendarProps;
}

// TODO: Improve the interaction with this such that
// it closes when user picks the final day
export function DatePickerWithRange({
  className,
  from,
  to,
  triggerClassName = "",
  handleSetDate,
  emptyMsg = <span>Pick a date</span>,
  options,
}: DatePickerWithRangeProps) {
  const date = { from, to };
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={(open) => setOpen(open)}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[20rem] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              triggerClassName,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <>{emptyMsg}</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            {...options}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              handleSetDate(range);

              if (range?.to) setOpen(false);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
