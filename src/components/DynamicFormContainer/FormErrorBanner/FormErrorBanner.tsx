import React, { FunctionComponent } from "react";
import Ajv from "ajv";
import { SvgIcon, SvgIconXCircle } from "../../UI/SvgIcon";

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
      <SvgIcon className="text-red mx-3 my-1">
        <SvgIconXCircle />
      </SvgIcon>
      <div className="text-red text-xl flex flex-col justify-center items-start">
        <div>This form has errors. Please fix the errors and submit again.</div>
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
