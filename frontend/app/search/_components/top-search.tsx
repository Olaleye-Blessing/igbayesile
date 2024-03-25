"use client";

import CountriesStates from "@/components/custom/countries-states";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { SearchData } from "../types";
import { FormField } from "@/components/custom/form-field";
import { DatePickerWithRange } from "@/components/custom/date-picker/date-range-picker";
import { Label } from "@/components/ui/label";
import ToggleContainer from "./toggle-container";
import { useRouter } from "next/navigation";

export default function TopSearch() {
  const form = useFormContext<SearchData>();
  const router = useRouter();

  return (
    // <ToggleContainer title="Search" className="md:col-span-2 md:py-2">
    <div className="bg-white sticky p-4 top-0 left-0 z-20 md:w-full md:flex-shrink-0">
      <ToggleContainer title="Search" className="">
        <div className="[&>*]:px-2 grid grid-cols-1 gap-0 gap-x-4 sm:grid-cols-[repeat(auto-fill,minmax(240px,_1fr))]">
          <div className="mb-3">
            <Label htmlFor="dates">Check in - Check out</Label>
            <DatePickerWithRange
              {...form.watch("date")}
              handleSetDate={(dates) => form.setValue("date", dates)}
              emptyMsg={<span>Check in - Check out</span>}
              triggerClassName="w-full max-w-none"
            />
          </div>
          <CountriesStates
            defaultCountry={form.getValues("country")}
            defaultState={form.getValues("state")}
            country={form.watch("country")}
            state={form.watch("state")}
            handleSetLocation={(type, value) => {
              form.setValue(type, value);
            }}
            countryContClassName="!w-full !max-w-none !mb-3"
            stateContClassName="!w-full !max-w-none !mb-3"
          />
          <FormField
            input={{ ...form.register("city"), placeholder: "City" }}
          />
          <FormField
            input={{
              ...form.register("name"),
              placeholder: "Search for hotels",
            }}
          />
          <div className="mb-3 flex items-end justify-center flex-wrap [&>*]:flex-1 sm:mt-0">
            <Button className="w-full max-w-[20rem] mr-4">Search</Button>
            <Button
              className="w-full max-w-[20rem]"
              variant="destructive"
              type="button"
              onClick={() => {
                form.reset();
                router.push("/search");
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </ToggleContainer>
    </div>
  );
}
