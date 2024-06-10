import Link from "next/link";
import React from "react";
import SiteLogo from "@ui/components/site-logo";

interface HomeLogoProps {
  className?: string;
}

export default function HomeLogo({ className }: HomeLogoProps) {
  return (
    <Link href="/" className={className}>
      <SiteLogo />
    </Link>
  );
}
