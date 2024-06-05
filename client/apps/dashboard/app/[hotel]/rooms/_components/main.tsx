"use client";

import { useIGBQuery } from "@dashboard/hooks/use-igb-query";
import { IPaginatedResult } from "@ui/types/paginate";
import { IRoom } from "@ui/interfaces/room";
import Loading from "@dashboard/app/loading";
import { RoomQueryKeys } from "../_utils/query-factory-key";
import RoomsTable from "./rooms-table";
import { columns } from "./rooms-table/columns";
import { useState } from "react";
import Pagination from "./pagination";
import { keepPreviousData } from "@tanstack/react-query";

interface MainProps {
  hotel: string;
}

const perPage = 5;

export default function Main({ hotel }: MainProps) {
  const [page, setPage] = useState(1);
  const params: any = {
    limit: perPage,
    page,
  };
  const searchParams = new URLSearchParams(params).toString();
  console.log({ searchParams });
  const { isFetching, data, error, isPending } = useIGBQuery<
    IPaginatedResult<IRoom>
  >({
    url: `/hotels/${hotel}/rooms?${searchParams}`,
    options: {
      queryKey: RoomQueryKeys.rooms(hotel, searchParams),
      placeholderData: keepPreviousData,
    },
  });

  return (
    <main>
      {isPending ? (
        <Loading />
      ) : error ? (
        <div className="error">{error.message}</div>
      ) : data ? (
        <section>
          <div className="relative">
            <RoomsTable data={data.results} columns={columns} />
            {isFetching && (
              <div className="absolute inset-0 bg-black bg-opacity-5 rounded-md flex items-center justify-center">
                <Loading />
              </div>
            )}
          </div>
          <div className="my-3">
            <p className="flex items-center justify-center text-center mb-0.5">
              Showing{" "}
              <span className="text-muted-foreground font-semibold text-sm px-1">
                {" "}
                {data.results.length}
              </span>{" "}
              <span>of</span>{" "}
              <span className="text-muted-foreground font-semibold text-sm px-1">
                {data.total}
              </span>
            </p>
            <Pagination
              onPageChange={(page) => setPage(page)}
              totalRooms={data.total}
              currentPage={page}
              pageSize={perPage}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
