import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { Config, FormTemplate } from "../../../types";
import { ProgressBar } from "../../ProgressBar";
import { Wrapper } from "../../UI/Wrapper";
import { IssueOrRevokeSelector } from "../../UI/IssueOrRevokeSelector";
import { Card } from "../../UI/Card";
import { ContentFrame } from "../../UI/ContentFrame";

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
    <Wrapper>
      <IssueOrRevokeSelector />
      <ContentFrame>
        <Card>
          <ProgressBar step={1} totalSteps={3} title="Choose Type" />
          <h3 className="my-10">Choose Document Type to Issue</h3>
          <div className="flex flex-wrap justify-start">
            {config.forms.map((form: FormTemplate, index: number) => {
              return (
                <div key={index} className="w-1/3 mb-4">
                  <Button
                    className="bg-white text-cerulean w-11/12 hover:bg-cloud-100 h-full p-4"
                    onClick={() => selectedForm(index)}
                  >
                    {form.name}
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </ContentFrame>
    </Wrapper>
  );
};
