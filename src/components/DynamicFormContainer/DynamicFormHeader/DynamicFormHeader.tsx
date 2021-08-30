import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { ArrowLeft } from "react-feather";
import { useFormsContext } from "../../../common/context/forms";
import { ProgressBar } from "../../ProgressBar";
import { Card } from "../../UI/Card";
import { Title } from "../../UI/Title";
import { Wrapper } from "../../UI/Wrapper";
import { DocumentSelector } from "../DocumentSelector";

interface DynamicFormHeaderProps {
  onBackToFormSelection: () => void;
  onNewForm: () => void;
  onFormSubmit: () => void;
  validateCurrentForm: () => boolean;
  closePreviewMode: () => void;
}

export const DynamicFormHeader: FunctionComponent<DynamicFormHeaderProps> = ({
  onBackToFormSelection,
  onNewForm,
  onFormSubmit,
  validateCurrentForm,
  closePreviewMode,
}) => {
  const { forms, activeFormIndex } = useFormsContext();

  return (
    <Wrapper className="mb-8">
      <div
        onClick={onBackToFormSelection}
        className="text-gray flex cursor-pointer py-4 w-20"
        data-testid="back-button"
      >
        <ArrowLeft />
        <div className="pl-2">Back</div>
      </div>
      <Card>
        <ProgressBar step={2} totalSteps={3} title="Fill Form" />
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <Title className="mb-4">Fill and Preview Form</Title>
            <div className="text-gray-800 text-lg">{`${(activeFormIndex || 0) + 1} of ${
              forms.length
            } document(s)`}</div>
            <DocumentSelector validateCurrentForm={validateCurrentForm} closePreviewMode={closePreviewMode} />
          </div>
          <div>
            <Button
              className="bg-white text-cerulean hover:bg-gray-50 mr-4"
              onClick={onNewForm}
              data-testid="add-new-button"
            >
              Add New
            </Button>
            <Button
              className="bg-cerulean text-white hover:bg-cerulean-500"
              onClick={onFormSubmit}
              data-testid="form-submit-button"
            >
              Issue Document
            </Button>
          </div>
        </div>
      </Card>
    </Wrapper>
  );
};
