import Staff from "@/components/staff";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";

export interface StaffModalProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  onSubmit(staff: string): void;
}

export default function StaffModal({
  open,
  onOpenChange,
  onSubmit,
}: StaffModalProps) {
  const [staff, setStaff] = useState("");

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign A New Staff</DialogTitle>
          <DialogDescription>
            The current staff will be removed as soon as the new staff accepts
            the invitation.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!staff)
              return toast.error("Select a new staff", {
                id: "new-staff-error",
              });

            onSubmit(staff);
          }}
        >
          <Staff
            handleChangeStaff={(staff) => {
              setStaff(staff?.value || "");
            }}
            name="new_staff"
          />
          <Button>Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
