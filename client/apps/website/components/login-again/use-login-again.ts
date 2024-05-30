import { FormEvent } from "react";
import toast from "react-hot-toast";
import { ILoginResponse } from "@website/app/auth/_types";
import { useIGBInstance } from "@website/hooks/use-igb-instance";
import useAuthStore from "@website/stores/auth";

export const useLoginAgain = () => {
  const { igbInstance } = useIGBInstance();
  const storeLogin = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);

  const toastId = "loggin-again";

  const login = async (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;

    const password: string = (form.elements as any).password.value.trim();

    if (!password) throw new Error("Provie your password");

    toast.loading("Confirming...", { id: toastId });

    let {
      data: { data },
    } = await igbInstance().post<{ data: ILoginResponse }>("/auth/me/login", {
      password,
    });

    storeLogin(data.user, data.authToken);

    toast.success("Confirmation successful", { id: toastId });

    return data;
  };

  const reLogin = () => token.decoded?.mode !== "login";

  return { login, toastId, reLogin };
};
