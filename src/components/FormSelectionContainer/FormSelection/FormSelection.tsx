import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { Config, FormTemplate } from "../../../types";
import { Container } from "../../Container";
import { ProgressBar } from "../../ProgressBar";
import { Button } from "../../UI/Button";
import { Title } from "../../UI/Title";
import { Wrapper } from "../../UI/Wrapper";
import { range } from "lodash";
import { useKeyboardShortcut } from "../../../common/hook/UseKeyboardShortcut";

interface FormSelection {
  config: Config;
  className?: string;
}

interface ButtonWrapperProps {
  handleClick: (arg: number) => void;
  className?: string;
  index: number;
  form: FormTemplate;
}

const ButtonWrapper: FunctionComponent<ButtonWrapperProps> = ({
  handleClick,
  className,
  form,
  index,
}) => {
  const handleButtonClick = (): void => {
    handleClick(index);
  };

  useKeyboardShortcut(["Control", (index + 1).toString()], handleButtonClick);

  return (
    <Button className={className} role="button" onClick={handleButtonClick}>
      {form.name}
    </Button>
  );
};

export const FormSelection: FunctionComponent<FormSelection> = ({ className, config }) => {
  const { activeFormIndex, newForm } = useFormsContext();
  const selectedForm = (templateIndex: number): void => {
    newForm(templateIndex);
  };

  const keymap = range(config.forms.length).map((_, i) => i.toString());
  keymap.push("Control");

  // Once the active form has been set, redirect to /form
  // To get back to this page, the previous page has to unset the activeFormIndex first
  if (activeFormIndex !== undefined) return <Redirect to="/form" />;

  return (
    <Container>
      <div className={className}>
        <Wrapper>
          <ProgressBar step={1} />
          <Title className="mb-8">Choose Document Type to Issue</Title>
          <div className="flex flex-wrap justify-start">
            {config.forms.map((form: FormTemplate, index: number) => {
              return (
                <ButtonWrapper
                  className="bg-white text-grey-dark hover:text-blue w-40 p-4 mb-4 mr-4"
                  index={index}
                  key={index}
                  handleClick={selectedForm}
                  form={form}
                />
              );
            })}
          </div>
        </Wrapper>
      </div>
    </Container>
  );
};
