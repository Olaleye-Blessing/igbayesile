import { IUserBooking } from "@/interfaces/booking";
import CreateReview from "../create-review";
import { AxiosInstance } from "axios";
import { convertDateToLocale } from "@/utils/convert-date-to-locale";

interface ReviewsProps {
  booking: IUserBooking;
  igbInstance: () => AxiosInstance;
}

export default function Reviews({ booking, igbInstance }: ReviewsProps) {
  return (
    <>
      {booking.reviews.length > 0 && (
        <ul>
          {booking.reviews.map((review) => (
            <li key={review._id} className="cardboard px-3 py-2 mb-4 last:mb-0">
              <div className="flex items-center flex-wrap justify-between mb-2">
                <div className="flex items-center justify-start">
                  <p className="capitalize mr-1">{review.type} Review</p>
                  <p className="ratBadge">
                    <span className="text-lg">3</span>
                    <span className="text-base">/5</span>
                  </p>
                </div>
                <p className="text-sm text-gray-500 font-semibold">
                  {convertDateToLocale({
                    date: review.createdAt,
                    options: { weekday: undefined },
                  })}
                </p>
              </div>
              <p className="overflow-y-auto max-h-40">
                {review.content} Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Nemo, recusandae. Eaque aperiam natus libero.
                Illo debitis ullam nostrum dolore illum tempore eveniet
                voluptatem minus aliquid aut quae fugit, repudiandae deleniti
                omnis dolores, sequi fuga unde sed libero ipsam hic voluptatibus
                inventore. Inventore, facere quia dignissimos amet, minima
                ratione numquam incidunt officia quam saepe aspernatur eius
                repellat voluptates. Quasi sapiente id repellat dicta illo.
                Illum in eligendi, esse ratione, laudantium, molestiae deserunt
                optio dolorum nemo fugit consequatur! Sed ad eaque rem eveniet
                dolorum sunt odit illum, impedit nostrum, ea, quam autem. Porro
                tempore velit provident. Soluta autem accusantium nesciunt quos
                pariatur.{" "}
              </p>
            </li>
          ))}
        </ul>
      )}
      {booking.reviews.length < 2 && (
        <CreateReview
          hotelId={booking.room.hotel}
          bookingId={booking._id}
          roomId={booking.room._id}
          igbInstance={igbInstance}
        />
      )}
    </>
  );
}
