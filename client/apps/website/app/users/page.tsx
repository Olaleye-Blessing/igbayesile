/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useIGBQuery } from "@website/hooks/use-igb-query";

export default function Page() {
  const { data: users, error } = useIGBQuery<{ message: string }>({
    options: {
      queryKey: ["users"],
    },
    url: `/users`,
  });

  return (
    <div>
      <h1>Page</h1>
      {users && <p>{JSON.stringify(users)}</p>}
      {error && <p>{JSON.stringify(error)}</p>}
    </div>
  );
}
