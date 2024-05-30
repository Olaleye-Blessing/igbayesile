"use client";

import { convertDateToLocale } from "@ui/utils/convert-date-to-locale";
import { IBookInfo } from "../_hooks/book-info";
import Info from "./info";
import Section from "./section";

interface DetailProps {
  bookInfo: IBookInfo;
}

export default function Detail({ bookInfo }: DetailProps) {
  return (
    <Section title="Booking Details">
      <div className="flex flex-col space-y-3">
        <Info label="Location" body={bookInfo.location} />
        <div className="flex items-start justify-start flex-wrap">
          <Info
            label="Check in"
            body={convertDateToLocale({ date: bookInfo.checkIn })}
            className="mr-3"
          />
          <Info
            label="Check out"
            body={convertDateToLocale({ date: bookInfo.checkOut })}
          />
        </div>
        <Info label="Total length of stay" body={bookInfo.totalDays} />
        <Info label="Guests" body={bookInfo.guests} />
      </div>
    </Section>
  );
}
