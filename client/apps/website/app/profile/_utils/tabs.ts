import { ChefHat, Home, Settings } from "lucide-react";

export const tabs = [
  { label: "bookings", Icon: ChefHat },
  { label: "hotels", Icon: Home, access: "manager" },
  { label: "settings", Icon: Settings },
];
