import Link from "next/link";
import React from "react";

interface HomeLogoProps {
  className?: string;
}

export default function HomeLogo({ className }: HomeLogoProps) {
  return (
    <Link href="/" className={className}>
      HomeLogo
    </Link>
  );
}
