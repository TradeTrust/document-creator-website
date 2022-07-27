import React, { FunctionComponent } from "react";
import { XCircle } from "react-feather";
import { AjvErrorMessage } from "./../../UI/AjvError";
import { FormErrors } from "../../../types";

interface FormErrorBanner {
  formErrorTitle: string | null;
  formErrors: FormErrors;
}

/**
 * FormErrorBanner
 * Shows a list of ajv errors for end user to self-diagnose and error recovery
 * @param formErrorTitle Custom error message title
 * @param formError Array of errors generated from ajv validation
 */
export const FormErrorBanner: FunctionComponent<FormErrorBanner> = ({ formErrorTitle, formErrors }) => {
  if (!formErrors || !(formErrors.length > 0)) return null;

  return (
    <div data-testid="form-error-banner" className="bg-red-100 rounded-lg mx-auto flex items-center p-6 mt-4">
      <XCircle className="text-scarlet-500 mx-3 my-1 h-10 w-10" />
      <div className="font-gilroy-bold flex flex-col justify-center items-left ml-4">
        <p className="text-scarlet-500 text-lg leading-none font-gilroy-bold mb-2">{formErrorTitle}</p>
        {formErrors && (
          <div className="text-scarlet-500">
            {formErrors.map((error, index: number) => {
              return <AjvErrorMessage key={index} error={error} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
