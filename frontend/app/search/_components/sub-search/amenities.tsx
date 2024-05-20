import AmenitiesComp from "@/app/hotels/new/_components/amenities";

import { UseFormReturn } from "react-hook-form";
import { SearchData } from "../../_types";

interface AmenitiesProps {
  form: UseFormReturn<SearchData, any, undefined>;
  type: "hotels" | "rooms";
}

export default function Amenities({ form, type }: AmenitiesProps) {
  return (
    <section className="!border-b-0">
      <h3>Filter by Amenities</h3>
      <AmenitiesComp
        form={form}
        listClassName="md:grid-cols-[repeat(auto-fill,minmax(30rem,_1fr))] max-h-[22rem] overflow-y-auto"
        defaultChecks={form.getValues("amenities")}
        target={type === "hotels" ? "hotel" : "room"}
        info=""
      />
    </section>
  );
}
