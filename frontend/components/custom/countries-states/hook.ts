import { useQuery } from "@tanstack/react-query";
import axios, { Method } from "axios";
import { useState } from "react";
import { ICountryUnicode, IResult, IState } from "./types";

const baseURL = `https://countriesnow.space/api/v0.1/countries`;

export const useCountriesStates = (_country = "", _state = "") => {
  // const [country, setCountry] = useState("");
  const [country, setCountry] = useState(_country);
  const [state, setState] = useState(_state);

  const handleSetLocation = (type: "state" | "country", value: string) =>
    type === "state" ? setState(value) : setCountry(value);

  const countries = useQuery({
    queryKey: ["countries-unicode"],
    queryFn: async () =>
      await fetchData<ICountryUnicode[]>("flag/unicode", "get"),
    retry: 1,
  });

  const states = useQuery({
    queryKey: ["country-states", { country }],
    queryFn: async () =>
      await fetchData<{ states: IState[] }>(
        `states/q?country=${country}`,
        "get",
      ),
    retry: 0,
    enabled: Boolean(country),
  });

  return { countries, country, state, states, handleSetLocation };
};

async function fetchData<T>(path: string, method: Method, body?: Object) {
  try {
    let {
      data: { error, data },
    } = await axios<IResult<T>>({
      method,
      url: `${baseURL}/${path}`,
      data: body,
    });

    if (error)
      throw new Error("Couldn't retrieve data, please try again later!!");

    return data;
  } catch (error) {
    throw error;
  }
}
