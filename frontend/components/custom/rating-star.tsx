import { Star, StarHalf } from "lucide-react";

interface RatingStarProps {
  rating: number;
  className?: string;
}

const maxRating = 5;

export default function RatingStar({ rating, className }: RatingStarProps) {
  if (rating > 5) {
    rating = 5;
  } else if (rating < 0) {
    rating = 0;
  }
  // 0.0 - 0.3 -> empty
  // 0.4 - 0.7 -> half
  // 0.8 - 0.9 -> full
  let full = 0,
    half = 0,
    empty = 0;

  full = Math.floor(rating);

  const remainder = rating - full;

  if (remainder <= 0.3) {
    empty = maxRating - full;
  } else if (remainder >= 0.4 && remainder <= 0.7) {
    half = 1;
    empty = maxRating - full - half;
  } else if (remainder >= 0.8 && remainder <= 0.99) {
    full += 1;
    empty = maxRating - full;
  }

  return (
    <div className={`flex items-center justify-start ${className}`}>
      {Array.from({ length: full }, (_, idx) => idx).map((val) => (
        <span key={val}>
          <Star className="lucide-icon mr-0 fill-orange-400 text-orange-400" />
        </span>
      ))}
      {Array.from({ length: half }, (_, idx) => idx).map((val) => (
        <span key={val}>
          <StarHalf className="lucide-icon mr-0 fill-orange-400 text-orange-400" />
        </span>
      ))}
      {Array.from({ length: empty }, (_, idx) => idx).map((val) => (
        <span key={val}>
          <Star className="lucide-icon mr-0" />
        </span>
      ))}
    </div>
  );
}
