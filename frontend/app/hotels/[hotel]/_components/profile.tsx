import { IUser } from "@/interfaces/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditStaff from "./edit-staff";
import { IFullHotel } from "@/interfaces/hotel";

interface ProfileProps {
  authUser?: IUser | null;
  hotel: IFullHotel;
  role: IUser["role"];
}

export default function Profile({ authUser, hotel, role }: ProfileProps) {
  const account = role === "staff" ? hotel.staff! : hotel.manager;

  return (
    <section className="cardboard px-4 py-2 my-3">
      <h3 className="text-base">{role === "staff" ? "Staff" : "Owner"}</h3>
      <div className="flex items-center justify-start">
        <Avatar className="mr-2">
          <AvatarImage src={account.avatar} />
          <AvatarFallback>{account.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p>{account.name}</p>
          {/* TODO: Enable managers to add bio */}
          <p>No bio yet</p>
        </div>
      </div>
      {authUser?._id === hotel.manager._id && (
        <EditStaff manager={authUser} hotel={hotel} />
      )}
    </section>
  );
}
