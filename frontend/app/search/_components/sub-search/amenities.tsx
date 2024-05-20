import AmenitiesComp from "@/app/hotels/new/_components/amenities";

import { UseFormReturn } from "react-hook-form";
import { SearchData } from "../../_types";
import useSearchParameters from "@/hooks/use-search-parameters";

interface AmenitiesProps {
  form: UseFormReturn<SearchData, any, undefined>;
  type: "hotels" | "rooms";
}

export default function Amenities({ form, type }: AmenitiesProps) {
  const { updateParams, deleteParams } = useSearchParameters();

  const searchAmenities = (amenities: any[]) => {
    if (amenities.length === 0) return deleteParams(["amenities"], "push");

    updateParams({ amenities: amenities.toString() }, "push");
  };
  return (
    <section className="!border-b-0">
      <h3>Filter by Amenities</h3>
      <AmenitiesComp
        form={form}
        listClassName="md:grid-cols-[repeat(auto-fill,minmax(30rem,_1fr))] max-h-[22rem] overflow-y-auto"
        defaultChecks={form.getValues("amenities")}
        target={type === "hotels" ? "hotel" : "room"}
        info=""
        onChange={searchAmenities}
      />
    </section>
  );
}
