import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { Config, FormTemplate } from "../../../types";
import { ProgressBar } from "../../ProgressBar";
import { Title } from "../../UI/Title";
import { Wrapper } from "../../UI/Wrapper";
import { IssueOrRevokeSelector } from "../../UI/IssueOrRevokeSelector";

interface FormSelection {
  config: Config;
}

export const FormSelection: FunctionComponent<FormSelection> = ({ config }) => {
  const { activeFormIndex, newForm } = useFormsContext();
  const selectedForm = (templateIndex: number): void => {
    newForm(templateIndex);
  };

  // Once the active form has been set, redirect to /form
  // To get back to this page, the previous page has to unset the activeFormIndex first
  if (activeFormIndex !== undefined) return <Redirect to="/form" />;

  return (
    <Wrapper isMaxW={true}>
      <IssueOrRevokeSelector />
      <ProgressBar step={1} totalSteps={3} title="Choose Type" />
      <Title className="mb-8">Choose Document Type to Issue</Title>
      <div className="flex flex-wrap justify-start">
        {config.forms.map((form: FormTemplate, index: number) => {
          return (
            <Button
              className="bg-white text-gray-800 hover:text-blue hover:bg-grey-100 w-40 mb-4 mr-4"
              key={index}
              onClick={() => selectedForm(index)}
            >
              {form.name}
            </Button>
          );
        })}
      </div>
    </Wrapper>
  );
};
