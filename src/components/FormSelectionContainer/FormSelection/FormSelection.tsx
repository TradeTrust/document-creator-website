import { Button } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { Config, FormTemplate } from "../../../types";
import { ProgressBar } from "../../ProgressBar";
import { Wrapper } from "../../UI/Wrapper";
import { IssueOrRevokeSelector } from "../../UI/IssueOrRevokeSelector";
import { Card } from "../../UI/Card";
import { Frame } from "../../UI/Frame";

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
      <Frame>
        <Card title={<IssueOrRevokeSelector />}>
          <div className="mb-10">
            <ProgressBar step={1} totalSteps={3} title="Choose Type" />
          </div>
          <div className="mb-8 text-2xl">Choose Document Type to Issue</div>
          <div className="flex flex-wrap justify-start">
            {config.forms.map((form: FormTemplate, index: number) => {
              return (
                <Button
                  className="bg-white text-cerulean-500 border-gray-300 hover:text-blue hover:bg-gray-50 w-40 mb-4 mr-4"
                  key={index}
                  onClick={() => selectedForm(index)}
                >
                  {form.name}
                </Button>
              );
            })}
          </div>
        </Card>
      </Frame>
    </Wrapper>
  );
};
