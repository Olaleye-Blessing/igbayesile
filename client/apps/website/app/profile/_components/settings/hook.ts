import { ILoginResponse } from "@website/app/auth/_types";
import { useLoginAgain } from "@website/components/login-again/use-login-again";
import { useIGBInstance } from "@website/hooks/use-igb-instance";
import toast from "react-hot-toast";

export const useSettings = () => {
  const { igbInstance } = useIGBInstance();
  const { login } = useLoginAgain();

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

  return { login, updateEmail, toastIds };
};
