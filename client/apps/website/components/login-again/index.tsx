import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { FormField } from "@ui/components/custom/form-field";
import { useLoginAgain } from "./use-login-again";
import { FormEventHandler } from "react";
import toast from "react-hot-toast";
import { handleIgbayesileAPIError } from "@website/utils/handle-igbayesile-api-error";

interface LoginAgainProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  successMsg?: string;
}

export default function LoginAgain({
  open,
  onOpenChange,
  successMsg = "You can continue with your action now.",
}: LoginAgainProps) {
  const { login, toastId } = useLoginAgain();

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await login(e);

      onOpenChange(false);
      toast(successMsg, { id: toastId });
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            Login again to prove you are in control of your account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin}>
          <FormField
            label="Password"
            input={{ name: "password", required: true, type: "password" }}
            required
          />
          <Button>Login</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
