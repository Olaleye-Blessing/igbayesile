"use client";
/* eslint-disable @next/next/no-img-element */
import { useIGBQuery } from "@website/hooks/use-igb-query";
import Loading from "@website/app/loading";
import { IFullHotel } from "@ui/interfaces/hotel";
import { hotelsKeys } from "../../utils/query-key-factory";
import { MapPin } from "lucide-react";
import AutoPlayImages from "@ui/components/custom/carousel/auto-play-images";
import RatingsReviewBadge from "@ui/components/custom/rating-review-badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/components/ui/tabs";
import Reviews from "@website/components/reviews";
import useSearchParameters from "@website/hooks/use-search-parameters";
import Rooms from "./rooms";
import Amenity from "@website/components/amenities/amenity";
import NewRoom from "./new-room";
import useAuthStore from "@website/stores/auth";
import Profile from "./profile";
import AssignStaffButton from "./edit-staff/assign-staff-button";

interface MainProps {
  hotelId: string;
}

export default function Main({ hotelId }: MainProps) {
  const user = useAuthStore((store) => store.user);
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
          <header className="pt-4 mb-2 flex items-center justify-between flex-wrap">
            <div className="flex-items-center justify-between mb-2 mr-1">
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
            </div>
            {user?._id === data.hotel.manager._id && (
              <div className="flex items-center justify-end mb-2">
                {!data.hotel.staff && (
                  <AssignStaffButton
                    text="Invite A Staff"
                    variant="outline"
                    hotel={data.hotel}
                    className="mb-2"
                  />
                )}
                <NewRoom hotel={data.hotel} />
              </div>
            )}
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
                  <p
                    key={amenity._id}
                    className="flex items-center justify-start"
                  >
                    <Amenity amenity={amenity} />
                  </p>
                ))}
              </ul>
            )}
          </section>
          {data.hotel.staff && (
            <Profile hotel={data.hotel} authUser={user} role="staff" />
          )}
          <Profile hotel={data.hotel} role="manager" />
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
