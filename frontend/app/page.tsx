"use client";
import Link from "next/link";
import { useState } from "react";
import { useIGBQuery } from "@/hooks/use-igb-query";

export default function Home() {
  const [loadUsers, setLoadUsers] = useState(false);

  const { data, error, refetch, isFetched, isFetching } = useIGBQuery<{
    message: string;
  }>({
    url: `/users`,
    options: {
      queryKey: ["users"],
      enabled: loadUsers,
    },
  });

  return (
    <main className="home">
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
