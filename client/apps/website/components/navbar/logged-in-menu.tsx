import { useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button, buttonVariants } from "@ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@ui/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { IUser } from "@ui/interfaces/user";
import {
  commonPaths,
  guestPaths,
  managerPaths,
  staffPaths,
  TPath,
} from "./_utils/paths";
import Search from "./search";
import Divider from "./divider";
interface LoggedInMenuProps {
  user: IUser;
  logout: () => Promise<void>;
}

const userPaths: Record<IUser["role"], Array<TPath>> = {
  guest: guestPaths,
  manager: managerPaths,
  staff: staffPaths,
};

export default function LoggedInMenu({ user, logout }: LoggedInMenuProps) {
  const [open, setOpen] = useState(false);

  const path = userPaths[user.role];
  const paths = [...path, ...commonPaths];

  return (
    <Sheet open={open} onOpenChange={(val) => setOpen(val)}>
      <SheetTrigger asChild>
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent className="!max-w-80 rounded-l-md">
        <SheetHeader>
          <div className="flex items-start justify-start">
            <Avatar className="mr-2">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h3 className="text-base">{user.name}</h3>
              <p className="short-label -mt-1">{user.role}</p>
            </div>
          </div>
        </SheetHeader>
        <Divider />
        <ul className="flex flex-col">
          {paths.map((path) => {
            const Component = path.external ? "a" : Link;
            const attrs = path.external
              ? { rel: "noreferrer", target: "_blank" }
              : {};

            return (
              <li
                key={path.href}
                className="w-full flex items-center justify-start"
              >
                <Component
                  {...attrs}
                  href={path.href}
                  className={buttonVariants({
                    variant: "ghost",
                    className: "!justify-start w-full",
                  })}
                  onClick={() => setOpen(false)}
                >
                  <span className="mr-2">
                    <path.Icon className="h-5 w-4" />
                  </span>
                  <span className="text-sm">{path.label}</span>
                </Component>
              </li>
            );
          })}
        </ul>
        <Divider />
        <Search className="w-full my-1" />
        <Divider />
        <Button
          type="button"
          onClick={logout}
          variant="ghost"
          className="!justify-start w-full !my-0 !-mt-1"
        >
          <span className="mr-2">
            <LogOut className="h-5 w-4" />
          </span>
          <span>Sign out</span>
        </Button>
      </SheetContent>
    </Sheet>
  );
}
