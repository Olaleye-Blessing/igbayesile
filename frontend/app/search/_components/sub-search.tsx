"use client";

import { FormField } from "@/components/custom/form-field";
import { SearchData } from "../types";
import { Controller, useFormContext } from "react-hook-form";
import { FormRadioField } from "@/components/custom/form-radio-field";
import Amenities from "@/app/hotels/new/_components/amenities";
import ToggleContainer from "./toggle-container";

const types = [
  {
    id: "hotels",
    value: "hotels",
  },
  {
    id: "rooms",
    value: "rooms",
  },
];

export default function SubSearch() {
  const form = useFormContext<SearchData>();
  const type = form.watch("type");

  return (
    // <ToggleContainer title="Filter" className="md:col-start-1 md:col-end-2">
    <div className="bg-white p-4 md:p-0 md:bg-transparent md:max-w-[15rem] md:w-full md:flex-1 md:min-w-[12rem] md:self-start md:sticky md:top-48 md:py-0 md:pl-0 md:mr-4 md:flex-shrink-0">
      <ToggleContainer
        title="Filter"
        // className="md:max-w-[15rem] md:w-full md:flex-1 md:sticky md:top-40 md:left-0"
      >
        <div className="[&>*]:px-2 [&>*]:border-b [&>*]:py-3 md:border-gray-200">
          <section>
            <h3 className="">Search Type</h3>
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormRadioField
                  label="Search by this only:"
                  labelClassName="sr-only"
                  options={types}
                  radioGroup={{
                    className: "capitalize space-y-1",
                    onValueChange: field.onChange,
                    name: "type",
                    value: form.watch("type") || "",
                    defaultValue: "hotels",
                  }}
                />
              )}
            />
          </section>
          {type === "rooms" && (
            <>
              <section>
                <h3>Your budget per 24 hours</h3>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    input={{
                      ...form.register("price.gte"),
                      type: "number",
                      min: 0,
                    }}
                    label="Minimum"
                  />
                  <FormField
                    input={{
                      ...form.register("price.lte"),
                      type: "number",
                      min: 0,
                    }}
                    label="Maximum"
                  />
                </div>
              </section>
              <section>
                <h3>Number of beds</h3>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    input={{
                      ...form.register("beds.gte"),
                      type: "number",
                      min: 1,
                    }}
                    label="Minimum"
                  />
                  <FormField
                    input={{
                      ...form.register("beds.lte"),
                      type: "number",
                      min: 1,
                    }}
                    label="Maximum"
                  />
                </div>
              </section>
            </>
          )}
          <section className="!border-b-0">
            <h3>Filter by Amenities</h3>
            <Amenities
              form={form}
              listClassName="md:grid-cols-[repeat(auto-fill,minmax(30rem,_1fr))]"
              defaultChecks={form.getValues("amenities")}
            />
          </section>
          {/* TODO: */}
          {/* Ratings Later */}
        </div>
      </ToggleContainer>
    </div>
  );
}
