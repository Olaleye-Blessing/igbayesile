"use client";

import { useQuery } from "@tanstack/react-query";
import { IHotel } from "@ui/interfaces/hotel";
import { IPaginatedResult } from "@ui/types/paginate";
import { useIGBQuery } from "@website/hooks/use-igb-query";
import axios from "axios";
import { IGeoLocation } from "./types";
import { sampleGeoLocation } from "./data";
import { sleep } from "@ui/utils/sleep";
import Hotels from "./hotels";
import Fetching from "@website/components/custom/fetching";
import Link from "next/link";
import { buttonVariants } from "@ui/components/ui/button";

export default function NearestHotels() {
  const { data: geoLocation, error: geoError } = useQuery({
    queryKey: ["geolocation"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        let data;
        if (process.env.NODE_ENV === "production") {
          data = (
            await axios.get<IGeoLocation>(
              `https://api.geoapify.com/v1/ipinfo?&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`,
            )
          ).data;
        } else {
          await sleep(1_500);
          data = sampleGeoLocation;
        }

        return data;
      } catch (error) {
        throw new Error("Unable to get your location");
      }
    },
  });

  const nearestHotelsSearchParams = new URLSearchParams();

  if (geoLocation) {
    const country = geoLocation?.country.names.en;
    const state = geoLocation?.state.name;
    const city = geoLocation?.city.names.en;

    if (country) nearestHotelsSearchParams.set("country", country);
    if (state) nearestHotelsSearchParams.set("state", state);
    if (city) nearestHotelsSearchParams.set("city", city);
  }

  const hotelsResult = useIGBQuery<IPaginatedResult<IHotel>>({
    url: `/hotels/nearest?${nearestHotelsSearchParams.toString()}`,
    options: {
      queryKey: ["hotels", { nearest: true }],
      refetchInterval: false,
      enabled: Boolean(geoLocation),
    },
  });

  return (
    <section className="cardboard px-6 py-4 mt-8">
      <header className="mb-4 flex justify-between">
        <h2>
          Nearest Hotels
          <span className="text-sm text-gray-500 font-normal">
            (Update every 12 hours)
          </span>
        </h2>
        {hotelsResult.data && (
          <p>
            <Link
              href={`/search?type=hotels&${nearestHotelsSearchParams.toString()}`}
              className={buttonVariants({
                variant: "default",
              })}
            >
              Load More
            </Link>
          </p>
        )}
      </header>
      {geoError ? (
        <p className="error">Unable to get your location</p>
      ) : geoLocation ? (
        <Fetching result={hotelsResult}>
          {hotelsResult.data ? (
            <>
              {hotelsResult.data.total === 0 ? (
                <p className="text-center font-semibold">
                  No hotel is close to your location!
                </p>
              ) : (
                <Hotels data={hotelsResult.data.results} />
              )}
            </>
          ) : null}
        </Fetching>
      ) : (
        <p>Getting your location...</p>
      )}
    </section>
  );
}
