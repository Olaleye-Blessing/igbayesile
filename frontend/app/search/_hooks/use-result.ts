import { useIGBQuery } from "@/hooks/use-igb-query";
import useSearchParameters from "@/hooks/use-search-parameters";
import { IHotel } from "@/interfaces/hotel";
import { IRoom } from "@/interfaces/room";
import { keepPreviousData } from "@tanstack/react-query";

const roomsSpecificKeys = ["minPrice", "maxPrice", "minBeds", "maxBeds"];

type IResult = {
  total: number;
  page: number;
  limit: number;
};
export type IHotelResult = { hotels: IHotel[] } & IResult;
export type IRoomResult = { rooms: IRoom[] } & IResult;

export const useResult = () => {
  const searchParams = useSearchParameters();
  const search = (Object.fromEntries(searchParams.entries()) || {}) as any;

  // default search
  if (!search.page) search.page = 1;
  if (!search.limit) search.limit = 5;
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
  // TODO: Implement searching by booking date
  if (search.from) delete search.from;
  if (search.to) delete search.to;

  let url = `/${search.type}?`;
  delete search.type;
  url += new URLSearchParams(search).toString();

  const result = useIGBQuery<IHotelResult | IRoomResult>({
    url,
    options: {
      queryKey: ["search", { url, search }],
      enabled: Object.keys(search).length > 0,
      placeholderData: keepPreviousData,
    },
  });

  function loadMore() {
    const page = String(Number(searchParams.getParam("page") || 1) + 1);

    searchParams.updateParams({ page }, "push");
  }

  return {
    searchParams,
    result,
    loadMore,
    type: searchParams.getParam("type"),
  };
};
