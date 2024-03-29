import { cn } from "@/lib/utils";
import { useReviews } from "./use-review";
import Loading from "@/app/loading";
import { useEffect, useState } from "react";
import { IReview } from "@/interfaces/review";
import { Button } from "@/components/ui/button";
import Review from "./review";

type Hotel = { type: "hotel"; hotelId: string };
type Room = { type: "room"; roomId: string };
type Common = { showHeader?: boolean; className?: string };

type ReviewsProps = Common & (Hotel | Room);

export default function Reviews({
  showHeader,
  className,
  ...props
}: ReviewsProps) {
  const { result, loadMore } = useReviews({
    type: props.type,
    id: props.type === "hotel" ? props.hotelId : props.roomId,
  });
  const [data, setData] = useState<IReview[]>([]);

  useEffect(() => {
    if (result.isFetching) return;

    if (!result.data) return;

    setData((prev) => [...prev, ...result.data.reviews]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.isFetching]);

  return (
    <section className={cn("", className)}>
      {showHeader && (
        <header>
          <h3>Reviews</h3>
        </header>
      )}
      <div>
        {result.isPending ? (
          <Loading />
        ) : result.isError ? (
          <p>Error: {result.error.message}</p>
        ) : (
          <>
            {data.length === 0 ? (
              <p className="">No reviews</p>
            ) : (
              <ul className="reviews grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(20rem,_1fr))]">
                {data.map((rev) => (
                  <Review key={rev._id} review={rev} />
                ))}
              </ul>
            )}
          </>
        )}

        {data.length > 0 &&
          result.data &&
          result.data.reviews.length > 0 &&
          !result.isFetching && (
            <Button
              type="button"
              onClick={() => {
                loadMore();
              }}
              className="flex mx-auto mt-4 max-w-28"
              disabled={result.isLoading}
            >
              Load More
            </Button>
          )}
      </div>
    </section>
  );
}
