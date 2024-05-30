"use client";

import Link from "next/link";
import { FormEventHandler } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FormField } from "@ui/components/custom/form-field";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { API_BASE_URL } from "@website/constants/backend";
import { handleIgbayesileAPIError } from "@website/utils/handle-igbayesile-api-error";

export default function Page() {
  const sendRequest: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    const email = (form.elements as any).email.value.trim();

    if (!email)
      return toast("Provide your email", { id: "forgot-pwd-required" });

    const toastId = "request-reset";

    toast.loading("Requesting password reset token", { id: toastId });

    try {
      const {
        data: { message, resetUrl },
      } = await axios.post<{ message: string; resetUrl?: string }>(
        `${API_BASE_URL}/auth/forgot-password`,
        { email },
      );

      toast.success(message, { id: toastId });

      if (process.env.NODE_ENV === "development")
        window.location.href = resetUrl!;

      form.reset();
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
    }
  };

  return (
    <main className="auth__main">
      <form className="cardboard p-4" onSubmit={sendRequest}>
        <header>
          <h2 className="text-center text-base font-normal mb-4">
            Request Password Reset
          </h2>
        </header>
        <FormField
          required
          input={{ type: "email", name: "email", required: true }}
          labelClassName="capitalize"
        />
        <Button type="submit" className="flex mx-auto mt-6">
          Request Reset
        </Button>
      </form>
      <p>
        Remember password?{" "}
        <Link
          href="/auth/login"
          className={buttonVariants({
            variant: "link",
            className: "!px-0",
          })}
        >
          Login
        </Link>
      </p>
    </main>
  );
}
