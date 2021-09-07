import React, { FunctionComponent } from "react";
import { useFormsContext } from "../../../common/context/forms";

interface DocumentSelectorProps {
  validateCurrentForm: () => boolean;
  closePreviewMode: () => void;
}

export const DocumentSelector: FunctionComponent<DocumentSelectorProps> = ({
  validateCurrentForm,
  closePreviewMode,
}) => {
  const { forms, setActiveFormIndex, activeFormIndex } = useFormsContext();

  const selectDocument = (formIndex: number): void => {
    if (isNaN(formIndex)) return;
    if (activeFormIndex === undefined || formIndex > forms.length) return;
    if (validateCurrentForm()) setActiveFormIndex(formIndex - 1);
    closePreviewMode();
  };

  const activeDocumentNumber = activeFormIndex ? activeFormIndex + 1 : 1;

  return (
    <div>
      <div className="flex items-center">
        <input
          data-testid="document-number-input"
          value={activeDocumentNumber}
          onChange={(e) => {
            selectDocument(parseInt(e.target.value));
          }}
          type="text"
          className="flex rounded border border-solid border-gray-300 h-10 w-10 text-center"
        />
        <div>&nbsp;of {forms.length} document(s)</div>
      </div>
      <div>
        <select
          data-testid="document-name-select"
          value={activeDocumentNumber}
          className="border border-cloud-200 rounded p-2 mt-3 w-48"
          onChange={(e) => selectDocument(parseInt(e.target.value))}
        >
          {forms.map((form, formIndex) => {
            const documentNumber = formIndex + 1;
            return (
              <option key={`${form.fileName}-${documentNumber}`} value={documentNumber}>
                {form.fileName}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};
