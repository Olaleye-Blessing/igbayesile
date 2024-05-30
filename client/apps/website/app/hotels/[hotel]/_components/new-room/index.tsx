import RoomForm from "@website/components/room-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/components/ui/alert-dialog";
import { Button } from "@ui/components/ui/button";
import { IFullHotel } from "@ui/interfaces/hotel";
import { School } from "lucide-react";
import { useState } from "react";

interface NewRoomProps {
  hotel: IFullHotel;
}

export default function NewRoom({ hotel }: NewRoomProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogTrigger asChild>
        <Button className="mb-2" onClick={() => setOpen(true)}>
          <span>
            <School className="w-5 h-4" />
          </span>
          <span>New Room</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="content flex flex-col h-[90vh] max-w-[90vw] md:max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Room to {hotel.name}</AlertDialogTitle>
          <AlertDialogDescription className="!mt-[-0.4rem]">
            Total rooms: {hotel.totalRooms}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="h-full overflow-y-auto">
          <RoomForm hotelId={hotel._id} showRedirect={false} />
        </div>
        <AlertDialogFooter>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
