import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useActiveFormContext } from "../../../common/context/activeForm";
import { Config, Form } from "../../../types";
import { Button } from "../../../UI/Button";
import { Title } from "../../../UI/Title";
import { Wrapper } from "../../../UI/Wrapper";
import { Container } from "../../Container";
import { ProgressBar } from "../../ProgressBar";

interface FormSelection {
  config: Config;
  className?: string;
}

export const FormSelection: FunctionComponent<FormSelection> = ({ className, config }) => {
  const { activeFormIndex, setActiveFormIndex } = useActiveFormContext();
  const selectedForm = (index: number): void => {
    setActiveFormIndex(index);
  };

  // Once the active form has been set, redirect to /form
  // To get back to this page, the previous page has to unset the activeFormIndex first
  if (activeFormIndex !== undefined) return <Redirect to="/form" />;

  return (
    <Container>
      <div className={className}>
        <Wrapper>
          <ProgressBar step={1} />
          <Title>Choose Document Type to Issue</Title>
          <div className="flex w-full">
            {config.forms.map((form: Form, index: number) => {
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
