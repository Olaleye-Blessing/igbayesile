"use client";

import Protected from "@/components/protected";
import Main from "./main";

export default function Page() {
  return (
    <Protected role="guest">
      <Main />
    </Protected>
  );
}
