import React, { FunctionComponent } from "react";
import { useFormsContext } from "../../../common/context/forms";
import { ProgressBar } from "../../ProgressBar";
import { Button } from "../../UI/Button";
import { ArrowLeft } from "react-feather";
import { Title } from "../../UI/Title";
import { DocumentSelector } from "../DocumentSelector";

interface DynamicFormHeaderProps {
  onBackToFormSelection: () => void;
  onNewForm: () => void;
  onFormSubmit: () => void;
  validateCurrentForm: () => boolean;
}

export const DynamicFormHeader: FunctionComponent<DynamicFormHeaderProps> = ({
  onBackToFormSelection,
  onNewForm,
  onFormSubmit,
  validateCurrentForm,
}) => {
  const { forms, activeFormIndex } = useFormsContext();

  return (
    <div className="container mx-auto mb-6">
      <div
        onClick={onBackToFormSelection}
        className="text-grey flex cursor-pointer py-4 w-20"
        data-testid="back-button"
      >
        <ArrowLeft />
        <div className="pl-2">Back</div>
      </div>
      <ProgressBar step={2} />
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <Title className="mb-4">Fill and Preview Form</Title>
          <div className="text-grey-dark text-lg">
            {`${(activeFormIndex || 0) + 1} of ${forms.length} document(s)`}
          </div>
          <DocumentSelector validateCurrentForm={validateCurrentForm} />
        </div>
        <div>
          <Button
            className="bg-white text-orange px-4 py-3 mr-4"
            onClick={onNewForm}
            data-testid="add-new-button"
          >
            Add New
          </Button>
          <Button
            className="bg-orange text-white self-end py-3 px-4"
            onClick={onFormSubmit}
            data-testid="form-submit-button"
          >
            Issue Document
          </Button>
        </div>
      </div>
    </div>
  );
};
