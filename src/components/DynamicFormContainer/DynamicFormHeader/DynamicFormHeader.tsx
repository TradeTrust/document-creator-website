import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { useFormsContext } from "../../../common/context/forms";
import { ProgressBar } from "../../ProgressBar";
import { Card } from "../../UI/Card";
import { IssueOrRevokeSelector } from "../../UI/IssueOrRevokeSelector";
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
      <Card
        title={
          <div className="flex justify-between items-center">
            <IssueOrRevokeSelector createLink="/form" />
            <Button
              data-testid="clear-all-button"
              className="bg-white text-cerulean hover:bg-cloud-100"
              onClick={onBackToFormSelection}
            >
              Clear All
            </Button>
          </div>
        }
      >
        <ProgressBar step={2} totalSteps={3} title="Fill Form" />
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <h3 data-testid="fill-form-title" className="my-8">
              Fill and Preview Form
            </h3>
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
              Issue Document(s)
            </Button>
          </div>
        </div>
      </Card>
    </Wrapper>
  );
};
