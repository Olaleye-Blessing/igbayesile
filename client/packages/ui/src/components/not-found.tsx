import { buttonVariants } from "@ui/components/ui/button";

interface NotFoundProps {
  Link: any;
}

export default function NotFound({ Link }: NotFoundProps) {
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
