import React, { FunctionComponent } from "react";
import { Button } from "../../../UI/Button";
import { ModalDialog } from "../../ModalDialog";

interface DeleteModalProps {
  deleteForm: () => void;
  show: boolean;
  closeDeleteModal: () => void;
}

export const DeleteModal: FunctionComponent<DeleteModalProps> = ({
  deleteForm,
  show,
  closeDeleteModal,
}) => {
  return (
    <>
      {show && (
        <ModalDialog show={show} close={closeDeleteModal}>
          <div className="flex flex-col ">
            <div className="text-2xl text-grey-dark font-bold">Delete Form</div>
            <div className="text-grey-dark mt-4 mr-16">
              Are you sure you want to delete this form?
            </div>
            <div className="mt-16">
              <div className="flex justify-end">
                <Button
                  className="py-3 px-4 text-grey border border-solid border-lightgrey"
                  onClick={closeDeleteModal}
                  data-testid="cancel-form-button"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="delete-button"
                  className="py-3 px-4 text-white bg-red"
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
