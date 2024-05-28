import { useState } from "react";
import toast from "react-hot-toast";
import { handleIgbayesileAPIError } from "@/utils/handle-igbayesile-api-error";
import { FormField } from "@/components/custom/form-field";
import Section from "./section";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/auth";
import { useSettings } from "./hook";
import LoginAgain from "@/components/login-again";

export default function ChangeEmail() {
  const token = useAuthStore((state) => state.token);
  const localLogin = useAuthStore((state) => state.login);
  const { updateEmail, toastIds } = useSettings();
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
      <LoginAgain
        open={openLoginModal}
        onOpenChange={(open) => setOpenLoginModal(open)}
      />
    </>
  );
}
