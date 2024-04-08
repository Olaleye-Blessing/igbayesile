"use client";

import { useIGBQuery } from "@/hooks/use-igb-query";
import { IAmenity } from "@/interfaces/amenity";
import Loading from "../loading";
import Amenity from "@/components/amenities/amenity";

const target = "room";

const url = `/amenities?limit=${5}&target=${target}`;

export default function Amenities() {
  const { data, error, isFetching } = useIGBQuery<{
    results: IAmenity[];
  }>({
    url,
    options: {
      queryKey: ["amenities", { target }],
    },
  });

  return (
    <div>
      {data ? (
        <ul>
          {data.results.map((amenity) => (
            <li key={amenity._id}>
              <button
                type="button"
                className="flex flex-col items-center justify-center"
              >
                {/* <span className="material-symbols-outlined">
                  {amenity.icon}
                </span> */}
                <Amenity amenity={amenity} />
              </button>
            </li>
          ))}
        </ul>
      ) : isFetching ? (
        <Loading />
      ) : error ? (
        <p className="error">{error.message}</p>
      ) : null}
    </div>
  );
}
