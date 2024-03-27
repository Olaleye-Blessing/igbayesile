"use client";

import { useEffect, useState } from "react";
import { useResult, IHotelResult, IRoomResult } from "../../_hooks/use-result";
import Base from "./base";
import { Button } from "@/components/ui/button";

export default function Result() {
  const { result, loadMore, type, searchParams } = useResult();

  const url = searchParams.stringnify().replace(/(?:\?|&)?page=\d+/g, "");

  const [data, setData] = useState<
    IHotelResult["hotels"] | IRoomResult["rooms"]
  >([]);

  useEffect(() => {
    if (!url) return;

    setData([]);
  }, [url]);

  useEffect(() => {
    if (result.isFetching) return;

    if (!result.data) return;

    setData((prev) => {
      let newR =
        type === "rooms"
          ? (result.data as IRoomResult).rooms
          : (result.data as IHotelResult).hotels;

      let current = [...prev, ...newR] as
        | IHotelResult["hotels"]
        | IRoomResult["rooms"];

      return current;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.isFetching]);

  // console.log(data);

  return (
    <output
      name="search-result"
      className="result block px-4 md:px-0 md:flex-1"
    >
      <div>
        {result.isPending ? (
          <div>Loading...</div>
        ) : result.isError ? (
          <div>Error: {result.error.message}</div>
        ) : (
          <ul>
            {data.map((dat) => (
              <Base
                type={(type as any) || "hotels"}
                key={dat._id}
                data={dat as any}
              />
            ))}
          </ul>
        )}
        {/* TODO: This doesn't make sense.  */}
        {/* TODO: Refactor in such a way that you only have result.data.lists */}
        {data.length > 0 &&
          ((result.data as any)?.rooms || (result.data as any)?.hotels).length >
            0 &&
          !result.isFetching && (
            <Button
              type="button"
              onClick={() => {
                // if (!isPlaceholderData && data.hasMore) {
                //   setPage((old) => old + 1);
                // }
                loadMore();
              }}
              className="flex mx-auto mt-4 max-w-28"
              disabled={result.isLoading}
            >
              Load More
            </Button>
          )}
        <div className="flex items-center justify-center text-center mt-4">
          {!result.isPending && result.isFetching && <p> Loading...</p>}
          {!result.isPending && !result.isFetching && data.length === 0 && (
            <p>No data found</p>
          )}
          {!result.isPending &&
            !result.isFetching &&
            ((result.data as any)?.rooms || (result.data as any)?.hotels)
              .length === 0 &&
            data.length !== 0 && <p>No more data</p>}
        </div>
      </div>
    </output>
  );
}
