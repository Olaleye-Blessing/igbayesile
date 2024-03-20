"use client";
import { BACKEND_URL } from "@/constants/backend";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    (async function login() {
      try {
        console.log("___ LOADING ____");
        console.log({ BACKEND_URL });
        const req = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
          method: "post",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email: "a@gmail.com",
            password: "New Password",
          }),
          credentials: "include",
        });

        const res = await req.json();

        console.log(res);
      } catch (error) {
        console.log("___ ERROR ___");
        console.log(error);
      }
      console.log("___ FINISH LOADING ____");
    })();
  }, []);

  return (
    <main>
      <h1>Home Page</h1>

      <div>
        <Link href={"/"}>Home</Link>
        <Link href={"/users"}>Users</Link>
      </div>
    </main>
  );
}
