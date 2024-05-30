import LoginAgain from "@website/components/login-again";
import StaffModal, { StaffModalProps } from "./staff-modal";

interface ModalsProps {
  login: { open: boolean; onOpenChange(open: boolean): void };
  staff: StaffModalProps;
}

export default function Modals({ login, staff }: ModalsProps) {
  return (
    <>
      <LoginAgain
        open={login.open}
        onOpenChange={(open) => login.onOpenChange(open)}
      />
      <StaffModal
        open={staff.open}
        onOpenChange={(open) => staff.onOpenChange(open)}
        onSubmit={(staffId) => staff.onSubmit(staffId)}
      />
    </>
  );
}
