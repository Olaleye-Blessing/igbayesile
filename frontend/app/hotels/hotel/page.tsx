"use client";

import { useSearchParams } from "next/navigation";
import Main from "./_components/main";

// hotels/hotel/?hotelId=1234
export default function Page() {
  const hotelId = useSearchParams().get("hotelId");

  return (
    <main className="bg-blue-100 bg-opacity-20 min-h-screen pb-8">
      <div className="layout">
        {hotelId ? (
          <Main hotelId={hotelId} />
        ) : (
          <header>
            <h1>Please provide your hotel ID</h1>
          </header>
        )}
      </div>
    </main>
  );
}
