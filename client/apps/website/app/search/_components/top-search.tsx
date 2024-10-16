"use client";

import CountriesStates from "@website/components/countries-states";
import { Button } from "@ui/components/ui/button";
import { useFormContext } from "react-hook-form";
import { SearchData } from "../_types";
import { FormField } from "@ui/components/custom/form-field";
import { DatePickerWithRange } from "@ui/components/custom/date-picker/date-range-picker";
import { Label } from "@ui/components/ui/label";
import ToggleContainer from "./toggle-container";
import useSearchParameters from "@website/hooks/use-search-parameters";
import { useDebouncedField } from "../_hooks/use-debounced-field";

const fromDate = new Date();

export default function TopSearch() {
  const { updateParams, deleteParams } = useSearchParameters();
  const form = useFormContext<SearchData>();
  const { handleSearchChange } = useDebouncedField();

  return (
    <div className="sticky p-4 top-0 left-0 z-20 md:w-full md:flex-shrink-0 md:bg-background">
      <ToggleContainer title="Search" className="">
        <div className="[&>*]:px-2 grid grid-cols-1 gap-0 gap-x-4 sm:grid-cols-[repeat(auto-fill,minmax(240px,_1fr))] sm:pt-3 sm:pb-1">
          <div className="mb-3">
            <Label htmlFor="dates">
              Check in - Check out(
              <span className="short-label text-xs">comming soon</span>)
            </Label>
            <DatePickerWithRange
              {...form.watch("date")}
              handleSetDate={(dates) => form.setValue("date", dates)}
              emptyMsg={<span>Check in - Check out</span>}
              triggerClassName="w-full max-w-none"
              options={{ fromDate }}
              disableTriggerBtn
            />
          </div>
          <CountriesStates
            defaultCountry={form.getValues("country")}
            defaultState={form.getValues("state")}
            country={form.watch("country")}
            state={form.watch("state")}
            handleSetLocation={(type, value) => {
              value
                ? updateParams({ [type]: value }, "push")
                : deleteParams([type], "push");

              form.setValue(type, value);
            }}
            countryContClassName="!w-full !max-w-none !mb-3"
            stateContClassName="!w-full !max-w-none !mb-3"
          />
          <FormField
            input={{
              ...form.register("city"),
              placeholder: "City",
              onChange: (e) => {
                handleSearchChange("city", e.target.value.trim());
              },
            }}
          />
          <FormField
            input={{
              ...form.register("name"),
              placeholder: "Search for hotels/rooms",
              onChange: (e) => {
                handleSearchChange("name", e.target.value.trim());
              },
            }}
          />
          <div className="mb-3 flex items-end justify-center flex-wrap [&>*]:flex-1 sm:mt-0">
            <Button className="w-full max-w-[20rem] mr-4">Search</Button>
            {/* TODO: You can add this later */}
            {/* <Button
              className="w-full max-w-[20rem]"
              variant="destructive"
              type="button"
              onClick={() => {
                form.reset();
                router.push("/search");
              }}
            >
              Clear
            </Button> */}
          </div>
        </div>
      </ToggleContainer>
    </div>
  );
}
