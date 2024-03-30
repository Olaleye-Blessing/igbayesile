import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="global-bg body-min-screen-h flex flex-col items-center justify-center text-center">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link
        href="/"
        className={buttonVariants({
          className: "mt-4",
        })}
      >
        Return Home
      </Link>
    </main>
  );
}
