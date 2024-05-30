"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useIGBInstance } from "@dashboard/hooks/use-igb-instance";
import useAuthStore from "@dashboard/stores/auth";
import Loading from "@dashboard/app/loading";
import { usePathname } from "next/navigation";
import { allowedDashboardSiteRoles } from "@ui/constants/roles";

export default function InitializeConfigs({ children }: PropsWithChildren) {
  const pathname = usePathname();

  console.log({ pathname });
  const { refreshToken } = useIGBInstance();
  const [loading, setLoading] = useState(true);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    (async function persistLoggedInUser() {
      const currentPage = window.location.href;

      const mainSite =
        process.env.NODE_ENV === "production"
          ? "https://www.igbayesile.xyz"
          : "http://localhost:3000";

      const redirectUrl = `${mainSite}/auth/login?redirect=${currentPage}`;

      try {
        const response = await refreshToken();
        if (!allowedDashboardSiteRoles.includes(response.user.role)) {
          return (window.location.href = redirectUrl);
        }

        login(response.user, response.authToken);
        setLoading(false);
      } catch (error) {
        return (window.location.href = redirectUrl);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="flex-items-center justify-center text-center">
        <Loading />
      </div>
    );

  return <>{children}</>;
}
