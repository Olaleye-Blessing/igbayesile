import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button, buttonVariants } from "../ui/button";

interface ErrorActionProps {
  open: boolean;
  toggleErrorModal: (open: boolean) => void;
}

export default function ErrorAction({
  open,
  toggleErrorModal,
}: ErrorActionProps) {
  return (
    <AlertDialog open={open} onOpenChange={(open) => toggleErrorModal(open)}>
      <AlertDialogContent className="content flex flex-col max-w-[90vw] md:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Unable to Update Room</AlertDialogTitle>
          <AlertDialogDescription className="!mt-[-0.2rem] text-destructive">
            This room has existing paid bookings and cannot be updated at this
            time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="h-full overflow-y-auto">
          <ul>
            <li>
              <p>
                {/* TODO: Update this link where there is a route ti get the bookings  */}
                <Link
                  href={`/profile/?tab=settings`}
                  className={buttonVariants({
                    variant: "link",
                    className: "text-primary pl-0",
                  })}
                >
                  View existing bookings for this room.
                </Link>
              </p>
            </li>
            <li>
              <p>
                <Button
                  type="button"
                  variant={"link"}
                  className=" text-yellow-400 pl-0"
                  // TODO: Provide a visible key to room model in order to hide/unhide
                  onClick={() =>
                    toast("This feature is coming soon...", {
                      id: "update-room-error-hide-coming-soon",
                    })
                  }
                >
                  Mark this room as unavailable.
                </Button>
              </p>
            </li>
          </ul>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              variant="destructive"
              onClick={() => toggleErrorModal(false)}
              className="!text-foreground !bg-red-400"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
