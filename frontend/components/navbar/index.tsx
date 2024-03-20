"use client";

import useAuthStore from "@/stores/auth";
import HomeLogo from "../home-logo";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import axios from "axios";
import { API_BASE_URL } from "@/constants/backend";
import toast from "react-hot-toast";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const storeLogout = useAuthStore((state) => state.logout);

  const logout = async () => {
    const toastId = "logging-out-user";

    try {
      storeLogout();

      toast.loading("Leaving...", { id: toastId });
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true },
      );

      toast.success("See you soon", { id: toastId });
    } catch (error) {
      console.info(error);
    }
  };

  return (
    <nav className="border-b py-3" id="main-nav">
      <div className="layout flex items-center justify-between w-full mx-auto">
        <div>
          <HomeLogo />
        </div>
        <form>search from</form>
        <>
          {Boolean(user) ? (
            <div className="flex items-center justify-end">
              <p className="mr-2">avatar</p>
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={logout}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <div>
              <Link
                href="/auth/login"
                className={buttonVariants({
                  variant: "link",
                  className: "mr-2 text-black hover:text-primary",
                })}
              >
                Log In
              </Link>
              <Link href="/auth/signup" className={buttonVariants()}>
                Create Account
              </Link>
            </div>
          )}
        </>
      </div>
    </nav>
  );
};

export default Navbar;
