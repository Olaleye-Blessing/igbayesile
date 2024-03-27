import { DateRange } from "react-day-picker";

export interface SearchData {
  country: string;
  state: string;
  city: string;
  name: string;
  type: "hotels" | "rooms";
  amenities: string[];
  price: {
    gte: number | string;
    lte: number | string;
  };
  beds: {
    gte: number | string;
    lte: number | string;
  };
  date: DateRange | undefined;
}
