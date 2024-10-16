"use client";
import Link from "next/link";
import HomeLogo from "../../home-logo";
import { pages } from "./utils";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { usePathname } from "next/navigation";
import { usePagePath } from "@dashboard/hooks/use-page-path";

export default function MainNavbar() {
  const { updatePagePath } = usePagePath();
  const pathname = usePathname();
  const disbledNavLinks = pathname === "/";
  const toggleNav = () => {
    document.querySelector(".main_nav--cont")?.classList.toggle("open");
  };

  return (
    <div className="relative flex items-center justify-start lg:flex-col lg:self-start lg:sticky lg:top-0 lg:left-0">
      <div className="flex items-center justify-start lg:border-input lg:border-r-[0.01rem] lg:w-full lg:justify-center">
        <HomeLogo className="lg:py-4" />
        <Button
          variant="outline"
          className="!p-0 w-6 h-6 lg:hidden"
          type="button"
          onClick={toggleNav}
        >
          <Menu />
        </Button>
      </div>
      <div className="main_nav--cont transition-all">
        <nav className="px-4 max-w-md">
          <ul className="flex flex-col">
            {pages.map((page) => {
              const path = updatePagePath({
                newPath: page.name,
                action: "normal",
              });

              const Tag: any = disbledNavLinks ? "p" : Link;
              const options = disbledNavLinks
                ? {
                    className:
                      "flex items-center justify-start cursor-not-allowed",
                  }
                : {
                    href: path,
                    className: buttonVariants({
                      variant: "ghost",
                      className: `!justify-start capitalize w-full lg:hover:bg-primary ${pathname === path ? " bg-blue-800 bg-opacity-60" : ""}`,
                    }),
                    onClick: toggleNav,
                  };

              return (
                <li className="mb-4 last:mb-0">
                  <Tag {...options}>
                    <span className="mr-2">{<page.icon />}</span>
                    <span>{page.name}</span>
                  </Tag>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
