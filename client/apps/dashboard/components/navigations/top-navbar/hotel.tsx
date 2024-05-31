"use client";

import { useIGBQuery } from "@dashboard/hooks/use-igb-query";
import ReactSelect from "@ui/components/custom/select/react-select";
import { IPaginatedResult } from "@ui/types/paginate";
import toast from "react-hot-toast";
import { IFullHotel } from "@ui/interfaces/hotel";
import { usePagePath } from "@dashboard/hooks/use-page-path";

export default function Hotel() {
  const { updateHotelPath } = usePagePath();
  const { data, isFetching, error } = useIGBQuery<IPaginatedResult<IFullHotel>>(
    {
      url: "/hotels",
      options: {
        queryKey: ["dashboard", "hotels"],
      },
    },
  );

  let hotels: { label: string; value: string }[] = [];

  if (!isFetching) {
    if (data) {
      hotels = data.results.map((hotel) => ({
        label: hotel.name,
        value: hotel._id,
      }));
    } else if (error) {
      hotels = [{ label: "An Error Occured", value: "" }];
      toast.error(error.message, {
        id: "fetching-hotels-err",
        duration: 6_000,
      });
    }
  }

  return (
    <ReactSelect
      className="mr-2 w-full max-w-40 nav_hotels"
      isLoading={isFetching}
      options={hotels}
      placeholder="Hotels"
      loadingMessage={() => "Loading Hotels..."}
      onChange={(hotel: any) =>
        updateHotelPath({ hotelId: hotel.value, action: "push" })
      }
    />
  );
}
