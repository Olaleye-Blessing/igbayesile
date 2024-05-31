"use client";

import { useIGBQuery } from "@dashboard/hooks/use-igb-query";
import { mockRTKQuery } from "@ui/utils/mock-rtk-query";
import { todayRooms } from "./data";
import Card from "./card";
import Loading from "@dashboard/app/loading";
import Divider from "./divider";

export default function Rooms() {
  const { data, error } = useIGBQuery({
    url: "/",
    options: {
      queryKey: [""],
      queryFn: async () => {
        const res = await mockRTKQuery({
          options: { status: "ok", data: { ...todayRooms } },
        });

        return res;
      },
    },
  });

  console.log(data);

  return (
    <div className="dash_cardboard">
      {data ? (
        <div className="p-4 md:flex md:items-center md:justify-between">
          <Card
            title="Available rooms today"
            amount={data.available}
            total={data.total}
          />
          <Divider />
          <Card
            title="Sold Out rooms today"
            amount={data.soldOut}
            total={data.total}
          />
          <Divider />
          <Card
            title="Maintenance"
            amount={data.maintenance}
            total={data.total}
          />
        </div>
      ) : error ? (
        <p className="error">{error.message}</p>
      ) : (
        <Loading />
      )}
    </div>
  );
}
