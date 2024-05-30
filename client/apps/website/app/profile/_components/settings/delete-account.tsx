import { IUser } from "@ui/interfaces/user";
import Section from "./section";
import { Button } from "@ui/components/ui/button";
import toast from "react-hot-toast";

interface DeleteAccountProps {
  user: IUser;
}

export default function DeleteAccount({ user }: DeleteAccountProps) {
  return (
    <Section
      title="Danger Zone"
      className="[&>header>h2]:text-red-800 bg-red-200 bg-opacity-70"
    >
      <p>
        {user.role === "guest"
          ? "You won't be able to delete your account if you are currently checked in."
          : "You won't be able to delete your account if a guest is currently checked in to any of your hotels."}
      </p>

      <section className="mt-4">
        <h4>Delete Account</h4>
        <p>Deleting your account means:</p>
        <ul className="list-inside list-disc">
          <li>All your logged-in sessions will be removed.</li>
          <li>
            All your history, such as payments,{" "}
            <>
              {user.role === "guest" ? "and bookings" : "bookings, and hotels"}
            </>
            , will be lost.
          </li>
        </ul>
      </section>
      <Button
        variant="destructive"
        className="mt-4"
        onClick={() => {
          toast("Coming soon!", { id: "delete-account" });
        }}
      >
        Delete Account
      </Button>
    </Section>
  );
}
