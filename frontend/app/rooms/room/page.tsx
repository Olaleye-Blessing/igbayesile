"use client";

import { useSearchParams } from "next/navigation";
import Main from "./_components/main";

export default function Page() {
  const roomId = useSearchParams().get("roomId");

  return (
    <main className="bg-blue-100 bg-opacity-20 min-h-screen pb-8">
      <div className="layout">
        {roomId ? <Main roomId={roomId} /> : <p>Invalid Room ID</p>}
      </div>
    </main>
  );
}
