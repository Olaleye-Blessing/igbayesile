import { usePathname, useSearchParams } from "next/navigation";

export const useRedirect = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectParams = searchParams.toString();
  const redirectUrl =
    `${pathname}?${encodeURIComponent(redirectParams)}`.replace(/\?$/, "");

  return { redirectUrl };
};
