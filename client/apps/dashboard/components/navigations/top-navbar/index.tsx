"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import Hotel from "./hotel";
import { Search } from "lucide-react";
import { Input } from "@ui/components/ui/input";
import { ThemeToggle } from "@ui/components/custom/theme-toggle";

export default function TopNavbar() {
  return (
    <div className="flex items-center justify-end lg:bg-muted/60 lg:px-4 lg:py-2">
      <form className="hidden lg:inline-flex lg:items-center lg:justify-start lg:mr-4 lg:w-full lg:relative lg:bg-transparent">
        <span className="absolute left-2 top-0 translate-y-[42%]">
          <Search className="w-5 h-5 text-muted-foreground" />
        </span>
        <Input
          type="text"
          name="search"
          id="search"
          className="w-full pt-1 pb-[0.3rem] pl-8 placeholder:font-semibold"
          placeholder="search for anything..."
        />
      </form>
      <ThemeToggle className="!p-0 ml-auto mr-2 sm:ml-0" />
      <Hotel />
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
