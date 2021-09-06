import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { ModalDialog } from "../../ModalDialog";

interface BackModalProps {
  backToFormSelection: () => void;
  show: boolean;
  closeBackModal: () => void;
}

export const BackModal: FunctionComponent<BackModalProps> = ({ backToFormSelection, show, closeBackModal }) => {
  return (
    <>
      {show && (
        <ModalDialog close={closeBackModal}>
          <div className="flex flex-col max-w-sm md: max-w-md">
            <h3 className="text-center" data-testid="modal-title">
              Clear All
            </h3>
            <div className="text-center mt-8">
              Do you want to clear all? This will delete <b>ALL</b> your current document(s).
            </div>
            <div className="mt-8">
              <div className="flex justify-around">
                <Button
                  className="bg-white text-cerulean hover:bg-cloud-100"
                  onClick={closeBackModal}
                  data-testid="cancel-form-button"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="red-back-button"
                  className="bg-rose text-white hover:bg-red-400"
                  onClick={backToFormSelection}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};
