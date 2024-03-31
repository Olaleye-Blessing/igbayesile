import { IUser } from "@/interfaces/user";
import ChangePassword from "./change-password";
import DeleteAccount from "./delete-account";

interface SettingsProps {
  user: IUser;
}

export default function Settings({ user }: SettingsProps) {
  return (
    <section>
      <header>
        <h3 className="text-primary text-xl">
          @{user.name.replace(/\s/i, "-")}
        </h3>
      </header>
      <ChangePassword />
      <DeleteAccount user={user} />
    </section>
  );
}
