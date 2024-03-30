/* eslint-disable @next/next/no-img-element */
import { useIGBQuery } from "@/hooks/use-igb-query";
import Loading from "@/app/loading";
import { IFullHotel } from "@/interfaces/hotel";
import { hotelsKeys } from "../../utils/query-key-factory";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AmentiyWithIcon from "@/components/amentiy-with-icon";
import AutoPlayImages from "@/components/custom/carousel/auto-play-images";
import RatingsReviewBadge from "@/components/rating-review-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Reviews from "@/components/reviews";
import useSearchParameters from "@/hooks/use-search-parameters";
import Rooms from "./rooms";

interface MainProps {
  hotelId: string;
}

export default function Main({ hotelId }: MainProps) {
  const { data, error } = useIGBQuery<{ hotel: IFullHotel }>({
    url: `/hotels/${hotelId}`,
    options: {
      queryKey: hotelsKeys.hotel(hotelId),
    },
  });

  const searchParams = useSearchParameters();

  const tab = searchParams.getParam("tab") || "rooms";

  return (
    <>
      {data?.hotel ? (
        <>
          <header className="pt-4 mb-4">
            <h1 className="mb-2 mr-2">{data.hotel.name}</h1>
            <button
              type="button"
              className="flex items-center justify-start flex-shrink-0 -mt-2"
            >
              <RatingsReviewBadge
                reviews={data.hotel.totalReviews}
                ratings={data.hotel.ratings}
              />
            </button>
          </header>
          <section className="space-y-2">
            <AutoPlayImages
              images={data.hotel.images}
              nextClassName="right-0 xl:-right-12"
              prevClassName="left-0 xl:-left-12"
              className="max-w-[97%] mx-auto"
            />
            <p className="flex items-center justify-start">
              <span>
                <MapPin className="text-blue-700 w-8 h-8" />
              </span>
              <span className="font-bold">
                {`${data.hotel.city || "-"}, ${data.hotel.state}, ${data.hotel.country}`.replace(
                  /^-,/,
                  "",
                )}
              </span>
            </p>
            <div>
              <p className="font-bold">Location Description</p>
              <p>{data.hotel.location_description}</p>
            </div>
            <div>
              <p className="font-bold">Hotel Description</p>
              <p>{data.hotel.description}</p>
            </div>
          </section>
          <section className="mt-4">
            <h3 className="font-bold text-base">Amenities</h3>
            {data.hotel.amenities.length === 0 ? (
              <p>No Amenity</p>
            ) : (
              <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {data.hotel.amenities.map((amenity) => (
                  <AmentiyWithIcon key={amenity} amenity={amenity} />
                ))}
              </ul>
            )}
          </section>
          <section className="mt-3">
            <h3 className="text-base">Owner</h3>
            <div className="flex items-center justify-start">
              <Avatar className="mr-2">
                {/* TODO: Replace this with the manager avatar */}
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {data.hotel.manager.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p>{data.hotel.manager.name}</p>
                {/* TODO: Enable managers to add bio */}
                <p>No bio yet</p>
              </div>
            </div>
          </section>
          <Tabs
            defaultValue={tab}
            className=""
            value={tab}
            onValueChange={(tab) => {
              searchParams.updateParams({ tab }, "push");
            }}
          >
            <TabsList className="sticky top-0 left-0 right-0 z-[999] global-bg w-full justify-start py-4">
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="rooms" className="">
              <Rooms hotelId={hotelId} />
            </TabsContent>
            <TabsContent value="reviews">
              <Reviews type="hotel" hotelId={hotelId} />
            </TabsContent>
          </Tabs>
        </>
      ) : error ? (
        <p className="error">{error.message}</p>
      ) : (
        <Loading />
      )}
    </>
  );
}
