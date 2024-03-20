"use client";

import HomeLogo from "@/components/home-logo";
import { PropsWithChildren, useEffect } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  useEffect(function removeNavbar() {
    document.getElementById("main-nav")?.classList.add("!hidden");

    return () => {
      document.getElementById("main-nav")?.classList.remove("!hidden");
    };
  }, []);

  return (
    <div className="layout max-w-md mx-auto">
      <header>
        <h1 className="flex items-center justify-center my-4">
          <HomeLogo />
        </h1>
      </header>
      {children}
    </div>
  );
}
