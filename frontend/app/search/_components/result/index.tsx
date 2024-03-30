"use client";

import Paginated from "@/components/paginated";
// import { useEffect, useState } from "react";
import {
  // IHotelResult,
  useResult,
  // IRoomResult
} from "../../_hooks/use-result";
import Base from "./base";
// import { Button } from "@/components/ui/button";

export default function Result() {
  const {
    result,
    loadMore,
    type,
    // searchParams,
    totalData: data,
  } = useResult();

  return (
    <output
      name="search-result"
      className="result block px-4 md:px-0 md:flex-1"
    >
      <div>
        <Paginated data={data} result={result} loadMore={loadMore}>
          <ul>
            {data.map((dat) => (
              <Base
                type={(type as any) || "hotels"}
                key={dat._id}
                data={dat as any}
              />
            ))}
          </ul>
        </Paginated>
      </div>
    </output>
  );
}
