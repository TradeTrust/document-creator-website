import { Button, ProgressBar } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
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
  return (
    <Wrapper className="mb-8">
      <Card
        title={
          <div className="md:flex justify-between items-center">
            <IssueOrRevokeSelector />
            <Button
              data-testid="clear-all-button"
              className="mt-2 md:mt-0 bg-white text-cerulean hover:bg-cloud-100"
              onClick={onBackToFormSelection}
            >
              Clear All
            </Button>
          </div>
        }
      >
        <ProgressBar step={2} totalSteps={3} />
        <h3 data-testid="fill-form-title" className="my-8">
          Fill and Preview Form
        </h3>
        <div className="md:flex justify-between items-start">
          <div className="flex flex-col">
            <DocumentSelector validateCurrentForm={validateCurrentForm} closePreviewMode={closePreviewMode} />
          </div>
          <div className="mt-4 md:mt-0">
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
