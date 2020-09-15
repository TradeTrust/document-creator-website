import Ajv from "ajv";
import React, { FunctionComponent } from "react";
import { XCircle } from "react-feather";

interface FormErrorBanner {
  formError: Ajv.ErrorObject[] | null | undefined;
}
export const FormErrorBanner: FunctionComponent<FormErrorBanner> = ({ formError }) => {
  if (!formError || !(formError.length > 0)) return null;
  return (
    <div
      data-testid="form-error-banner"
      className="bg-red-lighter rounded max-w-screen-sm mx-auto flex items-start py-3"
    >
      <XCircle className="text-red mx-3 my-1" />
      <div className="text-red text-xl flex flex-col justify-center items-start">
        <div>This form has errors. Please fix the errors to proceed.</div>
        <ul className="list-disc pl-5">
          {formError &&
            formError.map((error, index: number) => {
              return (
                <li key={index}>
                  {error.dataPath} {error.message}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};
