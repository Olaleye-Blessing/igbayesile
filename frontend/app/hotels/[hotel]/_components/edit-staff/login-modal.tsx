import { FormField } from "@/components/custom/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormEventHandler } from "react";
import { useStaff } from "./hook";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import toast from "react-hot-toast";

export interface LoginModalProps {
  open: boolean;
  onOpenChange(open: boolean): void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { login, toastId: loginToastId } = useStaff();

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await login(e);

      onOpenChange(false);
      toast("You can continue with your action now.", { id: loginToastId });
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: loginToastId });
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
