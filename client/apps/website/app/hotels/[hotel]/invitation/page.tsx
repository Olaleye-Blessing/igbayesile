"use client";

import Protected from "@website/components/protected";
import { IPage } from "@ui/interfaces/page";
import Main from "./main";

type PageProps = IPage<{ hotel: string }>;

export default function Page({ params }: PageProps) {
  console.log("__ PARAMS ___", params);

  return (
    <Protected role="staff">
      <Main hotel={params.hotel} />
    </Protected>
  );
}
