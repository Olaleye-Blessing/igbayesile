import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { IReview } from "@ui/interfaces/review";
import { Star } from "lucide-react";

interface ReviewProps {
  review: IReview;
}
export default function Review({ review }: ReviewProps) {
  return (
    <li className="cardboard px-2 py-3">
      <div className="flex items-start justify-start">
        <figure className="mr-1">
          <Avatar>
            <AvatarImage src={review.user.avatar} />
            <AvatarFallback>
              {review.user.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </figure>
        <div>
          <p className="text-sm font-semibold">{review.user.name}</p>
          <div className="flex items-center justify-start">
            <div className="flex items-center justify-start">
              {Array.from({ length: Math.floor(review.rating) }).map(
                (_, index) => (
                  <Star key={index} className="w-3 h-3 fill-yellow-400" />
                ),
              )}
            </div>
            <p className="short-label">A month ago</p>
          </div>
        </div>
      </div>
      <p className="max-h-36 overflow-y-auto">{review.content}</p>
    </li>
  );
}
