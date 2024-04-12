"use client";

import { FormEventHandler } from "react";
import Result from "./_components/result";
import SubSearch from "./_components/sub-search";
import TopSearch from "./_components/top-search";
import { FormProvider, useForm } from "react-hook-form";
import { SearchData } from "./_types";
import "./_components/index.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<SearchData>({
    defaultValues: {
      country: searchParams.get("country") || "",
      state: searchParams.get("state") || "",
      city: searchParams.get("city") || "",
      name: searchParams.get("name") || "",
      type: searchParams.get("type") === "rooms" ? "rooms" : "hotels",
      ratings: searchParams.get("ratings") || "",
      amenities: searchParams.get("amenities")?.split(",") || [],
      price: {
        gte: Number(searchParams.get("minPrice")) || "",
        lte: Number(searchParams.get("maxPrice")) || "",
      },
      beds: {
        gte: Number(searchParams.get("minBeds")) || "",
        lte: Number(searchParams.get("maxBeds")) || "",
      },
      date: {
        from: new Date(searchParams.get("from") || Date.now()),
        to: (() => {
          const to = searchParams.get("to");
          return to ? new Date(to) : undefined;
        })(),
      },
    },
  });

  const handleOnSearch: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const data = form.getValues();
    const path = {
      ...data,
      // TODO: Include this when a room knows its checked in visitors
      // ...data.date,
      minPrice: +data.price.gte,
      maxPrice: +data.price.lte,
      minBeds: +data.beds.gte,
      maxBeds: +data.beds.lte,
      ratings: +data.ratings,
      // page: 1,
      // limit: 5,
    } as any;
    delete path.date;
    delete path.price;
    delete path.beds;

    // const validPath = { ...path, page: 1 };
    const validPath = { ...path };

    // TODO: Remove "minPrice" and "maxPrice" when DB knows the avg price of a hotel
    if (data.type !== "rooms") {
      ["minBeds", "maxBeds", "minPrice", "maxPrice"].forEach(
        (key) => delete validPath[key],
      );
    }

    Object.keys(path).forEach((key) => {
      if (!validPath[key] || (key === "amenities" && !validPath[key].length))
        delete validPath[key];
    });

    router.push(`/search/?${new URLSearchParams(validPath).toString()}`);
  };

  return (
    <main className="min-h-screen pb-8">
      <div className="layout px-0">
        <header>
          <h1 className="sr-only">Search</h1>
        </header>
        <section className="mt-4 md:mt-0">
          <FormProvider {...form}>
            <form
              onSubmit={handleOnSearch}
              className="grid grid-cols-1 md:flex md:flex-wrap"
            >
              <TopSearch />
              <div className="w-full md:px-4 md:flex md:items-stretch md:justify-start md:mt-4">
                <SubSearch />
                <Result />
              </div>
            </form>
          </FormProvider>
        </section>
      </div>
    </main>
  );
}
