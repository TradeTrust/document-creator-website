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
            <h3 className="text-center" data-testid="modal-title">
              Revoke Document
            </h3>
            <div className="text-center mt-8">Are you sure you want to revoke this document?</div>
            <div className="mt-8">
              <div className="flex justify-around">
                <Button
                  className="bg-white text-cerulean hover:bg-cloud-100 px-3"
                  onClick={closeRevokeConfirmationModal}
                  data-testid="cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="modal-revoke-button"
                  className="bg-rose hover:bg-red-400 text-white px-3"
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
