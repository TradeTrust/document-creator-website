import { Button, ButtonSize } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent } from "react";
import { ProgressBar } from "../../ProgressBar";
import { Card } from "../../UI/Card";
import { Frame } from "../../UI/Frame";
import { IssueOrRevokeSelector } from "../../UI/IssueOrRevokeSelector";
import { Wrapper } from "../../UI/Wrapper";
import { DocumentCarousel } from "../DocumentCarousel";
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
          <div className="flex justify-between items-center">
            <IssueOrRevokeSelector createLink={"/form"} />
            <Button
              size={ButtonSize.SM}
              onClick={onBackToFormSelection}
              className="text-cerulean bg-white hover:bg-gray-50"
              data-testid="back-button"
            >
              Clear All
            </Button>
          </div>
        }
      >
        <ProgressBar step={2} totalSteps={3} title="Fill Form" />
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col">
            <div className="pt-6 pb-8 text-2xl">Fill and Preview Form</div>
            <DocumentSelector validateCurrentForm={validateCurrentForm} closePreviewMode={closePreviewMode} />
          </div>
          <div>
            <Button
              className="text-cerulean bg-white mr-4 hover:bg-gray-50"
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
        <DocumentCarousel validateCurrentForm={validateCurrentForm} closePreviewMode={closePreviewMode} />
      </Card>
    </Wrapper>
  );
};
