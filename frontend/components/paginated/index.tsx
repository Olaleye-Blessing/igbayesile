import { UseQueryResult } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { IPaginatedResult } from "./use-pagination";

interface PaginatedProps {
  data: any[];
  // result: UseQueryResult<{ results: any[]; total: number }, Error>;
  result: UseQueryResult<
    Pick<IPaginatedResult<unknown>, "results" | "total">,
    Error
  >;
  loadMore(): void;
  noDataMsg?: ReactNode;
  noMoreMsg?: ReactNode;
  children: ReactNode;
}

export default function Paginated({
  data,
  result,
  loadMore,
  children,
  noDataMsg = <p>No data found</p>,
  noMoreMsg = <p>No more data</p>,
}: PaginatedProps) {
  return (
    <>
      {result.isPending ? (
        <Loading />
      ) : result.isError ? (
        <div>Error: {result.error.message}</div>
      ) : (
        <>{children}</>
      )}
      {result.data && result.data.total > data.length && (
        <Button
          type="button"
          onClick={() => loadMore()}
          className="flex mx-auto mt-4 max-w-28"
          disabled={result.isLoading}
        >
          Load More
        </Button>
      )}
      <div className="flex items-center justify-center text-center mt-4">
        {!result.isPending && result.isFetching && <Loading />}
        {!result.isPending && !result.isFetching && data.length === 0 && (
          <>{noDataMsg}</>
        )}
        {!result.isPending &&
          !result.isFetching &&
          result.data?.results &&
          result.data.results.length === 0 &&
          data.length !== 0 && <>{noMoreMsg}</>}
      </div>
    </>
  );
}
