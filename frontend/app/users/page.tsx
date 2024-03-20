/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { BACKEND_URL } from "@/constants/backend";
import React, { useEffect, useState } from "react";

const getUsers = async () => {
  console.log("loading true");
  let data: any = {
    BACKEND_URL,
    env: process.env.NODE_ENV,
  };
  try {
    const req = await fetch(`${BACKEND_URL}/api/v1/users`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    });
    const res = await req.json();
    data = { ...data, ...res };
    return { ...res, BACKEND_URL };
  } catch (error) {
    console.log("___ THERE IS AN ERROR ____");
    data = { ...data, message: "Error" };
  } finally {
    console.log("Loading false");
  }

  return data;
};

export default function Page() {
  const [users, setUsers] = useState({});

  useEffect(() => {
    (async () => {
      setUsers(await getUsers());
    })();

    return () => {};
  }, []);

  return (
    <div>
      <h1>Page</h1>
      <p>{JSON.stringify(users)}</p>
    </div>
  );
}
