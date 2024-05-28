import { ILoginResponse } from "@/app/auth/_types";
import { useIGBInstance } from "@/hooks/use-igb-instance";
import useAuthStore from "@/stores/auth";
import { FormEvent } from "react";
import toast from "react-hot-toast";

export const useSettings = () => {
  const storeLogin = useAuthStore((state) => state.login);

  const { igbInstance } = useIGBInstance();

  const toastIds = { email: "updating-email", login: "loggin-in" };

  const updateEmail = async (email: string) => {
    email = email.trim();

    if (!email) throw new Error("Provide a new email");

    toast.loading("Updating Email", { id: toastIds.email });

    let { data } = await igbInstance().patch<{ data: ILoginResponse }>(
      `/auth/me/email`,
      { email },
    );

    toast.success("Email Updated", { id: toastIds.email });

    return data.data;
  };

  // TODO: CREATE A HOOK OR COMPONENT FOR THIS RE-LOGIN
  const login = async (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;

    const password: string = (form.elements as any).password.value.trim();

    if (!password) throw new Error("Provie your password");

    toast.loading("Confirming...", { id: toastIds.login });

    let {
      data: { data },
    } = await igbInstance().post<{ data: ILoginResponse }>("/auth/me/login", {
      password,
    });

    storeLogin(data.user, data.authToken);

    toast.success("Confirmation successful", { id: toastIds.login });

    return data;
  };

  return { login, updateEmail, toastIds };
};
