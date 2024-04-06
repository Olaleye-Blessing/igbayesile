"use client";

import Loading from "@/app/loading";
import { useIGBInstance } from "@/hooks/use-igb-instance";
import useAuthStore from "@/stores/auth";
import { PropsWithChildren, useEffect, useState } from "react";

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
