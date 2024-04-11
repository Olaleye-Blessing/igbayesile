import RoomForm from "@/components/room-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IRoomDetail } from "@/interfaces/room";
import { School } from "lucide-react";
import { useState } from "react";

interface RoomProps {
  room: IRoomDetail;
}

export default function EditRoom({ room }: RoomProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogTrigger asChild>
        <Button className="mb-2" onClick={() => setOpen(true)}>
          <span>
            <School className="w-5 h-4" />
          </span>
          <span>Edit Room</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="content flex flex-col h-[90vh] max-w-[90vw] md:max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Edit <span className="text-primary">{room.name}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="!mt-[-0.4rem] text-red-600">
            Note: This room won&apos;t be updated if it has existing paid
            bookings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="h-full overflow-y-auto">
          <RoomForm
            hotelId={room.hotel._id}
            showRedirect={false}
            type="edit"
            room={room}
          />
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
