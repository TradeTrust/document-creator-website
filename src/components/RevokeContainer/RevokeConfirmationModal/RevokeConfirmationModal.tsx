import { Button } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent } from "react";
import { ModalDialog } from "../../ModalDialog";

interface RevokeConfirmationModalProps {
  revokingDocument: () => void;
  show: boolean;
  closeRevokeConfirmationModal: () => void;
}

export const RevokeConfirmationModal: FunctionComponent<RevokeConfirmationModalProps> = ({
  revokingDocument,
  show,
  closeRevokeConfirmationModal,
}) => {
  return (
    <>
      {show && (
        <ModalDialog close={closeRevokeConfirmationModal}>
          <div className="flex flex-col ">
            <div data-testid="modal-title" className="text-2xl text-gray-800 font-bold">
              Revoke Document
            </div>
            <div className="text-gray-800 mt-4 mr-16">Do you want to revoke this document?</div>
            <div className="mt-16">
              <div className="flex justify-end">
                <Button
                  className="bg-white text-blue-500 border-gray-300 hover:bg-gray-100 mr-4"
                  onClick={closeRevokeConfirmationModal}
                  data-testid="cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="modal-revoke-button"
                  className="bg-red-600 hover:bg-red-500 text-white"
                  onClick={revokingDocument}
                >
                  Revoke
                </Button>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};
