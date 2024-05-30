"use client";

import Confirm from "./_component/confirm";
import Protected from "@website/components/protected";
import Detail from "./_component/detail";
import { useBookInfo } from "./_hooks/book-info";

export default function Page() {
  const bookInfo = useBookInfo();

  return (
    <Protected>
      <main className="global-bg min-h-[calc(100vh-4rem)]">
        <div className="layout grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
          <Detail bookInfo={bookInfo} />
          <Confirm bookInfo={bookInfo} />
        </div>
      </main>
    </Protected>
  );
}
