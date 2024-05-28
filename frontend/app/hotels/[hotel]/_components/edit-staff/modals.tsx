import LoginModal, { LoginModalProps } from "./login-modal";
import StaffModal, { StaffModalProps } from "./staff-modal";

interface ModalsProps {
  login: LoginModalProps;
  staff: StaffModalProps;
}

export default function Modals({ login, staff }: ModalsProps) {
  return (
    <>
      <LoginModal
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
