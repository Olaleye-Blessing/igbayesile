"use client";

import useAuthStore from "@/stores/auth";
import HomeLogo from "../home-logo";
import { Button } from "../ui/button";
import axios from "axios";
import { API_BASE_URL } from "@/constants/backend";
import toast from "react-hot-toast";
import Search from "./search";
import LoggedInMenu from "./logged-in-menu";
import UnAuthenticatedMenu from "./un-authenticated-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const authToken = useAuthStore((state) => state.token);
  const storeLogout = useAuthStore((state) => state.logout);

  const logout = async () => {
    const toastId = "logging-out-user";

    try {
      storeLogout();

      toast.loading("Leaving...", { id: toastId });
      await axios.post(`${API_BASE_URL}/auth/logout`, undefined, {
        headers: { Authorization: `Bearer ${authToken.jwt}` },
        withCredentials: true,
      });

      toast.success("See you soon", { id: toastId });
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
    }
  };

  return (
    <nav className="border-b py-3" id="main-nav">
      <div className="layout flex items-center justify-between w-full mx-auto">
        <div>
          <HomeLogo />
        </div>
        <Search className="hidden sm:block sm:mx-auto" />
        <ThemeToggle className="!p-0 ml-auto sm:ml-0" />
        <>
          {user ? (
            <div className="flex items-center justify-end">
              <LoggedInMenu user={user} logout={logout} />
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={logout}
                className="hidden sm:block sm:ml-3"
              >
                Log Out
              </Button>
            </div>
          ) : (
            <UnAuthenticatedMenu />
          )}
        </>
      </div>
    </nav>
  );
};

export default Navbar;
