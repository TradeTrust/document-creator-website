import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { Config, FormTemplate } from "../../../types";
import { Container } from "../../Container";
import { ProgressBar } from "../../ProgressBar";
import { Button } from "../../UI/Button";
import { Title } from "../../UI/Title";
import { Wrapper } from "../../UI/Wrapper";

interface FormSelection {
  config: Config;
  className?: string;
}

export const FormSelection: FunctionComponent<FormSelection> = ({ className, config }) => {
  const { activeFormIndex, newForm } = useFormsContext();
  const selectedForm = (templateIndex: number): void => {
    newForm(templateIndex);
  };

  // Once the active form has been set, redirect to /form
  // To get back to this page, the previous page has to unset the activeFormIndex first
  if (activeFormIndex !== undefined) return <Redirect to="/form" />;

  return (
    <Container>
      <div className={className}>
        <Wrapper>
          <ProgressBar step={1} />
          <Title className="mb-8">Choose Document Type to Issue</Title>
          <div className="flex w-full">
            {config.forms.map((form: FormTemplate, index: number) => {
              return (
                <Button
                  className="bg-white text-grey-dark hover:text-blue w-full p-4"
                  role="button"
                  key={index}
                  onClick={() => selectedForm(index)}
                >
                  {form.name}
                </Button>
              );
            })}
          </div>
        </Wrapper>
      </div>
    </Container>
  );
};
