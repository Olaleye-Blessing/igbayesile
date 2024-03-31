import Base from "@/app/search/_components/result/base";
import Paginated from "@/components/paginated";
import { usePagination } from "@/components/paginated/use-pagination";
import { IHotel } from "@/interfaces/hotel";
import { IUser } from "@/interfaces/user";

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
