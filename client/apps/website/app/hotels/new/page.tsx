"use client";

import Protected from "@website/components/protected";
import Main from "./main";

export default function Page() {
  return (
    <Protected role="manager">
      <Main />
    </Protected>
  );
}
