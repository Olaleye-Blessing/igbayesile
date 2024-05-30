import { Button, ButtonProps } from "@ui/components/ui/button";
import Modals from "./modals";
import { useStaff } from "./hook";
import { IFullHotel } from "@ui/interfaces/hotel";

interface AssignStaffButtonProps extends ButtonProps {
  text: string;
  hotel: IFullHotel;
}

export default function AssignStaffButton({
  text,
  hotel,
  className = "",
  ...button
}: AssignStaffButtonProps) {
  const staffHook = useStaff();

  return (
    <>
      <Button
        {...button}
        className={`mr-2 ${className}`}
        onClick={() => staffHook.setOpenStaffModal(true)}
      >
        {text}
      </Button>
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
