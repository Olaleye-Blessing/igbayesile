"use client";
import { BACKEND_URL } from "@/constants/backend";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { sleep } from "@/utils/sleep";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";

export default function Home() {
  const [loadUsers, setLoadUsers] = useState(false);

  const { data, error, refetch, isFetched, isFetching } = useQuery<
    {
      message: string;
    },
    Error
  >({
    queryKey: ["users"],
    enabled: loadUsers,
    queryFn: async () => {
      try {
        await sleep(3_000);
        let { data } = await axios.get(`${BACKEND_URL}/api/v1/users`, {
          withCredentials: true,
        });
        return data;
      } catch (error) {
        throw new Error(handleIgbayesileAPIError(error));
      }
    },
    retry: 0,
  });

  console.log(data, error);

  return (
    <main>
      <h1 className=" text-center">Home Page</h1>

      <div className="my-4 flex flex-col items-center justify-center">
        {isFetched ? (
          <button type="button" onClick={() => refetch()}>
            Refetch
          </button>
        ) : (
          <button type="button" onClick={() => setLoadUsers(true)}>
            Get Users
          </button>
        )}
      </div>

      <div className="flex items-center justify-center my-4">
        {data ? (
          <p className=" text-green-800">{data.message}</p>
        ) : error ? (
          <p className=" text-red-800">{error.message}</p>
        ) : isFetching ? (
          <p className="text-primary">Loading...</p>
        ) : null}
      </div>

      <div className="flex items-center justify-center">
        <Link href={"/"}>Home</Link>
        <Link href={"/users"}>Users</Link>
      </div>
    </main>
  );
}
