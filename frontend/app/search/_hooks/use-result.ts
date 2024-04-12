import { usePagination } from "@/components/paginated/use-pagination";
import useSearchParameters from "@/hooks/use-search-parameters";
import { IHotel } from "@/interfaces/hotel";
import { IRoom } from "@/interfaces/room";
// import { keepPreviousData } from "@tanstack/react-query";

const roomsSpecificKeys = ["minPrice", "maxPrice", "minBeds", "maxBeds"];

export const useResult = () => {
  const searchParams = useSearchParameters();
  const search = (Object.fromEntries(searchParams.entries()) || {}) as any;

  // default search
  // if (!search.page) search.page = 1;
  if (!search.limit) search.limit = 3;
  if (!search.type) search.type = "hotels";

  if (search.type === "hotels")
    roomsSpecificKeys.forEach((key) => delete search[key]);

  if (search.amenities) search.amenities = search.amenities.split(",");
  if (search.minBeds) {
    search["numberOfBeds[gte]"] = +search.minBeds;
    delete search.minBeds;
  }
  if (search.maxBeds) {
    search["numberOfBeds[lte]"] = +search.maxBeds;
    delete search.maxBeds;
  }
  if (search.minPrice) {
    search["price[gte]"] = +search.minPrice;
    delete search.minPrice;
  }
  if (search.maxPrice) {
    search["price[lte]"] = +search.maxPrice;
    delete search.maxPrice;
  }
  if (search.ratings) {
    search["ratings[gte]"] = search.ratings;
    delete search.ratings;
  }
  // TODO: Implement searching by booking date
  if (search.from) delete search.from;
  if (search.to) delete search.to;

  let url = `/${search.type}?`;
  delete search.type;
  url += new URLSearchParams(search).toString();

  // const { result, loadMore, totalData } = usePagination<IHotelResult | IRoomResult>({
  const { result, loadMore, totalData } = usePagination<IHotel | IRoom>({
    url,
    options: {
      queryKey: ["search", { url, search }],
      enabled: Object.keys(search).length > 0,
      staleTime: 0,
    },
  });

  return {
    // searchParams,
    result,
    loadMore,
    type: searchParams.getParam("type"),
    totalData,
  };
};
