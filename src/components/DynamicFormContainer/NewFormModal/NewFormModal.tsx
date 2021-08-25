import { Button, ButtonSize } from "@govtechsg/tradetrust-ui-components";
import { useEffect } from "react";
import { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { FormTemplate } from "../../../types";
import { ModalDialog, ModalSize } from "../../ModalDialog";

interface NewFormModalProps {
  closeModal: () => void;
  forms: FormTemplate[];
}

export const NewFormModal: FunctionComponent<NewFormModalProps> = ({ closeModal, forms }) => {
  const { newForm } = useFormsContext();

  const selectedForm = (templateIndex: number): void => {
    newForm(templateIndex);
  };

  return (
    <ModalDialog rounded size={ModalSize.MD} close={closeModal}>
      <h3>Add New Document</h3>
      <div className="my-6 text-lg font-bold">Choose Document Type to Issue</div>
      <div className="flex flex-wrap justify-start mb-8">
        {forms.map((form: FormTemplate, index: number) => {
          return (
            <Button
              onClick={() => selectedForm(index)}
              className="bg-white text-cerulean-500 border-gray-300 hover:text-blue hover:bg-gray-50 w-40 mb-4 mr-4"
              key={index}
            >
              {form.name}
            </Button>
          );
        })}
      </div>
      <div className="w-full flex justify-center">
        <Button onClick={closeModal} size={ButtonSize.SM} className="bg-rose text-white border-rose">
          Cancel
        </Button>
      </div>
    </ModalDialog>
  );
};
