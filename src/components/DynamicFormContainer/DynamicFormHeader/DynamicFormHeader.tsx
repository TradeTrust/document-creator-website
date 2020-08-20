import React, { FunctionComponent, useEffect, useState } from "react";
import { useFormsContext } from "../../../common/context/forms";
import { FormEntry } from "../../../types";
import { ProgressBar } from "../../ProgressBar";
import { Button } from "../../UI/Button";
import {
  SvgIcon,
  SvgIconArrowLeft,
  SvgIconLeftArrowBracket,
  SvgIconRightArrowBracket,
} from "../../UI/SvgIcon";
import { Title } from "../../UI/Title";

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
  const { forms, setActiveFormIndex, currentForm, setForms, activeFormIndex } = useFormsContext();
  const [docName, setDocName] = useState("");

  useEffect(() => {
    setDocName(currentForm ? currentForm?.fileName.split(".")[0] : "");
  }, [currentForm]);

  const setFileName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (activeFormIndex === undefined) return;
    setDocName(event.target.value);
    const updatedCurrentForm = {
      ...currentForm,
      fileName: event.target.value + ".tt",
    } as FormEntry;
    const nextForms = [...forms];
    nextForms.splice(activeFormIndex, 1, { ...updatedCurrentForm });
    setForms(nextForms);
  };

  const previousDocument = (): void => {
    if (activeFormIndex === undefined || activeFormIndex === 0) return;
    if (validateCurrentForm()) setActiveFormIndex(activeFormIndex - 1);
  };

  const nextDocument = (): void => {
    if (activeFormIndex === undefined || activeFormIndex === forms.length - 1) return;
    if (validateCurrentForm()) setActiveFormIndex(activeFormIndex + 1);
  };

  return (
    <div className="container mx-auto mb-6">
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
          <Title className="mb-4">Fill and Preview Form</Title>
          <div className="text-grey-dark text-lg">{`${(activeFormIndex || 0) + 1} of ${
            forms.length
          } document(s)`}</div>
          <div className="flex items-center mt-2">
            <div
              data-testid="previous-document-button"
              onClick={previousDocument}
              className="cursor-pointer border border-solid border-grey-lighter h-12 w-12 bg-lightgrey-lighter active:bg-lightgrey border-r-0 flex items-center justify-center"
            >
              <SvgIcon className="flex items-center justify-center">
                <SvgIconLeftArrowBracket />
              </SvgIcon>
            </div>
            <input
              type="text"
              value={docName}
              onChange={setFileName}
              className="h-12 border border-solid border-grey-lighter px-3 text-grey-dark text-lg"
            />
            <div
              data-testid="next-document-button"
              onClick={nextDocument}
              className="cursor-pointer border border-solid border-grey-lighter h-12 w-12 bg-lightgrey-lighter active:bg-lightgrey border-l-0 flex items-center justify-center"
            >
              <SvgIcon className="flex items-center justify-center">
                <SvgIconRightArrowBracket />
              </SvgIcon>
            </div>
          </div>
        </div>
        <div>
          <Button
            className="bg-white text-orange px-4 py-3"
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
