import {
  ChefHat,
  Home,
  LayoutDashboard,
  LucideIcon,
  Plus,
  User,
} from "lucide-react";

export type TPath = {
  href: string;
  label: string;
  Icon: LucideIcon;
  external?: boolean;
};

const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL!;

export const commonPaths: TPath[] = [
  { href: "/profile/", label: "My bookings", Icon: ChefHat },
  { href: "/profile/?tab=settings", label: "Edit Profile", Icon: User },
];

const managerStaffPaths: TPath[] = [
  {
    href: dashboardUrl,
    label: "Dashboard",
    Icon: LayoutDashboard,
    external: true,
  },
];

export const managerPaths: TPath[] = [
  { href: "/hotels/new", label: "Create new hotel", Icon: Plus },
  { href: "/profile/?tab=hotels", label: "My hotels", Icon: Home },
  ...managerStaffPaths,
];

export const staffPaths: TPath[] = [...managerStaffPaths];

export const guestPaths: TPath[] = [];
