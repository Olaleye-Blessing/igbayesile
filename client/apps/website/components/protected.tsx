"use client";

import { redirect, usePathname, useSearchParams } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import Loading from "@website/app/loading";
import { IUser } from "@ui/interfaces/user";
import useAuthStore from "@website/stores/auth";
import { useStore } from "@website/stores/store";

interface ProtectedProps extends PropsWithChildren {
  role?: IUser["role"];
}

export default function Protected({ role, children }: ProtectedProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authenticating, setAuthenticating] = useState(true);
  const user = useStore(useAuthStore, (state) => state.user);

  useEffect(
    function checkIfUserIsAuthenticated() {
      // zustand is yet to be initialized
      if (user === undefined) return;

      const redirectParams = searchParams.toString();
      const redirectUrl =
        `${pathname}?${encodeURIComponent(redirectParams)}`.replace(/\?$/, "");

      // zustand is initialized but null
      if (!user) return redirect(`/auth/login?redirect=${redirectUrl}`);

      if (role && user.role !== role) redirect("/");

      setAuthenticating(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  if (authenticating) return <Loading />;

  if (!user) return null;

  return <>{children}</>;
}
