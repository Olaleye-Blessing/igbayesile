import { differenceInDays } from "date-fns";
import { useSearchParams } from "next/navigation";

export interface IBookInfo {
  location: string;
  guests: number;
  totalDays: number;
  checkIn: string | null;
  checkOut: string | null;
  roomId: string | null;
}

export const useBookInfo = (): IBookInfo => {
  const searchParams = useSearchParams();
  const location = `${searchParams.get("city")}, ${searchParams.get("state")}, ${searchParams.get("country")}`;
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const totalDays = differenceInDays(checkOut || 0, checkIn || 0);
  const guests = Number(searchParams.get("userGuests")) || 0;
  const roomId = searchParams.get("roomId");

  return {
    location,
    guests,
    totalDays,
    checkIn,
    checkOut,
    roomId,
  };
};
