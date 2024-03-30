import { ChefHat, Home, LucideIcon, Plus, User } from "lucide-react";

type TPath = { href: string; label: string; Icon: LucideIcon };

export const commonPaths: TPath[] = [
  { href: "/bookings", label: "My bookings", Icon: ChefHat },
  { href: "/profile/edit", label: "Edit Profile", Icon: User },
];

export const managerPaths: TPath[] = [
  { href: "/hotels/new", label: "Create new hotel", Icon: Plus },
  { href: "/profile/hotels", label: "My hotels", Icon: Home },
];

export const guestPaths: TPath[] = [];
