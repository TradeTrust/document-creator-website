import { Button } from "@tradetrust-tt/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { ModalDialog } from "../ModalDialog";

interface ConfirmModalProps {
  title: string;
  description: string | React.ReactNode;
  show: boolean;
  onCloseText?: string;
  onConfirmText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: FunctionComponent<ConfirmModalProps> = ({
  title,
  description,
  onConfirm,
  show,
  onClose,
  onCloseText,
  onConfirmText,
}) => {
  return (
    <>
      {show && (
        <ModalDialog close={onClose}>
          <div className="flex flex-col max-w-sm md:max-w-md">
            <h3 className="text-center text-cloud-800" data-testid="modal-title">
              {title}
            </h3>
            <div className="text-center text-cloud-800 font-normal mt-8">{description}</div>
            <div className="mt-8">
              <div className="flex justify-around">
                <Button
                  className="bg-white text-cerulean-500 hover:bg-cloud-100"
                  onClick={onClose}
                  data-testid="confirm-modal-cancel-button"
                >
                  {onCloseText || "Cancel"}
                </Button>
                <Button
                  data-testid="confirm-modal-confirm-button"
                  className="bg-scarlet-500 text-white hover:bg-red-600"
                  onClick={onConfirm}
                >
                  {onConfirmText || "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};
