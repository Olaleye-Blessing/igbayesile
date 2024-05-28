interface ModalOpenProps {
  open: true;
  action: "change" | "delete";
}

interface ModalCloseProps {
  open: false;
  action: null;
}

export type ModalProps = ModalCloseProps | ModalOpenProps;
