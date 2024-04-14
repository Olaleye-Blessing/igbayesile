import { FormEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import { FormField } from "@/components/custom/form-field";
import Section from "./section";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSettings } from "./hook";

export default function ChangeEmail() {
  const token = useAuthStore((state) => state.token);
  const localLogin = useAuthStore((state) => state.login);
  const { login, updateEmail, toastIds } = useSettings();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [email, setEmail] = useState("");

  const handleUpdateEmail = async () => {
    if (token.decoded?.mode === "refresh") return setOpenLoginModal(true);

    try {
      const result = await updateEmail(email);
      localLogin(result.user, result.authToken);
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastIds.email });
    }
  };

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await login(e);

      setOpenLoginModal(false);
      toast("You can update your email now", { id: toastIds.login });
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastIds.login });
    }
  };

  return (
    <>
      <Section title="Update Email">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateEmail();
          }}
          className="mt-2"
        >
          <FormField
            label="New Email"
            input={{
              name: "email",
              required: true,
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
            }}
            required
          />
          <Button>Set New Email</Button>
        </form>
      </Section>
      <Dialog
        open={openLoginModal}
        onOpenChange={(open) => setOpenLoginModal(open)}
      >
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
    </>
  );
}
