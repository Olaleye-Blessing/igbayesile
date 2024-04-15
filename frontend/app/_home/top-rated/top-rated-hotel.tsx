"use client";

import { useIGBQuery } from "@/hooks/use-igb-query";
import { IHotel } from "@/interfaces/hotel";
import { IPaginatedResult } from "@/types/paginate";
import Loading from "../../loading";
import Hotel from "./hotel";

const thirtyMins = 1000 * 60 * 60 * 30;

export default function TopRatedHotel() {
  const { data, isFetching, error } = useIGBQuery<IPaginatedResult<IHotel>>({
    url: `/hotels/top-rated`,
    options: {
      queryKey: ["hotels", { "top-rated": true }],
      refetchInterval: thirtyMins,
    },
  });

  const hotel = data?.results[0];

  return (
    <section className="cardboard px-6 py-4">
      <header className="mb-4">
        <h2>
          Our Top Rated Hotel
          <span className="text-sm text-gray-500 font-normal">
            (Update every 12 hours)
          </span>
        </h2>
      </header>
      <div>
        {data ? (
          <>
            {hotel ? (
              <Hotel hotel={hotel} />
            ) : (
              <p className="text-center">Come back later</p>
            )}
          </>
        ) : error ? (
          <p className="error">{error.message}</p>
        ) : isFetching ? (
          <Loading />
        ) : null}
      </div>
    </section>
  );
}
