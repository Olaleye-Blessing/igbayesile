"use client";
import { BACKEND_URL } from "@/constants/backend";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const mutation = useMutation({
    mutationFn: async () => {
      try {
        console.log("logging in...");
        let { data } = await axios.post(
          `${BACKEND_URL}/api/v1/auth/login`,
          {
            email: "a@gmail.com",
            password: "New Password",
          },
          {
            withCredentials: true,
          },
        );
        console.log(data);
      } catch (error) {
        throw error;
      } finally {
        console.log("login done");
      }
    },
  });

  const [loadUsers, setLoadUsers] = useState(false);

  const { isLoading, data, error } = useQuery({
    queryKey: ["users"],
    enabled: loadUsers,
    queryFn: async () => {
      try {
        let { data } = await axios.get(`${BACKEND_URL}/api/v1/users`);
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  console.log(isLoading, data, error);

  return (
    <main>
      <h1>Home Page</h1>

      <button type="button" onClick={() => mutation.mutate()}>
        Login In
      </button>

      <button type="button" onClick={() => setLoadUsers(true)}>
        Get Users
      </button>

      <div>
        <Link href={"/"}>Home</Link>
        <Link href={"/users"}>Users</Link>
      </div>
    </main>
  );
}
