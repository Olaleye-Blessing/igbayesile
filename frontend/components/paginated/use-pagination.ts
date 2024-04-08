import { useEffect, useState } from "react";
import {
  keepPreviousData,
  QueryKey,
  UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { useIGBQuery } from "@/hooks/use-igb-query";
import { IPaginatedResult } from "@/types/paginate";

export const usePagination = <TData = unknown>({
  url,
  options,
}: {
  url: string;
  options: UndefinedInitialDataOptions<TData, Error, TData, QueryKey>;
}) => {
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState<TData[]>([]);

  const [base, path = ""] = url.split("?");
  const search = new URLSearchParams(path.trim());
  search.set("page", String(page));
  search.set("limit", "3");

  const result = useIGBQuery<IPaginatedResult<TData>>({
    url: `${base}?${search.toString()}`,
    // @ts-ignore
    options: {
      ...options,
      queryKey: [...options.queryKey, { page, url }],
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (!url) return;

    setTotalData([]);
    setPage(1);
  }, [url]);

  useEffect(() => {
    if (result.isFetching) return;

    if (!result.data) return;

    setTotalData((prev) => [...prev, ...result.data.results]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.isFetching]);

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  return { result, loadMore, totalData };
};
