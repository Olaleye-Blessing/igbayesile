import Base from "@/app/search/_components/result/base";
import Paginated from "@/components/paginated";
import { usePagination } from "@/components/paginated/use-pagination";
import { buttonVariants } from "@/components/ui/button";
import { IHotel } from "@/interfaces/hotel";
import { IUser } from "@/interfaces/user";
import { Home } from "lucide-react";
import Link from "next/link";

interface HotelsProps {
  user: IUser;
}

export default function Hotels({ user }: HotelsProps) {
  const url = `/hotels/?manager=${user._id}`;
  const {
    result,
    loadMore,
    totalData: hotels,
  } = usePagination<IHotel>({
    url,
    options: {
      queryKey: ["search", { url }],
      // staleTime: 0,
    },
  });

  return (
    <section>
      <header className="sr-only">
        <h3>Hotels Section</h3>
      </header>
      <section className="mb-3">
        {/* TODO: Include a search box and filter dropdown */}
        <Link
          href="/hotels/new"
          className={buttonVariants({
            className: "flex items-center justify-center",
          })}
        >
          <Home className="lucide-icon" />
          New
        </Link>
      </section>
      <div>
        <Paginated data={hotels} result={result} loadMore={loadMore}>
          <ul>
            {hotels.map((dat) => (
              <Base type={"hotels"} key={dat._id} data={dat as any} />
            ))}
          </ul>
        </Paginated>
      </div>
    </section>
  );
}
