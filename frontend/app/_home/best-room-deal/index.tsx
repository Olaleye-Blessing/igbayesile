import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Main from "./main";

export default function BestRoomDeal() {
  return (
    <section className="layout mt-8">
      <header className="flex items-center justify-between flex-wrap mb-4">
        <h2>Get The Best Deal</h2>
        <Link
          href={`/search/?sort=price&type=rooms`}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Explore more
        </Link>
      </header>
      <Main />
    </section>
  );
}
