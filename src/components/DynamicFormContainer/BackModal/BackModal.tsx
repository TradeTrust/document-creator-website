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
          <div className="flex flex-col ">
            <div data-testid="modal-title" className="text-2xl text-grey-800 font-bold">
              Back to form selection
            </div>
            <div className="text-grey-800 mt-4 mr-16">
              Do you want to go back? This will delete <strong>ALL</strong> your current document(s).
            </div>
            <div className="mt-16">
              <div className="flex justify-end">
                <Button
                  className="bg-white text-grey border-grey-400 hover:bg-grey-100 mr-4"
                  onClick={closeBackModal}
                  data-testid="cancel-form-button"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="red-back-button"
                  className="bg-red text-white hover:bg-red-400"
                  onClick={backToFormSelection}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};
