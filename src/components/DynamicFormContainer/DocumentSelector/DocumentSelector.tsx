import React, { FunctionComponent } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useFormsContext } from "../../../common/context/forms";

interface DocumentSelector {
  validateCurrentForm: () => boolean;
  closePreviewMode: () => void;
}

export const DocumentSelector: FunctionComponent<DocumentSelector> = ({
  validateCurrentForm,
  closePreviewMode,
}) => {
  const {
    forms,
    setActiveFormIndex,
    currentForm,
    activeFormIndex,
    setCurrentFileName,
  } = useFormsContext();

  const previousDocument = (): void => {
    if (activeFormIndex === undefined || activeFormIndex === 0) return;
    if (validateCurrentForm()) setActiveFormIndex(activeFormIndex - 1);
    closePreviewMode();
  };

  const nextDocument = (): void => {
    if (activeFormIndex === undefined || activeFormIndex === forms.length - 1) return;
    if (validateCurrentForm()) setActiveFormIndex(activeFormIndex + 1);
    closePreviewMode();
  };
  return (
    <div className="flex items-center mt-2">
      <div
        data-testid="previous-document-button"
        onClick={previousDocument}
        className="cursor-pointer border border-solid border-grey-300 h-12 w-12 bg-grey-100 active:bg-grey-400 border-r-0 flex items-center justify-center"
      >
        <ChevronLeft className="flex items-center justify-center" />
      </div>
      <input
        data-testid="file-name-input"
        type="text"
        aria-label="file-name-input"
        value={currentForm?.fileName}
        onChange={(e) => setCurrentFileName(e.target.value)}
        className="h-12 border border-solid border-grey-300 px-3 text-grey-800 text-lg"
      />
      <div
        data-testid="next-document-button"
        onClick={nextDocument}
        className="cursor-pointer border border-solid border-grey-300 h-12 w-12 bg-grey-100 active:bg-grey-400 border-l-0 flex items-center justify-center"
      >
        <ChevronRight className="flex items-center justify-center" />
      </div>
    </div>
  );
};
