"use client";

import { Label } from "@/components/ui/label";
import { useCountriesStates } from "./hook";
import { ComboboxMain } from "@/components/ui/combobox-main";
import { cn } from "@/lib/utils";

interface CountriesStatesProps {
  country?: string;
  state?: string;
  handleSetLocation?: (type: "state" | "country", value: string) => void;
  showState?: boolean;
  countryContClassName?: string;
  stateContClassName?: string;
  countryRequired?: boolean;
  stateRequired?: boolean;
  countryErrMsg?: string;
  stateErrMsg?: string;
  defaultCountry?: string;
  defaultState?: string;
}

export default function CountriesStates({
  showState = true,
  countryContClassName,
  stateContClassName,
  countryRequired = false,
  stateRequired = false,
  countryErrMsg,
  stateErrMsg,
  defaultCountry,
  defaultState,
  ...props
}: CountriesStatesProps) {
  const { countries, country, states, state, handleSetLocation } =
    useCountriesStates(defaultCountry, defaultState);

  const _countries = (countries.data || []).map((country) => ({
    value: country.name,
    label: (
      <p>
        <span>{country.unicodeFlag}</span>
        <span>{country.name}</span>
      </p>
    ),
  }));

  const _states = (states.data?.states || []).map((state) => ({
    value: state.name,
    label: state.name,
  }));

  return (
    <>
      <div
        className={cn(["flex flex-col max-w-60 mb-4", countryContClassName])}
      >
        <Label required={countryRequired}>Country</Label>
        <ComboboxMain
          options={_countries}
          triggerPlaceholder={
            countries.isLoading ? "Loading..." : "Select a country"
          }
          emptyMsg="No country found"
          searchPlaceholder="Search for country"
          selectedValue={country}
          contentClassName=""
          onChange={(country) => {
            handleSetLocation("country", country);
            props.handleSetLocation?.("country", country);
          }}
        />
        {countryErrMsg && (
          <p className="text-red-600 text-sm text-left">{countryErrMsg}</p>
        )}
      </div>
      {showState && (
        <div className={cn(["flex flex-col max-w-60", stateContClassName])}>
          <Label required={stateRequired}>State</Label>
          <ComboboxMain
            options={_states}
            triggerPlaceholder={
              states.isLoading ? "Loading..." : "Select a state"
            }
            emptyMsg="No state found"
            searchPlaceholder="Search for state"
            selectedValue={state}
            disabled={!country}
            onChange={(state) => {
              handleSetLocation("state", state);
              props.handleSetLocation?.("state", state);
            }}
          />
          {stateErrMsg && (
            <p className="text-red-600 text-sm text-left">{stateErrMsg}</p>
          )}
        </div>
      )}
    </>
  );
}
