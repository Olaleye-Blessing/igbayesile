import { cn } from "@/lib/utils";
import { useReviews } from "./use-review";
import Review from "./review";
import Paginated from "../paginated";

type Hotel = { type: "hotel"; hotelId: string };
type Room = { type: "room"; roomId: string };
type Common = { showHeader?: boolean; className?: string };

type ReviewsProps = Common & (Hotel | Room);

export default function Reviews({
  showHeader,
  className,
  ...props
}: ReviewsProps) {
  const {
    result,
    loadMore,
    totalData: reviews,
  } = useReviews({
    type: props.type,
    id: props.type === "hotel" ? props.hotelId : props.roomId,
  });

  return (
    <section className={cn("", className)}>
      {showHeader && (
        <header>
          <h3>Reviews</h3>
        </header>
      )}
      <div>
        <Paginated loadMore={loadMore} result={result} data={reviews}>
          <ul className="reviews grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(20rem,_1fr))]">
            {reviews.map((rev) => (
              <Review key={rev._id} review={rev} />
            ))}
          </ul>
        </Paginated>
      </div>
    </section>
  );
}
