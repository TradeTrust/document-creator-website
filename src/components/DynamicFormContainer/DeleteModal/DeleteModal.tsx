import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { ModalDialog } from "../../ModalDialog";

interface DeleteModalProps {
  deleteForm: () => void;
  show: boolean;
  closeDeleteModal: () => void;
}

export const DeleteModal: FunctionComponent<DeleteModalProps> = ({ deleteForm, show, closeDeleteModal }) => {
  return (
    <>
      {show && (
        <ModalDialog close={closeDeleteModal}>
          <div className="flex flex-col max-w-sm md: max-w-md">
            <h3 className="text-center" data-testid="modal-title">
              Delete Form
            </h3>
            <div className="text-center mt-8">Are you sure you want to delete this form?</div>
            <div className="mt-8">
              <div className="flex justify-around">
                <Button
                  className="bg-white text-cerulean hover:bg-cloud-100 px-3"
                  onClick={closeDeleteModal}
                  data-testid="cancel-form-button"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="delete-button"
                  className="bg-rose text-white hover:bg-red-400 px-3"
                  onClick={deleteForm}
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
