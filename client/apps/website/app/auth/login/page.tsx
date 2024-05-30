"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormField } from "@ui/components/custom/form-field";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { API_BASE_URL } from "@website/constants/backend";
import { handleIgbayesileAPIError } from "@website/utils/handle-igbayesile-api-error";
import useAuthStore from "@website/stores/auth";
import { ILoginResponse } from "../_types";
import { allowedDashboardSiteRoles } from "@ui/constants/roles";

interface FormData {
  email: string;
  password: string;
}

export default function Page() {
  const redirectPage = useSearchParams().get("redirect") || "/";
  const router = useRouter();
  const storeLogin = useAuthStore((state) => state.login);

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async (data: FormData) => {
    const toastId = "logging-in";

    try {
      const {
        data: { data: result },
      } = await axios.post<{ data: ILoginResponse }>(
        `${API_BASE_URL}/auth/login`,
        data,
        {
          withCredentials: true,
        },
      );

      toast.success("Signed in successfully", { id: toastId });

      // TODO: Update this logic when there is another subdomain
      if (!redirectPage.startsWith("http")) {
        storeLogin(result.user, result.authToken);
        return router.push(redirectPage);
      }

      if (allowedDashboardSiteRoles.includes(result.user.role)) {
        return (window.location.href = redirectPage);
      }

      storeLogin(result.user, result.authToken);
      router.push("/");
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
    }
  };

  return (
    <main className="auth__main">
      <form
        className="cardboard p-4"
        onSubmit={form.handleSubmit(login, () =>
          toast.error("Please fill all fields", { id: "signin-fill-fields" }),
        )}
      >
        <header>
          <h2 className="text-center text-base font-normal mb-4">Log In</h2>
        </header>
        <FormField
          required
          input={{ ...form.register("email", { required: true }) }}
          labelClassName="capitalize"
          errMsg={
            form.formState.errors.email?.type === "required"
              ? "Required"
              : undefined
          }
        />
        <FormField
          required
          input={{
            ...form.register("password", { required: true }),
            type: "password",
          }}
          labelClassName="capitalize"
          errMsg={
            form.formState.errors.password?.type === "required"
              ? "Required"
              : undefined
          }
        />
        <Button
          type="submit"
          className="flex mx-auto mt-6 w-full max-w-52"
          isLoading={form.formState.isSubmitting}
        >
          Log In
        </Button>
      </form>
      <div className="flex items-center justify-between flex-wrap">
        <p>
          No account?{" "}
          <Link
            href="/auth/signup"
            className={buttonVariants({
              variant: "link",
              className: "!px-0",
            })}
          >
            Sign up
          </Link>
        </p>
        <p>
          <Link
            href="/auth/forgot-password"
            className={buttonVariants({
              variant: "link",
              className: "!px-0",
            })}
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </main>
  );
}
