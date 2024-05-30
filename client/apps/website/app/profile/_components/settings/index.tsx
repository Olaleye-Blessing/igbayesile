import { IUser } from "@ui/interfaces/user";
import ChangePassword from "./change-password";
import DeleteAccount from "./delete-account";
import ChangeEmail from "./change-email";

interface SettingsProps {
  user: IUser;
}

export default function Settings({ user }: SettingsProps) {
  return (
    <section>
      <header>
        <h3 className="text-primary text-xl">@{user.email}</h3>
      </header>
      <ChangePassword />
      <ChangeEmail />
      <DeleteAccount user={user} />
    </section>
  );
}
