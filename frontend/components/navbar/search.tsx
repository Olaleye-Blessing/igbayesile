"use client";

import { FormEventHandler } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchProps {
  className?: string;
}

export default function Search({ className }: SearchProps) {
  const router = useRouter();
  const handleSearch: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const hotel = (
      new FormData(e.currentTarget).get("search") as string
    ).trim();

    if (!hotel) return;

    router.push(`/search?name=${hotel}&type=hotels&limit=5&page=1`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn("flex-1 max-w-80", className)}
      role="search"
    >
      <Input
        type="search"
        placeholder="Search for hotel name"
        aria-label="Search for hotel name"
        name="search"
        className="w-full border-gray-300"
      />
      <input type="submit" hidden />
    </form>
  );
}
