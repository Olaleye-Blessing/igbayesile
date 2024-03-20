"use client";

import useAuthStore from "@/stores/auth";
import HomeLogo from "../home-logo";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);

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
              <Button variant="destructive" size="sm">
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
