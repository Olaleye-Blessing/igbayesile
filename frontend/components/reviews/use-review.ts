import { useIGBQuery } from "@/hooks/use-igb-query";
import { reviewsKeys } from "./query-key-factory";
import { keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { IReview } from "@/interfaces/review";

type IResult = {
  total: number;
  page: number;
  limit: number;
  reviews: IReview[];
};

export const useReviews = ({
  type,
  id,
}: {
  type: "hotel" | "room";
  id: string;
}) => {
  const [page, setPage] = useState(1);
  const loadMore = () => setPage((prev) => prev + 1);

  const result = useIGBQuery<IResult>({
    url: `/reviews/?type=${type}&page=${page}&targetId=${id}`,
    options: {
      queryKey: reviewsKeys.lists(type, page, id),
      placeholderData: keepPreviousData,
    },
  });

  return { result, loadMore };
};
