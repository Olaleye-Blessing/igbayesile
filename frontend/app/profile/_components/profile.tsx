import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/interfaces/user";

interface ProfileProps {
  user: IUser;
}

// page content -> avatar(button to change) -> username
export default function Profile({ user }: ProfileProps) {
  return (
    <div className="text-center px-4 mb-4 sm:text-left sm:sticky sm:top-4 sm:left-0 sm:mt-4">
      <figure className="flex items-center justify-center">
        <Avatar className="w-32 h-32">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </figure>
      <p className="font-semibold leading-5">{user.name}</p>
      <p className="short-label">{user.role}</p>
    </div>
  );
}
