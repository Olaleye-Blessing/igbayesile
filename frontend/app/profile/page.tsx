"use client";

import Protected from "@/components/protected";
import Main from "./_components/main";

export default function Page() {
  return (
    <Protected>
      <Main />
    </Protected>
  );
}
