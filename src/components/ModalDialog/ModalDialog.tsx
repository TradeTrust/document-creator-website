import React, { FunctionComponent } from "react";
import { useLockBodyScroll } from "../../common/hook/useLockBodyScroll";

interface ModalDialogProps {
  close: () => void;
  children?: React.ReactNode;
}

export const ModalDialog: FunctionComponent<ModalDialogProps> = ({ close, children }) => {
  useLockBodyScroll();

  return (
    <>
      <div
        className="flex w-full h-full fixed justify-center items-center z-10 top-0 left-0"
        data-testid="modal-dialog"
      >
        <div className="relative z-20 max-w-lg bg-white p-6 rounded-xl">{children}</div>
        <div
          className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-70"
          data-testid="modal-backdrop"
          onClick={() => close()}
        />
      </div>
    </>
  );
};
