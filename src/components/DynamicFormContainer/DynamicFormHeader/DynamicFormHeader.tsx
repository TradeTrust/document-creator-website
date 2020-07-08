import React, { FunctionComponent } from "react";
import { Button } from "../../UI/Button";
import { SvgIcon, SvgIconArrowLeft } from "../../UI/SvgIcon";
import { Title } from "../../UI/Title";
import { ProgressBar } from "../../ProgressBar";

interface DynamicFormHeaderProps {
  onBackToFormSelection: () => void;
  onNewForm: () => void;
  onFormSubmit: () => void;
}

export const DynamicFormHeader: FunctionComponent<DynamicFormHeaderProps> = ({
  onBackToFormSelection,
  onNewForm,
  onFormSubmit,
}) => {
  return (
    <div className="container mx-auto">
      <div
        onClick={onBackToFormSelection}
        className="text-grey flex cursor-pointer py-4 w-20"
        data-testid="back-button"
      >
        <SvgIcon>
          <SvgIconArrowLeft />
        </SvgIcon>
        <div className="pl-2">Back</div>
      </div>
      <ProgressBar step={2} />
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <Title className="mb-6">Fill and Preview Form</Title>
        </div>
        <div>
          <Button
            className="bg-white text-orange px-4 py-3 mb-6"
            onClick={onNewForm}
            data-testid="add-new-button"
          >
            Add New
          </Button>
          <Button
            className="bg-orange text-white self-end py-3 px-4 mb-6"
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
