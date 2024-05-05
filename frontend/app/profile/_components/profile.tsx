import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/interfaces/user";
import EditAvatar from "./edit-avatar";

interface ProfileProps {
  user: IUser;
}

// page content -> avatar(button to change) -> username
export default function Profile({ user }: ProfileProps) {
  const imgFallback = user.name[0].toUpperCase();

  return (
    <div className="text-center px-4 mb-4 sm:sticky sm:top-4 sm:left-0 sm:mt-4 sm:mr-4">
      <figure className="flex items-center justify-center relative max-w-max mx-auto">
        <Avatar className="w-32 h-32">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{imgFallback}</AvatarFallback>
        </Avatar>
        <EditAvatar />
      </figure>
      <p className="font-semibold leading-5">{user.name}</p>
      <p className="short-label">{user.role}</p>
    </div>
  );
}
