"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormField } from "@/components/custom/form-field";
import { Button, buttonVariants } from "@/components/ui/button";
import { API_BASE_URL } from "@/constants/backend";
import { IUser } from "@/interfaces/user";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import useAuthStore from "@/stores/auth";

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
        data: {
          data: { user },
        },
      } = await axios.post<{ data: { user: IUser } }>(
        `${API_BASE_URL}/auth/login`,
        data,
        {
          withCredentials: true,
        },
      );
      toast.success("Signed in successfully", { id: toastId });
      storeLogin(user);
      router.push(redirectPage);
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
          className="flex mx-auto mt-6"
          isLoading={form.formState.isSubmitting}
        >
          Log In
        </Button>
      </form>
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
    </main>
  );
}
