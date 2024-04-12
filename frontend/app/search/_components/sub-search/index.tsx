"use client";

import { SearchData } from "./../../_types";
import { useFormContext } from "react-hook-form";
import ToggleContainer from "./../toggle-container";
import Type from "./type";
import Budget from "./budget";
import Beds from "./beds";
import Amenities from "./amenities";
import Ratings from "./ratings";

export default function SubSearch() {
  const form = useFormContext<SearchData>();
  const type = form.watch("type");

  return (
    // <ToggleContainer title="Filter" className="md:col-start-1 md:col-end-2">
    <div className="bg-background p-4 md:p-0 md:bg-transparent md:max-w-[15rem] md:w-full md:flex-1 md:min-w-[12rem] md:self-start md:sticky md:top-48 md:py-0 md:pl-0 md:mr-4 md:flex-shrink-0">
      <ToggleContainer
        title="Filter"
        // className="md:max-w-[15rem] md:w-full md:flex-1 md:sticky md:top-40 md:left-0"
      >
        <div className="[&>*]:px-2 [&>*]:border-b [&>*]:py-3 md:border-gray-200">
          <Type form={form} />
          <Ratings form={form} />
          {type === "rooms" && (
            <>
              <Budget form={form} />
              <Beds form={form} />
            </>
          )}
          <Amenities form={form} type={type} />
        </div>
      </ToggleContainer>
    </div>
  );
}
