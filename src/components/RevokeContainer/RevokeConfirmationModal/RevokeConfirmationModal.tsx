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
            <div data-testid="modal-title" className="text-2xl text-cloud-900 font-bold">
              Revoke Document
            </div>
            <div className="text-cloud-900 mt-4 mr-16">Do you want to revoke this document?</div>
            <div className="mt-16">
              <div className="flex justify-end">
                <Button
                  className="bg-white text-cloud-500 border-cloud-300 hover:bg-cloud-100 mr-4"
                  onClick={closeRevokeConfirmationModal}
                  data-testid="cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="modal-revoke-button"
                  className="bg-rose-400 hover:bg-rose text-white"
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
