import { useIGBQuery } from "@dashboard/hooks/use-igb-query";
import ReactSelect from "@ui/components/custom/select/react-select";
import { sleep } from "@ui/utils/sleep";
import { ISampleHotel, hotels as sampleHotels } from "./data";
import { handleIgbayesileAPIError } from "@dashboard/utils/handle-igbayesile-api-error";
import { IPaginatedResult } from "@ui/types/paginate";
import toast from "react-hot-toast";

export default function Hotel() {
  const { data, isFetching, error } = useIGBQuery<
    IPaginatedResult<ISampleHotel>
  >({
    url: "/hotels",
    options: {
      queryKey: ["hotels"],
      queryFn: async () => {
        try {
          await sleep(2_000);

          return {
            limit: 10,
            page: 1,
            total: 10,
            results: [...sampleHotels],
          };
        } catch (error) {
          throw new Error(handleIgbayesileAPIError(error));
        }
      },
    },
  });

  let hotels: any[] = [];

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
    />
  );
}
