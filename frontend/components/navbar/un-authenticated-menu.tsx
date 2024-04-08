import Link from "next/link";
import { buttonVariants } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import Search from "./search";
import Divider from "./divider";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function UnAuthenticatedMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden sm:flex sm:items-center sm:justify-end">
        <Link
          href="/auth/login"
          className={buttonVariants({
            variant: "link",
            className: "mr-2 text-black hover:text-primary",
          })}
        >
          Log In
        </Link>
        <Link href="/auth/signup" className={buttonVariants()}>
          Create Account
        </Link>
      </div>

      <Sheet open={open} onOpenChange={(val) => setOpen(val)}>
        <SheetTrigger className="sm:hidden">
          <Menu className="w-5 h-4 text-primary" />
        </SheetTrigger>
        <SheetContent className="!max-w-80 rounded-l-md">
          <SheetHeader>
            <p>Menu</p>
          </SheetHeader>
          <Divider />
          <div className="flex flex-col">
            <Link
              href="/auth/login"
              className={buttonVariants({
                variant: "secondary",
                className: "text-black hover:text-primary mb-4",
              })}
            >
              Log In
            </Link>
            <Link href="/auth/signup" className={buttonVariants()}>
              Create Account
            </Link>
          </div>
          <Divider />
          <Search className="w-full my-1" />
        </SheetContent>
      </Sheet>
    </>
  );
}
