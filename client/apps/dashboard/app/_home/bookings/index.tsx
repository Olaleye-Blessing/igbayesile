"use client";

import { useIGBQuery } from "@dashboard/hooks/use-igb-query";
import { mockRTKQuery } from "@ui/utils/mock-rtk-query";
import { bookings as mockBookings } from "./data";
import Loading from "@dashboard/app/loading";
import Card from "./card";

export default function Bookings() {
  const { data, error } = useIGBQuery({
    url: "/",
    options: {
      queryKey: [""],
      queryFn: async () => {
        const res = await mockRTKQuery({
          options: { status: "ok", data: { ...mockBookings } },
        });

        return res;
      },
    },
  });

  return (
    <header className="">
      {data ? (
        <ul className="flex items-center justify-start flex-nowrap space-x-4 overflow-x-auto py-4 no-scrollbar">
          <Card id="scheduled" data={data} />
          <Card id="checked_in" data={data} />
          <Card id="checked_out" data={data} />
          <Card id="total" data={data} />
        </ul>
      ) : error ? (
        <p className="error">{error.message}</p>
      ) : (
        <Loading />
      )}
    </header>
  );
}
