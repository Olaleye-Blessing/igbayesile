import { FormField } from "@/components/custom/form-field";
import Section from "./section";
import { Button } from "@/components/ui/button";
import { FormEventHandler } from "react";
import toast from "react-hot-toast";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import { useIGBInstance } from "@/hooks/use-igb-instance";

interface FormData {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export default function ChangePassword() {
  const { igbInstance } = useIGBInstance();

  const updatePassword: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    let data = new FormData(e.currentTarget);
    let body = Object.fromEntries(data.entries()) as unknown as FormData;

    if (Object.values(body).some((v) => !v))
      return toast.error("Fill all required fields", { id: "required-fields" });

    if (body.password.length < 6)
      return toast.error("Password is too short", { id: "too-short" });

    // if (body.password !== body.passwordConfirm)
    //   return toast.error("Passwords do not match", { id: "unmatch" });

    const toastId = "updating";

    toast.loading("Updating password", { id: toastId });
    try {
      await igbInstance().patch(`/auth/me/update-password`, body);
      toast.success("Password updated successfully", { id: toastId });
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
    }
  };

  return (
    <Section title="Set new password">
      <form onSubmit={updatePassword}>
        <FormField
          label="Current Password"
          input={{ name: "currentPassword", required: true, type: "password" }}
          required
        />
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
    </Section>
  );
}
