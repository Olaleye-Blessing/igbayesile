"use client";

import useSearchParameters from "@/hooks/use-search-parameters";
import Stepper from "./_components/stepper";
import HotelForm from "./_components/hotel-form";
import RoomForm from "./_components/room-form";

export default function Main() {
  const hotelId: null | string = useSearchParameters().getParam("hotel");

  return (
    <main className="layout pb-1">
      <header className="mt-5">
        <h1>{hotelId ? "Set Up A Room" : "Create New Hotel"}</h1>
        <Stepper current={hotelId ? 1 : 0} />
      </header>
      <section>
        {hotelId ? <RoomForm hotelId={hotelId} /> : <HotelForm />}
      </section>
    </main>
  );
}
