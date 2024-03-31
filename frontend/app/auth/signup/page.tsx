"use client";

import toast from "react-hot-toast";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { FormField } from "@/components/custom/form-field";
import { API_BASE_URL } from "@/constants/backend";
import { FormRadioField } from "@/components/custom/form-radio-field";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import { IUser } from "@/interfaces/user";
import useAuthStore from "@/stores/auth";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const fields = [
  {
    name: "name",
    placeholder: "John Doe",
  },
  {
    name: "email",
    type: "email",
    placeholder: "johndoe@gmail.com",
  },
  {
    name: "password",
    type: "password",
    placeholder: "******",
  },
];

const roles = [
  {
    id: "guest",
    value: "guest",
  },
  {
    id: "manager",
    value: "manager",
  },
];

export default function SignUp() {
  const redirectPage = useSearchParams().get("redirect") || "/";
  const storeLogin = useAuthStore((state) => state.login);
  const router = useRouter();
  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const signUp = async (body: FormData) => {
    const toastId = "signing-up";
    const data = {
      ...body,
      passwordConfirm: body.password,
    };

    toast.loading("Creating an account", { id: toastId });

    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.post<{ data: { user: IUser } }>(
        `${API_BASE_URL}/auth/signup`,
        data,
        {
          withCredentials: true,
        },
      );
      toast.success("Account created successfully", { id: toastId });
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
        onSubmit={form.handleSubmit(signUp, () => {
          toast.error("Please fill all required fields", {
            id: "signup-fill-fields",
          });
        })}
      >
        <header>
          <h2 className="text-center text-base font-normal mb-4">
            Create an account
          </h2>
        </header>
        <>
          {fields.map((field) => {
            const fieldKey = field.name as keyof FormData;
            const isError =
              form.formState.errors[fieldKey]?.type === "required";

            return (
              <FormField
                key={field.name}
                required
                input={{
                  ...form.register(field.name as keyof FormData, {
                    required: true,
                  }),
                  ...field,
                }}
                labelClassName="capitalize"
                errMsg={isError ? "Required" : undefined}
              />
            );
          })}
        </>

        <Controller
          name="role"
          control={form.control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormRadioField
              required
              label="Role"
              options={roles}
              errMsg={
                form.formState.errors.role?.type === "required"
                  ? "Required"
                  : undefined
              }
              radioGroup={{
                className: "flex items-center justify-start capitalize",
                onValueChange: field.onChange,
                name: "role",
                value: form.watch("role") || "",
              }}
            />
          )}
        />

        <Button
          type="submit"
          className="flex mx-auto mt-6"
          isLoading={form.formState.isSubmitting}
        >
          Create Account
        </Button>
      </form>
      <p>
        Have an account?{" "}
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
