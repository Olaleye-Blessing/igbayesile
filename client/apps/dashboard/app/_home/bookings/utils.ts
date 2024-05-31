import { IBookingKeys } from "./data";

export const labels: Record<IBookingKeys, string> = {
  checked_in: "Check In",
  checked_out: "Check Out",
  scheduled: "Scheduled",
  total: "Total",
};

export const colors: Record<IBookingKeys, string> = {
  checked_in: "green",
  checked_out: "red",
  scheduled: "orange",
  total: "blue",
};
