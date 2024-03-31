import Paginated from "@/components/paginated";
import { usePagination } from "@/components/paginated/use-pagination";
import { IUserBooking } from "@/interfaces/booking";
import Booking from "./booking";

const url = `/bookings`;

export default function Bookings() {
  const {
    result,
    loadMore,
    totalData: bookings,
  } = usePagination<IUserBooking>({
    url,
    options: {
      queryKey: ["search", { url }],
    },
  });

  return (
    <section>
      <header className="sr-only">
        <h3>Hotels Section</h3>
      </header>
      <div>
        <Paginated data={bookings} result={result} loadMore={loadMore}>
          <ul className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(22rem,_1fr))]">
            {bookings.map((booking) => (
              <Booking key={booking._id} booking={booking} />
            ))}
          </ul>
        </Paginated>
      </div>
    </section>
  );
}
