import React, { FunctionComponent } from "react";
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
  const selectedForm = (form: string): void => {
    console.log(form);
  };

  return (
    <Container>
      <div className={className}>
        <Wrapper>
          <ProgressBar step={1} />
          <Title className="text-grey-dark">Choose Document Type to Issue</Title>
          <div className="flex w-full">
            {config.forms.map((form: Form, i: number) => {
              return (
                <Button
                  className="bg-white text-grey-dark hover:text-blue w-full p-4"
                  role="button"
                  key={i}
                  onClick={() => selectedForm(form.name)}
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
