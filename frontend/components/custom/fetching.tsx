import Loading from "@/app/loading";
import { UseQueryResult } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

interface FetchingProps extends PropsWithChildren {
  result: UseQueryResult<unknown, Error>;
}

export default function Fetching({
  result: { data, isFetching, error },
  children,
}: FetchingProps) {
  return (
    <>
      {data ? (
        <>{children}</>
      ) : error ? (
        <p className="error">{error.message}</p>
      ) : isFetching ? (
        <Loading />
      ) : null}
    </>
  );
}
