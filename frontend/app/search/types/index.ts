import { DateRange } from "react-day-picker";

export interface SearchData {
  country: string;
  state: string;
  city: string;
  name: string;
  type: "hotels" | "rooms";
  amenities: string[];
  price: {
    gte: number;
    lte: number;
  };
  beds: {
    gte: number;
    lte: number;
  };
  date: DateRange | undefined;
}
