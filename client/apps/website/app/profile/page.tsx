"use client";

import Protected from "@website/components/protected";
import Main from "./_components/main";

export default function Page() {
  return (
    <Protected>
      <Main />
    </Protected>
  );
}
