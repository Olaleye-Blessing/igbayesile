"use client";

import { FormEventHandler } from "react";
import Result from "./_components/result";
import SubSearch from "./_components/sub-search";
import TopSearch from "./_components/top-search";
import { FormProvider, useForm } from "react-hook-form";
import { SearchData } from "./types";
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
      amenities: searchParams.get("amenities")?.split(",") || [],
      price: {
        gte: Number(searchParams.get("minPrice")) || 0,
        lte: Number(searchParams.get("maxPrice")) || 2000,
      },
      beds: {
        gte: Number(searchParams.get("minBeds")) || 1,
        lte: Number(searchParams.get("maxBeds")) || 4,
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
      ...data.date,
      minPrice: +data.price.gte,
      maxPrice: +data.price.lte,
      minBeds: +data.beds.gte,
      maxBeds: +data.beds.lte,
      page: 1,
      limit: 5,
    } as any;
    delete path.date;
    delete path.price;
    delete path.beds;

    const validPath = { ...path, page: 1 };

    Object.keys(path).forEach((key) => {
      if (!validPath[key] || (key === "amenities" && !validPath[key].length))
        delete validPath[key];
    });

    router.push(`/search/?${new URLSearchParams(validPath).toString()}`);
  };

  return (
    <main className="bg-blue-100 bg-opacity-20 min-h-screen pb-8">
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
