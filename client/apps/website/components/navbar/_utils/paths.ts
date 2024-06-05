import {
  ChefHat,
  Home,
  LayoutDashboard,
  LucideIcon,
  Plus,
  User,
} from "lucide-react";
import { HTMLAttributeAnchorTarget } from "react";

export type TPath = {
  href: string;
  label: string;
  Icon: LucideIcon;
  target?: HTMLAttributeAnchorTarget;
};

const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL!;

export const commonPaths: TPath[] = [
  { href: "/profile/", label: "My bookings", Icon: ChefHat },
  { href: "/profile/?tab=settings", label: "Edit Profile", Icon: User },
];

const managerStaffPaths = [
  {
    href: dashboardUrl,
    label: "Dashboard",
    Icon: LayoutDashboard,
    target: "_blank",
  },
];

export const managerPaths: TPath[] = [
  { href: "/hotels/new", label: "Create new hotel", Icon: Plus },
  { href: "/profile/?tab=hotels", label: "My hotels", Icon: Home },
  ...managerStaffPaths,
];

export const staffPaths: TPath[] = [...managerStaffPaths];

export const guestPaths: TPath[] = [];
