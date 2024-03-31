"use client";

import { FormEventHandler } from "react";
import toast from "react-hot-toast";
import { FormField } from "@/components/custom/form-field";
import { Button } from "@/components/ui/button";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import { useIGBInstance } from "@/hooks/use-igb-instance";
import { useSearchParams } from "next/navigation";

interface FormData {
  password: string;
  passwordConfirm: string;
}

export default function Page() {
  const token = useSearchParams().get("token");
  const { igbInstance } = useIGBInstance();

  const resetPassword: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!token)
      return toast.error("Invalid reset token! Request for a new one", {
        id: "reset-password-token-invalid",
      });

    let data = new FormData(e.currentTarget);
    let body = Object.fromEntries(data.entries()) as unknown as FormData;

    if (Object.values(body).some((v) => !v))
      return toast.error("Fill all required fields", { id: "required-fields" });

    if (body.password.length < 6)
      return toast.error("Password is too short", { id: "too-short" });

    if (body.password !== body.passwordConfirm)
      return toast.error("Passwords do not match", { id: "unmatch" });

    const toastId = "resetting";

    toast.loading("Resetting password", { id: toastId });

    try {
      const {
        data: { message },
      } = await igbInstance().post<{ message: string }>(
        `/auth/reset-password/${token}`,
        body,
      );

      toast.success(message, { id: toastId });
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
    }
  };

  return (
    <main className="auth__main">
      <form onSubmit={resetPassword}>
        <FormField
          label="New Password"
          input={{ name: "password", required: true, type: "password" }}
          required
        />
        <FormField
          label="Confirm New Password"
          input={{ name: "passwordConfirm", required: true, type: "password" }}
          required
        />
        <Button>Set New Password</Button>
      </form>
    </main>
  );
}
