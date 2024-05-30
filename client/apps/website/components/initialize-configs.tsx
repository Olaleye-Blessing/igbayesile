"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import Loading from "@website/app/loading";
import { useIGBInstance } from "@website/hooks/use-igb-instance";
import useAuthStore from "@website/stores/auth";

export default function InitializeConfigs({ children }: PropsWithChildren) {
  const { refreshToken } = useIGBInstance();
  const [loading, setLoading] = useState(true);
  const login = useAuthStore((state) => state.login);
  const updateToken = useAuthStore((state) => state.updateToken);

  useEffect(() => {
    (async function persistLoggedInUser() {
      try {
        const response = await refreshToken();
        login(response.user, response.authToken);
        setLoading(false);
      } catch (error) {
        updateToken({ status: "not-authenticated" });
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
