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
          <div className="flex flex-col ">
            <div className="text-2xl text-gray-800 font-bold">Delete Form</div>
            <div className="text-gray-800 mt-4 mr-16">Are you sure you want to delete this form?</div>
            <div className="mt-16">
              <div className="flex justify-end">
                <Button
                  className="text-gray border-gray-400 hover:bg-gray-100 mr-4"
                  onClick={closeDeleteModal}
                  data-testid="cancel-form-button"
                >
                  Cancel
                </Button>
                <Button data-testid="delete-button" className="text-white bg-red hover:bg-red-400" onClick={deleteForm}>
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
