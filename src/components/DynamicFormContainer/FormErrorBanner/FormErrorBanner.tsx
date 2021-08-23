import { ErrorObject } from "ajv";
import React, { FunctionComponent } from "react";
import { XCircle } from "react-feather";

export type FormError = ErrorObject[] | null | undefined;

interface FormErrorBanner {
  formErrorTitle: string | null | undefined;
  formError: FormError;
}
export const FormErrorBanner: FunctionComponent<FormErrorBanner> = ({ formErrorTitle, formError }) => {
  if (!formError || !(formError.length > 0)) return null;

  return (
    <div data-testid="form-error-banner" className="bg-red-100 rounded max-w-screen-sm mx-auto flex items-start py-3">
      <XCircle className="text-red-500 mx-3 my-1" />
      <div className="text-red-500 text-xl flex flex-col justify-center items-start">
        <div>{formErrorTitle}</div>
        <ul className="list-disc pl-5">
          {formError &&
            formError.map((error, index: number) => {
              return (
                <li key={index}>
                  {error.instancePath} {error.message}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};
