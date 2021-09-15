import { Button } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent } from "react";
import { FormTemplate } from "../../../types";
import { ModalDialog } from "../../ModalDialog";

interface AddFormModalProps {
  onAdd: (index: number) => void;
  show: boolean;
  onClose: () => void;
  forms: FormTemplate[];
}

export const AddFormModal: FunctionComponent<AddFormModalProps> = ({ onAdd, show, onClose, forms }) => {
  if (!show) {
    return null;
  }

  const handleAdd = (index: number) => {
    onAdd(index);
    onClose();
  };

  return (
    <ModalDialog className="mx-3 max-w-xl md:mx-0" close={onClose}>
      <h2 className="mb-6">Add New Document</h2>
      <h4 className="mb-8">Choose Document Type to Issue</h4>
      <div className="flex flex-wrap justify-start">
        {forms.map((form: FormTemplate, index: number) => {
          return (
            <div key={index} className="w-full md:w-1/3 mb-8 flex justify-center">
              <Button
                data-testid={`add-form-button-${index}`}
                className="bg-white text-cerulean w-11/12 hover:bg-cloud-100 h-full p-4 leading-5"
                onClick={() => handleAdd(index)}
              >
                {form.name}
              </Button>
            </div>
          );
        })}
      </div>
      <Button
        data-testid="cancel-add-form-button"
        onClick={onClose}
        className="flex mx-auto bg-rose hover:bg-red-400 text-white"
      >
        Cancel
      </Button>
    </ModalDialog>
  );
};
