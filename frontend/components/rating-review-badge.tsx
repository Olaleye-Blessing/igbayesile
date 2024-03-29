interface RatingsReviewBadgeProps {
  ratings: number;
  reviews: number;
}
export default function RatingsReviewBadge({
  ratings = 0,
  reviews = 0,
}: RatingsReviewBadgeProps) {
  return (
    <>
      <span className="rounded-md px-2 pt-0.5 pb-1 w-auto h-auto flex items-center justify-center text-center bg-primary text-white text-sm mr-1">
        {ratings}/5
      </span>
      <span className="short-label">
        {reviews} {reviews === 1 ? "review" : "reviews"}
      </span>
    </>
  );
}
