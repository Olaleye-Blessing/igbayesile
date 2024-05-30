import { Button } from "@ui/components/ui/button";
import { IUser } from "@ui/interfaces/user";
import { IFullHotel } from "@ui/interfaces/hotel";
import { useStaff } from "./hook";
import Modals from "./modals";
import AssignStaffButton from "./assign-staff-button";

interface EditStaffProps {
  manager: IUser;
  hotel: IFullHotel;
}

export default function EditStaff({ hotel }: EditStaffProps) {
  const staffHook = useStaff();

  return (
    <>
      <div className="mt-4 flex items-center justify-start flex-wrap">
        <Button
          variant="destructive"
          className="px-2 py-1 mr-4"
          onClick={async () => {
            if (staffHook.isLoginModalOpen()) return false;

            await staffHook.removeStaff.mutateAsync(hotel);
          }}
        >
          Remove
        </Button>
        <AssignStaffButton text="Change" hotel={hotel} className="px-2 py-1" />
      </div>
      <Modals
        login={{
          open: staffHook.openLoginModal,
          onOpenChange(open) {
            staffHook.setOpenLoginModal(open);
          },
        }}
        staff={{
          open: staffHook.openStaffModal,
          onOpenChange(open) {
            staffHook.setOpenStaffModal(open);
          },
          onSubmit(staff) {
            staffHook.handleChangeStaff(staff, hotel);
          },
        }}
      />
    </>
  );
}
