"use client";

import Amenities from "@/components/amenities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IAmenity } from "@/interfaces/amenity";
import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";

export default function Search() {
  const router = useRouter();
  const [amenities, setAmenities] = useState<string[]>([]);

  const onSearch: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    const minPrice = (form.elements as any).minPrice.value;
    const maxPrice = (form.elements as any).maxPrice.value;

    const search = new URLSearchParams({ type: "rooms" });
    if (minPrice) search.set("minPrice", minPrice);
    if (maxPrice) search.set("maxPrice", maxPrice);
    // TODO: Fix this when searching by amenities work
    if (amenities.length > 0) search.set("amenities", amenities.join(","));

    router.push(`/search/?${search.toString()}`);
  };

  const selectAmenity = (checked: boolean, amenity: IAmenity) => {
    setAmenities((prev) => {
      let newAmenities = [...prev];

      if (checked) {
        newAmenities.unshift(amenity._id);
      } else {
        newAmenities = newAmenities.filter((a) => a !== amenity._id);
      }

      return newAmenities;
    });
  };
  return (
    <form
      onSubmit={onSearch}
      className="cardboard px-6 py-4 rounded-md w-[90%] mx-auto relative -top-12 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(25rem,_1fr))] sm:gap-4  md:grid-cols-2 lg:flex lg:items-start lg:justify-between"
    >
      <h3 className="sr-only">Simple Search</h3>
      <section className="amenities md:col-span-2 lg:basis-6/12">
        <header>
          <h4 className="mb-2">Amenities</h4>
        </header>
        <Amenities
          className="flex flex-wrap"
          limit={5}
          target="room"
          mode="form"
          onSelect={selectAmenity}
        />
      </section>
      {/* TODO: Include this when filter by date is active */}
      {/* <section>
        <header>
          <h4>Check In - Check Out</h4>
        </header>
        <div>Include Date picker when user can searh with date</div>
      </section> */}
      <section className="lg:basis-4/12">
        <header>
          <h4 className="mb-2">Price</h4>
        </header>
        <div className="flex items-center justify-start flex-wrap lg:flex-col">
          <Input
            name="minPrice"
            aria-label="Minimum room price"
            placeholder="min price, e.g $20"
            type="number"
            min={0}
            className="py-2 flex-1 mb-2 mr-4 lg:mr-0"
          />
          <Input
            name="maxPrice"
            aria-label="Maximum room price"
            placeholder="max price, e.g $20,000"
            type="number"
            min={0}
            className="py-2 flex-1 mb-2"
          />
        </div>
      </section>
      <div className="flex items-center justify-center sm:items-end md:justify-start lg:basis-2/12 lg:self-stretch lg:items-center md:max-w-max">
        <Button type="submit" className="w-full max-w-20 sm:mb-2">
          Search
        </Button>
      </div>
    </form>
  );
}
