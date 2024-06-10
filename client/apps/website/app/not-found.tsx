import NotFound from "@ui/components/not-found";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Igbayesile | Not Found",
  description: "This page is not available on our server!",
};

export default function Page() {
  return (
    <NotFound Link={Link} />
  );
}
